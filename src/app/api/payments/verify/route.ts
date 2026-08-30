import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { paystack } from "@/lib/paystack";
import { sendTicketEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { reference } = data;

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    // Find the pending payment
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("*, registrations(*, competitions(*))")
      .eq("reference", reference)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (payment.status === "success") {
      return NextResponse.json({ success: true, message: "Payment already verified" });
    }

    // Verify with Paystack
    let isSuccess = false;
    try {
      isSuccess = await paystack.verifyPayment(reference);
    } catch (err: any) {
      console.error("Paystack verification failed:", err.message);
      
      // Update payment to failed
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    if (!isSuccess) {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 });
    }

    // Update payment to success
    await supabase
      .from("payments")
      .update({ status: "success" })
      .eq("reference", reference);

    // Update registration to enrolled and generate ticket
    const ticketNumber = `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    await supabase
      .from("registrations")
      .update({ 
        enrolled: true,
        ticket_number: ticketNumber 
      })
      .eq("id", payment.registration_id);

    // Send the ticket email
    const reg = payment.registrations;
    const comp = reg.competitions;
    
    try {
      await sendTicketEmail(
        reg.email,
        reg.team_name,
        comp.title,
        ticketNumber,
        comp.whatsapp_link
      );
    } catch (emailError) {
      console.error("Failed to send ticket email after payment:", emailError);
      // We still return success since payment was successful
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified successfully",
      whatsapp_link: comp.whatsapp_link
    });
  } catch (error: any) {
    console.error("Unexpected error verifying payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
