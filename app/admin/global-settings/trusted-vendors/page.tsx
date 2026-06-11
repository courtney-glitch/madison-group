"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

type Vendor = {
  name: string;
  category: string;
};

export default function TrustedVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      name: "ClearSkies Title Agency",
      category: "Title Company",
    },
    {
      name: "Preferred Mortgage Partner",
      category: "Lender",
    },
  ]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  function addVendor() {
    if (!name.trim() || !category.trim()) return;

    setVendors([
      ...vendors,
      {
        name: name.trim(),
        category: category.trim(),
      },
    ]);

    setName("");
    setCategory("");
  }

  function removeVendor(index: number) {
    setVendors(vendors.filter((_, i) => i !== index));
  }

  function saveVendors() {
    setStatus("Vendor settings saved locally. Database integration can be connected next.");
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Vendor Network
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Trusted Vendors
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold">
                Vendor Directory
              </h2>

              <div className="mt-6 grid gap-3">
                {vendors.map((vendor, index) => (
                  <div
                    key={`${vendor.name}-${index}`}
                    className="flex items-center justify-between rounded-3xl bg-[#F8F5EF] p-4"
                  >
                    <div>
                      <p className="font-serif text-lg font-bold">
                        {vendor.name}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                        {vendor.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVendor(index)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1A1A]/50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vendor Name"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                />

                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                />

                <button
                  onClick={addVendor}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Plus size={15} />
                  Add Vendor
                </button>

                <button
                  onClick={saveVendors}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Save Vendors
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
                Client Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                Recommended Professionals
              </h2>

              <div className="mt-8 grid gap-3">
                {vendors.map((vendor, index) => (
                  <div
                    key={`preview-${index}`}
                    className="rounded-3xl bg-white/10 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                      {vendor.category}
                    </p>

                    <p className="mt-2 font-serif text-lg font-bold">
                      {vendor.name}
                    </p>
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