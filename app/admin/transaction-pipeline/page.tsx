"use client";

import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
  Home,
  KeyRound,
  Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

type PipelineClient = {
  name: string;
  type: "Buyer" | "Seller";
  stage: string;
  property: string;
};

const stages = [
  {
    title: "New Lead",
    icon: Users,
  },
  {
    title: "Consultation",
    icon: CalendarDays,
  },
  {
    title: "Pre-Approved",
    icon: DollarSign,
  },
  {
    title: "Touring / Listing Active",
    icon: Home,
  },
  {
    title: "Offer Submitted",
    icon: FileText,
  },
  {
    title: "Under Contract",
    icon: BadgeCheck,
  },
  {
    title: "Closing Prep",
    icon: ClipboardList,
  },
  {
    title: "Closed",
    icon: KeyRound,
  },
];

export default function TransactionPipelinePage() {
  const [clients, setClients] = useState<PipelineClient[]>([
    {
      name: "Sarah Williams",
      type: "Buyer",
      stage: "Consultation",
      property: "Searching in Bergen County",
    },
    {
      name: "Michael Reyes",
      type: "Seller",
      stage: "Touring / Listing Active",
      property: "Luxury Listing - Active",
    },
    {
      name: "Amanda Lee",
      type: "Buyer",
      stage: "Offer Submitted",
      property: "Offer pending review",
    },
  ]);

  function updateStage(index: number, stage: string) {
    setClients(
      clients.map((client, clientIndex) =>
        clientIndex === index ? { ...client, stage } : client
      )
    );
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

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const count = clients.filter(
                (client) => client.stage === stage.title
              ).length;

              return (
                <div
                  key={stage.title}
                  className="rounded-[2rem] bg-white p-5 shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={21} />
                  </div>

                  <h2 className="mt-5 font-serif text-xl font-bold">
                    {stage.title}
                  </h2>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/45">
                    {count} active
                  </p>
                </div>
              );
            })}
          </section>

          <section className="mt-10 grid gap-5">
            {clients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="rounded-[2rem] bg-white p-6 shadow-xl"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-bold">
                        {client.name}
                      </h2>

                      <span className="rounded-full bg-[#B19A55]/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                        {client.type}
                      </span>

                      <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/50">
                        {client.stage}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-[#1A1A1A]/60">
                      {client.property}
                    </p>
                  </div>

                  <select
                    value={client.stage}
                    onChange={(e) => updateStage(index, e.target.value)}
                    className="rounded-full border border-[#1A1A1A]/10 bg-[#F8F5EF] px-5 py-3 text-sm outline-none"
                  >
                    {stages.map((stage) => (
                      <option key={stage.title}>{stage.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </section>
        </section>
      </main>
    </AdminPageShell>
  );
}