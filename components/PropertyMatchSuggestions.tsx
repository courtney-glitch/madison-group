"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import { calculatePropertyMatch } from "@/lib/propertyMatcher";

type SavedSearch = {
  city: string | null;
  min_price: number | null;
  max_price: number | null;
};

type PropertyItem = {
  id: string;
  title: string;
  city: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  image: string | null;
  status: string | null;
};

export function PropertyMatchSuggestions() {
  const [matches, setMatches] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: savedSearch } = await supabase
      .from("saved_searches")
      .select("city, min_price, max_price")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: properties } = await supabase
      .from("properties")
      .select("id, title, city, price, beds, baths, image, status")
      .order("created_at", { ascending: false })
      .limit(12);

    if (!savedSearch || !properties) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const saved = savedSearch as SavedSearch;
    const propertyList = properties as unknown as PropertyItem[];

    const scored = propertyList
      .map((property) => {
        const match = calculatePropertyMatch({
          buyerCity: saved.city,
          buyerMinPrice: saved.min_price,
          buyerMaxPrice: saved.max_price,
          propertyCity: property.city,
          propertyPrice: property.price,
        });

        return {
          property,
          score: match.score,
        };
      })
      .filter((item) => item.score >= 40)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.property)
      .slice(0, 3);

    setMatches(scored);
    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Sparkles size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            AI Property Match
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            Suggested Homes For You
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Finding matched properties...
        </p>
      ) : matches.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              city={property.city || ""}
              price={String(property.price || 0)}
              beds={property.beds || 0}
              baths={property.baths || 0}
              image={property.image || ""}
              status={property.status || "For Sale"}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm leading-7 text-[#1A1A1A]/60">
          Save a search first so Madison Group can recommend better matched
          homes for your goals.
        </p>
      )}
    </section>
  );
}