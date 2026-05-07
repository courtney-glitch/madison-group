export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          OUR APPROACH
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Building Beautiful Lives
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-9">
          Madison Group protects clients through the most significant financial
          and emotional decisions of their lives with calm guidance, transparent
          advocacy, and systems-driven support.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-[#1A1A1A]/20 p-6">
            <h2 className="font-serif text-2xl font-bold">
              Advocacy Over Commission
            </h2>
            <p className="mt-4 leading-7">
              We act in the client&apos;s best interest, even when it costs us.
            </p>
          </div>

          <div className="border border-[#1A1A1A]/20 p-6">
            <h2 className="font-serif text-2xl font-bold">
              Education Before Action
            </h2>
            <p className="mt-4 leading-7">
              Clients make informed decisions. We do not rush the process.
            </p>
          </div>

          <div className="border border-[#1A1A1A]/20 p-6">
            <h2 className="font-serif text-2xl font-bold">
              Calm in the Chaos
            </h2>
            <p className="mt-4 leading-7">
              We bring a steady hand to high-stakes real estate moments.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}