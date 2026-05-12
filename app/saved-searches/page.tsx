"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  async function loadSavedSearches() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setSavedSearches(data);
    }

    setLoading(false);
  }

  async function deleteSearch(id: string) {
    await supabase.from("saved_searches").delete().eq("id", id);
    loadSavedSearches();
  }

  function buildSearchUrl(search: any) {
    const params = new URLSearchParams();

    if (search.city) params.set("city", search.city);
    if (search.min_price) params.set("minPrice", String(search.min_price));
    if (search.max_price) params.set("maxPrice", String(search.max_price));
    if (search.beds) params.set("beds", String(search.beds));
    if (search.baths) params.set("baths", String(search.baths));

    return `/properties?${params.toString()}`;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <p>Loading saved searches...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          CLIENT PORTAL
        </p>

        <h1 className="font-serif text-5xl font-bold">
          Saved Searches
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-[#1A1A1A]/70">
          Revisit your preferred home searches and quickly return to properties
          matching your saved criteria.
        </p>

        {savedSearches.length === 0 ? (
          <div className="mt-12 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">
              No saved searches yet
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Browse Homes
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {savedSearches.map((search) => (
              <article
                key={search.id}
                className="border border-[#1A1A1A]/10 bg-white p-6 shadow-xl"
              >
                <p className="font-serif text-2xl font-bold">
                  {search.city || "Any City"}
                </p>

                <div className="mt-5 grid gap-2 text-[#1A1A1A]/70">
                  <p>
                    Price:{" "}
                    {search.min_price
                      ? `$${Number(search.min_price).toLocaleString()}`
                      : "Any"}{" "}
                    -{" "}
                    {search.max_price
                      ? `$${Number(search.max_price).toLocaleString()}`
                      : "Any"}
                  </p>

                  <p>Beds: {search.beds || "Any"}</p>
                  <p>Baths: {search.baths || "Any"}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={buildSearchUrl(search)}
                    className="bg-[#B19A55] px-6 py-3 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
                  >
                    View Homes
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteSearch(search.id)}
                    className="border border-red-500 px-6 py-3 font-serif text-sm font-bold uppercase tracking-[0.2em] text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}