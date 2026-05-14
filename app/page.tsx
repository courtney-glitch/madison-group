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
      <section className="relative overflow-hidden bg-[#F8F5EF]">
        <div className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <FadeIn>
            <div className="relative z-20">
              <p className="mb-5 font-serif text-sm tracking-[0.45em] text-[#B19A55]">
                BERGEN COUNTY LUXURY REAL ESTATE
              </p>

              <h1 className="font-serif text-6xl font-bold leading-tight md:text-8xl">
                Building
                <br />
                Beautiful Lives
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#1A1A1A]/75">
                Curated homes, elevated service, and trusted guidance across
                Bergen County&apos;s most desirable communities.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/properties"
                  className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#9D884B]"
                >
                  Explore Homes
                </Link>

                <Link
                  href="/contact"
                  className="border border-[#1A1A1A]/20 bg-white/80 px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.25em] text-[#1A1A1A] transition hover:bg-[#B19A55] hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-full w-full border border-[#B19A55]/40" />

              <div className="relative flex h-[620px] w-full items-center justify-center bg-gradient-to-br from-[#F8F5EF] via-[#E8DDC8] to-[#B19A55]/40 shadow-2xl">
                <div className="border border-[#B19A55]/50 bg-white/70 px-10 py-8 text-center backdrop-blur">
                  <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                    MADISON GROUP
                  </p>

                  <p className="mt-4 font-serif text-4xl font-bold">
                    Bergen County Luxury Living
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <FadeIn>
        <section className="border-b border-[#1A1A1A]/10 bg-white px-6 py-10">
          <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-4">
            <div>
              <p className="font-serif text-5xl font-bold text-[#B19A55]">
                20+
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                Years Experience
              </p>
            </div>

            <div>
              <p className="font-serif text-5xl font-bold text-[#B19A55]">
                500+
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                Homes Sold
              </p>
            </div>

            <div>
              <p className="font-serif text-5xl font-bold text-[#B19A55]">
                $250M+
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                Sales Volume
              </p>
            </div>

            <div>
              <p className="font-serif text-5xl font-bold text-[#B19A55]">
                Bergen
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                County Experts
              </p>
            </div>
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

              <Link
                href="/properties"
                className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
              >
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

      <FadeIn delay={0.2}>
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              BERGEN COUNTY COMMUNITIES
            </p>

            <h2 className="max-w-4xl font-serif text-5xl font-bold leading-tight">
              Local expertise in New Jersey&apos;s most desirable communities.
            </h2>

            <div className="mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
              {targetCities.map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${encodeURIComponent(city)}`}
                  className="group border border-[#1A1A1A]/10 bg-[#F8F5EF] p-6 transition hover:border-[#B19A55] hover:bg-[#EFE7D6]"
                >
                  <p className="font-serif text-xl font-bold transition group-hover:text-[#B19A55]">
                    {city}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.3}>
        <section className="bg-[#1A1A1A] px-6 py-24 text-white">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
              MADISON GROUP
            </p>

            <h2 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
              A calmer, smarter approach to luxury real estate.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/75">
              We guide buyers and sellers through major life decisions with
              strategy, transparency, and elevated service tailored to Bergen
              County luxury living.
            </p>

            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-[#9D884B]"
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