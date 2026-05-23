"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  Heart,
  Home,
  Menu,
  MessageCircle,
  User,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const navigationLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },

  {
    href: "/properties",
    label: "Properties",
    icon: Building2,
  },

  {
    href: "/favorites",
    label: "Favorites",
    icon: Heart,
  },

  {
    href: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },

  {
    href: "/dashboard",
    label: "Dashboard",
    icon: User,
  },
];

const adminLinks = [
  {
    href: "/admin/client-activity",
    label: "Client Activity",
    icon: Activity,
  },

  {
    href: "/admin/messages",
    label: "Admin Messages",
    icon: MessageCircle,
  },

  {
    href: "/admin/properties",
    label: "Manage Properties",
    icon: Building2,
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUser();

    const channel = supabase
      .channel("navbar-message-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {
          await checkUser();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setIsAdmin(false);
      setUnreadCount(0);
      return;
    }

    setLoggedIn(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const admin = profile?.role === "admin";

    setIsAdmin(admin);

    if (admin) {
      const { data: unreadMessages } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_type", "client")
        .eq("read_by_admin", false);

      setUnreadCount(unreadMessages?.length || 0);
    } else {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!conversation) {
        setUnreadCount(0);
        return;
      }

      const { data: unreadMessages } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversation.id)
        .eq("sender_type", "advisor")
        .eq("read_by_client", false);

      setUnreadCount(unreadMessages?.length || 0);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-bold">
          Madison Group
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          {navigationLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#1A1A1A]/75 transition hover:bg-[#F8F5EF] hover:text-[#B19A55]"
              >
                <Icon size={16} />

                {link.label}

                {link.label === "Messages" &&
                  unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
              </Link>
            );
          })}

          {loggedIn &&
            isAdmin &&
            adminLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B19A55]"
                >
                  <Icon size={16} />

                  {link.label}
                </Link>
              );
            })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-full border border-[#1A1A1A]/10 p-3 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl font-bold">
                Menu
              </p>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[#1A1A1A]/10 p-3"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 grid gap-3">
              {navigationLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="relative flex items-center gap-3 rounded-2xl bg-[#F8F5EF] px-5 py-4 font-medium text-[#1A1A1A]"
                  >
                    <Icon size={18} />

                    {link.label}

                    {link.label === "Messages" &&
                      unreadCount > 0 && (
                        <span className="absolute right-4 top-1/2 flex h-6 min-w-[24px] -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                  </Link>
                );
              })}

              {loggedIn &&
                isAdmin &&
                adminLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-[#1A1A1A] px-5 py-4 font-medium text-white"
                    >
                      <Icon size={18} />

                      {link.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}