import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "agent" | "client";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return (profile?.role as UserRole) || "client";
}

export function canAccessAdmin(role: UserRole | null) {
  return role === "admin" || role === "agent";
}

export function canAccessAgent(role: UserRole | null) {
  return role === "admin" || role === "agent";
}

export function canAccessClient(role: UserRole | null) {
  return role === "admin" || role === "agent" || role === "client";
}