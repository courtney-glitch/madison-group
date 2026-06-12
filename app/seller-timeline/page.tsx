import {
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Home,
  Megaphone,
} from "lucide-react";

const timelineSteps = [
  {
    title: "Listing Preparation",
    description: "Prepare home details, documents, pricing strategy, and listing plan.",
    status: "Complete",
    icon: ClipboardCheck,
  },
  {
    title: "Marketing Launch",
    description: "Photography, listing launch, social promotion, and buyer exposure.",
    status: "Complete",
    icon: Megaphone,
  },
  {
    title: "Active On Market",
    description: "Your listing is live and receiving buyer activity.",
    status: "Current",
    icon: Home,
  },
  {
    title: "Offer Review",
    description: "Review offers, terms, contingencies, and negotiation strategy.",
    status: "Upcoming",
    icon: BadgeCheck,
  },
  {
    title: "Closing Preparation",
    description: "Coordinate final steps, inspections, appraisal, and closing timeline.",
    status: "Upcoming",
    icon: CalendarDays,
  },
];

export default function SellerTimelinePage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Seller Portal
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
          Seller Timeline
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65">
          Follow the selling journey from listing preparation to closing with a
          clear, guided timeline.
        </p>

        <div className="mt-10 grid gap-4">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className={`rounded-[2rem] p-6 shadow-xl ${
                  step.status === "Current"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-[#1A1A1A]"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        step.status === "Current"
                          ? "bg-[#D4B06A]/20 text-[#D4B06A]"
                          : "bg-[#B19A55]/10 text-[#B19A55]"
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <div>
                      <p
                        className={`text-[10px] uppercase tracking-[0.22em] ${
                          step.status === "Current"
                            ? "text-[#D4B06A]"
                            : "text-[#B19A55]"
                        }`}
                      >
                        Step {index + 1}
                      </p>

                      <h2 className="mt-2 font-serif text-2xl font-bold">
                        {step.title}
                      </h2>

                      <p
                        className={`mt-2 text-sm leading-7 ${
                          step.status === "Current"
                            ? "text-white/65"
                            : "text-[#1A1A1A]/60"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] ${
                      step.status === "Complete"
                        ? "bg-emerald-100 text-emerald-700"
                        : step.status === "Current"
                        ? "bg-[#D4B06A] text-white"
                        : "bg-[#F8F5EF] text-[#1A1A1A]/45"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}