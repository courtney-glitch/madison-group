"use client";

import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  Heart,
  MessageCircle,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type CRMClient = {
  id: string;
  name: string;
  email: string | null;
  stage: string | null;
  budget: string | null;
  favorites_count: number | null;
  unread_count: number | null;
  created_at: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("Active Search");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);

    const { data, error } = await supabase
      .from("crm_clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setClients((data || []) as CRMClient[]);
    }

    setLoading(false);
  }

  async function addClient() {
    if (!name.trim()) return;

    setSaving(true);

    const { error } = await supabase.from("crm_clients").insert({
      name: name.trim(),
      email: email.trim(),
      stage,
      budget,
      favorites_count: 0,
      unread_count: 0,
    });

    if (!error) {
      setName("");
      setEmail("");
      setStage("Active Search");
      setBudget("");

      await loadClients();
    }

    setSaving(false);
  }

  async function deleteClient(id: string) {
    await supabase.from("crm_clients").delete().eq("id", id);

    await loadClients();
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Users size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Admin View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              All Clients
            </h1>
          </div>
        </div>

        <section className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">
            Add Client
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Client email"
              type="email"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            >
              <option>Active Search</option>
              <option>Pre-Approved</option>
              <option>Offer Stage</option>
              <option>Closed</option>
            </select>

            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$950,000"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />
          </div>

          <button
            type="button"
            onClick={addClient}
            disabled={saving || !name.trim()}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            <Plus size={15} />
            {saving ? "Saving..." : "Add Client"}
          </button>
        </section>

        <div className="mt-8 grid gap-4">
          {loading ? (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading clients...
            </p>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                className="rounded-[1.5rem] bg-white p-5 shadow-xl md:p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold">
                      {client.name}
                    </h2>

                    <p className="mt-2 text-sm text-[#B19A55]">
                      {client.stage || "Active Search"}
                    </p>

                    {client.email && (
                      <p className="mt-3 text-sm text-[#1A1A1A]/60">
                        {client.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                      <div className="flex items-center gap-2 text-[#B19A55]">
                        <Heart size={15} />

                        <p className="text-[10px] uppercase tracking-[0.2em]">
                          Favorites
                        </p>
                      </div>

                      <p className="mt-2 font-serif text-xl font-bold">
                        {client.favorites_count || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                      <div className="flex items-center gap-2 text-[#B19A55]">
                        <CircleDollarSign size={15} />

                        <p className="text-[10px] uppercase tracking-[0.2em]">
                          Budget
                        </p>
                      </div>

                      <p className="mt-2 font-serif text-xl font-bold">
                        {client.budget || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                      <div className="flex items-center gap-2 text-[#B19A55]">
                        <MessageCircle size={15} />

                        <p className="text-[10px] uppercase tracking-[0.2em]">
                          Unread
                        </p>
                      </div>

                      <p className="mt-2 font-serif text-xl font-bold">
                        {client.unread_count || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Open Profile
                  </button>

                  <button className="rounded-full border border-[#1A1A1A]/10 bg-white px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                    Send Message
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteClient(client.id)}
                    className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              No clients yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}