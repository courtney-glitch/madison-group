"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Search,
  Map,
  Heart,
  Bookmark,
  Building2,
  Phone,
  User,
  LogOut,
  Calculator,
  Scale,
  Activity,
  MessageCircle,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    if (!loggedIn) return;

    const channel = supabase
      .channel("navbar-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {
          await loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loggedIn, isAdmin]);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);

    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const admin = profile?.role === "admin";

    setIsAdmin(admin);

    await loadUnreadCount(admin);
  }

  async function loadUnreadCount(adminOverride?: boolean) {
    const admin =
      typeof adminOverride === "boolean"
        ? adminOverride
        : isAdmin;

    let query = supabase.from("messages").select("*", {
      count: "exact",
      head: true,
    });

    if (admin) {
      query = query.eq("read_by_admin", false);
    } else {
      query = query.eq("read_by_client", false);
    }

    const { count } = await query;

    setUnreadCount(count || 0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setMenuOpen(false);

    router.push("/login");
    router.refresh();
  }

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
      badge: unreadCount,
    },
    {
      href: "/properties",
      label: "Home Search",
      icon: Search,
    },
    {
      href: "/map-search",
      label: "Map Search",
      icon: Map,
    },
    {
      href: "/budget-calculator",
      label: "Budget",
      icon: Calculator,
    },
    {
      href: "/compare",
      label: "Compare",
      icon: Scale,
    },
    {
      href: "/saved-searches",
      label: "Saved",
      icon: Bookmark,
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: Heart,
    },
    {
      href: "/communities/wyckoff",
      label: "Communities",
      icon: Building2,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: Phone,
    },
  ];

  const adminLinks = [
    {
      href: "/admin/client-activity",
      label: "Client Activity",
      icon: Activity,
    },
  ];

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-2xl md:left-72">
        <div className="relative flex h-20 items-center justify-center px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-4 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.25em] shadow-sm backdrop-blur md:hidden"
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
                  className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.2em] shadow-sm backdrop-blur transition hover:border-[#B19A55]/40 hover:text-[#B19A55]"
                >
                  <User size={13} />
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 overflow-y-auto border-r border-white/20 bg-white/65 backdrop-blur-3xl md:block">
        <div className="flex min-h-full flex-col justify-between px-5 py-6">
          <div>
            <div className="mb-10">
              <p className="font-serif text-xs tracking-[0.4em] text-[#B19A55]">
                MADISON GROUP
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40">
                Luxury Real Estate
              </p>
            </div>

            <nav className="grid gap-2">
              {links.map((link: any) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/30 px-4 py-3 shadow-sm backdrop-blur transition hover:border-[#B19A55]/30 hover:bg-white/80 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-[#B19A55] group-hover:text-white">
                        <Icon size={17} />
                      </div>

                      <p className="font-serif text-base font-semibold text-[#1A1A1A]">
                        {link.label}
                      </p>
                    </div>

                    {link.badge > 0 && (
                      <div className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[#B19A55] px-2 text-xs font-bold text-white">
                        {link.badge}
                      </div>
                    )}
                  </Link>
                );
              })}

              {isAdmin && (
                <>
                  <div className="my-4 border-t border-[#1A1A1A]/10" />

                  <p className="px-2 text-[10px] uppercase tracking-[0.3em] text-[#B19A55]">
                    Admin
                  </p>

                  {adminLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center gap-3 rounded-2xl border border-[#B19A55]/10 bg-[#B19A55]/5 px-4 py-3 shadow-sm backdrop-blur transition hover:bg-[#B19A55] hover:text-white"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B19A55] text-white">
                          <Icon size={17} />
                        </div>

                        <p className="font-serif text-base font-semibold">
                          {link.label}
                        </p>
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}