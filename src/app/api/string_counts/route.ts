import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const brands = await prisma.string_counts.findMany();
  return NextResponse.json(brands);
}
