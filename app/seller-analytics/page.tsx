"use client";

import {
  Eye,
  Heart,
  TrendingUp,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    title: "Listing Views",
    value: "1,248",
    icon: Eye,
  },
  {
    title: "Property Saves",
    value: "84",
    icon: Heart,
  },
  {
    title: "Showing Requests",
    value: "18",
    icon: CalendarDays,
  },
  {
    title: "Buyer Interest",
    value: "High",
    icon: TrendingUp,
  },
];

export default function SellerAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Seller Portal
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold text-[#1A1A1A] md:text-6xl">
          Listing Analytics
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65">
          Monitor listing exposure, buyer engagement, showing activity, and
          overall market performance.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] bg-white p-6 shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <Icon size={22} />
                </div>

                <h2 className="mt-5 font-serif text-4xl font-bold text-[#1A1A1A]">
                  {item.value}
                </h2>

                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/45">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Weekly Activity
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                "Views increased 22% this week",
                "3 new showing requests",
                "Property saves increased",
                "Buyer engagement remains strong",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl bg-[#F8F5EF] p-4"
                >
                  <p className="text-sm text-[#1A1A1A]/70">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
              Market Insight
            </p>

            <h2 className="mt-5 font-serif text-3xl font-bold">
              Listing Performance Summary
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/65">
              Your property is receiving above-average attention compared to
              similar listings in the area. Continued marketing efforts and
              showing activity indicate healthy buyer interest.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}