"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { RealtimeChatBox } from "@/components/RealtimeChatBox";
import { AdminPageShell } from "@/components/AdminPageShell";
import { getLastMessagePreview, getProfileName } from "@/lib/chatHelpers";

type Conversation = {
  id: string;
  client_id: string | null;
  agent_id: string | null;
  created_at: string;
  preview?: string;
  preview_created_at?: string | null;
  client_name?: string | null;
  unread_count?: number;
  is_online?: boolean;
  last_seen?: string | null;
  preview_sender_type?: string | null;
  preview_receipt?: string;
};

export default function AdminLiveChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();

    const channel = supabase
      .channel("admin-live-chat-inbox")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async () => {
          await loadConversations(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_presence" },
        async () => {
          await loadConversations(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getUnreadCount(conversationId: string) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId)
      .eq("read_by_agent", false)
      .eq("sender_type", "client");

    return count || 0;
  }

  async function getPresence(userId: string | null) {
    if (!userId) {
      return {
        is_online: false,
        last_seen: null,
      };
    }

    const { data } = await supabase
      .from("user_presence")
      .select("is_online, last_seen")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      is_online: data?.is_online || false,
      last_seen: data?.last_seen || null,
    };
  }

  function formatLastSeen(lastSeen?: string | null) {
    if (!lastSeen) return "Offline";

    const minutes = Math.floor(
      (Date.now() - new Date(lastSeen).getTime()) / 60000
    );

    if (minutes < 1) return "Active moments ago";
    if (minutes < 60) return `Last seen ${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Last seen ${hours}h ago`;

    return `Last seen ${new Date(lastSeen).toLocaleDateString()}`;
  }

  async function loadConversations(showLoading = true) {
    if (showLoading) setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentUserId = user?.id || "";

    const { data } = await supabase.from("conversations").select("*");

    const loadedConversations = (data || []) as Conversation[];

    const conversationsWithPreview = await Promise.all(
      loadedConversations.map(async (conversation) => {
        const preview = await getLastMessagePreview(conversation.id);
        const clientName = await getProfileName(conversation.client_id);
        const unreadCount = await getUnreadCount(conversation.id);
        const presence = await getPresence(conversation.client_id);

        const isMine =
          preview.senderId &&
          currentUserId &&
          preview.senderId === currentUserId;

        const receipt =
          isMine &&
          (preview.readByClient ||
            preview.readByAgent ||
            preview.readByAdmin)
            ? "Seen"
            : isMine
            ? "Delivered"
            : "";

        return {
          ...conversation,
          preview: preview.preview,
          preview_created_at: preview.createdAt,
          client_name: clientName,
          unread_count: unreadCount,
          is_online: presence.is_online,
          last_seen: presence.last_seen,
          preview_sender_type: preview.senderType,
          preview_receipt: receipt,
        };
      })
    );

    conversationsWithPreview.sort((a, b) => {
      const aTime = a.preview_created_at || a.created_at;
      const bTime = b.preview_created_at || b.created_at;

      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    setConversations(conversationsWithPreview);

    if (!activeConversationId && conversationsWithPreview.length > 0) {
      setActiveConversationId(conversationsWithPreview[0].id);
    }

    setLoading(false);
  }

  async function openConversation(conversationId: string) {
    setActiveConversationId(conversationId);

    await supabase
      .from("messages")
      .update({
        read_by_agent: true,
        read_by_admin: true,
      })
      .eq("conversation_id", conversationId)
      .eq("sender_type", "client");

    await loadConversations(false);
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <MessageCircle size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Agent View
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Live Chat Inbox
              </h1>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
            <section className="rounded-[1.5rem] bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#B19A55]">
                  <Users size={17} />

                  <h2 className="font-serif text-lg font-bold">
                    Conversations
                  </h2>
                </div>

                <p className="rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/45">
                  {conversations.length}
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                {loading ? (
                  <p className="rounded-2xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    Loading conversations...
                  </p>
                ) : conversations.length > 0 ? (
                  conversations.map((conversation) => {
                    const isActive = activeConversationId === conversation.id;
                    const unread = conversation.unread_count || 0;

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => openConversation(conversation.id)}
                        className={`rounded-2xl p-4 text-left transition ${
                          isActive
                            ? "bg-[#B19A55] text-white shadow-lg"
                            : unread > 0
                            ? "bg-[#1A1A1A] text-white"
                            : "bg-[#F8F5EF] text-[#1A1A1A]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  conversation.is_online
                                    ? "bg-emerald-400"
                                    : isActive || unread > 0
                                    ? "bg-white/35"
                                    : "bg-[#1A1A1A]/20"
                                }`}
                              />

                              <p className="truncate font-serif text-sm font-bold">
                                {conversation.client_name || "Unknown Client"}
                              </p>
                            </div>

                            <p
                              className={`mt-1 text-[10px] uppercase tracking-[0.18em] ${
                                isActive || unread > 0
                                  ? "text-white/60"
                                  : "text-[#1A1A1A]/40"
                              }`}
                            >
                              {conversation.is_online
                                ? "Online now"
                                : formatLastSeen(conversation.last_seen)}
                            </p>

                            <div
                              className={`mt-2 flex items-start justify-between gap-3 ${
                                isActive || unread > 0
                                  ? "text-white/80"
                                  : "text-[#1A1A1A]/60"
                              }`}
                            >
                              <p className="line-clamp-2 flex-1 text-sm leading-6">
                                {conversation.preview_sender_type === "advisor"
                                  ? "You: "
                                  : ""}
                                {conversation.preview || "No messages yet."}
                              </p>

                              {conversation.preview_receipt && (
                                <span
                                  className={`shrink-0 text-[9px] uppercase tracking-[0.18em] ${
                                    conversation.preview_receipt === "Seen"
                                      ? "text-emerald-300"
                                      : isActive || unread > 0
                                      ? "text-white/45"
                                      : "text-[#1A1A1A]/35"
                                  }`}
                                >
                                  {conversation.preview_receipt}
                                </span>
                              )}
                            </div>
                          </div>

                          {unread > 0 && (
                            <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-bold text-white">
                              {unread > 99 ? "99+" : unread}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-3 text-[10px] uppercase tracking-[0.18em] ${
                            isActive || unread > 0
                              ? "text-white/65"
                              : "text-[#1A1A1A]/40"
                          }`}
                        >
                          {conversation.preview_created_at
                            ? new Date(
                                conversation.preview_created_at
                              ).toLocaleString()
                            : new Date(
                                conversation.created_at
                              ).toLocaleString()}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    No live chat conversations yet.
                  </p>
                )}
              </div>
            </section>

            <section>
              {activeConversationId ? (
                <RealtimeChatBox conversationId={activeConversationId} />
              ) : (
                <div className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
                  Select a conversation to open chat.
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}