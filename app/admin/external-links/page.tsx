"use client";

import { ExternalLink, Link2, Plus } from "lucide-react";
import { useState } from "react";

const startingLinks = [
  {
    name: "IDX Broker",
    url: "https://www.idxbroker.com",
    category: "MLS / IDX",
  },
  {
    name: "ClearSkies Title Agency",
    url: "https://clearskiestitle.com",
    category: "Title Partner",
  },
  {
    name: "Madison Group Live Site",
    url: "https://madison-group-kappa.vercel.app",
    category: "Platform",
  },
];

export default function ExternalLinksPage() {
  const [links, setLinks] = useState(startingLinks);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  function addLink() {
    if (!name.trim() || !url.trim()) return;

    setLinks([
      {
        name,
        url,
        category: category || "General",
      },
      ...links,
    ]);

    setName("");
    setUrl("");
    setCategory("");
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
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
          >
            <Plus size={15} />
            Add Link
          </button>
        </section>

        <div className="mt-8 grid gap-4">
          {links.map((item) => (
            <div
              key={`${item.name}-${item.url}`}
              className="rounded-[1.5rem] bg-white p-5 shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                    {item.category}
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    {item.name}
                  </h2>

                  <p className="mt-2 break-all text-sm text-[#1A1A1A]/60">
                    {item.url}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#1A1A1A]/10 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]"
                >
                  <ExternalLink size={14} />
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}