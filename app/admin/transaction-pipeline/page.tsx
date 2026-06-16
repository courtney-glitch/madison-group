"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
  Home,
  KeyRound,
  Loader2,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type PipelineClient = {
  id: string;
  client_name: string;
  client_type: "Buyer" | "Seller";
  stage: string;
  property_details: string | null;
  created_at: string;
};

const stages = [
  { title: "New Lead", icon: Users },
  { title: "Consultation", icon: CalendarDays },
  { title: "Pre-Approved", icon: DollarSign },
  { title: "Touring / Listing Active", icon: Home },
  { title: "Offer Submitted", icon: FileText },
  { title: "Under Contract", icon: BadgeCheck },
  { title: "Closing Prep", icon: ClipboardList },
  { title: "Closed", icon: KeyRound },
];

export default function TransactionPipelinePage() {
  const [clients, setClients] = useState<PipelineClient[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState<"Buyer" | "Seller">("Buyer");
  const [stage, setStage] = useState("New Lead");
  const [propertyDetails, setPropertyDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadClients();

    const channel = supabase
      .channel("transaction-pipeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transaction_pipeline",
        },
        async () => {
          await loadClients(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadClients(showLoading = true) {
    if (showLoading) setLoading(true);
    setStatus("");

    const { data, error } = await supabase
      .from("transaction_pipeline")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setClients((data || []) as PipelineClient[]);
    setLoading(false);
  }

  async function addClient() {
    if (!clientName.trim()) {
      setStatus("Please add a client name.");
      return;
    }

    setAdding(true);
    setStatus("");

    const { error } = await supabase.from("transaction_pipeline").insert({
      client_name: clientName.trim(),
      client_type: clientType,
      stage,
      property_details: propertyDetails.trim(),
    });

    if (error) {
      setStatus(error.message);
      setAdding(false);
      return;
    }

    setClientName("");
    setClientType("Buyer");
    setStage("New Lead");
    setPropertyDetails("");
    setAdding(false);
    await loadClients(false);
  }

  async function updateStage(id: string, newStage: string) {
    setStatus("");

    const { error } = await supabase
      .from("transaction_pipeline")
      .update({ stage: newStage })
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadClients(false);
  }

  async function deleteClient(id: string) {
    setStatus("");

    const { error } = await supabase
      .from("transaction_pipeline")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadClients(false);
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Transaction Management
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
              Transaction Pipeline
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65">
              Manage buyers, sellers, active transactions, and deal stages from
              lead intake to closing.
            </p>
          </div>

          {status && (
            <p className="mb-5 rounded-2xl bg-white px-4 py-3 text-sm text-red-600 shadow-xl">
              {status}
            </p>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((item) => {
              const Icon = item.icon;
              const count = clients.filter(
                (client) => client.stage === item.title
              ).length;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] bg-white p-5 shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={21} />
                  </div>

                  <h2 className="mt-5 font-serif text-xl font-bold">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/45">
                    {count} active
                  </p>
                </div>
              );
            })}
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl font-bold">
              Add Transaction
            </h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name"
                className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
              />

              <select
                value={clientType}
                onChange={(e) =>
                  setClientType(e.target.value as "Buyer" | "Seller")
                }
                className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
              >
                <option>Buyer</option>
                <option>Seller</option>
              </select>

              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
              >
                {stages.map((item) => (
                  <option key={item.title}>{item.title}</option>
                ))}
              </select>

              <input
                value={propertyDetails}
                onChange={(e) => setPropertyDetails(e.target.value)}
                placeholder="Property details"
                className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
              />
            </div>

            <button
              type="button"
              onClick={addClient}
              disabled={adding}
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              {adding ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {adding ? "Adding..." : "Add To Pipeline"}
            </button>
          </section>

          <section className="mt-10 grid gap-5">
            {loading ? (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                  <Loader2 size={16} className="animate-spin" />
                  Loading pipeline...
                </div>
              </div>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-[2rem] bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl font-bold">
                          {client.client_name}
                        </h2>

                        <span className="rounded-full bg-[#B19A55]/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                          {client.client_type}
                        </span>

                        <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/50">
                          {client.stage}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-[#1A1A1A]/60">
                        {client.property_details || "No property details yet."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select
                        value={client.stage}
                        onChange={(e) => updateStage(client.id, e.target.value)}
                        className="rounded-full border border-[#1A1A1A]/10 bg-[#F8F5EF] px-5 py-3 text-sm outline-none"
                      >
                        {stages.map((item) => (
                          <option key={item.title}>{item.title}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => deleteClient(client.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <p className="text-sm text-[#1A1A1A]/60">
                  No transactions yet. Add your first buyer or seller to the
                  pipeline.
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
    </AdminPageShell>
  );
}