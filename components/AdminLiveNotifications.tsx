"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Eye,
  Heart,
  MessageCircle,
  NotebookText,
  Search,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type LiveNotification = {
  id: string;
  user_id: string;
  activity_type: string;
  activity_label: string | null;
  created_at: string;
};

function getIcon(type: string) {
  if (type === "property_view") return <Eye size={16} />;
  if (type === "favorite") return <Heart size={16} />;
  if (type === "saved_search") return <Search size={16} />;
  if (type === "showing_request") return <CalendarDays size={16} />;
  if (type === "message") return <MessageCircle size={16} />;
  if (type === "note") return <NotebookText size={16} />;

  return <Activity size={16} />;
}

function formatType(type: string) {
  return type.replaceAll("_", " ");
}

export function AdminLiveNotifications() {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-live-buyer-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "buyer_activities",
        },
        (payload) => {
          const newActivity = payload.new as LiveNotification;

          setNotifications((current) => [newActivity, ...current].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function dismissNotification(id: string) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }

  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-5 top-24 z-[120] grid w-[360px] max-w-[calc(100vw-2rem)] gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-3xl border border-[#B19A55]/20 bg-white p-5 text-[#1A1A1A] shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B19A55] text-white">
                {getIcon(notification.activity_type)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-[#B19A55]" />

                  <p className="font-serif text-sm font-bold uppercase tracking-[0.18em] text-[#B19A55]">
                    Live Buyer Activity
                  </p>
                </div>

                <p className="mt-2 font-serif text-lg font-bold capitalize">
                  {formatType(notification.activity_type)}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/65">
                  {notification.activity_label || "New buyer activity recorded."}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                  Buyer {notification.user_id.slice(0, 8)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="rounded-full bg-[#F8F5EF] p-2 text-[#1A1A1A]/40 transition hover:text-[#1A1A1A]"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}