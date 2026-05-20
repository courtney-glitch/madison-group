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
} from "lucide-react";

export function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    checkUser();

    const savedSidebar = localStorage.getItem("madison-sidebar-collapsed");

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
      sidebarCollapsed ? "6rem" : "20rem"
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
          sidebarCollapsed ? "md:left-24" : "md:left-80"
        } left-0`}
      >
        <div className="relative flex h-24 items-center justify-center px-4 sm:px-8">
          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-4 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-4 py-3 text-[11px] uppercase tracking-[0.25em] shadow-sm backdrop-blur md:hidden"
          >
            Menu
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          {/* RIGHT BUTTONS */}
          <div className="absolute right-4 hidden items-center gap-2 md:flex lg:right-8 lg:gap-4">
            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.18em] shadow-sm backdrop-blur transition hover:border-[#B19A55]/40 hover:text-[#B19A55] lg:px-5"
                >
                  <User size={14} />
                  <span className="hidden lg:inline">Account</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white lg:px-5"
                >
                  <LogOut size={14} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-5 py-3 text-xs uppercase tracking-[0.25em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-white/20 bg-white/65 backdrop-blur-3xl transition-all duration-300 md:block ${
          sidebarCollapsed ? "w-24" : "w-80"
        }`}
      >
        <div
          className={`flex h-full flex-col justify-between py-8 ${
            sidebarCollapsed ? "px-4" : "px-7"
          }`}
        >
          <div>
            {/* BRAND */}
            <div className={`mb-10 ${sidebarCollapsed ? "text-center" : ""}`}>
              {!sidebarCollapsed && (
                <>
                  <p className="font-serif text-sm tracking-[0.45em] text-[#B19A55]">
                    MADISON GROUP
                  </p>

                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#1A1A1A]/40">
                    Luxury Real Estate
                  </p>
                </>
              )}

              {sidebarCollapsed && (
                <img
                  src="/madison-logo.jpg"
                  alt="Madison Group"
                  className="mx-auto h-12 w-auto object-contain"
                />
              )}
            </div>

            {/* HIDE / SHOW BUTTON */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#1A1A1A]/10 bg-white/50 px-4 py-4 text-[#B19A55] shadow-sm transition hover:bg-white ${
                sidebarCollapsed ? "" : "justify-start"
              }`}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}

              {!sidebarCollapsed && (
                <span className="font-serif text-sm font-bold">
                  Hide Sidebar
                </span>
              )}
            </button>

            {/* NAVIGATION */}
            <nav className="grid gap-3">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={sidebarCollapsed ? link.label : undefined}
                    className={`group flex items-center rounded-2xl border border-transparent bg-white/30 shadow-sm backdrop-blur transition hover:border-[#B19A55]/30 hover:bg-white/80 hover:shadow-xl ${
                      sidebarCollapsed
                        ? "justify-center px-3 py-4"
                        : "gap-4 px-5 py-5"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-[#B19A55] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    {!sidebarCollapsed && (
                      <p className="font-serif text-lg font-semibold text-[#1A1A1A]">
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
            <div className="rounded-3xl border border-white/30 bg-white/50 p-6 shadow-xl backdrop-blur">
              <img
                src="/madison-logo.jpg"
                alt="Madison Group"
                className="h-12 w-auto object-contain"
              />

              <p className="mt-5 font-serif text-lg text-[#1A1A1A]">
                Bergen County Luxury Real Estate
              </p>

              <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/50">
                Calm guidance. Elevated service. Strategic advocacy.
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
              className="h-16 w-auto object-contain"
            />

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#1A1A1A]/10 bg-white/70 px-5 py-3 text-xs uppercase tracking-[0.25em] shadow-sm"
            >
              Close
            </button>
          </div>

          <nav className="grid gap-4">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-5 rounded-2xl border border-white/40 bg-white/70 px-5 py-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                    <Icon size={20} />
                  </div>

                  <p className="font-serif text-xl text-[#1A1A1A]">
                    {link.label}
                  </p>
                </Link>
              );
            })}

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 rounded-2xl bg-[#B19A55] px-5 py-5 font-serif text-xl text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-4 rounded-2xl bg-[#B19A55] px-5 py-5 text-center font-serif text-xl text-white"
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