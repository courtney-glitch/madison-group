"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    { href: "/", label: "Dashboard" },
    { href: "/properties", label: "Home Search" },
    { href: "/map-search", label: "Map Search" },
    { href: "/saved-searches", label: "Saved Searches" },
    { href: "/favorites", label: "Favorites" },
    { href: "/communities/wyckoff", label: "Communities" },
    { href: "/about", label: "Our Approach" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#1A1A1A]/10 bg-white/95 backdrop-blur md:left-72">
        <div className="relative flex h-20 items-center justify-center px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-6 border border-[#1A1A1A]/15 px-4 py-2 text-xs uppercase tracking-[0.25em] md:hidden"
          >
            Menu
          </button>

          <Link href="/" className="flex items-center justify-center">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="absolute right-6 hidden items-center gap-4 text-xs uppercase tracking-[0.2em] md:flex">
            {loggedIn ? (
              <>
                <Link href="/account" className="hover:text-[#B19A55]">
                  Account
                </Link>

                <button onClick={handleLogout} className="text-[#B19A55]">
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="border border-[#B19A55] px-4 py-2 text-[#B19A55] hover:bg-[#B19A55] hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 border-r border-white/10 bg-[#111111] text-white md:block">
        <div className="flex h-full flex-col justify-between px-6 py-8">
          <div>
            <div className="mb-10">
              <p className="font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
                MADISON GROUP
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">
                Luxury Real Estate
              </p>
            </div>

            <nav className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-l-2 border-transparent px-4 py-4 font-serif text-base text-white/75 transition hover:border-[#B19A55] hover:bg-white/5 hover:text-[#D4B06A]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="font-serif text-sm text-white">Madison Group</p>
            <p className="mt-1 text-xs text-white/45">
              Bergen County, New Jersey
            </p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#111111] px-6 py-8 text-white md:hidden">
          <div className="mb-8 flex items-center justify-between">
            <img
              src="/madison-logo.jpg"
              alt="Madison Group"
              className="h-14 w-auto object-contain"
            />

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>

          <nav className="grid gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 font-serif text-xl"
              >
                {link.label}
              </Link>
            ))}

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="py-4 text-left font-serif text-xl text-[#D4B06A]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="py-4 font-serif text-xl text-[#D4B06A]"
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