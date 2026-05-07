import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";

const targetCities = [
  "Wyckoff",
  "Mahwah",
  "Saddle River",
  "Upper Saddle River",
  "Allendale",
  "Franklin Lakes",
  "Bergen County",
];

export default async function HomePage() {
  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="bg-[#FAF8F4] text-[#1A1A1A]">
      <section className="border-b border-[#1A1A1A]/10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              BERGEN COUNTY, NJ
            </p>

            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
              Building Beautiful Lives
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-8 text-[#1A1A1A]/75">
              Curated homes. Trusted guidance. A calmer,
              smarter luxury real estate experience.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/properties"
                className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
              >
                View Properties
              </Link>

              <Link
                href="/contact"
                className="border border-[#1A1A1A]/20 px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury Home"
              className="h-[600px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-center font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            FEATURED PROPERTIES
          </p>

          <h2 className="text-center font-serif text-4xl font-bold md:text-6xl">
            Exceptional Homes.
            <br />
            Exceptional Living.
          </h2>

          {featuredProperties?.length ? (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
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
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-[#1A1A1A]/10 p-10 text-center">
              <p className="font-serif text-2xl font-bold">
                No featured properties yet
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/properties"
              className="inline-block border border-[#1A1A1A]/20 px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em]"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#1A1A1A]/10 bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            LOCAL EXPERTISE
          </p>

          <h2 className="font-serif text-4xl font-bold md:text-5xl">
            Serving Bergen County&apos;s most desirable
            communities.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {targetCities.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${encodeURIComponent(city)}`}
                className="border border-[#1A1A1A]/10 bg-[#FAF8F4] p-6 font-serif text-xl font-bold transition hover:border-[#B19A55]"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1E8] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 text-center md:grid-cols-4">
          <div>
            <p className="font-serif text-5xl font-bold text-[#B19A55]">
              20+
            </p>

            <p className="mt-4 text-lg">Years Experience</p>
          </div>

          <div>
            <p className="font-serif text-5xl font-bold text-[#B19A55]">
              500+
            </p>

            <p className="mt-4 text-lg">Homes Sold</p>
          </div>

          <div>
            <p className="font-serif text-5xl font-bold text-[#B19A55]">
              1000+
            </p>

            <p className="mt-4 text-lg">Happy Clients</p>
          </div>

          <div>
            <p className="font-serif text-5xl font-bold text-[#B19A55]">
              Bergen
            </p>

            <p className="mt-4 text-lg">County Expertise</p>
          </div>
        </div>
      </section>
    </main>
  );
}