import { ClientMessages } from "@/components/ClientMessages";

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-5xl">
        <ClientMessages />
      </section>
    </main>
  );
}