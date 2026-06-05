"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  Activity,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Calculator,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageCircle,
  Palette,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Users,
  User,
  Wrench,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: any;
  badge?: number;
  children?: NavItem[];
};

function SidebarGroup({
  title,
  items,
  defaultOpen = true,
  onClick,
}: {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#1A1A1A]/8 pb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-1 py-3 text-left"
      >
        <span className="font-serif text-[11px] text-[#1A1A1A]/55">
          {title}
        </span>

        <ChevronDown
          size={14}
          className={`text-[#1A1A1A]/35 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="grid gap-1">
          {items.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onClick}
                className="group flex items-center justify-between rounded-xl px-2 py-2.5 text-[#1A1A1A] transition hover:bg-[#B19A55]/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <item.icon
                    size={17}
                    className="shrink-0 text-[#1A1A1A]/45 group-hover:text-[#B19A55]"
                  />

                  <span className="truncate font-serif text-[13px] font-semibold">
                    {item.label}
                  </span>
                </div>

                {item.badge && item.badge > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>

              {item.children && item.children.length > 0 && (
                <div className="ml-8 grid gap-1 pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClick}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-[#1A1A1A]/70 transition hover:bg-[#B19A55]/10 hover:text-[#B19A55]"
                    >
                      <child.icon size={14} />

                      <span className="font-serif text-[12px]">
                        {child.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);

    if (!user) {
      setUnreadCount(0);
      return;
    }

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read_by_client", false);

    setUnreadCount(count || 0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  const agentLinks: NavItem[] = [
    { href: "/admin/invite-client", label: "Invite a New Client", icon: Plus },
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/messages", label: "Chat", icon: MessageCircle, badge: unreadCount },
    { href: "/admin/client-activity", label: "Client Activity", icon: Users, badge: unreadCount > 0 ? unreadCount : undefined },
    { href: "/properties", label: "Home Search", icon: Search },
    { href: "/saved-searches", label: "Saved Searches", icon: Bookmark },
    { href: "/admin/ai-nurture", label: "AI Nurture", icon: Sparkles },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/trusted-vendors", label: "Trusted Vendors", icon: BriefcaseBusiness },
    { href: "/admin/search-settings", label: "Search Settings", icon: Settings },
    { href: "/admin/external-links", label: "External Links", icon: ExternalLink },
    {
      href: "/admin/push-notifications",
      label: "Push Notifications",
      icon: Bell,
      children: [
        { href: "/admin/push-notifications/create", label: "Create New", icon: Plus },
        { href: "/admin/push-notifications/history", label: "History", icon: ListIcon },
      ],
    },
  ];

  const adminLinks: NavItem[] = [
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/admin/clients", label: "All Clients", icon: Users },
    {
      href: "/admin/global-settings",
      label: "Global Settings",
      icon: Settings,
      children: [
        { href: "/admin/global-settings/branding", label: "Branding", icon: Palette },
        { href: "/admin/global-settings/onboarding", label: "Onboarding", icon: Sparkles },
        { href: "/admin/global-settings/trusted-vendors", label: "Trusted Vendors", icon: BriefcaseBusiness },
        { href: "/admin/global-settings/customize-learn", label: "Customize Learn", icon: GraduationCap },
        { href: "/admin/global-settings/search-settings", label: "Search Settings", icon: Search },
        { href: "/admin/global-settings/external-links", label: "External Links", icon: Link2 },
        { href: "/admin/global-settings/default-filters", label: "Default Filters", icon: SlidersHorizontal },
        { href: "/admin/global-settings/ui-customization", label: "UI Customization", icon: Wrench },
      ],
    },
  ];

  const clientLinks: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/properties", label: "Home Search", icon: Search },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/budget-calculator", label: "Budget", icon: Calculator },
    { href: "/education", label: "Education", icon: GraduationCap },
    { href: "/hire-professionals", label: "Hire Professionals", icon: BriefcaseBusiness },
  ];

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-white/75 backdrop-blur-2xl md:left-72">
        <div className="relative flex h-20 items-center justify-center px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-4 rounded-full border border-[#1A1A1A]/10 bg-white/80 px-5 py-2.5 font-serif text-[11px] uppercase tracking-[0.25em] shadow-sm md:hidden"
          >
            Menu
          </button>

          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="absolute right-6 hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                >
                  <User size={13} />
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#B19A55]"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-[#B19A55]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 overflow-y-auto border-r border-white/20 bg-white/80 backdrop-blur-3xl md:block">
        <div className="flex min-h-full flex-col px-5 py-6">
          <div className="mb-7">
            <p className="font-serif text-xs tracking-[0.4em] text-[#B19A55]">
              MADISON GROUP
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40">
              Luxury Real Estate
            </p>
          </div>

          <nav className="grid gap-3">
            <SidebarGroup title="Agent view" items={agentLinks} defaultOpen />
            <SidebarGroup title="Admin view" items={adminLinks} defaultOpen={false} />
            <SidebarGroup title="Client view" items={clientLinks} defaultOpen={false} />
          </nav>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#F8F5EF]/95 px-5 py-6 backdrop-blur-3xl md:hidden">
          <div className="mb-6 flex items-center justify-between">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-14 w-auto object-contain"
            />

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#1A1A1A]/10 bg-white/80 px-4 py-2 font-serif text-[10px] uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>

          <nav className="grid gap-3">
            <SidebarGroup
              title="Agent view"
              items={agentLinks}
              defaultOpen
              onClick={() => setMenuOpen(false)}
            />

            <SidebarGroup
              title="Admin view"
              items={adminLinks}
              defaultOpen={false}
              onClick={() => setMenuOpen(false)}
            />

            <SidebarGroup
              title="Client view"
              items={clientLinks}
              defaultOpen={false}
              onClick={() => setMenuOpen(false)}
            />

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 rounded-2xl bg-[#B19A55] px-5 py-4 font-serif text-base text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 rounded-2xl bg-[#B19A55] px-5 py-4 text-center font-serif text-base text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

function ListIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}