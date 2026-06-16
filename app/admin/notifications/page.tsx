"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Loader2,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type NotificationItem = {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  is_read: boolean | null;
  created_at: string;
};

function getNotificationIcon(type: string | null) {
  if (type === "buyer") return DollarSign;
  if (type === "showing") return CalendarDays;
  if (type === "chat") return MessageCircle;
  if (type === "referral") return UserPlus;

  return Bell;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
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

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setNotifications((data || []) as NotificationItem[]);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadNotifications(false);
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter((item) => !item.is_read)
      .map((item) => item.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadNotifications(false);
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                <Bell size={20} />
              </div>

              <div>
                <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                  Admin Control
                </p>

                <h1 className="mt-2 font-serif text-3xl font-bold text-[#1A1A1A] md:text-5xl">
                  Notification Center
                </h1>

                <p className="mt-2 text-sm text-[#1A1A1A]/55">
                  {unreadCount} unread notification
                  {unreadCount === 1 ? "" : "s"}
                </p>
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

          {status && (
            <p className="mb-5 rounded-2xl bg-white px-4 py-3 text-sm text-red-600 shadow-xl">
              {status}
            </p>
          )}

          <div className="grid gap-4">
            {loading ? (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                  <Loader2 size={16} className="animate-spin" />
                  Loading notifications...
                </div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = !notification.is_read;

                return (
                  <div
                    key={notification.id}
                    className={`rounded-[2rem] p-6 shadow-xl ${
                      isUnread ? "bg-[#1A1A1A] text-white" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isUnread
                            ? "bg-[#D4B06A]/20 text-[#D4B06A]"
                            : "bg-[#B19A55]/10 text-[#B19A55]"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="flex-1">
                        <p
                          className={`text-[10px] uppercase tracking-[0.2em] ${
                            isUnread ? "text-[#D4B06A]" : "text-[#B19A55]"
                          }`}
                        >
                          {notification.type || "general"}
                        </p>

                        <h2
                          className={`mt-2 font-serif text-xl font-bold ${
                            isUnread ? "text-white" : "text-[#1A1A1A]"
                          }`}
                        >
                          {notification.title}
                        </h2>

                        <p
                          className={`mt-2 text-sm ${
                            isUnread ? "text-white/65" : "text-[#1A1A1A]/65"
                          }`}
                        >
                          {notification.description || "No details provided."}
                        </p>

                        <p
                          className={`mt-3 text-[10px] uppercase tracking-[0.18em] ${
                            isUnread ? "text-white/40" : "text-[#B19A55]"
                          }`}
                        >
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>

                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4B06A] text-white"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  No notifications yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}