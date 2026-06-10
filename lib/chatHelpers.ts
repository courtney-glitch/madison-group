import { supabase } from "@/lib/supabase";

export async function getLastMessagePreview(conversationId: string) {
  const { data } = await supabase
    .from("messages")
    .select(
      "id, message, created_at, sender_id, sender_type, read_by_client, read_by_agent, read_by_admin"
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    id: data?.id || null,
    preview: data?.message || "No messages yet.",
    createdAt: data?.created_at || null,
    senderId: data?.sender_id || null,
    senderType: data?.sender_type || null,
    readByClient: data?.read_by_client || false,
    readByAgent: data?.read_by_agent || false,
    readByAdmin: data?.read_by_admin || false,
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