"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
};

export default function UserRolesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setProfiles((data || []) as Profile[]);
    setLoading(false);
  }

  async function updateRole(profileId: string, role: string) {
    await supabase.from("profiles").update({ role }).eq("id", profileId);
    await loadProfiles();
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Admin View
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                User Roles
              </h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {loading ? (
              <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
                Loading users...
              </p>
            ) : profiles.length > 0 ? (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-[1.5rem] bg-white p-5 shadow-xl md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B19A55]/10 text-[#B19A55]">
                        <Users size={20} />
                      </div>

                      <div>
                        <h2 className="font-serif text-xl font-bold">
                          {profile.full_name || "Unnamed User"}
                        </h2>

                        <p className="mt-1 break-all text-sm text-[#1A1A1A]/55">
                          {profile.id}
                        </p>
                      </div>
                    </div>

                    <select
                      value={profile.role || "client"}
                      onChange={(e) => updateRole(profile.id, e.target.value)}
                      className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none focus:border-[#B19A55]"
                    >
                      <option value="client">Client</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
                No profiles found yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}