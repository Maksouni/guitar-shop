"use client";
import { useEffect, useState } from "react";

type FilterProps = {
  onChange: (filters: Record<string, string>) => void;
};

export default function Filters({ onChange }: FilterProps) {
  const [brands, setBrands] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [types, setTypes] = useState([]);
  const [strings, setStrings] = useState([]);
  const [frets, setFrets] = useState([]);
  const [pickups, setPickups] = useState([]);

  const [filters, setFilters] = useState<Record<string, string>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onChange(updated); // передаём изменения вверх
  };

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold">Фильтры</h2>

      <select
        name="brand_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Бренд</option>
        {brands.map((b: any) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        name="shape_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Форма</option>
        {shapes.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        name="type_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Тип гитары</option>
        {types.map((t: any) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        name="string_count_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Количество струн</option>
        {strings.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.count}
          </option>
        ))}
      </select>

      <select
        name="fret_count_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Количество ладов</option>
        {frets.map((f: any) => (
          <option key={f.id} value={f.id}>
            {f.count}
          </option>
        ))}
      </select>

      <select
        name="pickup_config_id"
        className="border p-2 w-full"
        onChange={handleChange}
      >
        <option value="">Конфигурация звукоснимателей</option>
        {pickups.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
