"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function UserPresenceTracker() {
  useEffect(() => {
    let userId = "";

    async function markOnline() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      userId = user.id;

      await supabase
        .from("profiles")
        .update({
          is_online: true,
          last_seen: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    async function markOffline() {
      if (!userId) return;

      await supabase
        .from("profiles")
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    markOnline();

    window.addEventListener("beforeunload", markOffline);

    const interval = window.setInterval(() => {
      markOnline();
    }, 30000);

    return () => {
      window.removeEventListener("beforeunload", markOffline);
      window.clearInterval(interval);
      markOffline();
    };
  }, []);

  return null;
}