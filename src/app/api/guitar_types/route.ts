import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const types = await prisma.guitar_types.findMany();
  return NextResponse.json(types);
}
