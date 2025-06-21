"use client";
import {
  brands,
  fret_counts,
  guitar_types,
  pickup_configurations,
  shapes,
  string_counts,
} from "@/generated/prisma";
import { useEffect, useState } from "react";

export default function AddGuitarWindow() {
  const [brands, setBrands] = useState<brands[]>([]);
  const [shapes, setShapes] = useState<shapes[]>([]);
  const [types, setTypes] = useState<guitar_types[]>([]);
  const [strings, setStrings] = useState<string_counts[]>([]);
  const [frets, setFrets] = useState<fret_counts[]>([]);
  const [pickups, setPickups] = useState<pickup_configurations[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    brand_id: "",
    shape_id: "",
    type_id: "",
    string_count_id: "",
    pickup_config_id: "",
    fret_count_id: "",
    is_popular: false,
    in_stock: "1",
  });

  useEffect(() => {
    const fetchOptions = async () => {
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
    };

    fetchOptions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      brand_id: Number(formData.brand_id),
      shape_id: Number(formData.shape_id),
      type_id: Number(formData.type_id),
      string_count_id: Number(formData.string_count_id),
      pickup_config_id: Number(formData.pickup_config_id),
      fret_count_id: Number(formData.fret_count_id),
      in_stock: Number(formData.in_stock),
    };

    const res = await fetch("/api/guitars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const created = await res.json();

      if (file) {
        const imageForm = new FormData();
        imageForm.append("file", file);
        imageForm.append("guitarId", created.id);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageForm,
        });

        if (!uploadRes.ok) {
          alert("Гитара добавлена, но не удалось загрузить изображение.");
        }
      }

      alert("Гитара успешно добавлена!");

      setFormData({
        name: "",
        price: "",
        description: "",
        brand_id: "",
        shape_id: "",
        type_id: "",
        string_count_id: "",
        pickup_config_id: "",
        fret_count_id: "",
        is_popular: false,
        in_stock: "1",
      });
      setFile(null);
      setPreview("");
    } else {
      alert("Ошибка при добавлении гитары");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 rounded-2xl p-6 mt-6 space-y-4"
    >
      <h1 className="text-2xl font-bold">Добавить гитару</h1>

      <input
        name="name"
        placeholder="Название"
        className="border p-2 w-full"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Цена (₽)"
        type="number"
        className="border p-2 w-full"
        value={formData.price}
        onChange={handleChange}
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium">Выбрать изображение</label>

        <div className="relative w-full">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          <div className="border border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <span className="text-sm text-gray-600">
              Нажмите, чтобы выбрать файл
            </span>
          </div>
        </div>
      </div>

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded border"
          />
        </div>
      )}

      <textarea
        name="description"
        placeholder="Описание"
        className="border p-2 w-full"
        value={formData.description}
        onChange={handleChange}
      />

      <select
        name="brand_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.brand_id}
      >
        <option value="">Бренд</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        name="shape_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.shape_id}
      >
        <option value="">Форма</option>
        {shapes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        name="type_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.type_id}
      >
        <option value="">Тип гитары</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        name="string_count_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.string_count_id}
      >
        <option value="">Количество струн</option>
        {strings.map((s) => (
          <option key={s.id} value={s.id}>
            {s.count}
          </option>
        ))}
      </select>

      <select
        name="pickup_config_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.pickup_config_id}
      >
        <option value="">Конфигурация звукоснимателей</option>
        {pickups.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        name="fret_count_id"
        className="border p-2 w-full"
        onChange={handleChange}
        value={formData.fret_count_id}
      >
        <option value="">Количество ладов</option>
        {frets.map((f) => (
          <option key={f.id} value={f.id}>
            {f.count}
          </option>
        ))}
      </select>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="is_popular"
          checked={formData.is_popular}
          onChange={handleChange}
        />
        <span>Популярная</span>
      </label>

      <input
        name="in_stock"
        placeholder="В наличии (шт.)"
        type="number"
        className="border p-2 w-full"
        value={formData.in_stock}
        min={0}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!formData.name || !formData.price || !formData.brand_id}
      >
        Добавить гитару
      </button>
    </form>
  );
}
