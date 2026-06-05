"use client";

import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  Link2,
  Palette,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
  Wrench,
} from "lucide-react";

const settingsCards = [
  {
    title: "Branding",
    description: "Customize logos, colors, typography, and luxury identity.",
    icon: Palette,
    href: "/admin/global-settings/branding",
  },
  {
    title: "Onboarding",
    description: "Control client onboarding steps and welcome flows.",
    icon: Users,
    href: "/admin/global-settings/onboarding",
  },
  {
    title: "Customize Learn",
    description: "Manage educational modules and buyer learning center.",
    icon: GraduationCap,
    href: "/admin/global-settings/customize-learn",
  },
  {
    title: "Search Settings",
    description: "Configure MLS search behavior and property filters.",
    icon: Search,
    href: "/admin/global-settings/search-settings",
  },
  {
    title: "External Links",
    description: "Manage lender, title, vendor, and external resources.",
    icon: Link2,
    href: "/admin/global-settings/external-links",
  },
  {
    title: "Default Filters",
    description: "Set platform-wide search defaults and preferences.",
    icon: SlidersHorizontal,
    href: "/admin/global-settings/default-filters",
  },
  {
    title: "UI Customization",
    description: "Adjust app layouts, mobile views, and interface density.",
    icon: Wrench,
    href: "/admin/global-settings/ui-customization",
  },
];

export default function GlobalSettingsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Settings size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Admin View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Global Settings
            </h1>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-[1.5rem] bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-[#B19A55] group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h2 className="mt-6 font-serif text-2xl font-bold">
                  {card.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[#B19A55]">
                  <LayoutDashboard size={15} />

                  <p className="text-[10px] uppercase tracking-[0.2em]">
                    Open Settings
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}