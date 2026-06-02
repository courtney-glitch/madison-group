"use client";

import { useEffect, useMemo, useState } from "react";
import { Gauge, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateBuyerScore } from "@/lib/buyerScore";

type BuyerActivity = {
  id: string;
  activity_type: string;
};

export function BuyerReadinessMeter() {
  const [activities, setActivities] = useState<BuyerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadiness();
  }, []);

  async function loadReadiness() {
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
      .select("id, activity_type")
      .eq("user_id", user.id);

    setActivities((data || []) as BuyerActivity[]);
    setLoading(false);
  }

  const readiness = useMemo(() => {
    const propertyViews = activities.filter(
      (activity) => activity.activity_type === "property_view"
    ).length;

    const favorites = activities.filter(
      (activity) => activity.activity_type === "favorite"
    ).length;

    const savedSearches = activities.filter(
      (activity) => activity.activity_type === "saved_search"
    ).length;

    const showingRequests = activities.filter(
      (activity) => activity.activity_type === "showing_request"
    ).length;

    const messages = activities.filter(
      (activity) => activity.activity_type === "message"
    ).length;

    const notes = activities.filter(
      (activity) => activity.activity_type === "note"
    ).length;

    const score = calculateBuyerScore({
      propertyViews,
      favorites,
      savedSearches,
      showingRequests,
      messages,
      notes,
    });

    return {
      ...score,
      percentage: Math.min(score.score, 100),
      propertyViews,
      favorites,
      savedSearches,
      showingRequests,
      messages,
      notes,
    };
  }, [activities]);

  return (
    <section className="rounded-[1.5rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4B06A] text-white">
          <Gauge size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
            Buyer Readiness
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Your Readiness Score
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-white/10 p-6 text-sm text-white/60">
          Calculating readiness...
        </p>
      ) : (
        <div className="mt-8">
          <div className="rounded-3xl bg-white/10 p-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Current Level
                </p>

                <p className="mt-3 font-serif text-5xl font-bold text-[#D4B06A]">
                  {readiness.percentage}%
                </p>

                <p className="mt-3 font-serif text-xl font-bold">
                  {readiness.label} Buyer
                </p>
              </div>

              <Sparkles className="text-[#D4B06A]" size={34} />
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#D4B06A]"
                style={{
                  width: `${readiness.percentage}%`,
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/65">
              {readiness.message}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <MiniStat label="Views" value={readiness.propertyViews} />
            <MiniStat label="Favorites" value={readiness.favorites} />
            <MiniStat label="Searches" value={readiness.savedSearches} />
            <MiniStat label="Showings" value={readiness.showingRequests} />
            <MiniStat label="Messages" value={readiness.messages} />
          </div>
        </div>
      )}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70">
      {label}: <span className="font-bold text-white">{value}</span>
    </div>
  );
}