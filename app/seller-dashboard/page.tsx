"use client";

import {
  BarChart3,
  CalendarDays,
  Eye,
  Home,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const sellerStats = [
  {
    title: "Listing Views",
    value: "1,248",
    icon: Eye,
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

const timeline = [
  "Listing Preparation",
  "Photography & Marketing",
  "Active on Market",
  "Showing Activity",
  "Offer Review",
  "Under Contract",
  "Inspection & Appraisal",
  "Closing Preparation",
];

export default function SellerDashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Seller Portal
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
              Seller Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
              Track listing performance, showing activity, buyer interest, and
              selling progress in one organized seller experience.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                <Home size={24} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#B19A55]">
                  Current Stage
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold">
                  Active on Market
                </h2>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {sellerStats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <Icon size={22} />
                </div>

                <p className="mt-5 font-serif text-4xl font-bold">
                  {item.value}
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/45">
                  {item.title}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Listing Performance
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {["Views increased this week", "Showing requests are trending up", "Buyer saves are above average"].map(
                (item) => (
                  <div key={item} className="rounded-3xl bg-[#F8F5EF] p-4">
                    <p className="text-sm text-[#1A1A1A]/70">{item}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-[#D4B06A]" />

              <h2 className="font-serif text-2xl font-bold">
                Advisor Notes
              </h2>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/65">
              Your Madison advisor can use this space to share listing updates,
              marketing insights, and next-step recommendations.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">
            Seller Transaction Timeline
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {timeline.map((step, index) => (
              <div
                key={step}
                className={`rounded-3xl p-4 ${
                  index <= 2
                    ? "bg-[#B19A55] text-white"
                    : "bg-[#F8F5EF] text-[#1A1A1A]/65"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                  Step {index + 1}
                </p>

                <p className="mt-2 font-serif text-lg font-bold">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}