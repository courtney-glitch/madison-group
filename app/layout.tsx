import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Madison Group Properties",
  description: "Bergen County luxury real estate platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8F5EF] text-[15px] text-[#1A1A1A] antialiased">
        <Navbar />

        <div className="pt-[4.5rem] transition-all duration-300 md:pl-[var(--sidebar-width,17rem)]">
          <div className="min-w-0">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}