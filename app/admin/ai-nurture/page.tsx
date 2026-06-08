import Link from "next/link";
import {
  Flame,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

export default async function AINurturePage() {
  const { data: activities } = await supabase
    .from("buyer_activities")
    .select("id, user_id, activity_type, activity_label, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  const hotActivities =
    activities?.filter((activity) =>
      ["showing_request", "favorite", "message", "saved_search"].includes(
        activity.activity_type
      )
    ) || [];

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Sparkles size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Agent View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              AI Nurture
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard icon={<Flame size={20} />} label="Hot Signals" value={hotActivities.length} />
          <StatCard icon={<Search size={20} />} label="Recent Activity" value={activities?.length || 0} />
          <StatCard icon={<MessageCircle size={20} />} label="Follow-Ups" value={hotActivities.length} />
        </div>

        <section className="mt-8 rounded-[1.5rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
            AI Recommended Actions
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold">
            Buyer Nurture Queue
          </h2>

          <div className="mt-6 grid gap-4">
            {hotActivities.length > 0 ? (
              hotActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-3xl bg-white/10 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4B06A] text-white">
                      <Heart size={17} />
                    </div>

                    <div>
                      <p className="font-serif text-lg font-bold capitalize">
                        {activity.activity_type.replaceAll("_", " ")}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-white/65">
                        {activity.activity_label ||
                          "This buyer is showing engagement and should receive a personalized follow-up."}
                      </p>

                      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                        Buyer {activity.user_id?.slice(0, 8)} ·{" "}
                        {new Date(activity.created_at).toLocaleString()}
                      </p>

                      <Link
                        href="/admin/client-activity"
                        className="mt-4 inline-block rounded-full bg-[#D4B06A] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                      >
                        View Activity
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-3xl bg-white/10 p-6 text-sm text-white/60">
                No nurture actions yet. Buyer activity will appear here once
                clients save homes, request showings, or message advisors.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  </AdminPageShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="text-[#B19A55]">{icon}</div>

      <p className="mt-4 font-serif text-4xl font-bold">{value}</p>

      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>
    </div>
  );
}