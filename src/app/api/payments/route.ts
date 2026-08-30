import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const supabase = await createServiceRoleClient();
    
    let query = supabase
      .from('payments')
      .select(`
        *,
        registrations!inner(
          team_name,
          email,
          competitions!inner(title)
        )
      `, { count: 'exact' });

    if (search) {
      query = query.or(`reference.ilike.%${search}%, registrations.team_name.ilike.%${search}%, registrations.email.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: payments, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }

    return NextResponse.json({ 
      payments,
      pagination: {
        total: count,
        limit,
        offset
      }
    });
  } catch (error: any) {
    console.error("Unexpected error fetching payments:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
