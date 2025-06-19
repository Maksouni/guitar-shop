import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const frets = await prisma.fret_counts.findMany();
  return NextResponse.json(frets);
}
