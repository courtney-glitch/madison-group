"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdminMessageReplyProps = {
  conversationId: string;
};

export function AdminMessageReply({
  conversationId,
}: AdminMessageReplyProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function sendReply() {
    if (!message.trim()) return;

    setSending(true);
    setStatus("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_type: "advisor",
      message: message.trim(),
    });

    if (error) {
      setStatus(error.message);
    } else {
      setMessage("");
      setStatus("Reply sent.");
    }

    setSending(false);
  }

  return (
    <div className="mt-4 rounded-2xl bg-white p-4">
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write advisor reply..."
        className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none transition focus:border-[#B19A55]"
      />

      <button
        type="button"
        onClick={sendReply}
        disabled={sending}
        className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
      >
        <Send size={14} />
        {sending ? "Sending..." : "Send Reply"}
      </button>

      {status && (
        <p className="mt-3 text-sm text-[#1A1A1A]/60">
          {status}
        </p>
      )}
    </div>
  );
}