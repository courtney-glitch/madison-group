import { AdminMessagesCenter } from "@/components/AdminMessagesCenter";
import { AdminPageShell } from "@/components/AdminPageShell";

export default function AdminMessagesPage() {
  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-7xl">
          <AdminMessagesCenter />
        </section>
      </main>
    </AdminPageShell>
  );
}