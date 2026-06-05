"use client";

import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";

export default function InviteClientPage() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const inviteLink = "https://madison-group-kappa.vercel.app/signup";

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
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-4xl rounded-[1.5rem] bg-white p-6 shadow-xl md:p-8">
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

          <a
            href={mailtoLink}
            className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
          >
            <Mail size={15} />
            Send Invite Email
          </a>
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
    </main>
  );
}