import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const brands = await prisma.brands.findMany();
  return NextResponse.json(brands);
}
