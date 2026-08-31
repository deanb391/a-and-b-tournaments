"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCompetition() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("ESports");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("REGISTRATION OPEN");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [entryFee, setEntryFee] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("An image is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload to local proxy which forwards to ED Library
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "tournaments");
      uploadFormData.append("type", "image");

      const uploadRes = await fetch(`/api/upload`, {
        method: "POST",
        body: uploadFormData,
        credentials: "include",
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Failed to upload image: ${uploadRes.status} ${errText}`);
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      if (!imageUrl) {
        throw new Error("Did not receive URL from image upload");
      }

      // 2. Create competition in database
      const compRes = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          date,
          location,
          status,
          whatsapp_link: whatsappLink || null,
          image: imageUrl,
          entry_fee: parseFloat(entryFee) || 0
        }),
      });

      if (!compRes.ok) {
        const errorData = await compRes.json();
        throw new Error(errorData.error || "Failed to create competition");
      }

      // Success
      router.push("/admin/competitions");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/competitions"
          className="p-2 border border-navy/15 rounded-sm hover:bg-navy hover:text-offwhite transition-all text-navy/50"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-navy">Create Competition</h1>
          <p className="text-navy/40 font-medium text-sm mt-0.5">Add a new tournament to the platform.</p>
        </div>
      </div>

      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] p-6 md:p-8">
        {error && (
          <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Esports Championship"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Subtitle</label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. The biggest Valorant tournament of the year"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors appearance-none"
              >
                <option value="ESports">ESports</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Chess">Chess</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors appearance-none"
              >
                <option value="REGISTRATION OPEN">REGISTRATION OPEN</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Date</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 15-20, 2026"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tech Hub Arena & Online"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">WhatsApp Group Link</label>
              <input
                type="url"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="input-field"
              />
              <p className="text-[10px] text-navy/35 font-medium">Must start with https://chat.whatsapp.com/</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Entry Fee (NGN) — 0 for Free</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="0"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Competition Image</label>
            <div className="border border-dashed border-navy/20 bg-offwhite/50 rounded-sm p-8 flex flex-col items-center justify-center relative cursor-pointer hover:border-red transition-colors overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 object-contain rounded-sm mb-3" />
              ) : (
                <Upload size={28} className="text-navy/30 mb-3" />
              )}
              <p className="font-bold text-navy/60 text-sm text-center">
                {file ? file.name : "Click or drag to upload"}
              </p>
              <p className="text-xs text-navy/35 text-center mt-1">JPG, PNG or WEBP — Max 5MB</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 font-black uppercase tracking-widest text-sm bg-navy text-offwhite rounded-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,25,47,0.25)] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? "Creating..." : "Create Competition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
