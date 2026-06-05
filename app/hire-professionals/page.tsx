"use client";

import {
  BriefcaseBusiness,
  Hammer,
  Home,
  ShieldCheck,
} from "lucide-react";

const vendors = [
  {
    name: "ClearSkies Title",
    category: "Title Company",
  },
  {
    name: "Prestige Mortgage",
    category: "Mortgage Lender",
  },
  {
    name: "Luxury Home Inspectors",
    category: "Inspection",
  },
];

export default function HireProfessionalsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Client View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Hire Professionals
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="rounded-[1.5rem] bg-white p-6 shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                <ShieldCheck size={24} />
              </div>

              <h2 className="mt-6 font-serif text-2xl font-bold">
                {vendor.name}
              </h2>

              <p className="mt-3 text-sm text-[#B19A55]">
                {vendor.category}
              </p>

              <button className="mt-6 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] uppercase tracking-[0.2em] text-white">
                Contact Professional
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}