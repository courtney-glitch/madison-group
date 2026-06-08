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
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
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

  async function loadConversations(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data } = await supabase.from("conversations").select("*");

    const loadedConversations = (data || []) as Conversation[];

    const conversationsWithPreview = await Promise.all(
      loadedConversations.map(async (conversation) => {
        const preview = await getLastMessagePreview(conversation.id);
        const clientName = await getProfileName(conversation.client_id);
        const unreadCount = await getUnreadCount(conversation.id);

        return {
          ...conversation,
          preview: preview.preview,
          preview_created_at: preview.createdAt,
          client_name: clientName,
          unread_count: unreadCount,
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
                          <div className="min-w-0">
                            <p className="truncate font-serif text-sm font-bold">
                              {conversation.client_name || "Unknown Client"}
                            </p>

                            <p
                              className={`mt-2 line-clamp-2 text-sm leading-6 ${
                                isActive || unread > 0
                                  ? "text-white/80"
                                  : "text-[#1A1A1A]/60"
                              }`}
                            >
                              {conversation.preview || "No messages yet."}
                            </p>
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