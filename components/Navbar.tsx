"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
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
  }

  const publicLinks = [
    { href: "/properties", label: "Properties" },
    { href: "/team", label: "Team" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-wide text-[#1A1A1A]"
            onClick={() => setMenuOpen(false)}
          >
            Madison Group
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="border border-[#1A1A1A]/20 px-4 py-2 font-serif text-sm uppercase tracking-[0.2em] md:hidden"
          >
            Menu
          </button>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}

            <Link href="/favorites">Favorites</Link>

            {loggedIn ? (
              <>
                <Link href="/account">Account</Link>
                <Link href="/admin">Admin</Link>
                <button onClick={handleLogout} className="text-[#B19A55]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup">Signup</Link>
              </>
            )}
          </nav>
        </div>

        {menuOpen && (
          <nav className="grid gap-4 border-t border-[#1A1A1A]/10 py-5 text-sm md:hidden">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link href="/favorites" onClick={() => setMenuOpen(false)}>
              Favorites
            </Link>

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
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Signup
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}