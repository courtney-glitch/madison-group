"use client";

import { useState } from "react";
import { ExternalLink, Link2, Plus, Save, Trash2 } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

type ResourceLink = {
  title: string;
  url: string;
  category: string;
};

export default function ExternalLinksSettingsPage() {
  const [links, setLinks] = useState<ResourceLink[]>([
    {
      title: "IDX Broker Dashboard",
      url: "https://idxbroker.com",
      category: "IDX",
    },
    {
      title: "Madison Main Website",
      url: "https://madisongroupproperties.com",
      category: "Website",
    },
  ]);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  function addLink() {
    if (!title.trim() || !url.trim() || !category.trim()) return;

    setLinks([
      ...links,
      {
        title: title.trim(),
        url: url.trim(),
        category: category.trim(),
      },
    ]);

    setTitle("");
    setUrl("");
    setCategory("");
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  function saveLinks() {
    setStatus("External links saved locally. Database saving can be connected next.");
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
                {links.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
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
                        onClick={() => removeLink(index)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1A1A1A]/50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
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
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Plus size={15} />
                  Add Link
                </button>

                <button
                  type="button"
                  onClick={saveLinks}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Save External Links
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
                {links.map((item, index) => (
                  <a
                    key={`preview-${index}`}
                    href={item.url}
                    target="_blank"
                    className="flex items-center justify-between gap-4 rounded-3xl bg-white/10 p-4 text-white"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                        {item.category}
                      </p>

                      <p className="mt-2 font-serif text-lg font-bold">
                        {item.title}
                      </p>
                    </div>

                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}