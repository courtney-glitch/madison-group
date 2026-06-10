import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Handshake,
  Megaphone,
  Users,
} from "lucide-react";

const partnerships = [
  {
    title: "Referral Partners",
    description:
      "Earn referral opportunities by connecting buyers, sellers, and investors with Madison Group.",
    icon: Users,
  },
  {
    title: "Vendor Collaborations",
    description:
      "Join our trusted network of photographers, lenders, stagers, inspectors, and title professionals.",
    icon: Building2,
  },
  {
    title: "Co-Marketing Campaigns",
    description:
      "Launch luxury campaigns and local collaborations with Madison Group Properties.",
    icon: Megaphone,
  },
  {
    title: "Strategic Partnerships",
    description:
      "Build long-term business relationships and expand your brand alongside Madison Group.",
    icon: Handshake,
  },
];

export default function TrustedVendorsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Madison Ecosystem
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Partner Network
            </h1>
          </div>
        </div>

        <div className="mt-6 max-w-3xl">
          <h2 className="font-serif text-2xl font-bold md:text-4xl">
            Grow With Madison
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
            Become part of the Madison Group partnership ecosystem through
            referrals, strategic collaborations, co-marketing campaigns, and
            trusted service partnerships.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {partnerships.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] bg-white p-7 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={24} />
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                    <BadgeCheck size={12} />
                    Partnership
                  </div>
                </div>

                <h2 className="mt-6 font-serif text-3xl font-bold">
                  {item.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/60">
                  {item.description}
                </p>

                <button
                  type="button"
                  className="mt-8 flex items-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:gap-3"
                >
                  Apply Partnership
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}