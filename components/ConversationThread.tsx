"use client";

import { useEffect, useRef } from "react";

type ConversationMessage = {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
};

type ConversationThreadProps = {
  messages: ConversationMessage[];
};

export function ConversationThread({ messages }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="grid max-h-[560px] gap-4 overflow-y-auto rounded-3xl bg-[#F8F5EF] p-5">
      {messages.length > 0 ? (
        messages.map((message) => {
          const isClient = message.sender_type === "client";

          return (
            <div
              key={message.id}
              className={`flex ${isClient ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-3xl px-5 py-4 ${
                  isClient
                    ? "bg-[#B19A55] text-white"
                    : "bg-white text-[#1A1A1A]"
                }`}
              >
                <p className="text-sm leading-7">{message.message}</p>

                <p
                  className={`mt-2 text-[10px] uppercase tracking-[0.18em] ${
                    isClient ? "text-white/60" : "text-[#1A1A1A]/35"
                  }`}
                >
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="rounded-3xl bg-white p-6 text-sm text-[#1A1A1A]/60">
          No messages yet.
        </p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}