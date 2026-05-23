import { supabase } from "@/lib/supabase";

import { ClientMessages } from "@/components/ClientMessages";
import { AdminMessagesCenter } from "@/components/AdminMessagesCenter";

export default async function MessagesPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[1.5rem] bg-white p-10 shadow-xl">
          <h1 className="font-serif text-4xl font-bold">
            Please Login
          </h1>

          <p className="mt-4 text-[#1A1A1A]/65">
            You must login to access messages.
          </p>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === "admin" ||
    user.email === "ronaviljoyc@gmail.com";

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        {isAdmin ? (
          <AdminMessagesCenter />
        ) : (
          <ClientMessages />
        )}
      </section>
    </main>
  );
}