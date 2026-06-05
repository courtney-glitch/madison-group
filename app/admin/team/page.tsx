"use client";

import { Plus, Users } from "lucide-react";

const agents = [
  {
    name: "Madison Harper",
    role: "Lead Advisor",
    email: "madison@madisongroup.com",
    status: "Active",
  },
  {
    name: "Daniel Ross",
    role: "Buyer Specialist",
    email: "daniel@madisongroup.com",
    status: "Active",
  },
  {
    name: "Sophia Lee",
    role: "Client Coordinator",
    email: "sophia@madisongroup.com",
    status: "Pending",
  },
];

export default function TeamPage() {
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

          <button className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            <Plus size={15} />
            Add Team Member
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.email}
              className="rounded-[1.5rem] bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B19A55]/10 font-serif text-xl font-bold text-[#B19A55]">
                  {agent.name.charAt(0)}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    agent.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold">
                {agent.name}
              </h2>

              <p className="mt-2 text-sm text-[#B19A55]">
                {agent.role}
              </p>

              <p className="mt-5 break-all text-sm text-[#1A1A1A]/60">
                {agent.email}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}