import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const guitarId = data.get("guitarId")?.toString();

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    if (!guitarId) {
      return NextResponse.json(
        { error: "guitarId обязателен" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, filename);
    fs.writeFileSync(uploadPath, buffer);

    const imageUrl = `/uploads/${filename}`;

    await prisma.guitars.update({
      where: { id: guitarId },
      data: { image_url: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Ошибка при загрузке изображения:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при загрузке" },
      { status: 500 }
    );
  }
}
