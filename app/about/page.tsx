import Link from "next/link";

const values = [
  "Education-first guidance",
  "Calm negotiation strategy",
  "Bergen County market expertise",
  "Transparent communication",
  "Luxury-level client care",
  "Data-informed decision making",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            ABOUT MADISON GROUP
          </p>

          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">
            Real estate guidance built around clarity, trust, and beautiful lives.
          </h1>

          <p className="mt-8 text-lg leading-8 text-[#1A1A1A]/70">
            Madison Group is a modern real estate platform serving Bergen
            County, New Jersey with a calm, education-first approach. We help
            buyers and sellers move through major life decisions with strategy,
            transparency, and elevated care.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/properties"
              className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Explore Homes
            </Link>

            <Link
              href="/contact"
              className="border border-[#1A1A1A]/20 bg-white px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury Bergen County real estate"
          className="h-[620px] w-full object-cover shadow-2xl"
        />
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            OUR APPROACH
          </p>

          <h2 className="max-w-4xl font-serif text-4xl font-bold leading-tight md:text-6xl">
            A smarter, calmer way to buy and sell in Bergen County.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
              <h3 className="font-serif text-2xl font-bold">
                Educate First
              </h3>

              <p className="mt-4 leading-7 text-[#1A1A1A]/70">
                We help clients understand the process before pressure enters
                the conversation, so every move feels informed and intentional.
              </p>
            </div>

            <div className="border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
              <h3 className="font-serif text-2xl font-bold">
                Advocate Clearly
              </h3>

              <p className="mt-4 leading-7 text-[#1A1A1A]/70">
                From pricing to negotiations, our guidance is direct,
                transparent, and designed to protect your long-term goals.
              </p>
            </div>

            <div className="border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
              <h3 className="font-serif text-2xl font-bold">
                Elevate the Experience
              </h3>

              <p className="mt-4 leading-7 text-[#1A1A1A]/70">
                Luxury is not only the property. It is the confidence,
                organization, and calm you feel throughout the entire journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              WHERE WE SERVE
            </p>

            <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              Focused on Bergen County&apos;s most desirable communities.
            </h2>

            <p className="mt-6 leading-8 text-[#1A1A1A]/70">
              Our platform and local expertise are built around Wyckoff,
              Mahwah, Saddle River, Upper Saddle River, Allendale, Franklin
              Lakes, and the broader Bergen County market.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value}
                className="border border-[#1A1A1A]/10 bg-white p-6 font-serif text-xl font-bold shadow-sm"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A1A] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
            BUILDING BEAUTIFUL LIVES
          </p>

          <h2 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
            Ready for a better real estate experience?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-white/70">
            Whether you are buying, selling, or preparing for what comes next,
            Madison Group is here to guide you with clarity and care.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}