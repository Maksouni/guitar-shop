"use client";
import GuitarTableCell from "@/components/GuitarTableCell";
import { guitars } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminPage() {
  const [guitars, setGuitars] = useState<guitars[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuitars = async () => {
      const res = await fetch("/api/guitars?fields=id").then((data) =>
        data.json()
      );
      setGuitars(res);
      console.log(res);
    };
    fetchGuitars();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/guitars");
      const data = await res.json();
      setGuitars(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col w-full p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-2xl 
          hover:shadow-md transition-shadow duration-200 p-2"
          onClick={() => (window.location.href = "/admin/products/new")}
        >
          <FiPlus /> Добавить товар
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Изображение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guitars.map((product) => (
              <GuitarTableCell key={product.id} guitarId={product.id} />
            ))}
          </tbody>
        </table>
      </div>

      {guitars.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">Товары не найдены</div>
      )}
    </div>
  );
}
