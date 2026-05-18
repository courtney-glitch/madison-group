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
    { href: "/saved-searches", label: "Saved Searches" },
    { href: "/favorites", label: "Favorites" },
    { href: "/about", label: "Our Approach" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-5">
          {/* LOGO */}
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-wide text-[#1A1A1A]"
            onClick={() => setMenuOpen(false)}
          >
            Madison Group
          </Link>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="border border-[#1A1A1A]/20 px-4 py-2 font-serif text-sm uppercase tracking-[0.2em] md:hidden"
          >
            Menu
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.18em] md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[#B19A55]"
              >
                {link.label}
              </Link>
            ))}

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="transition hover:text-[#B19A55]"
                >
                  Account
                </Link>

                <Link
                  href="/admin"
                  className="transition hover:text-[#B19A55]"
                >
                  Admin
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[#B19A55]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="transition hover:text-[#B19A55]"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* MOBILE NAV */}
        {menuOpen && (
          <nav className="grid gap-5 border-t border-[#1A1A1A]/10 py-5 text-sm uppercase tracking-[0.18em] md:hidden">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-[#B19A55]"
              >
                {link.label}
              </Link>
            ))}

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                >
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
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}