"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function AdminSponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSponsors = async () => {
    try {
      const data = await apiClient.sponsors.get(50, 0);
      setSponsors(data);
    } catch (error) {
      console.error("Failed to fetch sponsors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;
    try {
      await apiClient.sponsors.delete(id);
      setSponsors(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
      alert("Failed to delete sponsor");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase text-navy">Sponsors</h1>
          <p className="text-navy/60 font-bold">Manage tournament sponsors.</p>
        </div>
        <Link
          href="/admin/customisations/sponsors/create"
          className="bg-red text-offwhite font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 border-2 border-red hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0A192F] transition-all"
        >
          <Plus size={20} /> Add Sponsor
        </Link>
      </div>

      <div className="bg-white border-4 border-navy shadow-[6px_6px_0px_#0A192F]">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-4 border-navy bg-navy/5">
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Logo</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Name</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Link</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-bold text-navy">Loading...</td>
                </tr>
              ) : sponsors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-bold text-navy/50">No sponsors found.</td>
                </tr>
              ) : (
                sponsors.map(sponsor => (
                  <tr key={sponsor.id} className="border-b-2 border-navy/10 hover:bg-navy/5">
                    <td className="p-4 w-24">
                      <div className="w-16 h-12 bg-navy/10 relative border-2 border-navy overflow-hidden">
                        <img src={sponsor.image} alt={sponsor.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-black text-navy">{sponsor.name}</td>
                    <td className="p-4 text-navy/70"><a href={sponsor.link} target="_blank" rel="noreferrer" className="hover:underline">{sponsor.link}</a></td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/customisations/sponsors/${sponsor.id}/edit`}
                        className="p-2 text-navy hover:text-red bg-offwhite border-2 border-navy/20 inline-block transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
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
