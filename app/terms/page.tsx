export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-4xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          LEGAL
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Terms of Service
        </h1>

        <div className="mt-10 grid gap-8 leading-8">
          <div>
            <h2 className="font-serif text-2xl font-bold">
              Website Use
            </h2>

            <p className="mt-3">
              By using this platform, users agree to use the
              website lawfully and respectfully.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              Property Information
            </h2>

            <p className="mt-3">
              Property listings and information are provided
              for informational purposes and may change without
              notice.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              User Accounts
            </h2>

            <p className="mt-3">
              Users are responsible for maintaining the
              confidentiality of their account information.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold">
              Limitation of Liability
            </h2>

            <p className="mt-3">
              Madison Group is not liable for inaccuracies,
              interruptions, or damages resulting from use of
              this website.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}