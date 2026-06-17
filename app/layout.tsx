import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";
import { UserPresenceTracker } from "@/components/UserPresenceTracker";

export const metadata: Metadata = {
  title: "Madison Group Properties",
  description: "Building Beautiful Lives",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Madison Group",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F5EF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-[#F8F5EF] text-[#1A1A1A]">
        <Navbar />

        <RealtimeNotifications />
        <UserPresenceTracker />

        <div className="w-full overflow-x-hidden md:ml-72 md:w-[calc(100%-18rem)]">
          <main className="min-h-screen overflow-x-hidden pb-28 md:pb-0">
            {children}
          </main>

          <Footer />
        </div>

        <MobileBottomNav />
      </body>
    </html>
  );
}