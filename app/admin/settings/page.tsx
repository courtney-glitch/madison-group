"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [notificationEmail, setNotificationEmail] =
    useState("");

  const [settingsId, setSettingsId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setSettingsId(data.id);
      setCompanyName(data.company_name || "");
      setNotificationEmail(
        data.notification_email || ""
      );
    }
  }

  async function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!settingsId) {
      setMessage("Settings record missing.");
      return;
    }

    const { error } = await supabase
      .from("settings")
      .update({
        company_name: companyName,
        notification_email: notificationEmail,
      })
      .eq("id", settingsId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Settings updated.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-3xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN
        </p>

        <h1 className="font-serif text-4xl font-bold">
          Company Settings
        </h1>

        <form
          onSubmit={handleSave}
          className="mt-10 grid gap-5"
        >
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <input
            type="email"
            placeholder="Notification Email"
            value={notificationEmail}
            onChange={(e) =>
              setNotificationEmail(e.target.value)
            }
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <button
            type="submit"
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Save Settings
          </button>

          {message && (
            <p className="text-sm text-[#B19A55]">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}