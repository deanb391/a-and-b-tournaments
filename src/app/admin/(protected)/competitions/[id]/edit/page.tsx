"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function EditCompetition({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("ESports");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("REGISTRATION OPEN");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [entryFee, setEntryFee] = useState("0");

  const [existingImage, setExistingImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const comp = await apiClient.competitions.getById(id);
        setTitle(comp.title);
        setSubtitle(comp.subtitle || "");
        setCategory(comp.category);
        setDate(comp.date);
        setLocation(comp.location);
        setStatus(comp.status);
        setWhatsappLink(comp.whatsapp_link || "");
        setEntryFee(comp.entry_fee ? comp.entry_fee.toString() : "0");
        setExistingImage(comp.image || "");
      } catch (err: any) {
        setError(err.message || "Failed to load competition");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompetition();
  }, [id]);

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
    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = existingImage;

      // Only upload new image if file is selected
      if (file) {
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
        imageUrl = uploadData.url;

        if (!imageUrl) {
          throw new Error("Did not receive URL from image upload");
        }
      }

      await apiClient.competitions.update(id, {
        title,
        subtitle,
        category,
        date,
        location,
        status,
        whatsapp_link: whatsappLink || null,
        image: imageUrl,
        entry_fee: parseFloat(entryFee) || 0
      });

      router.push(`/admin/competitions/${id}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse" style={{ marginBottom: 70 }}>
        <div className="skeleton h-8 w-48 rounded-sm" />
        <div className="skeleton h-96 w-full rounded-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/competitions/${id}`}
          className="p-2 border border-navy/15 rounded-sm hover:bg-navy hover:text-offwhite transition-all text-navy/50"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-navy">Edit Competition</h1>
          <p className="text-navy/40 font-medium text-sm mt-0.5">Update tournament details.</p>
        </div>
      </div>

      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] p-6 md:p-8">
        {error && (
          <div className="bg-red/8 border-l-4 border-red text-red p-4 mb-6 font-bold text-sm rounded-sm">
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
                className="input-field"
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
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field appearance-none"
              >
                <option value="ESports">ESports</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Chess">Chess</option>
                <option value="Hackathon">Hackathon</option>
                <option value="STEM">STEM</option>
                <option value="Creative">Creative</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field appearance-none"
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
                className="input-field"
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
                className="input-field"
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
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-navy/55 uppercase tracking-wider">Competition Image</label>
            
            {existingImage && !file && (
              <div className="mb-4 flex items-center gap-4 p-4 border border-navy/10 rounded-sm bg-navy/[0.02]">
                <img src={existingImage} alt="Current" className="w-24 h-16 object-cover rounded-sm border border-navy/10" />
                <div>
                  <p className="text-xs font-bold text-navy/60 uppercase tracking-wider">Current Image</p>
                  <p className="text-xs text-navy/40">Upload a new file below to replace it.</p>
                </div>
              </div>
            )}

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
                {file ? file.name : "Click or drag to upload new image"}
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
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
