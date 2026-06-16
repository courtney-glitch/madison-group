"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Globe,
  Mail,
  Megaphone,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

const tools = [
  {
    title: "Lead Campaigns",
    description:
      "Launch luxury email campaigns and targeted outreach for buyers and sellers.",
    icon: Mail,
    stat: "12 Active",
    href: "/admin/push-notifications",
  },
  {
    title: "Social Growth",
    description:
      "Track Instagram, Facebook, TikTok, and luxury brand engagement.",
    icon: TrendingUp,
    stat: "+28%",
    href: "/admin/growth-tools/social-growth",
  },
  {
    title: "Audience Insights",
    description:
      "Analyze visitor behavior, lead activity, and returning clients.",
    icon: Users,
    stat: "4.2k Users",
    href: "/admin/client-activity",
  },
  {
    title: "Ad Performance",
    description:
      "Monitor ROI, ad clicks, conversions, and campaign performance.",
    icon: Target,
    stat: "87 Leads",
    href: "/admin/growth-tools/ad-performance",
  },
  {
    title: "Brand Promotion",
    description:
      "Manage promotions, spotlight listings, and featured campaigns.",
    icon: Megaphone,
    stat: "6 Running",
    href: "/admin/properties",
  },
  {
    title: "Website Analytics",
    description:
      "View property traffic, popular searches, and user activity.",
    icon: Globe,
    stat: "18k Visits",
    href: "/admin/growth-tools/website-analytics",
  },
];

export default function GrowthToolsPage() {
  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Brokerage Growth
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
                Growth Tools
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
                Monitor growth, marketing performance, luxury audience
                engagement, and business expansion tools for Madison Group
                Properties.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white px-6 py-5 shadow-xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#B19A55]">
                Monthly Growth
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <BarChart3 size={24} />
                </div>

                <div>
                  <h2 className="font-serif text-3xl font-bold">+38%</h2>

                  <p className="mt-1 text-sm text-[#1A1A1A]/55">
                    Increased client engagement this month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group rounded-[2rem] bg-white p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                      <Icon size={24} />
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-[#F8F5EF] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                      {tool.stat}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="font-serif text-2xl font-bold">
                      {tool.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-serif text-[11px] font-bold uppercase tracking-[0.22em] text-[#B19A55] transition group-hover:gap-3">
                    Open Tool
                    <ArrowUpRight size={15} />
                  </div>
                </Link>
              );
            })}
          </section>
        </section>
      </main>
    </AdminPageShell>
  );
}