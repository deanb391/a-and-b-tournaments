import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function GET() {
  try {
    const session = await authService.getSession();
    
    if (!session) {
      return NextResponse.json({ session: null }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch session" }, { status: 500 });
  }
}
