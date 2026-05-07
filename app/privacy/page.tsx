export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-4xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          LEGAL
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Privacy Policy
        </h1>

        <div className="mt-10 grid gap-8 leading-8">
          <div>
            <h2 className="font-serif text-2xl font-bold">
              Information We Collect
            </h2>

            <p className="mt-3">
              Madison Group may collect contact information,
              showing requests, saved properties, and account
              information submitted through this website.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              How We Use Information
            </h2>

            <p className="mt-3">
              Information is used to respond to inquiries,
              provide real estate services, improve user
              experience, and communicate regarding listings
              and requests.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              Data Protection
            </h2>

            <p className="mt-3">
              Madison Group takes reasonable measures to
              protect personal information and platform data.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              Third-Party Services
            </h2>

            <p className="mt-3">
              This platform may use trusted third-party
              services including Supabase, hosting providers,
              analytics providers, and communication tools.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}