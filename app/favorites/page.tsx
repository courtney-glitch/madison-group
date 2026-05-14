"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("favorites")
      .select(`
        property_id,
        properties (*)
      `)
      .eq("user_id", user.id);

    if (data) {
      const savedHomes = data
        .map((favorite: any) => favorite.properties)
        .filter(Boolean);

      setProperties(savedHomes);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <p>Loading saved homes...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              SAVED COLLECTION
            </p>

            <h1 className="font-serif text-5xl font-bold">
              Your Favorite Homes
            </h1>
          </div>

          <Link
            href="/properties"
            className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
          >
            Browse More Homes →
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {properties.map((property: any) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                city={property.city}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                image={property.image}
                status={property.status}
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">
              No saved homes yet
            </p>

            <p className="mt-4 text-[#1A1A1A]/60">
              Save homes to build your luxury collection.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Explore Properties
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}