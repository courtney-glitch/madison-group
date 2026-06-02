"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import { doesPropertyMatchSavedSearch } from "@/lib/searchMatcher";

type SavedSearch = {
  id: string;
  city: string | null;
  min_price: number | null;
  max_price: number | null;
  beds: number | null;
  baths: number | null;
};

type PropertyItem = {
  id: string;
  title: string;
  city: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  image: string | null;
  status: string | null;
};

export function SavedSearchAlerts() {
  const [matches, setMatches] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
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
      .select("id, city, min_price, max_price, beds, baths")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: properties } = await supabase
      .from("properties")
      .select("id, title, city, price, beds, baths, image, status")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!savedSearch || !properties) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const saved = savedSearch as SavedSearch;
    const propertyList = properties as unknown as PropertyItem[];

    const matchedProperties = propertyList
      .filter((property) =>
        doesPropertyMatchSavedSearch({
          savedCity: saved.city,
          savedMinPrice: saved.min_price,
          savedMaxPrice: saved.max_price,
          savedBeds: saved.beds,
          savedBaths: saved.baths,
          propertyCity: property.city,
          propertyPrice: property.price,
          propertyBeds: property.beds,
          propertyBaths: property.baths,
        })
      )
      .slice(0, 3);

    setMatches(matchedProperties);
    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <BellRing size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Saved Search Alerts
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            New Matches From Your Search
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Checking your saved search matches...
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
          No new saved search matches yet. Once a property matches your latest
          saved search, it will appear here.
        </p>
      )}
    </section>
  );
}