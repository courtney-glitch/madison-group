"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Link2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ExternalLinkItem = {
  id: string;
  name: string;
  url: string;
  category: string | null;
  created_at: string;
};

export default function ExternalLinksPage() {
  const [links, setLinks] = useState<ExternalLinkItem[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("external_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setLinks((data || []) as ExternalLinkItem[]);
    }

    setLoading(false);
  }

  async function addLink() {
    if (!name.trim() || !url.trim()) return;

    setSaving(true);

    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;

    const { error } = await supabase.from("external_links").insert({
      name: name.trim(),
      url: cleanUrl,
      category: category.trim() || "General",
    });

    if (!error) {
      setName("");
      setUrl("");
      setCategory("");
      await loadLinks();
    }

    setSaving(false);
  }

  async function deleteLink(id: string) {
    await supabase.from("external_links").delete().eq("id", id);
    await loadLinks();
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Link2 size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Agent View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              External Links
            </h1>
          </div>
        </div>

        <section className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">Add New Link</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Link name"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
            />
          </div>

          <button
            type="button"
            onClick={addLink}
            disabled={saving || !name.trim() || !url.trim()}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            <Plus size={15} />
            {saving ? "Saving..." : "Add Link"}
          </button>
        </section>

        <div className="mt-8 grid gap-4">
          {loading ? (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              Loading external links...
            </p>
          ) : links.length > 0 ? (
            links.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] bg-white p-5 shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                      {item.category || "General"}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-2 break-all text-sm text-[#1A1A1A]/60">
                      {item.url}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={item.url}
                      target="_blank"
                      className="flex items-center justify-center gap-2 rounded-full border border-[#1A1A1A]/10 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]"
                    >
                      <ExternalLink size={14} />
                      Open
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteLink(item.id)}
                      className="flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white p-6 text-sm text-[#1A1A1A]/60 shadow-xl">
              No external links saved yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}