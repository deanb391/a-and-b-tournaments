import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.registrationId || !data.otpCode) {
      return NextResponse.json({ error: "Missing registration ID or OTP code" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    
    // Fetch the registration with competition entry_fee
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*, competitions(title, whatsapp_link, entry_fee)')
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

    const competition = registration.competitions;
    const entryFee = competition?.entry_fee || 0;
    
    // We update is_verified = true immediately since their email is verified
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        is_verified: true,
        otp_code: null,
        otp_expires_at: null
      })
      .eq('id', data.registrationId);

    if (updateError) {
      console.error("Verification update error:", updateError);
      return NextResponse.json({ error: "Failed to verify registration" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // FREE COMPETITION FLOW
    if (entryFee === 0) {
      const ticketNumber = `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      
      const { error: enrollError } = await supabase
        .from('registrations')
        .update({
          enrolled: true,
          ticket_number: ticketNumber
        })
        .eq('id', data.registrationId);

      if (enrollError) {
        console.error("Enrollment error for free comp:", enrollError);
        return NextResponse.json({ error: "Verified, but failed to generate ticket." }, { status: 500 });
      }

      // We should dynamically import this to avoid circular dependencies if any, but regular import is fine
      const { sendTicketEmail } = await import("@/lib/email");
      try {
        await sendTicketEmail(
          registration.email, 
          registration.team_name, 
          competition.title, 
          ticketNumber, 
          competition.whatsapp_link
        );
      } catch (err) {
        console.error("Failed to send free ticket email:", err);
      }

      return NextResponse.json({ 
        success: true, 
        paymentRequired: false,
        whatsapp_link: competition.whatsapp_link,
        message: "Registration verified and ticket generated successfully."
      });
    }

    // PAID COMPETITION FLOW
    const { paystack } = await import("@/lib/paystack");
    const reference = `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now()}`;
    const callbackUrl = `${appUrl.replace(/\/$/, '')}/payment/verify`;

    let authorizationUrl = "";
    try {
      authorizationUrl = await paystack.initializePayment(
        registration.email,
        entryFee,
        reference,
        callbackUrl
      );
    } catch (paystackError: any) {
      console.error("Paystack Init Error:", paystackError);
      return NextResponse.json({ error: "Failed to initialize payment gateway." }, { status: 500 });
    }

    // Create pending payment record
    const { error: paymentRecordError } = await supabase
      .from('payments')
      .insert({
        registration_id: data.registrationId,
        reference: reference,
        amount: entryFee,
        status: 'pending'
      });

    if (paymentRecordError) {
      console.error("Failed to insert payment record:", paymentRecordError);
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      paymentRequired: true,
      authorizationUrl: authorizationUrl
    });
    
  } catch (error: any) {
    console.error("Unexpected error in OTP verification:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
