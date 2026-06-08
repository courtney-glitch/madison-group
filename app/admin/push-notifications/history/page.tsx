"use client";

import { useEffect, useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

type NotificationEvent = {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationHistoryPage() {
  const [history, setHistory] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const { data } = await supabase
      .from("notification_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    setHistory((data || []) as NotificationEvent[]);
    setLoading(false);
  }

  return (
   <AdminPageShell>
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BellRing size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Push Notifications
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Notification History
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {loading ? (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading notification history...
            </p>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] bg-white p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                      {item.notification_type.replaceAll("_", " ")}
                    </p>

                    <h2 className="mt-3 font-serif text-2xl font-bold">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/65">
                      {item.body}
                    </p>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  {item.is_read && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              No notifications created yet.
            </p>
          )}
        </div>
      </section>
    </main>
    </AdminPageShell>
  );
}