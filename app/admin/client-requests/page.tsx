"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

type RequestItem = {
  id: string;
  name: string | null;
  email: string | null;
  message: string | null;
  created_at: string;
};

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();

    const channel = supabase
      .channel("client-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "showing_requests",
        },
        async () => {
          await loadRequests(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadRequests(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data } = await supabase
      .from("showing_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests((data || []) as RequestItem[]);
    setLoading(false);
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <MessageSquare size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Lead Management
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Client Requests
              </h1>
            </div>
          </div>

          <div className="grid gap-5">
            {loading ? (
              <div className="rounded-[1.5rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  Loading requests...
                </p>
              </div>
            ) : requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-[1.5rem] bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[#B19A55]">
                        <UserRound size={15} />

                        <p className="font-serif text-lg font-bold">
                          {request.name || "Unknown Client"}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-[#1A1A1A]/55">
                        {request.email || "No email"}
                      </p>

                      <div className="mt-5 rounded-3xl bg-[#F8F5EF] p-5">
                        <p className="text-sm leading-7 text-[#1A1A1A]/75">
                          {request.message || "No message included."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-[#F8F5EF] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/45">
                      <CalendarDays size={13} />

                      {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  No client requests yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}