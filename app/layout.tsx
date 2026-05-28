import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Madison Group Properties",
  description: "Building Beautiful Lives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F8F5EF] text-[#1A1A1A]">
        <Navbar />

        <div className="md:ml-72">
          <main className="min-h-screen pb-28 md:pb-0">
            {children}
          </main>

          <Footer />
        </div>

        <MobileBottomNav />
      </body>
    </html>
  );
}