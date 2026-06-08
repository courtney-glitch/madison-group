import { supabase } from "@/lib/supabase";

export async function getLastMessagePreview(conversationId: string) {
  const { data } = await supabase
    .from("messages")
    .select("message, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    preview: data?.message || "No messages yet.",
    createdAt: data?.created_at || null,
  };
}