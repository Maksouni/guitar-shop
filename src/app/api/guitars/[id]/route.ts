import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fieldsParam = searchParams.get("fields");

    if (fieldsParam) {
      const requestedFields = fieldsParam.split(",").map((f) => f.trim());

      const allowedFields: Record<string, boolean> = {
        id: true,
        name: true,
        price: true,
        image_url: true,
        description: true,
        is_popular: true,
        in_stock: true,
        brand_id: true,
        shape_id: true,
        type_id: true,
        string_count_id: true,
        pickup_config_id: true,
        fret_count_id: true,
      };

      const select: Record<string, true> = {};
      for (const field of requestedFields) {
        if (allowedFields[field]) {
          select[field] = true;
        }
      }

      if (Object.keys(select).length === 0) {
        return NextResponse.json(
          { error: "Нет допустимых полей для выборки" },
          { status: 400 }
        );
      }

      const guitar = await prisma.guitars.findUnique({
        where: { id },
        select,
      });

      if (!guitar) {
        return NextResponse.json(
          { error: "Гитара не найдена" },
          { status: 404 }
        );
      }

      return NextResponse.json(guitar);
    }

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
