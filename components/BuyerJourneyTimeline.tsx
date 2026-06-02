"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Eye,
  Heart,
  MessageCircle,
  NotebookText,
  Search,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type BuyerActivity = {
  id: string;
  activity_type: string;
  activity_label: string | null;
  created_at: string;
};

function getIcon(type: string) {
  if (type === "property_view") return <Eye size={17} />;
  if (type === "favorite") return <Heart size={17} />;
  if (type === "saved_search") return <Search size={17} />;
  if (type === "showing_request") return <CalendarDays size={17} />;
  if (type === "message") return <MessageCircle size={17} />;
  if (type === "note") return <NotebookText size={17} />;

  return <Sparkles size={17} />;
}

function formatType(type: string) {
  return type.replaceAll("_", " ");
}

export function BuyerJourneyTimeline() {
  const [activities, setActivities] = useState<BuyerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourney();
  }, []);

  async function loadJourney() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("buyer_activities")
      .select("id, activity_type, activity_label, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    setActivities((data || []) as BuyerActivity[]);
    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Sparkles size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            AI Buyer Journey
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Your Home Search Timeline
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Loading your journey...
        </p>
      ) : activities.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 rounded-3xl bg-[#F8F5EF] p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B19A55]">
                {getIcon(activity.activity_type)}
              </div>

              <div>
                <p className="font-serif text-lg font-bold capitalize">
                  {formatType(activity.activity_type)}
                </p>

                <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/60">
                  {activity.activity_label || "Activity recorded."}
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm leading-7 text-[#1A1A1A]/60">
          Your buyer journey will appear here as you view homes, save searches,
          send messages, and request showings.
        </p>
      )}
    </section>
  );
}