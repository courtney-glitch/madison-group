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
} from "lucide-react";

export function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-2xl md:left-80">
        <div className="relative flex h-24 items-center justify-center px-8">
          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-6 rounded-full border border-[#1A1A1A]/10 bg-white/70 px-5 py-3 text-[11px] uppercase tracking-[0.3em] shadow-sm backdrop-blur md:hidden"
          >
            Menu
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* RIGHT */}
          <div className="absolute right-8 hidden items-center gap-4 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.2em] shadow-sm backdrop-blur transition hover:border-[#B19A55]/40 hover:text-[#B19A55]"
                >
                  <User size={14} />
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-80 border-r border-white/20 bg-white/65 backdrop-blur-3xl md:block">
        <div className="flex h-full flex-col justify-between px-7 py-8">
          <div>
            {/* BRAND */}
            <div className="mb-14">
              <p className="font-serif text-sm tracking-[0.45em] text-[#B19A55]">
                MADISON GROUP
              </p>

              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#1A1A1A]/40">
                Luxury Real Estate
              </p>
            </div>

            {/* NAVIGATION */}
            <nav className="grid gap-3">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white/30 px-5 py-5 shadow-sm backdrop-blur transition hover:border-[#B19A55]/30 hover:bg-white/80 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55] transition group-hover:bg-[#B19A55] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <div>
                      <p className="font-serif text-lg font-semibold text-[#1A1A1A]">
                        {link.label}
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                        Madison Group
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* FOOTER */}
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