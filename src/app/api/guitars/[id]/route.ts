import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 });
  }

  try {
    const guitar = await prisma.guitars.findUnique({
      where: { id },
      include: {
        brands: true,
        shapes: true,
        guitar_types: true,
        string_counts: true,
        pickup_configurations: true,
        fret_counts: true,
      },
    });

    if (!guitar) {
      return NextResponse.json({ error: "Гитара не найдена" }, { status: 404 });
    }

    return NextResponse.json(guitar);
  } catch (error) {
    console.error("[GET /api/guitars/:id]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
