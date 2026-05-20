import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import { FadeIn } from "@/components/FadeIn";

export default async function HomePage() {
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="relative min-h-screen overflow-hidden bg-[#F8F5EF]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://imageresize.leadingre.com/IfHSWoHlyuIOiaKuNGck9SunwEy1YJbJmdplWdC-9AA/format:webp/sm:1/q:70/rs:fill/g:no/el:0/cb:2026-05-18144943/w:1280/h:960/aHR0cHM6Ly9zdGFyaW5wdXRkYXRhbHJlcHJvZC5ibG9iLmNvcmUud2luZG93cy5uZXQvc3RhcnByb2plY3QvSW1hZ2VzL3Byb3BlcnR5L29yaWdpbmFsLzE5Nzk2MzIvNzUxNTgyNTcuanBn.webp"
            alt="Luxury Estate"
            className="absolute inset-y-0 right-0 h-full w-[72%] object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/92 via-[42%] to-transparent" />
        </div>

        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-6">
          <div className="max-w-2xl">
            <p className="mb-5 font-serif text-[11px] uppercase tracking-[0.38em] text-[#B19A55]">
              Bergen County Luxury Real Estate
            </p>

            <h1 className="font-serif text-[clamp(3rem,7vw,5.8rem)] font-bold leading-[0.95]">
              Building
              <br />
              Beautiful Lives
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#1A1A1A]/65 md:text-lg">
              Curated homes, elevated service, and trusted guidance across
              Bergen County&apos;s most desirable communities.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="bg-[#B19A55] px-8 py-4 text-center font-serif text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#9D884B]"
              >
                Home Search
              </Link>

              <Link
                href="/contact"
                className="border border-[#1A1A1A]/20 bg-white/70 px-8 py-4 text-center font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FadeIn>
        <section className="border-y border-[#1A1A1A]/10 bg-white px-6 py-8">
          <div className="mx-auto grid max-w-7xl gap-6 text-center sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["20+", "Years Experience"],
              ["500+", "Homes Sold"],
              ["$250M+", "Sales Volume"],
              ["Bergen", "County Experts"],
            ].map(([number, label]) => (
              <div key={label} className="min-w-0 px-2">
                <p className="break-words font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none text-[#B19A55]">
                  {number}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#1A1A1A]/55">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                  Featured Properties
                </p>

                <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-bold leading-tight">
                  Exceptional Homes.
                  <br />
                  Elevated Living.
                </h2>
              </div>

              <Link
                href="/properties"
                className="font-serif text-xs uppercase tracking-[0.22em] text-[#B19A55]"
              >
                View All Listings →
              </Link>
            </div>

            {featuredProperties?.length ? (
              <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                <p className="font-serif text-xl font-bold">
                  No featured properties yet
                </p>
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                  Bergen County Communities
                </p>

                <h2 className="max-w-4xl font-serif text-[clamp(2.2rem,4.5vw,3.75rem)] font-bold leading-tight">
                  Explore Northern New Jersey&apos;s most desirable communities.
                </h2>
              </div>

              <Link
                href="/properties"
                className="font-serif text-xs uppercase tracking-[0.22em] text-[#B19A55]"
              >
                View All Homes →
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  href: "/communities/wyckoff",
                  image:
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1400&auto=format&fit=crop",
                  title: "Wyckoff",
                  description:
                    "Luxury homes, tree-lined streets, and timeless suburban elegance.",
                },
                {
                  href: "/communities/franklin-lakes",
                  image:
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
                  title: "Franklin Lakes",
                  description:
                    "Prestigious estates, private luxury, and elevated living.",
                },
                {
                  href: "/communities/saddle-river",
                  image:
                    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1400&auto=format&fit=crop",
                  title: "Saddle River",
                  description:
                    "Grand estate living with privacy, prestige, and sophistication.",
                },
              ].map((community) => (
                <Link
                  key={community.href}
                  href={community.href}
                  className="group relative overflow-hidden rounded-[1.5rem]"
                >
                  <img
                    src={community.image}
                    alt={community.title}
                    className="h-[380px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-[420px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 p-6 text-white">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                      Bergen County
                    </p>

                    <h3 className="mt-3 font-serif text-3xl font-bold">
                      {community.title}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                      {community.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.3}>
        <section className="bg-[#1A1A1A] px-6 py-20 text-white">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
              Madison Group
            </p>

            <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-bold leading-tight">
              A calmer, smarter approach to luxury real estate.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
              We guide buyers and sellers through major life decisions with
              strategy, transparency, and elevated service tailored to Bergen
              County luxury living.
            </p>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-block bg-[#B19A55] px-8 py-4 font-serif text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#9D884B]"
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