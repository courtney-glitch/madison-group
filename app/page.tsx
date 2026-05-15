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
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F8F5EF]">
        <div className="mx-auto grid min-h-[88vh] max-w-[1600px] items-center lg:grid-cols-[0.9fr_1.1fr]">
          
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex items-center px-8 py-20 md:px-16">
            <div className="max-w-2xl">
              <p className="mb-8 font-serif text-sm tracking-[0.45em] text-[#B19A55]">
                BERGEN COUNTY LUXURY REAL ESTATE
              </p>

              <h1 className="font-serif text-6xl font-bold leading-[0.92] tracking-[-0.03em] md:text-[110px]">
                Building TEST
                <br />
                Beautiful Lives
              </h1>

              <p className="mt-10 max-w-xl text-[22px] leading-[2.1rem] text-[#1A1A1A]/70">
                Curated homes, elevated service, and trusted guidance across
                Bergen County&apos;s most desirable communities.
              </p>

              <div className="mt-14 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/properties"
                  className="bg-[#B19A55] px-10 py-5 text-center font-serif text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#9D884B]"
                >
                  Explore Homes
                </Link>

                <Link
                  href="/contact"
                  className="border border-[#1A1A1A]/20 bg-white/70 px-10 py-5 text-center font-serif text-sm font-bold uppercase tracking-[0.25em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden h-full min-h-[88vh] lg:block">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2200&auto=format&fit=crop"
              alt="Luxury Estate"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* SOFT FADE */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <FadeIn>
        <section className="border-y border-[#1A1A1A]/10 bg-white px-6 py-10">
          <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-4">
            <div>
              <p className="font-serif text-6xl font-bold text-[#B19A55]">
                20+
              </p>

              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#1A1A1A]/60">
                Years Experience
              </p>
            </div>

            <div>
              <p className="font-serif text-6xl font-bold text-[#B19A55]">
                500+
              </p>

              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#1A1A1A]/60">
                Homes Sold
              </p>
            </div>

            <div>
              <p className="font-serif text-6xl font-bold text-[#B19A55]">
                $250M+
              </p>

              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#1A1A1A]/60">
                Sales Volume
              </p>
            </div>

            <div>
              <p className="font-serif text-6xl font-bold text-[#B19A55]">
                Bergen
              </p>

              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#1A1A1A]/60">
                County Experts
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURED */}
      <FadeIn delay={0.1}>
        <section className="px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  FEATURED PROPERTIES
                </p>

                <h2 className="font-serif text-6xl font-bold leading-tight">
                  Exceptional Homes.
                  <br />
                  Elevated Living.
                </h2>
              </div>

              <Link
                href="/properties"
                className="font-serif text-lg uppercase tracking-[0.25em] text-[#B19A55]"
              >
                View All Listings →
              </Link>
            </div>

            {featuredProperties?.length ? (
              <div className="mt-16 grid gap-8 md:grid-cols-3">
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
            ) : (
              <div className="mt-10 border border-[#1A1A1A]/10 bg-white p-10 text-center">
                <p className="font-serif text-2xl font-bold">
                  No featured properties yet
                </p>
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* COMMUNITIES */}
      <FadeIn delay={0.2}>
        <section className="bg-white px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  BERGEN COUNTY COMMUNITIES
                </p>

                <h2 className="max-w-4xl font-serif text-6xl font-bold leading-tight">
                  Local expertise in New Jersey&apos;s most desirable communities.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {targetCities.map((city) => (
                  <Link
                    key={city}
                    href={`/properties?city=${encodeURIComponent(city)}`}
                    className="group border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8 transition hover:border-[#B19A55] hover:bg-[#EFE7D6]"
                  >
                    <p className="font-serif text-2xl font-bold transition group-hover:text-[#B19A55]">
                      {city}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.3}>
        <section className="bg-[#1A1A1A] px-6 py-28 text-white">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
              MADISON GROUP
            </p>

            <h2 className="font-serif text-6xl font-bold leading-tight">
              A calmer, smarter approach to luxury real estate.
            </h2>

            <p className="mx-auto mt-10 max-w-3xl text-xl leading-10 text-white/75">
              We guide buyers and sellers through major life decisions with
              strategy, transparency, and elevated service tailored to Bergen
              County luxury living.
            </p>

            <div className="mt-14">
              <Link
                href="/contact"
                className="inline-block bg-[#B19A55] px-10 py-5 font-serif text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#9D884B]"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}