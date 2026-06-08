"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { RealtimeChatBox } from "@/components/RealtimeChatBox";

export default function LiveChatPage() {
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadConversation();
  }, []);

  async function loadConversation() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first to use live chat.");
      setLoading(false);
      return;
    }

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let activeConversationId = existingConversation?.id;

    if (!activeConversationId) {
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          client_id: user.id,
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
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <MessageCircle size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Live Chat
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Message Your Advisor
            </h1>
          </div>
        </div>

        {loading ? (
          <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
            Loading live chat...
          </p>
        ) : conversationId ? (
          <RealtimeChatBox conversationId={conversationId} />
        ) : (
          <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
            {status || "Unable to open live chat."}
          </p>
        )}
      </section>
    </main>
  );
}