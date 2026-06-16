"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Handshake,
  Loader2,
  Mail,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type Referral = {
  id: string;
  name: string | null;
  business_name: string | null;
  email: string | null;
  phone?: string | null;
  partner_type: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    loadReferrals();

    const channel = supabase
      .channel("admin-referrals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "partner_applications",
        },
        async () => {
          await loadReferrals(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadReferrals(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(error.message);
      setLoading(false);
      return;
    }

    setReferrals((data || []) as Referral[]);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    setStatusMessage("");

    const { error } = await supabase
      .from("partner_applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    await loadReferrals(false);
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Growth Pipeline
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
                Referral Management
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65">
                Track agent referrals, client referrals, vendor collaborations,
                and Madison growth opportunities in one internal dashboard.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <Handshake size={24} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#B19A55]">
                    Active Submissions
                  </p>

                  <h2 className="mt-1 font-serif text-3xl font-bold">
                    {referrals.length}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {statusMessage && (
            <p className="mb-5 rounded-2xl bg-white px-4 py-3 text-sm text-red-600 shadow-xl">
              {statusMessage}
            </p>
          )}

          <section className="grid gap-5">
            {loading ? (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                  <Loader2 size={16} className="animate-spin" />
                  Loading referrals...
                </div>
              </div>
            ) : referrals.length > 0 ? (
              referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="rounded-[2rem] bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                          <UserPlus size={22} />
                        </div>

                        <div>
                          <h2 className="font-serif text-2xl font-bold">
                            {referral.name || "Unnamed Referral"}
                          </h2>

                          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                            {referral.partner_type || "Referral"} ·{" "}
                            {referral.business_name || "No organization"}
                          </p>
                        </div>

                        <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/50">
                          {referral.status || "New"}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-2 text-sm text-[#1A1A1A]/60">
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {referral.email || "No email"}
                        </p>

                        <p className="flex items-center gap-2">
                          <Phone size={14} />
                          {referral.phone || "No phone"}
                        </p>

                        <p className="flex items-center gap-2">
                          <Building2 size={14} />
                          {referral.business_name || "No business / referral name"}
                        </p>
                      </div>

                      {referral.message && (
                        <div className="mt-5 rounded-3xl bg-[#F8F5EF] p-4">
                          <p className="text-sm leading-7 text-[#1A1A1A]/70">
                            {referral.message}
                          </p>
                        </div>
                      )}

                      <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/35">
                        Submitted {new Date(referral.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {["New", "Contacted", "Qualified", "Closed"].map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => updateStatus(referral.id, item)}
                            className="rounded-full border border-[#1A1A1A]/10 px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-[0.18em] transition hover:bg-[#B19A55] hover:text-white"
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  No referrals or partner applications yet.
                </p>
              </div>
            )}
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Agent Referrals",
                description:
                  "Outside agents can refer buyers, sellers, or other agents into Madison.",
                icon: Users,
              },
              {
                title: "Client Referrals",
                description:
                  "Clients can recommend Madison to friends and family.",
                icon: BadgeCheck,
              },
              {
                title: "Referral Growth",
                description:
                  "Track relationship-based lead growth and partnership value.",
                icon: ArrowRight,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4B06A]/20 text-[#D4B06A]">
                    <Icon size={22} />
                  </div>

                  <h2 className="mt-5 font-serif text-2xl font-bold">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/65">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </section>
        </section>
      </main>
    </AdminPageShell>
  );
}