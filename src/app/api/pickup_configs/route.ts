import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const pickups = await prisma.pickup_configurations.findMany();
  return NextResponse.json(pickups);
}
