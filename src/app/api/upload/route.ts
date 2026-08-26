import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await authService.getSession();
    const isAdmin = await authService.isAdmin();
    
    console.log("Upload Route - isAdmin:", isAdmin, "Session exists:", !!session?.user);

    if (!isAdmin) {
      return NextResponse.json({ 
        error: `Forbidden: Admin access required. Session exists: ${!!session?.user}` 
      }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 1MB limit" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    const extension = file.name.split('.').pop() || 'bin';
    const key = `${folder}/${uuidv4()}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket named "tournaments"
    const { data, error } = await supabase
      .storage
      .from('tournaments')
      .upload(key, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: "Failed to upload to Supabase Storage: " + error.message }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('tournaments')
      .getPublicUrl(key);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
