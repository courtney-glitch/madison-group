"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  read_by_client: boolean | null;
  created_at: string;
};

type RealtimeChatBoxProps = {
  conversationId: string;
};

export function RealtimeChatBox({ conversationId }: RealtimeChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
    loadCurrentUser();

    const channel = supabase
      .channel(`realtime-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          await loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  async function loadCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id || "");
  }

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages((data || []) as ChatMessage[]);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !conversationId || !currentUserId) return;

    setSending(true);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      message: newMessage.trim(),
      read_by_client: false,
    });

    setNewMessage("");
    setSending(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-4 shadow-xl md:p-6">
      <div className="max-h-[520px] overflow-y-auto rounded-3xl bg-[#F8F5EF] p-4">
        {messages.length > 0 ? (
          <div className="grid gap-3">
            {messages.map((message) => {
              const isMine = message.sender_id === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-3xl px-4 py-3 ${
                      isMine
                        ? "bg-[#B19A55] text-white"
                        : "bg-white text-[#1A1A1A]"
                    }`}
                  >
                    <p className="text-sm leading-6">{message.message}</p>

                    <p
                      className={`mt-2 text-[9px] uppercase tracking-[0.18em] ${
                        isMine ? "text-white/55" : "text-[#1A1A1A]/35"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-5 text-sm text-[#1A1A1A]/60">
            No messages yet. Start the conversation.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <textarea
          rows={3}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none focus:border-[#B19A55]"
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !newMessage.trim()}
          className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
        >
          <Send size={15} />
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </section>
  );
}