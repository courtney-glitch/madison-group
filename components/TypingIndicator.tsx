"use client";

type TypingIndicatorProps = {
  name?: string;
};

export function TypingIndicator({ name = "Advisor" }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="rounded-3xl bg-white px-5 py-4 text-[#1A1A1A] shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
          {name} is typing
        </p>

        <div className="mt-3 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#B19A55]" />
          <span className="h-2 w-2 rounded-full bg-[#B19A55]/70" />
          <span className="h-2 w-2 rounded-full bg-[#B19A55]/40" />
        </div>
      </div>
    </div>
  );
}