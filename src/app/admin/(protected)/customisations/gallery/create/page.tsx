"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function CreateGalleryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const data = await response.json();
        setFormData({ ...formData, image: data.url });
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(error.message || "Failed to upload image.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.image) {
        alert("Please upload an image.");
        setIsSubmitting(false);
        return;
      }
      
      await apiClient.gallery.create(formData);
      router.push("/admin/customisations/gallery");
    } catch (error) {
      console.error("Failed to create gallery item:", error);
      alert("Failed to create gallery item");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/customisations/gallery"
          className="p-3 bg-white border-4 border-navy shadow-[4px_4px_0px_#0A192F] hover:translate-y-1 hover:shadow-[2px_2px_0px_#0A192F] transition-all text-navy"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase text-navy">Add Gallery Image</h1>
          <p className="text-navy/60 font-bold">Upload a new event photo to the gallery.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] p-8 space-y-6">
        <div>
          <label className="block font-black text-navy uppercase tracking-wider mb-2">Image Title</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-offwhite border-4 border-navy p-4 font-bold text-navy focus:outline-none focus:bg-white transition-colors"
            placeholder="e.g., Main Event Crowd"
          />
        </div>

        <div>
          <label className="block font-black text-navy uppercase tracking-wider mb-2">Photo</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="w-full bg-offwhite border-4 border-navy p-4 font-bold text-navy focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-2 file:border-navy file:bg-navy file:text-offwhite file:font-bold hover:file:bg-navy/90"
          />
          {formData.image && (
            <div className="mt-4 w-full h-48 bg-navy/5 border-2 border-navy relative overflow-hidden">
              <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red text-offwhite font-black uppercase tracking-widest py-4 border-4 border-navy shadow-[4px_4px_0px_#0A192F] hover:translate-y-1 hover:shadow-[2px_2px_0px_#0A192F] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Uploading..." : <><Save size={20} /> Add to Gallery</>}
        </button>
      </form>
    </div>
  );
}
