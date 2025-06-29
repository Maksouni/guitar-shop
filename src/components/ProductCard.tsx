"use client";
import { guitars } from "@/generated/prisma";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
}

export default function ProductCard({ id }: ProductCardProps) {
  const [guitar, setGuitar] = useState<guitars | null>(null);

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/guitars/${id}`);
        const data = await res.json();
        setGuitar(data);
      } catch (error) {
        console.error("Ошибка при загрузке гитары", error);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <Link
      href={`/catalog/${id}`}
      className="group flex flex-col bg-white rounded-lg overflow-hidden shadow transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="relative w-full h-64 bg-white flex items-center justify-center">
        {guitar?.image_url ? (
          <img
            src={guitar.image_url}
            alt={guitar.name}
            className="object-contain p-4 w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-gray-500">Нет изображения</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold mb-1 line-clamp-1">
          {guitar?.name || "Гитара"}
        </h2>
        <p className="text-gray-600 text-base mb-2">
          {guitar?.price ? `${guitar.price} ₽` : "Цена не указана"}
        </p>
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
      </div>
    </Link>
  );
}
