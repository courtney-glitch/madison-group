"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const statuses = [
  "New",
  "Contacted",
  "Scheduled",
  "Closed",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data, error } = await supabase
      .from("showings")
      .select(`
        *,
        properties (
          title,
          city,
          price
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    }

    if (data) {
      setLeads(data);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    await supabase
      .from("showings")
      .update({ status })
      .eq("id", id);

    loadLeads();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
        <p>Loading leads...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Showing Requests
        </h1>

        {leads.length === 0 ? (
          <div className="mt-10 border border-[#1A1A1A]/10 p-10 text-center">
            <p className="font-serif text-2xl font-bold">
              No leads yet
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="border border-[#1A1A1A]/10 p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-serif text-2xl font-bold">
                      {lead.full_name}
                    </p>

                    <p className="mt-2 text-[#1A1A1A]/70">
                      {lead.email} · {lead.phone || "No phone"}
                    </p>

                    <div className="mt-5 border-l-4 border-[#B19A55] pl-4">
                      <p className="font-serif font-bold">
                        {lead.properties?.title ||
                          "Property deleted"}
                      </p>

                      <p className="text-sm text-[#1A1A1A]/70">
                        {lead.properties?.city} ·{" "}
                        {lead.properties?.price}
                      </p>
                    </div>

                    {lead.message && (
                      <p className="mt-5 leading-7">
                        {lead.message}
                      </p>
                    )}

                    <p className="mt-5 text-xs text-[#1A1A1A]/50">
                      Submitted:{" "}
                      {new Date(
                        lead.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="min-w-[200px]">
                    <p className="mb-2 font-serif text-sm font-bold uppercase tracking-[0.2em]">
                      Status
                    </p>

                    <select
                      value={lead.status || "New"}
                      onChange={(e) =>
                        updateStatus(
                          lead.id,
                          e.target.value
                        )
                      }
                      className="w-full border border-[#1A1A1A]/20 px-4 py-3"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}