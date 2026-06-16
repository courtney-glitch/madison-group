"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type Vendor = {
  id: string;
  name: string;
  category: string;
  created_at?: string;
};

export default function TrustedVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase
      .from("trusted_vendors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setVendors((data || []) as Vendor[]);
    setLoading(false);
  }

  async function addVendor() {
    if (!name.trim() || !category.trim()) {
      setStatus("Please add vendor name and category.");
      return;
    }

    setAdding(true);
    setStatus("");

    const { error } = await supabase.from("trusted_vendors").insert({
      name: name.trim(),
      category: category.trim(),
    });

    if (error) {
      setStatus(error.message);
      setAdding(false);
      return;
    }

    setName("");
    setCategory("");
    setStatus("Vendor added successfully.");
    setAdding(false);
    await loadVendors();
  }

  async function removeVendor(id: string) {
    const { error } = await supabase
      .from("trusted_vendors")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Vendor removed successfully.");
    await loadVendors();
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
                {loading ? (
                  <p className="rounded-3xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    Loading vendors...
                  </p>
                ) : vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <div
                      key={vendor.id}
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
                        onClick={() => removeVendor(vendor.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1A1A]/50 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="rounded-3xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    No vendors yet. Add your first trusted vendor.
                  </p>
                )}
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
                  type="button"
                  onClick={addVendor}
                  disabled={adding}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  {adding ? "Adding..." : "Add Vendor"}
                </button>

                <button
                  type="button"
                  onClick={loadVendors}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Refresh Vendors
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
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <div
                      key={`preview-${vendor.id}`}
                      className="rounded-3xl bg-white/10 p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                        {vendor.category}
                      </p>

                      <p className="mt-2 font-serif text-lg font-bold">
                        {vendor.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-sm text-white/65">
                      No vendors available yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}