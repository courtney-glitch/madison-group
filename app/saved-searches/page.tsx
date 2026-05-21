"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SavedSearch = {
  id: string;
  name?: string | null;
  city?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  beds?: number | null;
  baths?: number | null;
  created_at?: string;
};

function money(value?: number | null) {
  if (!value) return "Any";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSavedSearches();
  }, []);

  async function loadSavedSearches() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first to view saved searches.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    }

    if (data) {
      setSavedSearches(data);
    }

    setLoading(false);
  }

  async function deleteSearch(id: string) {
    await supabase.from("saved_searches").delete().eq("id", id);
    await loadSavedSearches();
  }

  function buildSearchUrl(search: SavedSearch) {
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
        <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-2xl font-bold">
            Loading saved searches...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Client Portal
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Saved Searches
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Revisit your preferred home searches and quickly return to
              properties matching your saved criteria.
            </p>
          </div>

          <Link
            href="/properties"
            className="rounded-full bg-[#B19A55] px-7 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
          >
            Browse Homes
          </Link>
        </div>

        {message && (
          <div className="mt-8 rounded-3xl bg-white p-5 text-sm text-[#1A1A1A]/65 shadow-sm">
            {message}
          </div>
        )}

        {savedSearches.length === 0 ? (
          <div className="mt-10 rounded-[1.5rem] bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Bookmark size={22} />
            </div>

            <p className="mt-6 font-serif text-3xl font-bold">
              No saved searches yet.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/60">
              Use filters on the Home Search page, then save your search so it
              appears here.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block rounded-full bg-[#B19A55] px-8 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {savedSearches.map((search) => (
              <article
                key={search.id}
                className="rounded-[1.5rem] bg-white p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                      Saved Search
                    </p>

                    <h2 className="mt-3 font-serif text-2xl font-bold">
                      {search.name || search.city || "Home Search"}
                    </h2>

                    <p className="mt-2 text-sm text-[#1A1A1A]/55">
                      {search.city || "Any City"}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Bookmark size={20} />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-3xl bg-[#F8F5EF] p-5">
                  <SearchDetail label="Price Min" value={money(search.min_price)} />
                  <SearchDetail label="Price Max" value={money(search.max_price)} />
                  <SearchDetail label="Beds" value={search.beds || "Any"} />
                  <SearchDetail label="Baths" value={search.baths || "Any"} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={buildSearchUrl(search)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
                  >
                    <Search size={15} />
                    View Homes
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteSearch(search.id)}
                    className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={15} />
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

function SearchDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </span>

      <strong className="font-serif text-sm">{value}</strong>
    </div>
  );
}