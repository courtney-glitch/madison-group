"use client";

import { useState } from "react";
import { ImageUp, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createNotificationEvent } from "@/lib/createNotificationEvent";
import { getPushNotificationTemplate } from "@/lib/pushNotificationTemplates";

type ChatAttachmentUploadProps = {
  conversationId: string;
  senderType: "advisor" | "client";
  onSent?: () => void;
};

export function ChatAttachmentUpload({
  conversationId,
  senderType,
  onSent,
}: ChatAttachmentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function sendAttachment() {
    if (!file || !conversationId) return;

    setUploading(true);
    setStatus("");

    const filePath = `${conversationId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("message-attachments")
      .upload(filePath, file);

    if (uploadError) {
      setStatus(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("message-attachments")
      .getPublicUrl(filePath);

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        message: note.trim() || "Shared an attachment.",
        read_by_admin: senderType === "advisor",
        read_by_client: senderType === "client",
      })
      .select()
      .single();

    if (messageError || !message) {
      setStatus(messageError?.message || "Unable to send attachment.");
      setUploading(false);
      return;
    }

    const { error: attachmentError } = await supabase
      .from("message_attachments")
      .insert({
        message_id: message.id,
        file_url: publicUrlData.publicUrl,
        file_name: file.name,
        file_type: file.type,
      });

    if (attachmentError) {
      setStatus(attachmentError.message);
      setUploading(false);
      return;
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (conversation?.user_id) {
      const template = getPushNotificationTemplate({
        type: "new_message",
      });

      await createNotificationEvent({
        userId: conversation.user_id,
        notificationType: "new_message",
        title: template.title,
        body:
          senderType === "advisor"
            ? "Your advisor sent you a new attachment."
            : "A client sent a new attachment.",
        relatedConversationId: conversationId,
      });
    }

    setFile(null);
    setNote("");
    setStatus("Attachment sent.");
    setUploading(false);

    if (onSent) onSent();
  }

  return (
    <div className="mt-4 rounded-3xl bg-white p-4">
      <div className="flex items-center gap-2">
        <ImageUp size={16} className="text-[#B19A55]" />

        <p className="font-serif text-sm font-bold">
          Attach Photo or File
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm"
        />

        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note with this attachment..."
          className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none"
        />

        <button
          type="button"
          onClick={sendAttachment}
          disabled={uploading || !file}
          className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
        >
          <Send size={14} />
          {uploading ? "Uploading..." : "Send Attachment"}
        </button>
      </div>

      {status && (
        <p className="mt-3 text-sm text-[#1A1A1A]/60">
          {status}
        </p>
      )}
    </div>
  );
}