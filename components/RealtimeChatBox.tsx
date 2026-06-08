"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChatAttachmentUpload } from "@/components/ChatAttachmentUpload";

type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_type?: string | null;
  message: string;
  read_by_client: boolean | null;
  read_by_agent: boolean | null;
  read_by_admin?: boolean | null;
  created_at: string;
};

type TypingStatus = {
  id: string;
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
  updated_at: string;
};

type RealtimeChatBoxProps = {
  conversationId: string;
};

export function RealtimeChatBox({ conversationId }: RealtimeChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [role, setRole] = useState("client");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    loadTypingUsers();

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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_status",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          await loadTypingUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      stopTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  async function loadCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      setStatus(error.message);
      return;
    }

    if (!user) {
      setStatus("Please login first.");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    setRole(profile?.role || "client");
  }

  async function loadMessages() {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      setStatus(error.message);
      return;
    }

    setMessages((data || []) as ChatMessage[]);

    await markMessagesAsRead();
  }

  async function markMessagesAsRead() {
    if (!conversationId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const userRole = profile?.role || "client";

    if (userRole === "admin" || userRole === "agent") {
      await supabase
        .from("messages")
        .update({
          read_by_agent: true,
          read_by_admin: true,
        })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);
    } else {
      await supabase
        .from("messages")
        .update({ read_by_client: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);
    }
  }

  async function loadTypingUsers() {
    if (!conversationId) return;

    const { data } = await supabase
      .from("typing_status")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("is_typing", true);

    setTypingUsers((data || []) as TypingStatus[]);
  }

  async function startTyping() {
    if (!conversationId || !currentUserId) return;

    await supabase.from("typing_status").upsert({
      conversation_id: conversationId,
      user_id: currentUserId,
      is_typing: true,
      updated_at: new Date().toISOString(),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  }

  async function stopTyping() {
    if (!conversationId || !currentUserId) return;

    await supabase
      .from("typing_status")
      .update({
        is_typing: false,
        updated_at: new Date().toISOString(),
      })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    setStatus("");

    if (!conversationId) {
      setStatus("Missing conversation ID.");
      return;
    }

    if (!currentUserId) {
      setStatus("Missing current user ID. Please refresh and login again.");
      return;
    }

    setSending(true);

    const isAgent = role === "admin" || role === "agent";

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      sender_type: isAgent ? "advisor" : "client",
      message: newMessage.trim(),
      read_by_client: !isAgent,
      read_by_agent: isAgent,
      read_by_admin: isAgent,
    });

    if (error) {
      setStatus(error.message);
      setSending(false);
      return;
    }

    await stopTyping();
    await loadMessages();

    setNewMessage("");
    setSending(false);
  }

  function getReceipt(message: ChatMessage) {
    const isMine = message.sender_id === currentUserId;

    if (!isMine) return "";

    const isAgent = role === "admin" || role === "agent";

    if (isAgent) {
      return message.read_by_client ? "Read" : "Sent";
    }

    return message.read_by_agent || message.read_by_admin ? "Read" : "Sent";
  }

  const otherTypingUsers = typingUsers.filter(
    (user) => user.user_id !== currentUserId
  );

  return (
    <section className="rounded-[1.5rem] bg-white p-4 shadow-xl md:p-6">
      <div className="max-h-[520px] overflow-y-auto rounded-3xl bg-[#F8F5EF] p-4">
        {messages.length > 0 ? (
          <div className="grid gap-3">
            {messages.map((message) => {
              const isMine = message.sender_id === currentUserId;
              const receipt = getReceipt(message);

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
                      {receipt && ` · ${receipt}`}
                    </p>
                  </div>
                </div>
              );
            })}

            {otherTypingUsers.length > 0 && <TypingBubble />}
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="rounded-3xl bg-white p-5 text-sm text-[#1A1A1A]/60">
              No messages yet. Start the conversation.
            </p>

            {otherTypingUsers.length > 0 && <TypingBubble />}
          </div>
        )}
      </div>

       <div className="mt-4 flex items-end gap-3">
         <ChatAttachmentUpload
           conversationId={conversationId}
           senderType={role === "admin" || role === "agent" ? "advisor" : "client"}
           onSent={loadMessages}
         />

  <div className="flex-1">
    <textarea
      rows={3}
      value={newMessage}
      onChange={(e) => {
        setNewMessage(e.target.value);
        startTyping();
      }}
      onBlur={stopTyping}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
         sendMessage();
     }
   }}
   placeholder="Write a message..."
     className="w-full rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-5 py-4 text-sm outline-none focus:border-[#B19A55]"
    />
  </div>

  <button
    type="button"
    onClick={sendMessage}
    disabled={sending || !newMessage.trim()}
    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#B19A55] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
  >
    <Send size={18} />
  </button>
</div>

      {status && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {status}
        </p>
      )}
    </section>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-3xl bg-white px-4 py-3 text-[#1A1A1A] shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
          Typing
        </p>

        <div className="mt-2 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#B19A55]" />
          <span className="h-2 w-2 rounded-full bg-[#B19A55]/70" />
          <span className="h-2 w-2 rounded-full bg-[#B19A55]/40" />
        </div>
      </div>
    </div>
  );
}