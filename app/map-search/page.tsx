import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function MapSearchPage() {
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-y-auto px-6 py-10">
          <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            MADISON GROUP MAP SEARCH
          </p>

          <h1 className="font-serif text-5xl font-bold leading-tight">
            Explore homes by location.
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-[#1A1A1A]/70">
            Browse Bergen County listings with a map-inspired search experience.
          </p>

          <Link
            href="/properties"
            className="mt-8 inline-block font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
          >
            View Full Home Search →
          </Link>

          <div className="mt-10 grid gap-5">
            {properties?.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="grid gap-4 border border-[#1A1A1A]/10 bg-white p-4 shadow-sm transition hover:border-[#B19A55] md:grid-cols-[180px_1fr]"
              >
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-[#1A1A1A] text-white">
                    Image Coming Soon
                  </div>
                )}

                <div>
                  {property.status && (
                    <p className="mb-2 inline-block bg-[#B19A55] px-3 py-1 font-serif text-xs uppercase tracking-[0.2em] text-white">
                      {property.status}
                    </p>
                  )}

                  <h2 className="font-serif text-2xl font-bold">
                    {property.title}
                  </h2>

                  <p className="mt-2 text-[#1A1A1A]/60">
                    {property.city}, NJ
                  </p>

                  <p className="mt-4 font-serif text-2xl font-bold text-[#B19A55]">
                    {property.price}
                  </p>

                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                    {property.beds} Beds · {property.baths} Baths
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="sticky top-0 hidden h-screen bg-[#1A1A1A] lg:block">
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              title="Bergen County Map"
              src="https://www.google.com/maps?q=Bergen%20County%20New%20Jersey&output=embed"
              className="h-full w-full grayscale"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1A1A1A]/20" />

            <div className="absolute left-8 top-8 bg-white p-6 shadow-2xl">
              <p className="font-serif text-sm tracking-[0.25em] text-[#B19A55]">
                BERGEN COUNTY
              </p>

              <p className="mt-3 font-serif text-3xl font-bold">
                Map Search
              </p>

              <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/60">
                Interactive MLS-style map experience for luxury home discovery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}