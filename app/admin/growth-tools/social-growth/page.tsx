import { TrendingUp } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

export default function SocialGrowthPage() {
  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] p-8 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-xl">
          <TrendingUp className="text-[#B19A55]" size={28} />
          <h1 className="mt-5 font-serif text-4xl font-bold">Social Growth</h1>
          <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/60">
            Social media growth tracking and engagement reporting will be managed here.
          </p>
        </section>
      </main>
    </AdminPageShell>
  );
}