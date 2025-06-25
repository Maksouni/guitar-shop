import { guitar_types, guitars } from "@/generated/prisma";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface CellProps {
  guitarId: string;
}

type GuitarIncluded = guitars & {
  guitar_types?: guitar_types;
};

export default function GuitarTableCell({ guitarId }: CellProps) {
  const [guitar, setGuitar] = useState<GuitarIncluded | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/guitars/${guitarId}`);
        const data = await res.json();
        setGuitar(data);
      } catch (error) {
        console.error("Ошибка при загрузке гитары", error);
      }
    };

    fetchDetails();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить товар?")) return;

    try {
      await fetch(`/api/guitars?id=${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  if (guitar == null)
    return (
      <tr>
        <td>Загрузка ...</td>
      </tr>
    );

  return (
    <tr key={guitar.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {guitar.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {guitar.image_url && (
          <img
            src={guitar.image_url}
            alt={guitar.name}
            className="h-10 w-10 object-contain rounded"
          />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {guitar.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {guitar.price} ₽
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {guitar.guitar_types?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <button
            onClick={() =>
              (window.location.href = `/admin/products/edit/${guitar.id}`)
            }
            className="text-indigo-600 hover:text-indigo-900"
          >
            <FiEdit className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(guitar.id)}
            className="text-red-600 hover:text-red-900"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
