"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProperties(data);
    }
  }

  async function deleteProperty(id: string) {
    const confirmed = confirm("Are you sure you want to delete this property?");

    if (!confirmed) return;

    await supabase.from("properties").delete().eq("id", id);

    loadProperties();
  }

  return (
   <AdminPageShell>
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              ADMIN
            </p>

            <h1 className="font-serif text-4xl font-bold">
              Manage Properties
            </h1>
          </div>

          <Link
            href="/admin/properties/new"
            className="bg-[#B19A55] px-6 py-3 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Add Property
          </Link>
        </div>

        <div className="mt-10 grid gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-5 border border-[#1A1A1A]/10 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-serif text-2xl font-bold">
                  {property.title}
                </p>

                <p className="mt-2 text-[#1A1A1A]/70">
                  {property.city} · {property.price}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/properties/${property.id}`}
                  className="border border-[#1A1A1A] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em]"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => deleteProperty(property.id)}
                  className="border border-red-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    </AdminPageShell>
  );
}