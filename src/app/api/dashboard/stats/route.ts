import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await authService.isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = await createServiceRoleClient();

    // Get total registrations count
    const { count: totalRegistrations, error: regError } = await supabase
      .from("registrations")
      .select('*', { count: 'exact', head: true });

    if (regError) throw regError;

    // Get active competitions count (status not COMPLETED)
    const { count: activeCompetitions, error: compError } = await supabase
      .from("competitions")
      .select('*', { count: 'exact', head: true })
      .neq('status', 'COMPLETED');

    if (compError) throw compError;

    return NextResponse.json({ 
      stats: {
        totalRegistrations: totalRegistrations || 0,
        activeCompetitions: activeCompetitions || 0
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
