"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, Flame, MessageCircle, Search, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateBuyerScore } from "@/lib/buyerScore";

type BuyerActivity = {
  id: string;
  user_id: string;
  activity_type: string;
  activity_label: string | null;
  created_at: string;
};

export function AdminAIRecommendations() {
  const [activities, setActivities] = useState<BuyerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();

    const channel = supabase
      .channel("admin-ai-recommendations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "buyer_activities",
        },
        async () => {
          await loadRecommendations(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadRecommendations(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data } = await supabase
      .from("buyer_activities")
      .select("id, user_id, activity_type, activity_label, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    setActivities((data || []) as unknown as BuyerActivity[]);
    setLoading(false);
  }

  const recommendations = useMemo(() => {
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

        let action = "Keep nurturing this buyer with helpful education.";
        let icon = <Sparkles size={18} />;

        if (score.label === "Hot") {
          action =
            "Prioritize this buyer today. Send a personal message and suggest a private showing or consultation.";
          icon = <Flame size={18} />;
        } else if (savedSearches > 0 || favorites > 0) {
          action =
            "Send a tailored follow-up with similar listings and ask what they liked most.";
          icon = <Search size={18} />;
        } else if (messages > 0) {
          action =
            "Continue the conversation and move them toward a clear next step.";
          icon = <MessageCircle size={18} />;
        }

        return {
          userId,
          score: score.score,
          label: score.label,
          message: score.message,
          action,
          icon,
          propertyViews,
          favorites,
          savedSearches,
          showingRequests,
          messages,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [activities]);

  return (
    <section className="rounded-[1.5rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4B06A] text-white">
          <Brain size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
            AI Advisor Assistant
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Recommended Follow-Ups
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-white/10 p-6 text-sm text-white/60">
          Reviewing buyer activity...
        </p>
      ) : recommendations.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {recommendations.map((item) => (
            <div
              key={item.userId}
              className="rounded-3xl border border-white/10 bg-white/10 p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      item.label === "Hot"
                        ? "bg-red-500 text-white"
                        : item.label === "Warm"
                        ? "bg-[#D4B06A] text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-serif text-lg font-bold">
                      Buyer {item.userId.slice(0, 8)}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-white/65">
                      {item.action}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <MiniStat label="Views" value={item.propertyViews} />
                      <MiniStat label="Favorites" value={item.favorites} />
                      <MiniStat label="Searches" value={item.savedSearches} />
                      <MiniStat label="Showings" value={item.showingRequests} />
                      <MiniStat label="Messages" value={item.messages} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 text-center text-[#1A1A1A]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    Score
                  </p>

                  <p className="mt-2 font-serif text-4xl font-bold text-[#B19A55]">
                    {item.score}
                  </p>

                  <p
                    className={`mt-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
                      item.label === "Hot"
                        ? "bg-red-500 text-white"
                        : item.label === "Warm"
                        ? "bg-[#B19A55] text-white"
                        : "bg-[#F8F5EF] text-[#1A1A1A]/50"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-white/10 p-6 text-sm text-white/60">
          No recommendations yet. Buyer activity will appear here once clients
          start viewing, saving, messaging, or requesting showings.
        </p>
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