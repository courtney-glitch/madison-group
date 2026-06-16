"use client";

import { ReactNode } from "react";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";

type AdminPageShellProps = {
  children: ReactNode;
};

export function AdminPageShell({
  children,
}: AdminPageShellProps) {
  return (
    <AdminRouteGuard>
      {children}
    </AdminRouteGuard>
  );
}