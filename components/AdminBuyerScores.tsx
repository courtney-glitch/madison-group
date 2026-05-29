"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Thermometer, Snowflake } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateBuyerScore } from "@/lib/buyerScore";

type BuyerActivity = {
  id: string;
  user_id: string;
  activity_type: string;
};

function scoreIcon(label: "Cold" | "Warm" | "Hot") {
  if (label === "Hot") return <Flame size={18} />;
  if (label === "Warm") return <Thermometer size={18} />;

  return <Snowflake size={18} />;
}

export function AdminBuyerScores() {
  const [activities, setActivities] = useState<BuyerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();

    const channel = supabase
      .channel("admin-buyer-scores")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "buyer_activities",
        },
        async () => {
          await loadScores(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadScores(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data } = await supabase
      .from("buyer_activities")
      .select("id, user_id, activity_type")
      .order("created_at", { ascending: false });

    setActivities((data || []) as unknown as BuyerActivity[]);

    setLoading(false);
  }

  const buyerScores = useMemo(() => {
    const grouped: Record<string, BuyerActivity[]> = {};

    activities.forEach((activity) => {
      if (!grouped[activity.user_id]) {
        grouped[activity.user_id] = [];
      }

      grouped[activity.user_id].push(activity);
    });

    return Object.entries(grouped)
      .map(([userId, userActivities]) => {
        const propertyViews = userActivities.filter(
          (activity) => activity.activity_type === "property_view"
        ).length;

        const favorites = userActivities.filter(
          (activity) => activity.activity_type === "favorite"
        ).length;

        const savedSearches = userActivities.filter(
          (activity) => activity.activity_type === "saved_search"
        ).length;

        const showingRequests = userActivities.filter(
          (activity) => activity.activity_type === "showing_request"
        ).length;

        const messages = userActivities.filter(
          (activity) => activity.activity_type === "message"
        ).length;

        const notes = userActivities.filter(
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
          userId,
          propertyViews,
          favorites,
          savedSearches,
          showingRequests,
          messages,
          notes,
          ...score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [activities]);

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Flame size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Hot Buyer Scoring
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Buyer Engagement Scores
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Calculating buyer scores...
        </p>
      ) : buyerScores.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {buyerScores.map((buyer) => (
            <div
              key={buyer.userId}
              className="rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      buyer.label === "Hot"
                        ? "bg-red-500 text-white"
                        : buyer.label === "Warm"
                        ? "bg-[#B19A55] text-white"
                        : "bg-white text-[#1A1A1A]/40"
                    }`}
                  >
                    {scoreIcon(buyer.label)}
                  </div>

                  <div>
                    <p className="font-serif text-lg font-bold">
                      Buyer {buyer.userId.slice(0, 8)}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/60">
                      {buyer.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <MiniStat label="Views" value={buyer.propertyViews} />
                      <MiniStat label="Favorites" value={buyer.favorites} />
                      <MiniStat
                        label="Searches"
                        value={buyer.savedSearches}
                      />
                      <MiniStat
                        label="Showings"
                        value={buyer.showingRequests}
                      />
                      <MiniStat label="Messages" value={buyer.messages} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    Score
                  </p>

                  <p className="mt-2 font-serif text-4xl font-bold text-[#B19A55]">
                    {buyer.score}
                  </p>

                  <p
                    className={`mt-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                      buyer.label === "Hot"
                        ? "bg-red-500 text-white"
                        : buyer.label === "Warm"
                        ? "bg-[#B19A55] text-white"
                        : "bg-[#F8F5EF] text-[#1A1A1A]/50"
                    }`}
                  >
                    {buyer.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          No buyer scores yet.
        </p>
      )}
    </section>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-full bg-white px-4 py-2 text-xs text-[#1A1A1A]/60">
      {label}: <span className="font-bold text-[#1A1A1A]">{value}</span>
    </div>
  );
}