"use client";

import {
  BookOpen,
  GraduationCap,
  Home,
  Search,
} from "lucide-react";

const lessons = [
  {
    title: "How Pre-Approval Works",
    description:
      "Understand financing, lender requirements, and buying power.",
  },
  {
    title: "How To Win Multiple Offers",
    description:
      "Strategies for competing in luxury and fast-moving markets.",
  },
  {
    title: "Understanding Closing Costs",
    description:
      "Learn what buyers should expect before closing day.",
  },
];

export default function EducationPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <GraduationCap size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Client View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Buyer Education
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.title}
              className="rounded-[1.5rem] bg-white p-6 shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                <BookOpen size={24} />
              </div>

              <h2 className="mt-6 font-serif text-2xl font-bold">
                {lesson.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
                {lesson.description}
              </p>

              <button className="mt-6 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] uppercase tracking-[0.2em] text-white">
                Open Lesson
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}