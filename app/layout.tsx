import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";

export const metadata: Metadata = {
  title: "Madison Group Properties",
  description: "Building Beautiful Lives",
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