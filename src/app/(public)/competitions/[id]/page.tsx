import { createClient } from "@/lib/supabase/server";
import CompetitionDetailsClient from "./CompetitionDetailsClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.abtournaments.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: comp } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single();

  if (!comp) {
    return {
      title: "Arena Not Found | A&B Tournaments",
      description: "This competition does not exist.",
    };
  }

  const title = `${comp.title} | A&B Tournaments`;
  const description = comp.subtitle || "The ultimate showdown";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/competitions/${id}`,
      siteName: "A&B Tournaments",
      images: [
        {
          url: comp.image || `${APP_URL}/images/ab_tournaments_og.jpg`,
          width: 1200,
          height: 630,
          alt: comp.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [comp.image || `${APP_URL}/images/ab_tournaments_og.jpg`],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <CompetitionDetailsClient id={id} />;
}
