import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins can view registration details
    const adminCheck = await authService.isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    const { data: registration, error } = await supabase
      .from("registrations")
      .select(`
        *,
        competitions (
          title,
          category
        ),
        payments (
          reference,
          amount,
          status,
          created_at
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ registration });
  } catch (error: any) {
    console.error("Failed to fetch registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
