"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Search, SlidersHorizontal } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type SearchSettings = {
  defaultCity: string;
  defaultMinPrice: string;
  defaultMaxPrice: string;
  showSold: boolean;
  showPending: boolean;
  showFeaturedFirst: boolean;
};

const defaultSettings: SearchSettings = {
  defaultCity: "Bergen County",
  defaultMinPrice: "500000",
  defaultMaxPrice: "2500000",
  showSold: true,
  showPending: true,
  showFeaturedFirst: true,
};

export default function SearchSettingsPage() {
  const [defaultCity, setDefaultCity] = useState(defaultSettings.defaultCity);
  const [defaultMinPrice, setDefaultMinPrice] = useState(defaultSettings.defaultMinPrice);
  const [defaultMaxPrice, setDefaultMaxPrice] = useState(defaultSettings.defaultMaxPrice);
  const [showSold, setShowSold] = useState(defaultSettings.showSold);
  const [showPending, setShowPending] = useState(defaultSettings.showPending);
  const [showFeaturedFirst, setShowFeaturedFirst] = useState(defaultSettings.showFeaturedFirst);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("app_settings")
      .select("setting_value")
      .eq("setting_key", "search_settings")
      .maybeSingle();

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    const saved = data?.setting_value as Partial<SearchSettings> | null;

    if (saved) {
      setDefaultCity(saved.defaultCity || defaultSettings.defaultCity);
      setDefaultMinPrice(saved.defaultMinPrice || defaultSettings.defaultMinPrice);
      setDefaultMaxPrice(saved.defaultMaxPrice || defaultSettings.defaultMaxPrice);
      setShowSold(saved.showSold ?? defaultSettings.showSold);
      setShowPending(saved.showPending ?? defaultSettings.showPending);
      setShowFeaturedFirst(saved.showFeaturedFirst ?? defaultSettings.showFeaturedFirst);
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setStatus("");

    const { error } = await supabase.from("app_settings").upsert(
      {
        setting_key: "search_settings",
        setting_value: {
          defaultCity,
          defaultMinPrice,
          defaultMaxPrice,
          showSold,
          showPending,
          showFeaturedFirst,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" }
    );

    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }

    setStatus("Search settings saved successfully.");
    setSaving(false);
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Search size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Property Search Control
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Search Settings
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[2rem] bg-white p-8 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading search settings...
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
              <section className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#B19A55]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Default Search Rules
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  <input
                    value={defaultCity}
                    onChange={(e) => setDefaultCity(e.target.value)}
                    placeholder="Default area"
                    className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={defaultMinPrice}
                      onChange={(e) => setDefaultMinPrice(e.target.value)}
                      placeholder="Default min price"
                      className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                    />

                    <input
                      value={defaultMaxPrice}
                      onChange={(e) => setDefaultMaxPrice(e.target.value)}
                      placeholder="Default max price"
                      className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                    />
                  </div>

                  <label className="flex items-center justify-between rounded-2xl bg-[#F8F5EF] px-4 py-4 text-sm">
                    Show sold properties
                    <input
                      type="checkbox"
                      checked={showSold}
                      onChange={(e) => setShowSold(e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl bg-[#F8F5EF] px-4 py-4 text-sm">
                    Show pending properties
                    <input
                      type="checkbox"
                      checked={showPending}
                      onChange={(e) => setShowPending(e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl bg-[#F8F5EF] px-4 py-4 text-sm">
                    Prioritize featured listings
                    <input
                      type="checkbox"
                      checked={showFeaturedFirst}
                      onChange={(e) => setShowFeaturedFirst(e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? "Saving..." : "Save Search Settings"}
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
                  Search Preview
                </p>

                <h2 className="mt-5 font-serif text-4xl font-bold">
                  {defaultCity}
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  Default buyer search experience preview.
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                      Price Range
                    </p>

                    <p className="mt-2 font-serif text-xl font-bold">
                      ${Number(defaultMinPrice || 0).toLocaleString()} - $
                      {Number(defaultMaxPrice || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                      Visibility
                    </p>

                    <p className="mt-2 text-sm text-white/75">
                      {showSold ? "Sold shown" : "Sold hidden"} ·{" "}
                      {showPending ? "Pending shown" : "Pending hidden"} ·{" "}
                      {showFeaturedFirst ? "Featured first" : "Default sorting"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </section>
      </main>
    </AdminPageShell>
  );
}