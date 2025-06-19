import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public/uploads", filename);

  fs.writeFileSync(uploadPath, buffer);

  const imageUrl = `/uploads/${filename}`;
  return NextResponse.json({ imageUrl });
}
