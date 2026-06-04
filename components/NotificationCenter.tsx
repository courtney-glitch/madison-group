"use client";

import { useEffect, useState } from "react";
import { Bell, Check, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type NotificationEvent = {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

function getIcon(type: string) {
  if (type === "new_message") return <MessageCircle size={17} />;
  return <Sparkles size={17} />;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("notification-center")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notification_events",
        },
        async () => {
          await loadNotifications(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotifications(showLoading = true) {
    if (showLoading) setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("notification_events")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setNotifications((data || []) as NotificationEvent[]);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase
      .from("notification_events")
      .update({
        is_read: true,
      })
      .eq("id", id);

    await loadNotifications(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Bell size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Notification Center
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Your Latest Updates
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Loading notifications...
        </p>
      ) : notifications.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl border p-5 ${
                notification.is_read
                  ? "border-[#1A1A1A]/10 bg-[#F8F5EF]"
                  : "border-[#B19A55]/30 bg-[#B19A55]/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B19A55]">
                  {getIcon(notification.notification_type)}
                </div>

                <div className="flex-1">
                  <p className="font-serif text-lg font-bold">
                    {notification.title}
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/65">
                    {notification.body}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B19A55] text-white"
                  >
                    <Check size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm leading-7 text-[#1A1A1A]/60">
          No notifications yet. New messages, saved search alerts, and property
          match updates will appear here.
        </p>
      )}
    </section>
  );
}