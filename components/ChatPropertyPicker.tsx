"use client";

import { useEffect, useState } from "react";
import { Home, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ChatPropertyPickerProps = {
  conversationId: string;
  senderType: "advisor" | "client";
  onSent?: () => void;
};

type PropertyItem = {
  id: string;
  title: string;
  city: string;
  price: string;
  image: string;
  status?: string;
};

export function ChatPropertyPicker({
  conversationId,
  senderType,
  onSent,
}: ChatPropertyPickerProps) {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const { data } = await supabase
      .from("properties")
      .select("id, title, city, price, image, status")
      .order("created_at", { ascending: false })
      .limit(20);

    setProperties(data || []);
  }

  async function sendPropertyCard() {
    if (!selectedPropertyId || !conversationId) return;

    setSending(true);
    setStatus("");

    const selectedProperty = properties.find(
      (property) => property.id === selectedPropertyId
    );

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        message: note.trim()
          ? note.trim()
          : `Shared property: ${selectedProperty?.title || "Property"}`,
        read_by_admin: senderType === "advisor",
        read_by_client: senderType === "client",
      })
      .select()
      .single();

    if (messageError || !message) {
      setStatus(messageError?.message || "Unable to send property.");
      setSending(false);
      return;
    }

    const { error: propertyError } = await supabase
      .from("message_properties")
      .insert({
        message_id: message.id,
        property_id: selectedPropertyId,
      });

    if (propertyError) {
      setStatus(propertyError.message);
      setSending(false);
      return;
    }

    setSelectedPropertyId("");
    setNote("");
    setStatus("Property sent.");
    setSending(false);

    if (onSent) onSent();
  }

  return (
    <div className="mt-4 rounded-3xl bg-white p-4">
      <div className="flex items-center gap-2">
        <Home size={16} className="text-[#B19A55]" />

        <p className="font-serif text-sm font-bold">Attach Property Card</p>
      </div>

      <div className="mt-4 grid gap-3">
        <select
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none"
        >
          <option value="">Select a property</option>

          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.title} — {property.city} — {property.price}
            </option>
          ))}
        </select>

        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional message with this property..."
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none"
        />

        <button
          type="button"
          onClick={sendPropertyCard}
          disabled={sending || !selectedPropertyId}
          className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
        >
          <Send size={14} />
          {sending ? "Sending..." : "Send Property"}
        </button>
      </div>

      {status && (
        <p className="mt-3 text-sm text-[#1A1A1A]/60">{status}</p>
      )}
    </div>
  );
}