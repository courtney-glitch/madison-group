"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Eye,
  Heart,
  MessageCircle,
  NotebookText,
  Search,
  Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type BuyerActivity = {
  id: string;
  user_id: string;
  property_id: string | null;
  activity_type: string;
  activity_label: string | null;
  created_at: string;
  properties?: {
    id: string;
    title: string;
    city: string;
    price: string;
  } | null;
};

function getIcon(type: string) {
  if (type === "property_view") return <Eye size={17} />;
  if (type === "favorite") return <Heart size={17} />;
  if (type === "saved_search") return <Search size={17} />;
  if (type === "message") return <MessageCircle size={17} />;
  if (type === "note") return <NotebookText size={17} />;
  if (type === "compare") return <Star size={17} />;

  return <Activity size={17} />;
}

function formatActivityType(type: string) {
  return type.replaceAll("_", " ");
}

export function AdminBuyerActivityFeed() {
  const [activities, setActivities] = useState<BuyerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();

    const channel = supabase
      .channel("admin-buyer-activities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "buyer_activities",
        },
        async () => {
          await loadActivities(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadActivities(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data } = await supabase
      .from("buyer_activities")
      .select(
        `
        id,
        user_id,
        property_id,
        activity_type,
        activity_label,
        created_at,
        properties (
          id,
          title,
          city,
          price
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(30);

    setActivities((data || []) as unknown as BuyerActivity[]);
    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Activity size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Buyer Intelligence
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Live Buyer Activity Feed
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Loading buyer activity...
        </p>
      ) : activities.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-5"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B19A55]">
                  {getIcon(activity.activity_type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="font-serif text-lg font-bold capitalize">
                      {formatActivityType(activity.activity_type)}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                      User: {activity.user_id?.slice(0, 8)}
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/60">
                    {activity.activity_label || "Buyer activity recorded."}
                  </p>

                  {activity.properties && (
                    <div className="mt-4 rounded-2xl bg-white p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                        Related Property
                      </p>

                      <p className="mt-2 font-serif text-lg font-bold">
                        {activity.properties.title}
                      </p>

                      <p className="mt-1 text-sm text-[#1A1A1A]/60">
                        {activity.properties.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          No buyer activity yet.
        </p>
      )}
    </section>
  );
}