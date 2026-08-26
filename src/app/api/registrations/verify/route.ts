import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.registrationId || !data.otpCode) {
      return NextResponse.json({ error: "Missing registration ID or OTP code" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    
    // Fetch the registration
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*, competitions(whatsapp_link)')
      .eq('id', data.registrationId)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.is_verified) {
      return NextResponse.json({ error: "Registration is already verified" }, { status: 400 });
    }

    // Check expiration
    if (registration.otp_expires_at && new Date() > new Date(registration.otp_expires_at)) {
      return NextResponse.json({ error: "OTP has expired. Please register again." }, { status: 400 });
    }

    // Check code
    if (registration.otp_code !== data.otpCode) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Verify
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        is_verified: true,
        otp_code: null, // Clear the code after successful verification
        otp_expires_at: null
      })
      .eq('id', data.registrationId);

    if (updateError) {
      console.error("Verification update error:", updateError);
      return NextResponse.json({ error: "Failed to verify registration" }, { status: 500 });
    }

    const whatsappLink = registration.competitions?.whatsapp_link;

    return NextResponse.json({ 
      success: true, 
      message: "Registration verified successfully.",
      whatsapp_link: whatsappLink
    });
    
  } catch (error: any) {
    console.error("Unexpected error in OTP verification:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
