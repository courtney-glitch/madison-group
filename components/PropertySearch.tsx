"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function PropertySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (search.trim()) {
      router.push(
        `/properties?search=${encodeURIComponent(search)}`
      );
    } else {
      router.push("/properties");
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mt-8 flex flex-col gap-4 sm:flex-row"
    >
      <input
        type="text"
        placeholder="Search city or property..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-[#1A1A1A]/20 px-4 py-4 outline-none focus:border-[#B19A55]"
      />

      <button
        type="submit"
        className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
      >
        Search
      </button>
    </form>
  );
}