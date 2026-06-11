"use client";

import { useState } from "react";
import { Filter, Save, SlidersHorizontal } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

export default function DefaultFiltersPage() {
  const [propertyType, setPropertyType] = useState("Single Family");
  const [bedrooms, setBedrooms] = useState("3+");
  const [bathrooms, setBathrooms] = useState("2+");
  const [sortBy, setSortBy] = useState("Featured First");
  const [status, setStatus] = useState("");

  function saveSettings() {
    setStatus("Default filters saved locally. Database saving can be connected next.");
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <SlidersHorizontal size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Search Defaults
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Default Filters
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[#B19A55]" />
                <h2 className="font-serif text-2xl font-bold">
                  Buyer Search Defaults
                </h2>
              </div>

              <div className="mt-6 grid gap-4">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                >
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-Family</option>
                  <option>Luxury Estate</option>
                </select>

                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                >
                  <option>Any Bedrooms</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                  <option>5+</option>
                </select>

                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                >
                  <option>Any Bathrooms</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                >
                  <option>Featured First</option>
                  <option>Newest Listings</option>
                  <option>Price High to Low</option>
                  <option>Price Low to High</option>
                </select>

                <button
                  type="button"
                  onClick={saveSettings}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Save Default Filters
                </button>

                {status && (
                  <p className="rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/60">
                    {status}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
                Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                Default Search Experience
              </h2>

              <div className="mt-8 grid gap-3">
                {[propertyType, bedrooms, bathrooms, sortBy].map((item) => (
                  <div key={item} className="rounded-3xl bg-white/10 p-4">
                    <p className="text-sm text-white/75">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}