import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Home,
  Phone,
  ShieldCheck,
} from "lucide-react";

const vendors = [
  {
    name: "ClearSkies Title Agency",
    category: "Title Partner",
    description: "Trusted title support for smooth and secure closings.",
    phone: "Add phone number",
    icon: ShieldCheck,
  },
  {
    name: "Preferred Mortgage Partner",
    category: "Lending",
    description: "Buyer financing, pre-approval support, and loan guidance.",
    phone: "Add phone number",
    icon: Home,
  },
  {
    name: "Home Inspection Partner",
    category: "Inspection",
    description: "Professional home inspection support before closing.",
    phone: "Add phone number",
    icon: Building2,
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
              Partner Network
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Trusted Vendors
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
          A curated network of trusted professionals to support clients through
          every part of the buying, selling, and closing journey.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => {
            const Icon = vendor.icon;

            return (
              <div
                key={vendor.name}
                className="rounded-[2rem] bg-white p-6 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={24} />
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                    <BadgeCheck size={12} />
                    Trusted
                  </div>
                </div>

                <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#B19A55]">
                  {vendor.category}
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold">
                  {vendor.name}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
                  {vendor.description}
                </p>

                <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/60">
                  <Phone size={15} />
                  {vendor.phone}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}