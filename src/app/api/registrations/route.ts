import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";
import { sendOTPEmail } from "@/lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.competition_id || !data.team_name || !data.email || !data.phone || !data.school || !data.players_count) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    // Duplicate Check
    const { data: existingReg, error: checkError } = await supabase
      .from('registrations')
      .select('id, is_verified')
      .eq('competition_id', data.competition_id)
      .or(`email.eq.${data.email},phone.eq.${data.phone}`)
      .maybeSingle();
      
    if (checkError) {
      console.error("Duplication check error:", checkError);
      return NextResponse.json({ error: "Failed to check existing registrations" }, { status: 500 });
    }

    if (existingReg) {
      if (existingReg.is_verified) {
        return NextResponse.json({ error: "You are already registered for this tournament." }, { status: 400 });
      } else {
        return NextResponse.json({ error: "A registration with this email or phone is already pending verification." }, { status: 400 });
      }
    }
    
    // Generate OTP
    const otp = generateOTP();
    // OTP expires in 15 mins
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create unverified registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        competition_id: data.competition_id,
        team_name: data.team_name,
        email: data.email,
        phone: data.phone,
        school: data.school,
        players_count: parseInt(data.players_count),
        is_verified: false,
        otp_code: otp,
        otp_expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Registration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send OTP via email
    try {
      await sendOTPEmail(data.email, otp, data.team_name);
    } catch (emailError: any) {
      console.error("Failed to send OTP email:", emailError);
      // Even if email fails, we return the registration ID so they can retry or we handle it
      // In production you might want to return an error, but here we just log it.
    }

    return NextResponse.json({ 
      success: true, 
      registrationId: registration.id,
      message: "Registration created. OTP sent to email." 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Unexpected error in registration:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only admins can view registrations
    const adminCheck = await authService.isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const competitionId = searchParams.get("competition_id");
    const search = searchParams.get("search");

    const supabase = await createServiceRoleClient();
    
    let query = supabase
      .from("registrations")
      .select(`
        *,
        competitions (
          title,
          category
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (competitionId) {
      query = query.eq('competition_id', competitionId);
    }
    if (search) {
      query = query.or(`team_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: registrations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registrations });
  } catch (error: any) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
