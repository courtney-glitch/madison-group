import { ClientMessages } from "@/components/ClientMessages";

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-5xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Client Communication
        </p>

        <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
          Messages
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
          Message your Madison Group advisor, review replies, and keep your
          buying conversation organized in one place.
        </p>

        <div className="mt-10">
          <ClientMessages />
        </div>
      </section>
    </main>
  );
}