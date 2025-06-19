import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      image_url,
      description,
      brand_id,
      shape_id,
      type_id,
      string_count_id,
      pickup_config_id,
      fret_count_id,
      is_popular,
      in_stock,
    } = body;

    if (!name || !price || !brand_id || !shape_id || !type_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const guitar = await prisma.guitars.create({
      data: {
        name,
        price,
        image_url,
        description,
        brand_id,
        shape_id,
        type_id,
        string_count_id,
        pickup_config_id,
        fret_count_id,
        is_popular,
        in_stock,
      },
    });

    return NextResponse.json(guitar, { status: 201 });
  } catch (error) {
    console.error("[POST /api/guitars]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
