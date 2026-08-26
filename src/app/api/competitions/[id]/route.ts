import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { competitionService } from "@/services/competition.service";

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await Promise.resolve(params);
    const competition = await competitionService.getCompetitionById(id);
    return NextResponse.json({ success: true, competition }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch competition" }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const isAdmin = await authService.isAdmin();
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const competition = await competitionService.updateCompetition(id, body);
    
    return NextResponse.json({ success: true, competition }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update competition" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const isAdmin = await authService.isAdmin();
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);
    await competitionService.deleteCompetition(id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete competition" }, { status: 500 });
  }
}
