"use client";

import { useEffect, useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type NotificationEvent = {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("user-notifications")
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
      .order("created_at", { ascending: false });

    setNotifications((data || []) as NotificationEvent[]);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase
      .from("notification_events")
      .update({ is_read: true })
      .eq("id", id);

    await loadNotifications(false);
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter((item) => !item.is_read)
      .map((item) => item.id);

    if (unreadIds.length === 0) return;

    await supabase
      .from("notification_events")
      .update({ is_read: true })
      .in("id", unreadIds);

    await loadNotifications(false);
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <BellRing size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Notification Center
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Your Alerts
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            Mark All Read
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {loading ? (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading notifications...
            </p>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-[1.5rem] p-6 shadow-xl ${
                  item.is_read ? "bg-white" : "bg-[#1A1A1A] text-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-[10px] uppercase tracking-[0.2em] ${
                        item.is_read ? "text-[#B19A55]" : "text-[#D4B06A]"
                      }`}
                    >
                      {item.notification_type.replaceAll("_", " ")}
                    </p>

                    <h2 className="mt-3 font-serif text-2xl font-bold">
                      {item.title}
                    </h2>

                    <p
                      className={`mt-3 text-sm leading-7 ${
                        item.is_read ? "text-[#1A1A1A]/65" : "text-white/70"
                      }`}
                    >
                      {item.body}
                    </p>

                    <p
                      className={`mt-4 text-[10px] uppercase tracking-[0.2em] ${
                        item.is_read ? "text-[#1A1A1A]/35" : "text-white/40"
                      }`}
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  {!item.is_read ? (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4B06A] text-white"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              No notifications yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}