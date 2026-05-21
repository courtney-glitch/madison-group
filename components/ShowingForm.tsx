"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ShowingFormProps = {
  propertyId: string;
};

export function ShowingForm({ propertyId }: ShowingFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first to request a showing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("showing_requests").insert({
      user_id: user.id,
      property_id: propertyId,
      full_name: fullName,
      email,
      phone,
      message,
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Showing request sent successfully.");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div>
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Private Tour
        </p>

        <h2 className="mt-3 font-serif text-3xl font-bold">
          Request a Showing
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
          Submit your preferred showing request and a Madison Group advisor will
          follow up with next steps.
        </p>
      </div>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 outline-none transition focus:border-[#B19A55]"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 outline-none transition focus:border-[#B19A55]"
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 outline-none transition focus:border-[#B19A55]"
      />

      <textarea
        rows={5}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 outline-none transition focus:border-[#B19A55]"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#B19A55] px-8 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {status && (
        <p className="rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/70">
          {status}
        </p>
      )}
    </form>
  );
}