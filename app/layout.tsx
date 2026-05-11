import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Madison Group | Bergen County Real Estate",
  description:
    "Madison Group is an education-first Bergen County real estate platform helping buyers and sellers move with clarity, confidence, and trusted guidance.",
  openGraph: {
    title: "Madison Group | Building Beautiful Lives",
    description:
      "Luxury Bergen County real estate guidance for Wyckoff, Mahwah, Saddle River, Upper Saddle River, Allendale, Franklin Lakes, and beyond.",
    url: "https://madison-group.vercel.app",
    siteName: "Madison Group",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Madison Group luxury real estate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madison Group | Bergen County Real Estate",
    description:
      "Building Beautiful Lives through calm, strategic, education-first real estate guidance.",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <footer className="mt-20 border-t border-[#1A1A1A]/10 bg-white px-6 py-12 text-[#1A1A1A]">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Madison Group
              </h2>

              <p className="mt-4 leading-7 text-[#1A1A1A]/70">
                Serving Bergen County&apos;s most desirable communities with a
                calm, education-first approach to real estate.
              </p>
            </div>

            <div>
              <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                Navigation
              </p>

              <div className="mt-4 grid gap-3">
                <Link href="/properties">Properties</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/favorites">Favorites</Link>
              </div>
            </div>

            <div>
              <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                Legal
              </p>

              <div className="mt-4 grid gap-3">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>

              <p className="mt-8 text-sm text-[#1A1A1A]/50">
                © {new Date().getFullYear()} Madison Group. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}