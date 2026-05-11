import { supabase } from "@/lib/supabase";

export default async function TeamPage() {
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-16 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">
          Meet the team building beautiful lives.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#1A1A1A]/70">
          A calm, education-first real estate team serving Bergen County&apos;s
          most desirable communities with advocacy, clarity, and care.
        </p>

        {agents && agents.length > 0 ? (
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {agents.map((agent) => (
              <article
                key={agent.id}
                className="bg-white p-6 shadow-xl"
              >
                {agent.photo_url ? (
                  <img
                    src={agent.photo_url}
                    alt={agent.name}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center bg-[#1A1A1A] text-white">
                    No Photo
                  </div>
                )}

                <h2 className="mt-6 font-serif text-3xl font-bold">
                  {agent.name}
                </h2>

                {agent.title && (
                  <p className="mt-2 text-[#B19A55]">
                    {agent.title}
                  </p>
                )}

                {agent.bio && (
                  <p className="mt-5 leading-7 text-[#1A1A1A]/70">
                    {agent.bio}
                  </p>
                )}

                <div className="mt-6 grid gap-2 text-sm">
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="text-[#B19A55]"
                    >
                      {agent.email}
                    </a>
                  )}

                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="text-[#B19A55]"
                    >
                      {agent.phone}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">
              No agents added yet
            </p>
          </div>
        )}
      </section>
    </main>
  );
}