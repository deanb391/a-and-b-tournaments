import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { competitionService } from "@/services/competition.service";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAdmin = await authService.isAdmin();

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const competition = await competitionService.createCompetition(body);

    return NextResponse.json({ success: true, competition }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create competition" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const search = searchParams.get("search");

    const supabase = await createServiceRoleClient();
    
    let query = supabase
      .from("competitions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: competitions, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, competitions: competitions || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch competitions" }, { status: 500 });
  }
}
