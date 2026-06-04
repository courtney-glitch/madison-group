export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5EF] px-6 text-[#1A1A1A]">
      <div className="text-center">
        <img
          src="/madison-logo.jpg"
          alt="Madison Group"
          className="mx-auto h-20 w-auto object-contain"
        />

        <p className="mt-8 font-serif text-[11px] uppercase tracking-[0.35em] text-[#B19A55]">
          Madison Group Properties
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold">
          Building Beautiful Lives
        </h1>

        <div className="mx-auto mt-8 h-2 w-40 overflow-hidden rounded-full bg-white">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#B19A55]" />
        </div>
      </div>
    </main>
  );
}