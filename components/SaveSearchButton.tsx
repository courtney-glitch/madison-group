"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  async function saveSearch() {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login to save this search.");
      return;
    }

    const { error } = await supabase.from("saved_searches").insert({
      user_id: user.id,
      city: searchParams.get("city"),
      min_price: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : null,
      max_price: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : null,
      beds: searchParams.get("beds")
        ? Number(searchParams.get("beds"))
        : null,
      baths: searchParams.get("baths")
        ? Number(searchParams.get("baths"))
        : null,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Search saved.");
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={saveSearch}
        className="border border-[#B19A55] bg-white px-6 py-3 font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#B19A55]"
      >
        Save This Search
      </button>

      {message && (
        <p className="mt-3 text-sm text-[#B19A55]">
          {message}
        </p>
      )}
    </div>
  );
}