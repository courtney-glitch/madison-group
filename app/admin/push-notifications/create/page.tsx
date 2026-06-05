"use client";

import { useState } from "react";
import { BellRing, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CreatePushNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [notificationType, setNotificationType] = useState("advisor_follow_up");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function sendNotification() {
    if (!title.trim() || !message.trim() || !targetUserId.trim()) {
      setStatus("Please enter title, message, and target user ID.");
      return;
    }

    setSaving(true);
    setStatus("");

    const { error } = await supabase.from("notification_events").insert({
      user_id: targetUserId.trim(),
      notification_type: notificationType,
      title: title.trim(),
      body: message.trim(),
      is_read: false,
    });

    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }

    setTitle("");
    setMessage("");
    setTargetUserId("");
    setNotificationType("advisor_follow_up");
    setStatus("Notification created successfully.");
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-6 shadow-xl md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BellRing size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Push Notifications
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Create Notification
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          <input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Target user ID"
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          >
            <option value="advisor_follow_up">Advisor Follow-Up</option>
            <option value="new_message">New Message</option>
            <option value="new_property_match">New Property Match</option>
            <option value="saved_search_alert">Saved Search Alert</option>
            <option value="showing_request">Showing Request</option>
            <option value="hot_buyer">Hot Buyer</option>
          </select>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification message..."
            className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
          />

          <button
            type="button"
            onClick={sendNotification}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            <Send size={15} />
            {saving ? "Sending..." : "Create Notification"}
          </button>
        </div>

        {status && (
          <p className="mt-5 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
            {status}
          </p>
        )}

        <div className="mt-10 rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-5">
          <p className="font-serif text-[11px] uppercase tracking-[0.25em] text-[#B19A55]">
            Live Preview
          </p>

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-serif text-lg font-bold">
              {title || "Notification title"}
            </p>

            <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/65">
              {message || "Your notification preview will appear here."}
            </p>

            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
              Type: {notificationType.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}