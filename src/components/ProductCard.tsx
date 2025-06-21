import { guitars } from "@/generated/prisma";
import { useEffect, useState } from "react";

interface ProductCardProps {
  id: string;
}

export default function ProductCard({ id }: ProductCardProps) {
  const [guitar, setGuitar] = useState<guitars | null>(null);

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
    <div className="border-2 flex flex-col w-60 rounded overflow-hidden shadow-sm bg-white">
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        {guitar?.image_url ? (
          <img
            src={guitar.image_url}
            alt={guitar.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-sm text-gray-500">Нет изображения</div>
        )}
      </div>
      <div className="p-3">
        <h2 className="text-base font-semibold truncate">
          {guitar?.name || "Гитара"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {guitar?.price ? `${guitar.price} ₽` : "Цена не указана"}
        </p>
      </div>
    </div>
  );
}
