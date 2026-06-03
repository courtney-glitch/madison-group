"use client";

import Link from "next/link";
import {
  Calculator,
  Heart,
  Home,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    href: "/properties",
    label: "Search Homes",
    icon: Search,
  },
  {
    href: "/favorites",
    label: "Saved Homes",
    icon: Heart,
  },
  {
    href: "/messages",
    label: "Message Advisor",
    icon: MessageCircle,
  },
  {
    href: "/budget-calculator",
    label: "Budget",
    icon: Calculator,
  },
  {
    href: "/dashboard",
    label: "AI Match",
    icon: Sparkles,
  },
];

export function MobileQuickActions() {
  return (
    <section className="rounded-[1.5rem] bg-white p-5 shadow-xl md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
          <Home size={20} />
        </div>

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Quick Actions
          </p>

          <h2 className="mt-1 font-serif text-2xl font-bold">
            What would you like to do?
          </h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-3xl bg-[#F8F5EF] p-4 transition hover:bg-[#B19A55]/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#B19A55]">
                <Icon size={17} />
              </div>

              <p className="mt-4 font-serif text-sm font-bold text-[#1A1A1A]">
                {action.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}