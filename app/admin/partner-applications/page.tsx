"use client";

import { useEffect, useState } from "react";
import { Handshake, Mail, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

type PartnerApplication = {
  id: string;
  name: string | null;
  business_name: string | null;
  email: string | null;
  partner_type: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);

    const { data } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });

    setApplications((data || []) as PartnerApplication[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("partner_applications")
      .update({ status })
      .eq("id", id);

    await loadApplications();
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Handshake size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Partnership Pipeline
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Partner Applications
              </h1>
            </div>
          </div>

          <div className="grid gap-5">
            {loading ? (
              <div className="rounded-[1.5rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  Loading applications...
                </p>
              </div>
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-[1.5rem] bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl font-bold">
                          {application.name || "Unnamed Partner"}
                        </h2>

                        <span className="rounded-full bg-[#B19A55]/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                          {application.partner_type || "Partner"}
                        </span>

                        <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/50">
                          {application.status || "New"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-[#1A1A1A]/60">
                        <p className="flex items-center gap-2">
                          <Building2 size={14} />
                          {application.business_name || "No business name"}
                        </p>

                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {application.email || "No email"}
                        </p>
                      </div>

                      <div className="mt-5 rounded-3xl bg-[#F8F5EF] p-5">
                        <p className="text-sm leading-7 text-[#1A1A1A]/70">
                          {application.message || "No message included."}
                        </p>
                      </div>

                      <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/35">
                        Submitted{" "}
                        {new Date(application.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      {["New", "Reviewing", "Approved", "Declined"].map(
                        (status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatus(application.id, status)}
                            className="rounded-full border border-[#1A1A1A]/10 px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A] transition hover:bg-[#B19A55] hover:text-white"
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  No partner applications yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}