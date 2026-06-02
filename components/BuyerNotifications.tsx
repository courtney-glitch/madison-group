"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  Heart,
  Home,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type BuyerNotification = {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
};

export function BuyerNotifications() {
  const [notifications, setNotifications] = useState<BuyerNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: favorites } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id);

    const { data: savedSearches } = await supabase
      .from("saved_searches")
      .select("id")
      .eq("user_id", user.id);

    const { data: showingRequests } = await supabase
      .from("showing_requests")
      .select("id")
      .eq("user_id", user.id);

    const { data: messages } = await supabase
      .from("messages")
      .select("id")
      .eq("sender_type", "advisor")
      .eq("read_by_client", false);

    const generated: BuyerNotification[] = [];

    if ((messages?.length || 0) > 0) {
      generated.push({
        id: "messages",
        title: "New advisor message",
        message: `You have ${messages?.length || 0} unread advisor message(s).`,
        icon: <MessageCircle size={18} />,
      });
    }

    if ((favorites?.length || 0) > 0) {
      generated.push({
        id: "favorites",
        title: "Saved homes active",
        message: `You have ${favorites?.length || 0} saved home(s) in your client portal.`,
        icon: <Heart size={18} />,
      });
    }

    if ((savedSearches?.length || 0) > 0) {
      generated.push({
        id: "saved-search",
        title: "Saved search monitoring",
        message:
          "Your saved search is helping Madison Group recommend better matched homes.",
        icon: <Search size={18} />,
      });
    }

    if ((showingRequests?.length || 0) > 0) {
      generated.push({
        id: "showings",
        title: "Showing request submitted",
        message:
          "Your showing request is saved and ready for advisor follow-up.",
        icon: <CalendarDays size={18} />,
      });
    }

    generated.push({
      id: "ai-match",
      title: "AI property matching active",
      message:
        "Madison Group is using your saved searches and activity to improve home recommendations.",
      icon: <Sparkles size={18} />,
    });

    setNotifications(generated);
    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4B06A] text-white">
          <Bell size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
            Smart Notifications
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Buyer Updates
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-white/10 p-6 text-sm text-white/60">
          Loading notifications...
        </p>
      ) : notifications.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex gap-4 rounded-3xl bg-white/10 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D4B06A]">
                {notification.icon}
              </div>

              <div>
                <p className="font-serif text-lg font-bold">
                  {notification.title}
                </p>

                <p className="mt-2 text-sm leading-7 text-white/65">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-white/10 p-6 text-sm text-white/60">
          No notifications yet.
        </p>
      )}
    </section>
  );
}