import { TransactionTimeline } from "@/components/TransactionTimeline";

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Buyer Journey
        </p>

        <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
          Transaction Timeline
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
          Track your home buying journey from consultation to closing day with a
          clear Madison Group roadmap.
        </p>

        <div className="mt-10">
          <TransactionTimeline />
        </div>
      </section>
    </main>
  );
}