"use client";
import { useState, useEffect } from "react";

type CartItem = {
  guitar_id: string;
  count: number;
  guitars: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    in_stock: number;
  };
};

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки корзины");
        return res.json();
      })
      .then((data) => {
        setItems(data.cart_items || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const updateCount = async (guitar_id: string, newCount: number) => {
    const currentItem = items.find((item) => item.guitar_id === guitar_id);
    if (!currentItem) return;

    if (newCount < 1) return;
    if (newCount > currentItem.guitars.in_stock) {
      alert(`Нельзя добавить больше, чем ${currentItem.guitars.in_stock} шт.`);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guitar_id, count: newCount }),
      });
      if (!res.ok) throw new Error("Не удалось обновить количество");
      setItems((prev) =>
        prev.map((item) =>
          item.guitar_id === guitar_id ? { ...item, count: newCount } : item
        )
      );
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const removeItem = async (guitar_id: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guitar_id }),
      });
      if (!res.ok) throw new Error("Не удалось удалить товар");
      setItems((prev) => prev.filter((item) => item.guitar_id !== guitar_id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <p>Загрузка корзины...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (items.length === 0) return <p className="text-gray-500">Корзина пуста</p>;

  const total = items.reduce(
    (sum, item) => sum + item.guitars.price * item.count,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div
          key={item.guitar_id}
          className="flex items-center border rounded p-4 shadow-sm"
        >
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
            {item.guitars.image_url ? (
              <img
                src={item.guitars.image_url}
                alt={item.guitars.name}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="text-gray-400 text-center pt-8">Нет фото</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.guitars.name}</h3>
            <p className="text-gray-600">{item.guitars.price} ₽</p>
            <div className="flex items-center mt-2 gap-2">
              <button
                onClick={() => updateCount(item.guitar_id, item.count - 1)}
                className="px-2 py-1 border rounded"
              >
                –
              </button>
              <span>{item.count}</span>
              <button
                onClick={() => updateCount(item.guitar_id, item.count + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => removeItem(item.guitar_id)}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            Удалить
          </button>
        </div>
      ))}
      <div className="text-right font-bold text-xl mt-4">Итого: {total} ₽</div>
    </div>
  );
}
