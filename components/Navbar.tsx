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
  PanelLeftClose,
  PanelLeftOpen,
  Calculator,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    checkUser();

    const savedSidebar = localStorage.getItem(
      "madison-sidebar-collapsed"
    );

    if (savedSidebar === "true") {
      setSidebarCollapsed(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "madison-sidebar-collapsed",
      String(sidebarCollapsed)
    );

    document.documentElement.style.setProperty(
      "--sidebar-width",
      sidebarCollapsed ? "5.5rem" : "17rem"
    );
  }, [sidebarCollapsed]);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setMenuOpen(false);

    router.push("/login");
    router.refresh();
  }

  const links = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/properties",
      label: "Home Search",
      icon: Search,
    },
    {
      href: "/budget-calculator",
      label: "Budget Calculator",
      icon: Calculator,
    },
    {
      href: "/map-search",
      label: "Map Search",
      icon: Map,
    },
    {
      href: "/saved-searches",
      label: "Saved Searches",
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

  return (
    <>
      {/* TOP HEADER */}
      <header
        className={`fixed right-0 top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-2xl transition-all duration-300 ${
          sidebarCollapsed ? "md:left-[5.5rem]" : "md:left-[17rem]"
        } left-0`}
      >
        <div className="relative flex h-18 items-center justify-center px-4 sm:px-8">
          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-4 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.25em] shadow-sm backdrop-blur md:hidden"
          >
            Menu
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* RIGHT BUTTONS */}
          <div className="absolute right-4 hidden items-center gap-2 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.18em] shadow-sm backdrop-blur transition hover:border-[#B19A55]/40 hover:text-[#B19A55]"
                >
                  <User size={12} />

                  <span className="hidden lg:inline">
                    Account
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
                >
                  <LogOut size={12} />

                  <span className="hidden lg:inline">
                    Logout
                  </span>
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

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-white/20 bg-white/65 backdrop-blur-3xl transition-all duration-300 md:block ${
          sidebarCollapsed ? "w-[5.5rem]" : "w-[17rem]"
        }`}
      >
        <div
          className={`flex h-full flex-col ${
            sidebarCollapsed ? "px-3 py-5" : "px-4 py-5"
          }`}
        >
          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* BRAND */}
            <div
              className={`mb-6 ${
                sidebarCollapsed ? "text-center" : ""
              }`}
            >
              {!sidebarCollapsed && (
                <>
                  <p className="font-serif text-[10px] tracking-[0.35em] text-[#B19A55]">
                    MADISON GROUP
                  </p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-[#1A1A1A]/40">
                    Luxury Real Estate
                  </p>
                </>
              )}

              {sidebarCollapsed && (
                <img
                  src="/madison-logo.jpg"
                  alt="Madison Group"
                  className="mx-auto h-9 w-auto object-contain"
                />
              )}
            </div>

            {/* SIDEBAR TOGGLE */}
            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed(!sidebarCollapsed)
              }
              className={`mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#1A1A1A]/10 bg-white/50 px-3 py-3 text-[#B19A55] shadow-sm transition hover:bg-white ${
                sidebarCollapsed ? "" : "justify-start"
              }`}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={16} />
              ) : (
                <PanelLeftClose size={16} />
              )}

              {!sidebarCollapsed && (
                <span className="font-serif text-[11px] font-bold">
                  Hide Sidebar
                </span>
              )}
            </button>

            {/* NAVIGATION */}
            <nav className="grid gap-2">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={
                      sidebarCollapsed
                        ? link.label
                        : undefined
                    }
                    className={`group flex items-center rounded-2xl border border-transparent bg-white/30 shadow-sm backdrop-blur transition hover:border-[#B19A55]/30 hover:bg-white/80 hover:shadow-lg ${
                      sidebarCollapsed
                        ? "justify-center px-2 py-2.5"
                        : "gap-3 px-3 py-2.5"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-[#B19A55] group-hover:text-white">
                      <Icon size={16} />
                    </div>

                    {!sidebarCollapsed && (
                      <p className="font-serif text-[14px] font-semibold text-[#1A1A1A]">
                        {link.label}
                      </p>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* FOOTER */}
          {!sidebarCollapsed && (
            <div className="mt-4 rounded-3xl border border-white/30 bg-white/50 p-4 shadow-xl backdrop-blur">
              <img
                src="/madison-logo.jpg"
                alt="Madison Group"
                className="h-7 w-auto object-contain"
              />

              <p className="mt-3 font-serif text-sm text-[#1A1A1A]">
                Bergen County Luxury Real Estate
              </p>

              <p className="mt-2 text-xs leading-5 text-[#1A1A1A]/50">
                Calm guidance. Elevated service.
                Strategic advocacy.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-[#F8F5EF]/95 px-6 py-8 backdrop-blur-3xl md:hidden">
          <div className="mb-10 flex items-center justify-between">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-14 w-auto object-contain"
            />

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#1A1A1A]/10 bg-white/70 px-5 py-3 text-xs uppercase tracking-[0.25em] shadow-sm"
            >
              Close
            </button>
          </div>

          <nav className="grid gap-3">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl border border-white/40 bg-white/70 px-4 py-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={18} />
                  </div>

                  <p className="font-serif text-lg text-[#1A1A1A]">
                    {link.label}
                  </p>
                </Link>
              );
            })}

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 rounded-2xl bg-[#B19A55] px-5 py-4 font-serif text-lg text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-4 rounded-2xl bg-[#B19A55] px-5 py-4 text-center font-serif text-lg text-white"
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