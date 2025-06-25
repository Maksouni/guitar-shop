import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const guitarId = data.get("guitarId")?.toString();
    const removeImage = data.get("removeImage") === "true";

    if (!guitarId) {
      return NextResponse.json(
        { error: "guitarId обязателен" },
        { status: 400 }
      );
    }

    const guitar = await prisma.guitars.findUnique({
      where: { id: guitarId },
      select: { image_url: true },
    });

    let imageUrl: string | null = null;

    if (guitar?.image_url && (file || removeImage)) {
      await deleteOldImage(guitar.image_url);
    }

    if (file) {
      imageUrl = await uploadNewImage(file);
    }

    const updatedGuitar = await prisma.guitars.update({
      where: { id: guitarId },
      data: {
        image_url: removeImage ? null : imageUrl || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: updatedGuitar.image_url,
    });
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при обработке изображения" },
      { status: 500 }
    );
  }
}

async function uploadNewImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExt = path.extname(file.name);
  const filename = `${Date.now()}${fileExt}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, filename);
  fs.writeFileSync(uploadPath, buffer);

  return `/uploads/${filename}`;
}

async function deleteOldImage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl.startsWith("/uploads/")) {
      console.warn(`Попытка удалить файл вне директории uploads: ${imageUrl}`);
      return;
    }

    const filePath = path.join(process.cwd(), "public", imageUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Ошибка при удалении файла ${imageUrl}:`, error);
    throw error;
  }
}
