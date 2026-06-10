"use client";

import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

const defaultModules = [
  {
    title: "Understanding Mortgage Basics",
    category: "Financing",
  },
  {
    title: "Preparing For Home Tours",
    category: "Buyer Education",
  },
  {
    title: "How Closing Costs Work",
    category: "Closing",
  },
];

export default function CustomizeLearnPage() {
  const [modules, setModules] = useState(defaultModules);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");

  function addModule() {
    if (!title.trim() || !category.trim()) return;

    setModules([
      ...modules,
      {
        title: title.trim(),
        category: category.trim(),
      },
    ]);

    setTitle("");
    setCategory("");
  }

  function removeModule(index: number) {
    setModules(modules.filter((_, itemIndex) => itemIndex !== index));
  }

  function saveModules() {
    setStatus(
      "Learning modules saved locally. Database connection can be added next."
    );
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <GraduationCap size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Education Control
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Customize Learn
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#B19A55]" />

                <h2 className="font-serif text-2xl font-bold">
                  Learning Modules
                </h2>
              </div>

              <div className="mt-6 grid gap-3">
                {modules.map((module, index) => (
                  <div
                    key={`${module.title}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-3xl bg-[#F8F5EF] p-4"
                  >
                    <div>
                      <p className="font-serif text-lg font-bold">
                        {module.title}
                      </p>

                      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                        {module.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1A1A]/50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Module title"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                />

                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                />

                <button
                  type="button"
                  onClick={addModule}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Plus size={15} />
                  Add Module
                </button>

                <button
                  type="button"
                  onClick={saveModules}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  <Save size={15} />
                  Save Learning Center
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
                Client Experience Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                Madison Learning Center
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Buyers can access personalized educational content directly
                inside the platform.
              </p>

              <div className="mt-8 grid gap-3">
                {modules.map((module, index) => (
                  <div
                    key={`preview-${module.title}-${index}`}
                    className="rounded-3xl bg-white/10 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                      {module.category}
                    </p>

                    <p className="mt-2 font-serif text-lg font-bold text-white">
                      {module.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}