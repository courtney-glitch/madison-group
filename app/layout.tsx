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

        {children}

        <footer className="mt-20 border-t border-[#1A1A1A]/10 bg-white px-6 py-14 text-[#1A1A1A]">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 md:grid-cols-4">
              <div>
                <h2 className="font-serif text-2xl font-bold">
                  Madison Group
                </h2>

                <p className="mt-5 leading-7 text-[#1A1A1A]/70">
                  A modern luxury real estate platform serving Bergen County
                  with clarity, advocacy, and elevated client experiences.
                </p>
              </div>

              <div>
                <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                  Navigation
                </p>

                <div className="mt-5 grid gap-3 text-sm">
                  <Link href="/properties">Properties</Link>
                  <Link href="/team">Team</Link>
                  <Link href="/favorites">Favorites</Link>
                  <Link href="/contact">Contact</Link>
                </div>
              </div>

              <div>
                <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                  Service Areas
                </p>

                <div className="mt-5 grid gap-3 text-sm text-[#1A1A1A]/70">
                  <p>Wyckoff</p>
                  <p>Mahwah</p>
                  <p>Saddle River</p>
                  <p>Franklin Lakes</p>
                  <p>Upper Saddle River</p>
                </div>
              </div>

              <div>
                <p className="font-serif text-sm font-bold uppercase tracking-[0.2em]">
                  Compliance
                </p>

                <div className="mt-5 grid gap-4 text-sm leading-7 text-[#1A1A1A]/60">
                  <p>
                    Madison Group is a licensed real estate brokerage serving
                    Bergen County, New Jersey.
                  </p>

                  <p>
                    IDX information is provided exclusively for personal,
                    non-commercial use and may not be used for any purpose
                    other than identifying prospective properties consumers may
                    be interested in purchasing.
                  </p>

                  <p>
                    Listing information is deemed reliable but not guaranteed.
                  </p>

                  <p>
                    Equal Housing Opportunity.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-[#1A1A1A]/10 pt-6 text-sm text-[#1A1A1A]/50">
              © {new Date().getFullYear()} Madison Group. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}