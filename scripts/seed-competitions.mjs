import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local")
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const seedCompetitions = async () => {
  console.log("Seeding competitions...")

  const initialCompetitions = [
    {
      title: "Summer Esports Championship",
      subtitle: "The biggest Valorant tournament of the year",
      category: "ESports",
      date: "October 15-20, 2026",
      location: "Tech Hub Arena & Online",
      status: "REGISTRATION OPEN",
      image: "/assets/comp_esports_1787587002448.jpg"
    },
    {
      title: "University Football League",
      subtitle: "Inter-departmental 11-a-side football tournament",
      category: "Football",
      date: "November 5-25, 2026",
      location: "Main Campus Stadium",
      status: "UPCOMING",
      image: "/assets/comp_football_1787587027823.jpg"
    },
    {
      title: "Grandmaster Chess Open",
      subtitle: "Standard time control tournament for all ratings",
      category: "Chess",
      date: "September 30, 2026",
      location: "Student Union Hall",
      status: "COMPLETED",
      image: "/assets/comp_chess_1787587041151.jpg"
    },
    {
      title: "3v3 Basketball Clash",
      subtitle: "Fast-paced half-court basketball tournament",
      category: "Basketball",
      date: "December 10-12, 2026",
      location: "Indoor Sports Complex",
      status: "REGISTRATION OPEN",
      image: "/assets/comp_basketball_1787587055645.jpg"
    },
    {
      title: "CodeHack 2026",
      subtitle: "48-hour competitive programming and build marathon",
      category: "Hackathon",
      date: "January 15-17, 2027",
      location: "Innovation Center",
      status: "UPCOMING",
      image: "/assets/comp_hackathon_1787587065190.jpg"
    }
  ];

  // Attempt insert
  const { error } = await supabaseAdmin
    .from('competitions')
    .insert(initialCompetitions)

  if (error) {
    console.error(`
      Error inserting into public.competitions. 
      Please ensure you have created the competitions table in your Supabase SQL editor:
      
      create table if not exists public.competitions (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        subtitle text,
        category text not null,
        date text not null,
        location text not null,
        status text not null,
        image text not null,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
    `)
    console.error("Detailed error:", error.message)
  } else {
    console.log("✅ Competitions seeded successfully!")
  }
}

seedCompetitions()
