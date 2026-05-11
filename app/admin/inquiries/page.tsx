import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AdminInquiriesPage() {
  const { data: inquiries } = await supabase
    .from("showings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              ADMIN CRM
            </p>

            <h1 className="font-serif text-5xl font-bold">
              Buyer Inquiries
            </h1>
          </div>

          <Link
            href="/admin"
            className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
          >
            Back to Admin
          </Link>
        </div>

        {inquiries && inquiries.length > 0 ? (
          <div className="mt-12 overflow-hidden border border-[#1A1A1A]/10 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-[#1A1A1A]/10 bg-[#F8F5EF]">
                  <tr>
                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Message
                    </th>

                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Property
                    </th>

                    <th className="px-6 py-4 text-left font-serif text-sm uppercase tracking-[0.2em]">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-[#1A1A1A]/10"
                    >
                      <td className="px-6 py-5 font-medium">
                        {inquiry.name}
                      </td>

                      <td className="px-6 py-5">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-[#B19A55]"
                        >
                          {inquiry.email}
                        </a>
                      </td>

                      <td className="px-6 py-5">
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="text-[#B19A55]"
                        >
                          {inquiry.phone}
                        </a>
                      </td>

                      <td className="max-w-xs px-6 py-5 text-sm leading-7 text-[#1A1A1A]/70">
                        {inquiry.message}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {inquiry.property_id}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#1A1A1A]/60">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-12 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">
              No inquiries yet
            </p>
          </div>
        )}
      </section>
    </main>
  );
}