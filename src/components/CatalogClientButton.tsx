"use client";

import { guitars } from "@/generated/prisma";

interface CtlgProps {
  guitar: guitars;
}

export default function CatalogClientButton({ guitar }: CtlgProps) {
  async function addToCart(guitar_id: string, count = 1) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guitar_id, count }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка при добавлении в корзину");
      }
      alert("Товар добавлен в корзину");
    } catch (e) {
      alert((e as Error).message);
    }
  }
  return (
    <button
      className="mt-auto bg-black cursor-pointer text-white text-sm font-medium py-2 rounded hover:bg-gray-800 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        guitar && addToCart(guitar.id);
      }}
      disabled={!guitar}
    >
      В корзину
    </button>
  );
}
