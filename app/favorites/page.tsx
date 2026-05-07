"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
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
      const homes = data.map((item: any) => item.properties);
      setFavorites(homes);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Saved Homes
        </h1>

        {favorites.length === 0 ? (
          <div className="mt-10 border border-[#1A1A1A]/10 p-10 text-center">
            <p className="font-serif text-2xl font-bold">
              No saved homes yet
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {favorites.map((property: any) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                city={property.city}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                image={property.image}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}