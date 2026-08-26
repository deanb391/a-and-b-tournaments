import Hero from "@/components/Hero";
import FeaturedCompetitions from "@/components/FeaturedCompetitions";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import GallerySection from "@/components/GallerySection";
import PartnersSection from "@/components/PartnersSection";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.abtournaments.com";

export const metadata = {
  title: "A&B Tournaments",
  description: "Discover, register, and compete in the ultimate esports, sports, and hackathon events.",
  openGraph: {
    title: "A&B Tournaments | Let's Compete",
    description: "Discover, register, and compete in the ultimate esports, sports, and hackathon events.",
    url: APP_URL,
    siteName: "A&B Tournaments",
    images: [
      {
        url: `${APP_URL}/images/ab_tournaments_og.jpg`,
        width: 1200,
        height: 630,
        alt: "A&B Tournaments Promotional Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A&B Tournaments | Let's Compete",
    description: "Discover, register, and compete in the ultimate esports, sports, and hackathon events.",
    images: [`${APP_URL}/images/ab_tournaments_og.jpg`],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCompetitions />
      <Categories />
      <HowItWorks />
      <GallerySection />
      <PartnersSection />
    </>
  );
}
