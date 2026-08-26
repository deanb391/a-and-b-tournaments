import Link from "next/link";
import { Image as ImageIcon, Briefcase } from "lucide-react";

export default function CustomisationsPage() {
  const sections = [
    {
      title: "Sponsors",
      description: "Manage tournament sponsors, logos, and links.",
      icon: <Briefcase size={32} />,
      href: "/admin/customisations/sponsors"
    },
    {
      title: "Gallery",
      description: "Manage event photos and gallery items.",
      icon: <ImageIcon size={32} />,
      href: "/admin/customisations/gallery"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase text-navy">Customisations</h1>
        <p className="text-navy/60 font-bold">Manage public-facing website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <Link href={section.href} key={i}>
            <div className="bg-white border-4 border-navy p-6 shadow-[6px_6px_0px_#0A192F] hover:shadow-[2px_2px_0px_#0A192F] hover:translate-y-1 transition-all cursor-pointer h-full group">
              <div className="flex items-center gap-4 mb-4 text-navy group-hover:text-red transition-colors">
                {section.icon}
                <h3 className="text-2xl font-black uppercase">{section.title}</h3>
              </div>
              <p className="font-bold text-navy/70 text-sm">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
