"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
} from "lucide-react";

const tabs = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/properties",
    label: "Search",
    icon: Search,
  },
  {
    href: "/favorites",
    label: "Saved",
    icon: Heart,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },
  {
    href: "/timeline",
    label: "Journey",
    icon: LayoutDashboard,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#1A1A1A]/10 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[10px] transition ${
                active
                  ? "bg-[#B19A55] text-white"
                  : "text-[#1A1A1A]/55 hover:bg-[#F8F5EF]"
              }`}
            >
              <Icon size={18} />

              <span className="mt-1 font-serif text-[10px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}