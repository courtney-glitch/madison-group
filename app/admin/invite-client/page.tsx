"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageShell } from "@/components/AdminPageShell";

type ClientInvite = {
  id: string;
  client_name: string;
  client_email: string;
  invite_link: string;
  status: string | null;
  created_at: string;
};

export default function InviteClientPage() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invites, setInvites] = useState<ClientInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inviteLink = "https://madison-group-kappa.vercel.app/signup";

  useEffect(() => {
    loadInvites();
  }, []);

  async function loadInvites() {
    setLoading(true);

    const { data } = await supabase
      .from("client_invites")
      .select("*")
      .order("created_at", { ascending: false });

    setInvites((data || []) as ClientInvite[]);
    setLoading(false);
  }

  async function saveInvite() {
    if (!clientName.trim() || !clientEmail.trim()) return;

    setSaving(true);

    const { error } = await supabase.from("client_invites").insert({
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      invite_link: inviteLink,
      status: "Sent",
    });

    if (!error) {
      setClientName("");
      setClientEmail("");
      await loadInvites();
    }

    setSaving(false);
  }

  async function deleteInvite(id: string) {
    await supabase.from("client_invites").delete().eq("id", id);
    await loadInvites();
  }

  const emailSubject = encodeURIComponent(
    "Your Madison Group Client Portal Invitation"
  );

  const emailBody = encodeURIComponent(
    `Hi ${clientName || "there"},

I’d like to invite you to Madison Group Properties’ client portal.

You can create your account here:
${inviteLink}

Inside the portal, you’ll be able to view homes, save favorites, track your buyer journey, message your advisor, and access helpful tools for your home search.

Best,
Madison Group Properties`
  );

  const mailtoLink = `mailto:${clientEmail}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <section className="rounded-[1.5rem] bg-white p-6 shadow-xl md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <UserPlus size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Agent View
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Invite a New Client
              </h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Client email"
              type="email"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={saveInvite}
                disabled={saving || !clientName.trim() || !clientEmail.trim()}
                className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
              >
                <UserPlus size={15} />
                {saving ? "Saving..." : "Save Invite"}
              </button>

              <a
                href={mailtoLink}
                className="flex items-center justify-center gap-2 rounded-full border border-[#B19A55]/30 bg-white px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-[#B19A55]"
              >
                <Mail size={15} />
                Send Email
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-5">
            <p className="font-serif text-sm font-bold text-[#B19A55]">
              Client signup link:
            </p>

            <p className="mt-2 break-all text-sm text-[#1A1A1A]/65">
              {inviteLink}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">Invite History</h2>

          <div className="mt-6 grid gap-4">
            {loading ? (
              <p className="rounded-3xl bg-[#F8F5EF] p-5 text-sm text-[#1A1A1A]/60">
                Loading invites...
              </p>
            ) : invites.length > 0 ? (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className="rounded-3xl bg-[#F8F5EF] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-serif text-xl font-bold">
                        {invite.client_name}
                      </p>

                      <p className="mt-2 text-sm text-[#1A1A1A]/60">
                        {invite.client_email}
                      </p>

                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                        {invite.status || "Sent"} ·{" "}
                        {new Date(invite.created_at).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteInvite(invite.id)}
                      className="flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-3xl bg-[#F8F5EF] p-5 text-sm text-[#1A1A1A]/60">
                No invites sent yet.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  </AdminPageShell>
);
}