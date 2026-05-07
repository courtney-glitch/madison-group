"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

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
  }

  return (
    <header className="border-b border-[#1A1A1A]/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-[#1A1A1A]">
          Madison Group
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/properties">Properties</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/favorites">Favorites</Link>

          {loggedIn ? (
            <>
              <Link href="/account">Account</Link>
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
    </header>
  );
}