import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const shapes = await prisma.shapes.findMany();
  return NextResponse.json(shapes);
}
