"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const data = await apiClient.gallery.get(50, 0);
      setGallery(data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await apiClient.gallery.delete(id);
      setGallery(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      alert("Failed to delete gallery item");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-navy">Gallery</h1>
          <p className="text-navy/60 font-bold">Manage tournament gallery images.</p>
        </div>
        <Link
          href="/admin/customisations/gallery/create"
          className="bg-red text-offwhite font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 border-2 border-red hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all"
        >
          <Plus size={20} /> Add Image
        </Link>
      </div>

      <div className="bg-white border-4 border-navy shadow-[6px_6px_0px_#0A192F]">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-4 border-navy bg-navy/5">
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Image</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Name</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center font-bold text-navy">Loading...</td>
                </tr>
              ) : gallery.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center font-bold text-navy/50">No images found.</td>
                </tr>
              ) : (
                gallery.map(item => (
                  <tr key={item.id} className="border-b-2 border-navy/10 hover:bg-navy/5">
                    <td className="p-4 w-32">
                      <div className="w-24 h-16 bg-navy/10 relative border-2 border-navy overflow-hidden">
                        <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-black text-navy">{item.name}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/customisations/gallery/${item.id}/edit`}
                        className="p-2 text-navy hover:text-red bg-offwhite border-2 border-navy/20 inline-block transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-navy hover:text-red bg-offwhite border-2 border-navy/20 inline-block transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
