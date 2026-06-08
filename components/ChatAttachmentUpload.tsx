"use client";

import { useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function sendAttachment() {
    if (!file || !conversationId) return;

    setUploading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first.");
      setUploading(false);
      return;
    }

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

    const isAdvisor = senderType === "advisor";

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: senderType,
        message: note.trim() || "Shared an attachment.",
        read_by_admin: isAdvisor,
        read_by_agent: isAdvisor,
        read_by_client: !isAdvisor,
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
      .select("client_id, user_id")
      .eq("id", conversationId)
      .maybeSingle();

    const targetUserId = conversation?.client_id || conversation?.user_id;

    if (targetUserId) {
      const template = getPushNotificationTemplate({
        type: "new_message",
      });

      await createNotificationEvent({
        userId: targetUserId,
        notificationType: "new_message",
        title: template.title,
        body: isAdvisor
          ? "Your advisor sent you a new attachment."
          : "A client sent a new attachment.",
        relatedConversationId: conversationId,
      });
    }

    setFile(null);
    setNote("");
    setStatus("");
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onSent) onSent();
  }

  return (
    <div className="rounded-2xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1A1A1A]/10 bg-white text-[#B19A55] shadow-sm transition hover:bg-[#B19A55] hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>
      ) : (
        <div className="rounded-3xl border border-[#B19A55]/20 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-bold text-[#1A1A1A]">
                {file.name}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                Ready to send
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setNote("");
                setStatus("");

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F5EF] text-[#1A1A1A]/50"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>

          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
            className="mt-3 w-full resize-none rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-3 text-sm outline-none"
          />

          <button
            type="button"
            onClick={sendAttachment}
            disabled={uploading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
          >
            <Send size={14} />
            {uploading ? "Uploading..." : "Send Attachment"}
          </button>
        </div>
      )}

      {status && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {status}
        </p>
      )}
    </div>
  );
}