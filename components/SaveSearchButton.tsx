"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveSearch() {
    setMessage("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login to save this search.");
      setSaving(false);
      return;
    }

    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const beds = searchParams.get("beds");
    const baths = searchParams.get("baths");

    const name =
      city || search
        ? `${city || search} Search`
        : "Saved Home Search";

    const { error } = await supabase.from("saved_searches").insert({
      user_id: user.id,
      name,
      city,
      min_price: minPrice ? Number(minPrice) : null,
      max_price: maxPrice ? Number(maxPrice) : null,
      beds: beds ? Number(beds) : null,
      baths: baths ? Number(baths) : null,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Search saved successfully.");
    }

    setSaving(false);
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={saveSearch}
        disabled={saving}
        className="flex items-center gap-2 rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white disabled:opacity-50"
      >
        <Bookmark size={15} />
        {saving ? "Saving..." : "Save This Search"}
      </button>

      {message && (
        <p className="mt-3 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
          {message}
        </p>
      )}
    </div>
  );
}