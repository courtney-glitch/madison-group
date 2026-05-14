import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import { FadeIn } from "@/components/FadeIn";

const targetCities = [
  "Wyckoff",
  "Mahwah",
  "Saddle River",
  "Upper Saddle River",
  "Allendale",
  "Franklin Lakes",
];

export default async function HomePage() {
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-[65%] md:block">
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop"
            alt="Bergen County Luxury Estate"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-white/10" />
        </div>

        <div className="relative z-20 mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="mb-6 font-serif text-sm tracking-[0.45em] text-[#B19A55]">
                BERGEN COUNTY LUXURY REAL ESTATE
              </p>

              <h1 className="font-serif text-6xl font-bold leading-[0.95] md:text-8xl">
                Building
                <br />
                Beautiful Lives
              </h1>

              <p className="mt-8 max-w-xl text-xl leading-9 text-[#1A1A1A]/75">
                Curated homes, elevated service, and trusted guidance across
                Bergen County&apos;s most desirable communities.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/properties"
                  className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.25em] text-white"
                >
                  Explore Homes
                </Link>

                <Link
                  href="/contact"
                  className="border border-[#1A1A1A]/30 bg-white/80 px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.25em]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12 overflow-hidden shadow-2xl md:hidden">
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop"
                alt="Bergen County Luxury Estate"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <FadeIn>
        <section className="border-y border-[#1A1A1A]/10 bg-white px-6 py-10">
          <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-4">
            <div><p className="font-serif text-5xl font-bold text-[#B19A55]">20+</p><p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">Years Experience</p></div>
            <div><p className="font-serif text-5xl font-bold text-[#B19A55]">500+</p><p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">Homes Sold</p></div>
            <div><p className="font-serif text-5xl font-bold text-[#B19A55]">$250M+</p><p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">Sales Volume</p></div>
            <div><p className="font-serif text-5xl font-bold text-[#B19A55]">Bergen</p><p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">County Experts</p></div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  FEATURED PROPERTIES
                </p>
                <h2 className="font-serif text-5xl font-bold leading-tight">
                  Exceptional Homes.
                  <br />
                  Elevated Living.
                </h2>
              </div>

              <Link href="/properties" className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]">
                View All Listings →
              </Link>
            </div>

            {featuredProperties?.length ? (
              <div className="mt-14 grid gap-8 md:grid-cols-3">
                {featuredProperties.map((property) => (
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
            ) : null}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}