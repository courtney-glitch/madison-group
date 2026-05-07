export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-4xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          CONTACT MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Start with clarity.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8">
          Whether you are buying, selling, or simply preparing for what comes
          next, our team is here to guide you with calm, transparent advocacy.
        </p>

        <form className="mt-10 grid gap-5">
          <div>
            <label className="block font-serif text-sm font-bold">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <div>
            <label className="block font-serif text-sm font-bold">Email</label>
            <input
              type="email"
              placeholder="jane@example.com"
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <div>
            <label className="block font-serif text-sm font-bold">Phone</label>
            <input
              type="tel"
              placeholder="(201) 555-0123"
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <div>
            <label className="block font-serif text-sm font-bold">
              Message
            </label>
            <textarea
              placeholder="Tell us how we can help."
              rows={6}
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <button
            type="button"
            className="mt-4 bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}