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

    return () => {
      subscription.unsubscribe();
    };
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

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Home Search" },
    { href: "/map-search", label: "Map" },
    { href: "/saved-searches", label: "Saved Searches" },
    { href: "/favorites", label: "Favorites" },
    { href: "/about", label: "Approach" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-6">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-serif text-[22px] font-semibold tracking-[-0.02em] text-[#1A1A1A]"
          >
            Madison Group
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="border border-[#1A1A1A]/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#1A1A1A] md:hidden"
          >
            Menu
          </button>

          <nav className="hidden items-center gap-5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/70 md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap transition hover:text-[#B19A55]"
              >
                {link.label}
              </Link>
            ))}

            <span className="h-4 w-px bg-[#1A1A1A]/15" />

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="whitespace-nowrap transition hover:text-[#B19A55]"
                >
                  Account
                </Link>

                <Link
                  href="/admin"
                  className="whitespace-nowrap transition hover:text-[#B19A55]"
                >
                  Admin
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="whitespace-nowrap text-[#B19A55]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="whitespace-nowrap border border-[#B19A55] px-4 py-2 text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>

        {menuOpen && (
          <nav className="grid gap-5 border-t border-[#1A1A1A]/10 py-6 text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A]/75 md:hidden">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {loggedIn ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)}>
                  Account
                </Link>

                <Link href="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left text-[#B19A55]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}