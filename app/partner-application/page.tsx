"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Handshake } from "lucide-react";
import { supabase } from "@/lib/supabase";

function PartnerApplicationForm() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerType, setPartnerType] = useState("Referral Partner");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");

    if (typeFromUrl) {
      setPartnerType(typeFromUrl);
    }
  }, [searchParams]);

  async function submitApplication() {
    if (!name.trim() || !email.trim()) {
      setStatus("Please add your name and email.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    const { error } = await supabase.from("partner_applications").insert({
      name: name.trim(),
      business_name: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      partner_type: partnerType,
      message: message.trim(),
      status: "New",
    });

    if (error) {
      setStatus(error.message);
      setSubmitting(false);
      return;
    }

    setName("");
    setBusinessName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("Your referral/application has been submitted.");
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Handshake size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Grow With Madison
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              {partnerType}
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-[#1A1A1A]/60">
          Submit a referral or partnership request. Madison will review the
          information and follow up with the next steps.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={
              partnerType === "Client Referral"
                ? "Friend / referral name"
                : partnerType === "Agent Referral"
                ? "Agent / brokerage name"
                : "Business / company name"
            }
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            type="email"
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            type="tel"
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <select
            value={partnerType}
            onChange={(e) => setPartnerType(e.target.value)}
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          >
            <option>Referral Partner</option>
            <option>Agent Referral</option>
            <option>Client Referral</option>
            <option>Vendor Collaboration</option>
            <option>Co-Marketing Campaign</option>
            <option>Strategic Partnership</option>
          </select>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about this referral or partnership..."
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <button
            type="button"
            onClick={submitApplication}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Referral"}
            <ArrowRight size={15} />
          </button>

          {status && (
            <p className="rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
              {status}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default function PartnerApplicationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8F5EF] px-4 py-12 text-[#1A1A1A]">
          Loading referral form...
        </main>
      }
    >
      <PartnerApplicationForm />
    </Suspense>
  );
}