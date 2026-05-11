"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const cities = [
  "Wyckoff",
  "Mahwah",
  "Saddle River",
  "Upper Saddle River",
  "Allendale",
  "Franklin Lakes",
];

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [beds, setBeds] = useState(searchParams.get("beds") || "");
  const [baths, setBaths] = useState(searchParams.get("baths") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);

    router.push(`/properties?${params.toString()}`);
  }

  function clearFilters() {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    router.push("/properties");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-4 border border-[#1A1A1A]/10 bg-white p-6 shadow-xl md:grid-cols-6"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      >
        <option value="">Any City</option>
        {cities.map((cityOption) => (
          <option key={cityOption} value={cityOption}>
            {cityOption}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <input
        type="number"
        placeholder="Beds"
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <input
        type="number"
        placeholder="Baths"
        value={baths}
        onChange={(e) => setBaths(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <div className="grid gap-2">
        <button
          type="submit"
          className="bg-[#B19A55] px-4 py-3 font-serif text-xs font-bold uppercase tracking-[0.2em] text-white"
        >
          Filter
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="border border-[#1A1A1A]/20 px-4 py-3 font-serif text-xs font-bold uppercase tracking-[0.2em]"
        >
          Clear
        </button>
      </div>
    </form>
  );
}