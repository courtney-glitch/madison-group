"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SearchSetting = {
  id: string;
  default_city: string | null;
  min_price: string | null;
  max_price: string | null;
  property_type: string | null;
};

export default function SearchSettingsPage() {
  const [settingId, setSettingId] = useState("");
  const [defaultCity, setDefaultCity] = useState("Bergen County");
  const [minPrice, setMinPrice] = useState("500000");
  const [maxPrice, setMaxPrice] = useState("2000000");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data } = await supabase
      .from("search_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const setting = data as SearchSetting;

      setSettingId(setting.id);
      setDefaultCity(setting.default_city || "Bergen County");
      setMinPrice(setting.min_price || "500000");
      setMaxPrice(setting.max_price || "2000000");
      setPropertyType(setting.property_type || "Single Family");
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);

    if (settingId) {
      await supabase
        .from("search_settings")
        .update({
          default_city: defaultCity,
          min_price: minPrice,
          max_price: maxPrice,
          property_type: propertyType,
        })
        .eq("id", settingId);
    } else {
      const { data } = await supabase
        .from("search_settings")
        .insert({
          default_city: defaultCity,
          min_price: minPrice,
          max_price: maxPrice,
          property_type: propertyType,
        })
        .select()
        .single();

      if (data) {
        setSettingId(data.id);
      }
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <SlidersHorizontal size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Agent View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Search Settings
            </h1>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 rounded-3xl bg-[#F8F5EF] p-5 text-sm text-[#1A1A1A]/60">
            Loading search settings...
          </p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Input
                label="Default Market"
                value={defaultCity}
                onChange={setDefaultCity}
              />

              <Input
                label="Minimum Price"
                value={minPrice}
                onChange={setMinPrice}
              />

              <Input
                label="Maximum Price"
                value={maxPrice}
                onChange={setMaxPrice}
              />

              <Input
                label="Property Type"
                value={propertyType}
                onChange={setPropertyType}
              />
            </div>

            <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-5">
              <div className="flex items-center gap-2 text-[#B19A55]">
                <Search size={16} />

                <p className="font-serif text-sm font-bold">
                  Current Default Search
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
                {defaultCity} homes from ${Number(minPrice || 0).toLocaleString()} to $
                {Number(maxPrice || 0).toLocaleString()} · {propertyType}
              </p>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="mt-8 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Search Settings"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
      />
    </label>
  );
}