import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST() {
  try {
    await authService.logout();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 });
  }
}
