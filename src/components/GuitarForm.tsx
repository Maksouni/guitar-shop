"use client";
import { GuitarWithRelations } from "@/types/guitar";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  brands,
  fret_counts,
  guitar_types,
  pickup_configurations,
  shapes,
  string_counts,
} from "@/generated/prisma";

export default function GuitarForm({
  initialData,
}: {
  initialData: GuitarWithRelations;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: initialData.name,
    price: initialData.price,
    description: initialData.description || "",
    brand_id: initialData.brand_id || "",
    type_id: initialData.type_id || "",
    shape_id: initialData.shape_id || "",
    string_count_id: initialData.string_count_id || "",
    pickup_config_id: initialData.pickup_config_id || "",
    fret_count_id: initialData.fret_count_id || "",
    is_popular: initialData.is_popular || false,
    in_stock: initialData.in_stock || 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData.image_url || "");
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [brands, setBrands] = useState<brands[]>([]);
  const [shapes, setShapes] = useState<shapes[]>([]);
  const [types, setTypes] = useState<guitar_types[]>([]);
  const [strings, setStrings] = useState<string_counts[]>([]);
  const [frets, setFrets] = useState<fret_counts[]>([]);
  const [pickups, setPickups] = useState<pickup_configurations[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [b, s, t, sc, fc, pc] = await Promise.all([
          fetch("/api/brands").then((res) => res.json()),
          fetch("/api/shapes").then((res) => res.json()),
          fetch("/api/guitar_types").then((res) => res.json()),
          fetch("/api/string_counts").then((res) => res.json()),
          fetch("/api/fret_counts").then((res) => res.json()),
          fetch("/api/pickup_configs").then((res) => res.json()),
        ]);
        setBrands(b);
        setShapes(s);
        setTypes(t);
        setStrings(sc);
        setFrets(fc);
        setPickups(pc);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setIsRemovingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
    setIsRemovingImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleaned = {
        ...formData,
        price: Number(formData.price),
        in_stock: Number(formData.in_stock),
        brand_id: formData.brand_id ? Number(formData.brand_id) : null,
        type_id: formData.type_id ? Number(formData.type_id) : null,
        shape_id: formData.shape_id ? Number(formData.shape_id) : null,
        string_count_id: formData.string_count_id
          ? Number(formData.string_count_id)
          : null,
        pickup_config_id: formData.pickup_config_id
          ? Number(formData.pickup_config_id)
          : null,
        fret_count_id: formData.fret_count_id
          ? Number(formData.fret_count_id)
          : null,
      };

      const jsonRes = await fetch(`/api/guitars?id=${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });

      if (!jsonRes.ok) {
        throw new Error(await jsonRes.text());
      }

      if (file || isRemovingImage) {
        const form = new FormData();
        if (file) form.append("file", file);
        form.append("guitarId", initialData.id);
        form.append("removeImage", String(isRemovingImage));

        const imageRes = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        if (!imageRes.ok) {
          throw new Error(await imageRes.text());
        }
      }

      // router.push("/admin/products");
      // router.refresh();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Цена (₽)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded min-h-[100px]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Изображение</label>

            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded border object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="border border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <span className="text-sm text-gray-600">
                    Нажмите, чтобы загрузить изображение
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Бренд</label>
            <select
              value={formData.brand_id}
              onChange={(e) =>
                setFormData({ ...formData, brand_id: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите бренд</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Тип гитары</label>
            <select
              value={formData.type_id}
              onChange={(e) =>
                setFormData({ ...formData, type_id: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите тип</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Форма корпуса</label>
            <select
              value={formData.shape_id}
              onChange={(e) =>
                setFormData({ ...formData, shape_id: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите форму</option>
              {shapes.map((shape) => (
                <option key={shape.id} value={shape.id}>
                  {shape.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Количество струн</label>
            <select
              value={formData.string_count_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  string_count_id: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите количество</option>
              {strings.map((string) => (
                <option key={string.id} value={string.id}>
                  {string.count}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Конфигурация звукоснимателей</label>
            <select
              value={formData.pickup_config_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickup_config_id: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите конфигурацию</option>
              {pickups.map((pickup) => (
                <option key={pickup.id} value={pickup.id}>
                  {pickup.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Количество ладов</label>
            <select
              value={formData.fret_count_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fret_count_id: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={loadingOptions}
            >
              <option value="">Выберите количество</option>
              {frets.map((fret) => (
                <option key={fret.id} value={fret.id}>
                  {fret.count}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_popular"
              checked={formData.is_popular}
              onChange={(e) =>
                setFormData({ ...formData, is_popular: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="is_popular">Популярный товар</label>
          </div>

          <div>
            <label className="block mb-1">Количество на складе</label>
            <input
              type="number"
              value={formData.in_stock}
              onChange={(e) =>
                setFormData({ ...formData, in_stock: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
