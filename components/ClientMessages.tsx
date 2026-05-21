"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type MessageItem = {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
};

export function ClientMessages() {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversation();
  }, []);

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

    const { data: loadedMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeConversationId)
      .order("created_at", { ascending: true });

    setMessages(loadedMessages || []);
    setLoading(false);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !conversationId) return;

    setStatus("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_type: "client",
      message: newMessage.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setNewMessage("");
    await loadConversation();
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
          <p className="text-sm text-[#1A1A1A]/60">Loading messages...</p>
        ) : messages.length > 0 ? (
          <div className="grid gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                  item.sender_type === "client"
                    ? "ml-auto bg-[#B19A55] text-white"
                    : "bg-white text-[#1A1A1A]"
                }`}
              >
                <p className="text-sm leading-6">{item.message}</p>

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
            ))}
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