"use client";

import { useState } from "react";
import { Palette, Save } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

export default function BrandingSettingsPage() {
  const [brandName, setBrandName] = useState("Madison Group Properties");
  const [tagline, setTagline] = useState("Building Beautiful Lives");
  const [primaryColor, setPrimaryColor] = useState("#B19A55");
  const [accentColor, setAccentColor] = useState("#F8F5EF");
  const [status, setStatus] = useState("");

  function saveSettings() {
    setStatus("Branding settings saved locally. Database saving can be connected next.");
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Palette size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Brand Control
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Branding Settings
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold">
                Brand Identity
              </h2>

              <div className="mt-6 grid gap-4">
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Brand name"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                />

                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Tagline"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-4 text-sm">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                      Primary Color
                    </span>

                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="mt-3 h-12 w-full"
                    />
                  </label>

                  <label className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-4 text-sm">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                      Accent Color
                    </span>

                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="mt-3 h-12 w-full"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={saveSettings}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Save Branding
                </button>

                {status && (
                  <p className="rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/60">
                    {status}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
                Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                {brandName}
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/65">
                {tagline}
              </p>

              <div
                className="mt-8 rounded-3xl p-5"
                style={{ backgroundColor: accentColor }}
              >
                <p
                  className="font-serif text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  Luxury Brand Preview
                </p>

                <p className="mt-3 text-sm text-[#1A1A1A]/65">
                  This shows how the selected colors may appear across Madison
                  branding sections.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}