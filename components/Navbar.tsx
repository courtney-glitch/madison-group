"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  Bell,
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Calculator,
  ChevronDown,
  Compass,
  Crown,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Home,
  Layers3,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageCircle,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  User,
  WandSparkles,
  Wrench,
  CalendarDays,
  BarChart3,
  Handshake,
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
  subtitle,
  items,
  defaultOpen = true,
  onClick,
}: {
  title: string;
  subtitle?: string;
  items: NavItem[];
  defaultOpen?: boolean;
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[1.25rem] border border-[#1A1A1A]/5 bg-white/45 p-2 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white/70"
      >
        <div>
          <p className="font-serif text-[12px] font-bold text-[#1A1A1A]">
            {title}
          </p>

          {subtitle && (
            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A]/35">
              {subtitle}
            </p>
          )}
        </div>

        <ChevronDown
          size={15}
          className={`text-[#B19A55] transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-1 grid gap-1">
          {items.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onClick}
                className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-white/10 group-hover:text-[#D4B06A]">
                    <item.icon size={15} />
                  </div>

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
                <div className="ml-11 mt-1 grid gap-1 pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClick}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[#1A1A1A]/65 transition hover:bg-[#B19A55]/10 hover:text-[#B19A55]"
                    >
                      <child.icon size={13} />

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
  const [notificationCount, setNotificationCount] = useState(0);
  const [role, setRole] = useState("client");

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
      setRole("client");
      setUnreadCount(0);
      setNotificationCount(0);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    setRole(profile?.role || "client");

    const { count: unreadMessages } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read_by_client", false);

    setUnreadCount(unreadMessages || 0);

    const { count: notificationUnread } = await supabase
      .from("notification_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotificationCount(notificationUnread || 0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  const clientCareLinks: NavItem[] = [
    { href: "/admin/invite-client", label: "Start Client Journey", icon: Plus },
    { href: "/admin/clients", label: "Client Book", icon: Users },
    {
      href: "/admin/client-activity",
      label: "Buyer Signals",
      icon: WandSparkles,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      href: "/admin/live-chat",
      label: "Live Chat Desk",
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      href: "/admin/client-requests",
      label: "Client Requests",
      icon: Users,
    },
    { href: "/admin/ai-nurture", label: "Advisor AI", icon: Sparkles },
  ];

  const propertySuiteLinks: NavItem[] = [
    { href: "/properties", label: "Property Collection", icon: Compass },
    { href: "/admin/properties", label: "Listing Studio", icon: Building2 },
    { href: "/saved-searches", label: "Search Vault", icon: Bookmark },
    { href: "/favorites", label: "Curated Homes", icon: Star },
    {
      href: "/admin/search-settings",
      label: "Search Rules",
      icon: SlidersHorizontal,
    },
  ];

  const growthLinks: NavItem[] = [
    {
      href: "/trusted-vendors",
      label: "Partner Network",
      icon: HeartHandshake,
    },
    {
      href: "/admin/external-links",
      label: "Resource Library",
      icon: ExternalLink,
    },
    {
      href: "/admin/push-notifications",
      label: "Engagement Studio",
      icon: Bell,
      children: [
        {
          href: "/admin/push-notifications/create",
          label: "New Broadcast",
          icon: Plus,
        },
        {
          href: "/admin/push-notifications/history",
          label: "Broadcast Log",
          icon: ListIcon,
        },
      ],
    },
  ];

  const operationsLinks: NavItem[] = [
    {
      href: "/admin/dashboard",
      label: "Command Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/admin/team", label: "Team Suite", icon: ShieldCheck },
    { href: "/admin/user-roles", label: "Access Control", icon: Crown },
    {
      href: "/admin/global-settings",
      label: "Brand Control",
      icon: Settings,
      children: [
        {
          href: "/admin/global-settings/branding",
          label: "Identity System",
          icon: Palette,
        },
        {
          href: "/admin/global-settings/onboarding",
          label: "Welcome Flow",
          icon: Layers3,
        },
        {
          href: "/admin/global-settings/trusted-vendors",
          label: "Vendor Network",
          icon: BriefcaseBusiness,
        },
        {
          href: "/admin/global-settings/customize-learn",
          label: "Learning Studio",
          icon: GraduationCap,
        },
        {
          href: "/admin/global-settings/search-settings",
          label: "Search Logic",
          icon: Search,
        },
        {
          href: "/admin/global-settings/external-links",
          label: "Link Library",
          icon: Link2,
        },
        {
          href: "/admin/global-settings/default-filters",
          label: "Filter Presets",
          icon: SlidersHorizontal,
        },
        {
          href: "/admin/global-settings/ui-customization",
          label: "Experience Design",
          icon: Wrench,
        },
      ],
    },
  ];

  const portalLinks: NavItem[] = [
    { href: "/dashboard", label: "My Homebase", icon: Home },
    { href: "/live-chat", label: "Live Chat", icon: MessageCircle },
    { href: "/notifications", label: "Notifications", icon: BellRing, badge: notificationCount },
    { href: "/properties", label: "Explore Homes", icon: Search },
    { href: "/favorites", label: "My Shortlist", icon: Star },
    { href: "/budget-calculator", label: "Buying Power", icon: Calculator },
    { href: "/education", label: "Learn Center", icon: GraduationCap },
    {
      href: "/hire-professionals",
      label: "Hire Experts",
      icon: BriefcaseBusiness,
    },
    { href: "/seller-dashboard", label: "Seller Dashboard", icon: Home },
    { href: "/seller-timeline", label: "Seller Timeline", icon: CalendarDays },
    { href: "/seller-analytics", label: "Seller Analytics", icon: BarChart3 },
    { href: "/admin/referrals", label: "Referral Pipeline", icon: Handshake },
  ];

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-[#F8F5EF]/85 backdrop-blur-2xl md:left-72">
        <div className="relative flex h-20 items-center justify-center px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-4 rounded-full border border-[#B19A55]/20 bg-white/80 px-5 py-2.5 font-serif text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A] shadow-sm md:hidden"
          >
            Menu
          </button>

          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.png"
              alt="Madison Group"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="absolute right-6 hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white/70 text-[#1A1A1A]"
                >
                  <BellRing size={17} />

                  {notificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </Link>

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

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 overflow-y-auto border-r border-white/30 bg-[#F8F5EF]/90 backdrop-blur-3xl md:block">
        <div className="flex min-h-full flex-col px-4 py-6">
          <div className="mb-6 px-2">
            <p className="font-serif text-[10px] uppercase tracking-[0.35em] text-[#B19A55]">
              Madison Group
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#1A1A1A]">
              Command Center
            </h2>
          </div>

          <nav className="grid gap-3">
            {(role === "admin" || role === "agent") && (
              <>
                <SidebarGroup
                  title="Client Care"
                  subtitle="relationships"
                  items={clientCareLinks}
                  defaultOpen
                />

                <SidebarGroup
                  title="Property Suite"
                  subtitle="search + listings"
                  items={propertySuiteLinks}
                  defaultOpen={false}
                />

                <SidebarGroup
                  title="Growth Tools"
                  subtitle="engagement"
                  items={growthLinks}
                  defaultOpen={false}
                />
              </>
            )}

            {role === "admin" && (
              <SidebarGroup
                title="Operations"
                subtitle="admin control"
                items={operationsLinks}
                defaultOpen={false}
              />
            )}

            <SidebarGroup
              title="My Portal"
              subtitle="client experience"
              items={portalLinks}
              defaultOpen={false}
            />
          </nav>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#F8F5EF]/98 px-5 py-6 backdrop-blur-3xl md:hidden">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-serif text-[10px] uppercase tracking-[0.35em] text-[#B19A55]">
                Madison
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold">
                Command Center
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#1A1A1A]/10 bg-white/80 px-4 py-2 font-serif text-[10px] uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>

          <nav className="grid gap-3">
            {(role === "admin" || role === "agent") && (
              <>
                <SidebarGroup
                  title="Client Care"
                  subtitle="relationships"
                  items={clientCareLinks}
                  defaultOpen
                  onClick={() => setMenuOpen(false)}
                />

                <SidebarGroup
                  title="Property Suite"
                  subtitle="search + listings"
                  items={propertySuiteLinks}
                  defaultOpen={false}
                  onClick={() => setMenuOpen(false)}
                />

                <SidebarGroup
                  title="Growth Tools"
                  subtitle="engagement"
                  items={growthLinks}
                  defaultOpen={false}
                  onClick={() => setMenuOpen(false)}
                />
              </>
            )}

            {role === "admin" && (
              <SidebarGroup
                title="Operations"
                subtitle="admin control"
                items={operationsLinks}
                defaultOpen={false}
                onClick={() => setMenuOpen(false)}
              />
            )}

            <SidebarGroup
              title="My Portal"
              subtitle="client experience"
              items={portalLinks}
              defaultOpen={false}
              onClick={() => setMenuOpen(false)}
            />

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 rounded-2xl bg-[#1A1A1A] px-5 py-4 font-serif text-base text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 rounded-2xl bg-[#1A1A1A] px-5 py-4 text-center font-serif text-base text-white"
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

function ListIcon({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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