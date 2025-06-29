import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
      include: {
        cart_items: {
          include: {
            guitars: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart_items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("[GET /api/cart]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { guitar_id, count } = await req.json();

    if (!guitar_id || typeof count !== "number" || count < 1) {
      return NextResponse.json(
        { error: "guitar_id and positive count are required" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: session.user.id,
        },
      });
    }

    const existingItem = await prisma.cart_items.findUnique({
      where: {
        cart_id_guitar_id: {
          cart_id: cart.id,
          guitar_id,
        },
      },
    });

    if (existingItem) {
      await prisma.cart_items.update({
        where: {
          cart_id_guitar_id: {
            cart_id: cart.id,
            guitar_id,
          },
        },
        data: {
          count: existingItem.count + count,
        },
      });
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          guitar_id,
          count,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/cart]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { guitar_id, count } = await req.json();

    if (!guitar_id || typeof count !== "number" || count < 0) {
      return NextResponse.json(
        { error: "guitar_id and non-negative count are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (count === 0) {
      await prisma.cart_items.delete({
        where: {
          cart_id_guitar_id: {
            cart_id: cart.id,
            guitar_id,
          },
        },
      });
    } else {
      await prisma.cart_items.update({
        where: {
          cart_id_guitar_id: {
            cart_id: cart.id,
            guitar_id,
          },
        },
        data: {
          count,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/cart]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { guitar_id } = await req.json();

    if (!guitar_id) {
      return NextResponse.json(
        { error: "guitar_id is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await prisma.cart_items.delete({
      where: {
        cart_id_guitar_id: {
          cart_id: cart.id,
          guitar_id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/cart]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
