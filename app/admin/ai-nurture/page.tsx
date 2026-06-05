import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AINurturePage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Agent View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              AI Nurture
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
          This section is prepared for AI follow-ups, client nurture campaigns,
          and automated advisor recommendations.
        </p>

        <Link
          href="/admin/client-activity"
          className="mt-8 inline-block rounded-full bg-[#B19A55] px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
        >
          Back to Client Activity
        </Link>
      </section>
    </main>
  );
}