"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/ImageUploader";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    const { data } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAgents(data);
    }
  }

  async function addAgent(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("agents").insert({
      name,
      title,
      email,
      phone,
      photo_url: photoUrl,
      bio,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Agent added successfully.");
    setName("");
    setTitle("");
    setEmail("");
    setPhone("");
    setPhotoUrl("");
    setBio("");
    loadAgents();
  }

  async function deleteAgent(id: string) {
    const confirmed = confirm("Delete this agent?");

    if (!confirmed) return;

    await supabase.from("agents").delete().eq("id", id);

    loadAgents();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN
        </p>

        <h1 className="font-serif text-4xl font-bold">Manage Agents</h1>

        <form
          onSubmit={addAgent}
          className="mt-10 grid gap-5 border border-[#1A1A1A]/10 p-6"
        >
          <input
            type="text"
            placeholder="Agent name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />
          </div>

          <div className="grid gap-3">
            <p className="font-serif text-sm font-bold">Agent Photo</p>

            <ImageUploader onUpload={setPhotoUrl} />

            {photoUrl && (
              <img
                src={photoUrl}
                alt="Agent preview"
                className="h-48 w-48 object-cover"
              />
            )}
          </div>

          <textarea
            placeholder="Bio"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <button
            type="submit"
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Add Agent
          </button>

          {message && <p className="text-sm text-[#B19A55]">{message}</p>}
        </form>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-[#1A1A1A]/10 p-6">
              {agent.photo_url ? (
                <img
                  src={agent.photo_url}
                  alt={agent.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-[#1A1A1A] text-white">
                  No Photo
                </div>
              )}

              <h2 className="mt-5 font-serif text-2xl font-bold">
                {agent.name}
              </h2>

              <p className="mt-1 text-[#B19A55]">{agent.title}</p>

              <p className="mt-4 text-sm text-[#1A1A1A]/70">
                {agent.email}
                <br />
                {agent.phone}
              </p>

              <button
                type="button"
                onClick={() => deleteAgent(agent.id)}
                className="mt-5 w-full border border-red-500 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}