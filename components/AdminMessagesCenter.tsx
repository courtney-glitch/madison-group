"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, Send, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ConversationItem = {
  id: string;
  user_id: string;
  created_at: string;
};

type MessageItem = {
  id: string;
  conversation_id: string;
  sender_type: string;
  message: string;
  created_at: string;
  read_by_admin?: boolean;
  read_by_client?: boolean;
};

function firstNameFromEmail(email?: string | null) {
  if (!email) return "Client";
  return email.split("@")[0].split(".")[0] || "Client";
}

export function AdminMessagesCenter() {
  const [adminFirstName, setAdminFirstName] = useState("Advisor");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [reply, setReply] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadAdminMessages();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-message-center")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {
          await loadAdminMessages(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadAdminMessages(showLoading = true) {
    if (showLoading) setLoading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    setAdminFirstName(
      profile?.full_name?.split(" ")[0] || firstNameFromEmail(user.email)
    );

    const { data: conversationData } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: messageData } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    setConversations(conversationData || []);
    setMessages(messageData || []);

    if (!selectedConversationId && conversationData && conversationData[0]) {
      setSelectedConversationId(conversationData[0].id);
    }

    setLoading(false);
  }

  const conversationCards = useMemo(() => {
    return conversations
      .map((conversation) => {
        const threadMessages = messages.filter(
          (message) => message.conversation_id === conversation.id
        );

        const latestMessage = threadMessages[threadMessages.length - 1];

        const unreadCount = threadMessages.filter(
          (message) =>
            message.sender_type === "client" && message.read_by_admin === false
        ).length;

        return {
          ...conversation,
          latestMessage,
          unreadCount,
        };
      })
      .filter((conversation) => {
        const searchValue = searchText.toLowerCase();

        const matchesSearch =
          conversation.user_id.toLowerCase().includes(searchValue) ||
          conversation.latestMessage?.message
            ?.toLowerCase()
            .includes(searchValue);

        const matchesFilter =
          filter === "all" ? true : conversation.unreadCount > 0;

        return matchesSearch && matchesFilter;
      });
  }, [conversations, messages, searchText, filter]);

  const selectedMessages = messages.filter(
    (message) => message.conversation_id === selectedConversationId
  );

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );

  async function openConversation(conversationId: string) {
    setSelectedConversationId(conversationId);

    await supabase
      .from("messages")
      .update({ read_by_admin: true })
      .eq("conversation_id", conversationId)
      .eq("sender_type", "client");

    await loadAdminMessages(false);
  }

  async function sendReply() {
    if (!reply.trim() || !selectedConversationId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversationId,
      sender_type: "advisor",
      message: reply.trim(),
      read_by_admin: true,
      read_by_client: false,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setReply("");
    await loadAdminMessages(false);
  }

  if (loading) {
    return (
      <section className="rounded-[1.5rem] bg-white p-8 shadow-xl">
        <p className="font-serif text-2xl font-bold">Loading messages...</p>
      </section>
    );
  }

  if (status) {
    return (
      <section className="rounded-[1.5rem] bg-white p-8 shadow-xl">
        <p className="text-sm text-[#1A1A1A]/60">{status}</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-xl">
      <div className="flex flex-col gap-5 border-b border-[#1A1A1A]/10 bg-[#F8F5EF] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Agent Messages
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold">
            Chat Command Center
          </h1>
        </div>

        <div className="rounded-full bg-white px-5 py-3 font-serif text-sm font-bold text-[#1A1A1A] shadow-sm">
          Hi {adminFirstName}
        </div>
      </div>

      <div className="grid min-h-[650px] lg:grid-cols-[0.42fr_0.58fr]">
        <aside className="border-r border-[#1A1A1A]/10 bg-[#FAF7F0] p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <Search size={16} className="text-[#B19A55]" />

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] ${
                filter === "all"
                  ? "bg-[#B19A55] text-white"
                  : "bg-white text-[#1A1A1A]/55"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-full px-4 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] ${
                filter === "unread"
                  ? "bg-[#B19A55] text-white"
                  : "bg-white text-[#1A1A1A]/55"
              }`}
            >
              Unread
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {conversationCards.length > 0 ? (
              conversationCards.map((conversation) => {
                const active = conversation.id === selectedConversationId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => openConversation(conversation.id)}
                    className={`rounded-3xl p-4 text-left transition ${
                      active
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#1A1A1A] hover:bg-[#F8F5EF]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-[#B19A55]/10 text-[#B19A55]"
                          }`}
                        >
                          <UserRound size={18} />
                        </div>

                        <div>
                          <p className="font-serif text-base font-bold">
                            Client {conversation.user_id.slice(0, 6)}
                          </p>

                          <p
                            className={`mt-1 line-clamp-2 text-xs leading-5 ${
                              active ? "text-white/60" : "text-[#1A1A1A]/50"
                            }`}
                          >
                            {conversation.latestMessage?.message ||
                              "No messages yet."}
                          </p>
                        </div>
                      </div>

                      {conversation.unreadCount > 0 && (
                        <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-3xl bg-white p-6 text-sm text-[#1A1A1A]/60">
                No conversations found.
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-[650px] flex-col bg-white">
          <div className="border-b border-[#1A1A1A]/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B19A55]/10 text-[#B19A55]">
                <MessageCircle size={20} />
              </div>

              <div>
                <p className="font-serif text-xl font-bold">
                  {selectedConversation
                    ? `Client ${selectedConversation.user_id.slice(0, 6)}`
                    : "Select a conversation"}
                </p>

                <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                  Madison Group Client Thread
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F8F5EF] p-6">
            {selectedMessages.length > 0 ? (
              <div className="grid gap-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[78%] rounded-3xl px-5 py-4 ${
                      message.sender_type === "advisor"
                        ? "ml-auto bg-[#B19A55] text-white"
                        : "bg-white text-[#1A1A1A]"
                    }`}
                  >
                    <p className="text-sm leading-6">{message.message}</p>

                    <p
                      className={`mt-2 text-[10px] uppercase tracking-[0.18em] ${
                        message.sender_type === "advisor"
                          ? "text-white/60"
                          : "text-[#1A1A1A]/40"
                      }`}
                    >
                      {message.sender_type}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 text-sm text-[#1A1A1A]/60">
                Select a conversation to start replying.
              </div>
            )}
          </div>

          <div className="border-t border-[#1A1A1A]/10 bg-white p-5">
            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none transition focus:border-[#B19A55]"
            />

            <button
              type="button"
              onClick={sendReply}
              disabled={!selectedConversationId || !reply.trim()}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
            >
              <Send size={15} />
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}