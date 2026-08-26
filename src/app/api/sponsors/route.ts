import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const supabase = await createServiceRoleClient();
    const { data: sponsors, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ sponsors: sponsors || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch sponsors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await authService.isAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const supabase = await createServiceRoleClient();

    const { data: sponsor, error } = await supabase
      .from("sponsors")
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ sponsor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create sponsor" }, { status: 500 });
  }
}
