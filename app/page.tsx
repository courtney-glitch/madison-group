import Link from "next/link";

const targetCities = [
  "Wyckoff",
  "Mahwah",
  "Saddle River",
  "Upper Saddle River",
  "Allendale",
  "Franklin Lakes",
  "Bergen County",
];

export default function Home() {
  return (
    <main className="bg-white text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">
          Building Beautiful Lives
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8">
          A calm, education-first real estate experience built to guide,
          protect, and empower clients through life&apos;s most important
          decisions.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/properties"
            className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Explore Homes
          </Link>

          <Link
            href="/about"
            className="border border-[#1A1A1A] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em]"
          >
            Our Approach
          </Link>

          <Link
            href="/contact"
            className="border border-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A]"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            LOCAL EXPERTISE
          </p>

          <h2 className="font-serif text-4xl font-bold">
            Serving Bergen County&apos;s most desirable communities.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {targetCities.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${encodeURIComponent(city)}`}
                className="border border-[#1A1A1A]/10 p-6 font-serif text-xl font-bold hover:border-[#B19A55]"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}