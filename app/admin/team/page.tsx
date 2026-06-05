"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string | null;
  created_at: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setMembers((data || []) as TeamMember[]);
    }

    setLoading(false);
  }

  async function addMember() {
    if (!name.trim() || !role.trim() || !email.trim()) return;

    setSaving(true);

    const { error } = await supabase.from("team_members").insert({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      status,
    });

    if (!error) {
      setName("");
      setRole("");
      setEmail("");
      setStatus("Active");
      await loadMembers();
    }

    setSaving(false);
  }

  async function deleteMember(id: string) {
    await supabase.from("team_members").delete().eq("id", id);
    await loadMembers();
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Users size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Admin View
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Team Management
              </h1>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">Add Team Member</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="button"
            onClick={addMember}
            disabled={saving || !name.trim() || !role.trim() || !email.trim()}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            <Plus size={15} />
            {saving ? "Saving..." : "Add Team Member"}
          </button>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading team members...
            </p>
          ) : members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="rounded-[1.5rem] bg-white p-6 shadow-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B19A55]/10 font-serif text-xl font-bold text-[#B19A55]">
                    {member.name.charAt(0)}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                      member.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : member.status === "Pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-[#F8F5EF] text-[#1A1A1A]/50"
                    }`}
                  >
                    {member.status || "Active"}
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-2xl font-bold">
                  {member.name}
                </h2>

                <p className="mt-2 text-sm text-[#B19A55]">
                  {member.role}
                </p>

                <p className="mt-5 break-all text-sm text-[#1A1A1A]/60">
                  {member.email}
                </p>

                <button
                  type="button"
                  onClick={() => deleteMember(member.id)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              No team members yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}