"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type MessageItem = {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
};

type MessageProperty = {
  id: string;
  message_id: string;
  property_id: string;
  properties: {
    id: string;
    title: string;
    city: string;
    price: string;
    image: string;
    status?: string;
  } | null;
};

export function ClientMessages() {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageProperties, setMessageProperties] = useState<MessageProperty[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          await refreshMessages(conversationId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_properties",
        },
        async () => {
          await refreshMessages(conversationId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  async function loadConversation() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first to use messaging.");
      setLoading(false);
      return;
    }

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let activeConversationId = existingConversation?.id;

    if (!activeConversationId) {
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        setStatus(error.message);
        setLoading(false);
        return;
      }

      activeConversationId = newConversation.id;
    }

    setConversationId(activeConversationId);

    await refreshMessages(activeConversationId);

    setLoading(false);
  }

  async function refreshMessages(id: string) {
    const { data: loadedMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    const { data: propertyData } = await supabase.from("message_properties")
      .select(`
        id,
        message_id,
        property_id,
        properties (
          id,
          title,
          city,
          price,
          image,
          status
        )
      `);

    setMessages(loadedMessages || []);
    setMessageProperties(
      ((propertyData || []) as unknown as MessageProperty[]) || []
    );
  }

  function getMessageProperty(messageId: string) {
    return messageProperties.find((item) => item.message_id === messageId);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !conversationId) return;

    setStatus("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_type: "client",
      message: newMessage.trim(),
      read_by_admin: false,
      read_by_client: true,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setNewMessage("");
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <MessageCircle className="text-[#B19A55]" />

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Client Messages
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold">
            Message Your Advisor
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-[#F8F5EF] p-5">
        {loading ? (
          <p className="text-sm text-[#1A1A1A]/60">
            Loading messages...
          </p>
        ) : messages.length > 0 ? (
          <div className="grid gap-4">
            {messages.map((item) => {
              const attachedProperty = getMessageProperty(item.id);
              const property = attachedProperty?.properties;

              return (
                <div
                  key={item.id}
                  className={`max-w-[88%] rounded-3xl px-5 py-4 ${
                    item.sender_type === "client"
                      ? "ml-auto bg-[#B19A55] text-white"
                      : "bg-white text-[#1A1A1A]"
                  }`}
                >
                  <p className="text-sm leading-6">
                    {item.message}
                  </p>

                  {property && (
                    <Link
                      href={`/properties/${property.id}`}
                      className={`mt-4 block overflow-hidden rounded-2xl border ${
                        item.sender_type === "client"
                          ? "border-white/20 bg-white text-[#1A1A1A]"
                          : "border-[#1A1A1A]/10 bg-[#F8F5EF]"
                      }`}
                    >
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-[#1A1A1A] text-sm text-white">
                          Image Coming Soon
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-center gap-2 text-[#B19A55]">
                          <Home size={15} />

                          <p className="text-[10px] uppercase tracking-[0.2em]">
                            Shared Property
                          </p>
                        </div>

                        <h3 className="mt-2 font-serif text-lg font-bold">
                          {property.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#1A1A1A]/60">
                          {property.city}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="font-serif text-lg font-bold text-[#B19A55]">
                            {property.price}
                          </p>

                          {property.status && (
                            <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white">
                              {property.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}

                  <p
                    className={`mt-2 text-[10px] uppercase tracking-[0.18em] ${
                      item.sender_type === "client"
                        ? "text-white/60"
                        : "text-[#1A1A1A]/40"
                    }`}
                  >
                    {item.sender_type}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-7 text-[#1A1A1A]/60">
            No messages yet. Start a conversation with your Madison Group
            advisor.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        <textarea
          rows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message..."
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none transition focus:border-[#B19A55]"
        />

        <button
          type="button"
          onClick={sendMessage}
          className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
        >
          <Send size={15} />
          Send Message
        </button>
      </div>

      {status && (
        <p className="mt-4 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
          {status}
        </p>
      )}
    </section>
  );
}