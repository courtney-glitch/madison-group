"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { supabase } from "@/lib/supabase";

type NotificationItem = {
  id: string;
  message: string;
  sender_type: string;
};

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const message =
            payload.new as NotificationItem;

          setNotifications((prev) => [
            ...prev,
            message,
          ]);

          setTimeout(() => {
            setNotifications((prev) =>
              prev.filter(
                (item) => item.id !== message.id
              )
            );
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-4 top-24 z-[120] grid gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex w-[320px] items-start gap-3 rounded-3xl border border-[#B19A55]/10 bg-white p-4 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55] text-white">
            <Bell size={18} />
          </div>

          <div className="flex-1">
            <p className="font-serif text-sm font-bold">
              New Message
            </p>

            <p className="mt-1 text-sm text-[#1A1A1A]/70">
              {notification.message}
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
              {notification.sender_type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}