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
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || ""
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (status) params.set("status", status);
    if (propertyType) params.set("propertyType", propertyType);
    if (sort) params.set("sort", sort);

    router.push(`/properties?${params.toString()}`);
  }

  function clearFilters() {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setStatus("");
    setPropertyType("");
    setSort("");

    router.push("/properties");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-[#1A1A1A]/20 bg-white px-4 py-4"
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
          className="border border-[#1A1A1A]/20 px-4 py-4"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-[#1A1A1A]/20 px-4 py-4"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-[#1A1A1A]/20 bg-white px-4 py-4"
        >
          <option value="">Any Status</option>
          <option value="For Sale">For Sale</option>
          <option value="Pending">Pending</option>
          <option value="Sold">Sold</option>
          <option value="Featured">Featured</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <input
          type="number"
          placeholder="Beds"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="border border-[#1A1A1A]/20 px-4 py-4"
        />

        <input
          type="number"
          placeholder="Baths"
          value={baths}
          onChange={(e) => setBaths(e.target.value)}
          className="border border-[#1A1A1A]/20 px-4 py-4"
        />

        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="border border-[#1A1A1A]/20 bg-white px-4 py-4"
        >
          <option value="">Any Type</option>
          <option value="Single Family">Single Family</option>
          <option value="Estate">Estate</option>
          <option value="Townhome">Townhome</option>
          <option value="Condo">Condo</option>
          <option value="New Construction">New Construction</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-[#1A1A1A]/20 bg-white px-4 py-4"
        >
          <option value="">Newest</option>
          <option value="price-low">Price Low to High</option>
          <option value="price-high">Price High to Low</option>
        </select>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          <button
            type="submit"
            className="bg-[#B19A55] px-4 py-4 font-serif text-xs font-bold uppercase tracking-[0.2em] text-white"
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="border border-[#1A1A1A]/20 px-4 py-4 font-serif text-xs font-bold uppercase tracking-[0.2em]"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}