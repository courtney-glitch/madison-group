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
      <body>
        <Navbar />

        <div className="pt-24 transition-all duration-300 md:pl-[var(--sidebar-width,20rem)]">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}