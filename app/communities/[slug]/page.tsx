import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";

const communities: Record<string, any> = {
  wyckoff: {
    name: "Wyckoff",
    headline: "Luxury living with a warm suburban village feel.",
    description:
      "Wyckoff is known for its tree-lined streets, spacious homes, strong schools, and peaceful Bergen County lifestyle.",
  },
  mahwah: {
    name: "Mahwah",
    headline: "Mountain views, privacy, and refined Northern New Jersey living.",
    description:
      "Mahwah offers a unique blend of natural beauty, estate-style homes, and convenient access to major routes and outdoor recreation.",
  },
  "franklin-lakes": {
    name: "Franklin Lakes",
    headline: "Private luxury estates in one of Bergen County’s most prestigious communities.",
    description:
      "Franklin Lakes is known for expansive properties, elegant homes, lake communities, and a highly desirable luxury lifestyle.",
  },
  "saddle-river": {
    name: "Saddle River",
    headline: "Estate living with privacy, prestige, and timeless character.",
    description:
      "Saddle River is one of New Jersey’s premier luxury markets, offering grand homes, large lots, and exceptional privacy.",
  },
  "upper-saddle-river": {
    name: "Upper Saddle River",
    headline: "Elegant suburban living with space, comfort, and refined homes.",
    description:
      "Upper Saddle River offers luxury residences, peaceful neighborhoods, and a strong sense of community in northern Bergen County.",
  },
  allendale: {
    name: "Allendale",
    headline: "A charming Bergen County community with classic appeal.",
    description:
      "Allendale blends small-town charm, strong schools, and a convenient lifestyle with beautiful residential neighborhoods.",
  },
};

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = communities[slug];

  if (!community) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-20 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl font-bold">
            Community not found
          </h1>

          <Link
            href="/properties"
            className="mt-8 inline-block text-[#B19A55]"
          >
            View homes
          </Link>
        </section>
      </main>
    );
  }

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .ilike("city", `%${community.name}%`)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="bg-[#1A1A1A] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
            BERGEN COUNTY COMMUNITY
          </p>

          <h1 className="max-w-5xl font-serif text-6xl font-bold leading-tight md:text-7xl">
            {community.name}
          </h1>

          <p className="mt-6 max-w-3xl text-2xl leading-9 text-white/80">
            {community.headline}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            COMMUNITY OVERVIEW
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight">
            Discover {community.name}
          </h2>
        </div>

        <p className="text-xl leading-10 text-[#1A1A1A]/70">
          {community.description}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col gap-6 border-t border-[#1A1A1A]/10 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              HOMES IN {community.name.toUpperCase()}
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold">
              Featured Local Listings
            </h2>
          </div>

          <Link
            href={`/properties?city=${encodeURIComponent(community.name)}`}
            className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
          >
            View All Homes →
          </Link>
        </div>

        {properties && properties.length > 0 ? (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {properties.map((property) => (
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
          <div className="mt-10 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">
              No current listings in {community.name}
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Browse All Homes
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}