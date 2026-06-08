"use client";

import { AdminGuard } from "@/components/AdminGuard";

type AdminPageShellProps = {
  children: React.ReactNode;
};

export function AdminPageShell({
  children,
}: AdminPageShellProps) {
  return <AdminGuard>{children}</AdminGuard>;
}