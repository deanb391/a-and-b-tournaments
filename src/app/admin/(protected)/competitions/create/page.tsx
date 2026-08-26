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
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
          image: imageUrl
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/competitions"
          className="p-2 border-2 border-navy hover:bg-navy hover:text-offwhite transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-navy">Create Competition</h1>
          <p className="text-navy/60 font-medium">Add a new tournament to the platform.</p>
        </div>
      </div>

      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] p-8">
        {error && (
          <div className="bg-red/10 border-l-4 border-red text-red p-4 mb-8 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Esports Championship"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Subtitle</label>
              <input 
                type="text"
                required 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. The biggest Valorant tournament of the year"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Category</label>
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

            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Status</label>
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

            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Date</label>
              <input 
                type="text" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 15-20, 2026"
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">Location</label>
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
            <div className="space-y-2">
              <label className="block text-sm font-pixel text-navy">WhatsApp Group Link</label>
              <input 
                type="url" 
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full bg-offwhite border-2 border-navy/20 px-4 py-3 font-medium text-navy focus:outline-none focus:border-red transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-pixel text-navy">Competition Image</label>
            <div className="border-2 border-dashed border-navy/30 bg-offwhite p-8 flex flex-col items-center justify-center relative cursor-pointer hover:border-red transition-colors">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload size={32} className="text-navy/50 mb-4" />
              <p className="font-bold text-navy text-center mb-1">
                {file ? file.name : "Click or drag to upload"}
              </p>
              <p className="text-sm text-navy/50 text-center">
                JPG, PNG or WEBP (Max 5MB)
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-black uppercase tracking-widest text-lg transition-all border-2 border-navy flex items-center justify-center ${
                isSubmitting 
                  ? 'bg-navy/80 text-white cursor-not-allowed' 
                  : 'bg-navy text-offwhite hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A192F]'
              }`}
            >
              {isSubmitting ? 'CREATING...' : 'CREATE COMPETITION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
