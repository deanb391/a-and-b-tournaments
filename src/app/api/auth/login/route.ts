import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const data = await authService.loginAdmin(password);

    return NextResponse.json({ success: true, user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 401 });
  }
}
