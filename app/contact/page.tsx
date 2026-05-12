"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("showings").insert({
      full_name: fullName,
      email,
      phone,
      message: `Interest: ${interest}\n\n${message}`,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Thank you. Madison Group will be in touch soon.");
    setFullName("");
    setEmail("");
    setPhone("");
    setInterest("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            CONTACT MADISON GROUP
          </p>

          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">
            Start with clarity.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#1A1A1A]/70">
            Whether you are buying, selling, relocating, or exploring Bergen
            County communities, our team is here to guide your next move with
            calm, strategic support.
          </p>

          <div className="mt-10 grid gap-6">
            <div className="border border-[#1A1A1A]/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#B19A55]">
                Service Areas
              </p>

              <p className="mt-4 leading-8 text-[#1A1A1A]/70">
                Wyckoff · Mahwah · Saddle River · Upper Saddle River ·
                Allendale · Franklin Lakes · Bergen County
              </p>
            </div>

            <div className="border border-[#1A1A1A]/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#B19A55]">
                Client Experience
              </p>

              <p className="mt-4 leading-8 text-[#1A1A1A]/70">
                We respond with thoughtful guidance, not pressure. Tell us where
                you are in the process, and we will help you understand the best
                next step.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-2xl"
        >
          <h2 className="font-serif text-3xl font-bold">
            How can we help?
          </h2>

          <div className="mt-8 grid gap-5">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
              />

              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
              />
            </div>

            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              required
              className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            >
              <option value="">I am interested in...</option>
              <option value="Buying a home">Buying a home</option>
              <option value="Selling a home">Selling a home</option>
              <option value="Relocating to Bergen County">
                Relocating to Bergen County
              </option>
              <option value="Requesting a home valuation">
                Requesting a home valuation
              </option>
              <option value="Speaking with an agent">
                Speaking with an agent
              </option>
            </select>

            <textarea
              rows={6}
              placeholder="Tell us about your goals."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />

            <button
              type="submit"
              className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Submit Inquiry
            </button>

            {status && (
              <p className="text-sm text-[#B19A55]">
                {status}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}