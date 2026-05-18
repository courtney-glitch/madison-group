import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111111] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          {/* LEFT */}
          <div>
            <p className="font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
              MADISON GROUP PROPERTIES
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight">
              Building Beautiful Lives.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Madison Group Properties is a Bergen County luxury real estate
              brokerage focused on expert guidance, strategic advocacy, and a
              calmer real estate experience.
            </p>
          </div>

          {/* RIGHT */}
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="mb-4 font-serif text-lg font-bold text-[#D4B06A]">
                Navigation
              </p>

              <div className="flex flex-col gap-3 text-white/70">
                <Link href="/">Home</Link>
                <Link href="/properties">Properties</Link>
                <Link href="/about">Our Approach</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>

            <div>
              <p className="mb-4 font-serif text-lg font-bold text-[#D4B06A]">
                Legal
              </p>

              <div className="flex flex-col gap-3 text-white/70">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="space-y-5 text-sm leading-7 text-white/55">
            <p>
              All information deemed reliable but not guaranteed and should be
              independently verified. Listing information may be subject to
              errors, omissions, changes in price, prior sale, or withdrawal
              without notice.
            </p>

            <p>
              Madison Group Properties fully supports the principles of the Fair
              Housing Act and Equal Opportunity Housing.
            </p>

            <p>
              IDX information is provided exclusively for personal,
              non-commercial use and may not be used for any purpose other than
              identifying prospective properties consumers may be interested in
              purchasing.
            </p>

            <div className="flex flex-col gap-2 pt-4 md:flex-row md:items-center md:justify-between">
              <p>
                © {new Date().getFullYear()} Madison Group Properties. All
                rights reserved.
              </p>

              <p>Bergen County, New Jersey</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}