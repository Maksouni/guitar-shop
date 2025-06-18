"use client";
import { brands } from "@/generated/prisma";
import { useEffect, useState } from "react";

export default function BrandsList() {
  const [brands, setBrands] = useState<brands[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Ошибка при получении брендов:", err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Бренды</h2>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id}>{brand.name}</li>
        ))}
      </ul>
    </div>
  );
}
