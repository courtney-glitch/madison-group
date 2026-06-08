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

export async function getProfileName(userId: string | null) {
  if (!userId) return "Unknown Client";

  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  return data?.full_name || "Unnamed Client";
}