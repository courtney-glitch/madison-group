"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";
import { supabase } from "@/lib/supabase";

type ResourceLink = {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at?: string;
};

export default function ExternalLinksSettingsPage() {
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase
      .from("external_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setLinks((data || []) as ResourceLink[]);
    setLoading(false);
  }

  async function addLink() {
    if (!title.trim() || !url.trim() || !category.trim()) {
      setStatus("Please add title, URL, and category.");
      return;
    }

    setAdding(true);
    setStatus("");

    const finalUrl =
      url.trim().startsWith("http://") || url.trim().startsWith("https://")
        ? url.trim()
        : `https://${url.trim()}`;

    const { error } = await supabase.from("external_links").insert({
      title: title.trim(),
      url: finalUrl,
      category: category.trim(),
    });

    if (error) {
      setStatus(error.message);
      setAdding(false);
      return;
    }

    setTitle("");
    setUrl("");
    setCategory("");
    setStatus("External link added successfully.");
    setAdding(false);
    await loadLinks();
  }

  async function removeLink(id: string) {
    const { error } = await supabase
      .from("external_links")
      .delete()
      .eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("External link removed successfully.");
    await loadLinks();
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Link2 size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Resource Control
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                External Links
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold">
                Platform Resources
              </h2>

              <div className="mt-6 grid gap-3">
                {loading ? (
                  <p className="rounded-3xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    Loading links...
                  </p>
                ) : links.length > 0 ? (
                  links.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-[#F8F5EF] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-serif text-lg font-bold">
                            {item.title}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                            {item.category}
                          </p>

                          <p className="mt-2 truncate text-sm text-[#1A1A1A]/55">
                            {item.url}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLink(item.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1A1A1A]/50 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-3xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                    No external links yet. Add your first resource.
                  </p>
                )}
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Link title"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                />

                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="URL"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                />

                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={addLink}
                  disabled={adding}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  {adding ? "Adding..." : "Add Link"}
                </button>

                <button
                  type="button"
                  onClick={loadLinks}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Refresh Links
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
                Quick Access Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                Resource Library
              </h2>

              <div className="mt-8 grid gap-3">
                {links.length > 0 ? (
                  links.map((item) => (
                    <a
                      key={`preview-${item.id}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 rounded-3xl bg-white/10 p-4 text-white"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                          {item.category}
                        </p>

                        <p className="mt-2 truncate font-serif text-lg font-bold">
                          {item.title}
                        </p>
                      </div>

                      <ExternalLink size={16} />
                    </a>
                  ))
                ) : (
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-sm text-white/65">
                      No links available yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}