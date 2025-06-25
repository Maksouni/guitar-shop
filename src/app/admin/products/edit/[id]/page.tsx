"use client";
import GuitarForm from "@/components/GuitarForm";
import { GuitarWithRelations } from "@/types/guitar";
import { useEffect, useState } from "react";
import { use } from "react";

export default function EditGuitarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [guitar, setGuitar] = useState<GuitarWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/guitars/${id}`);
        const data = await res.json();
        setGuitar(data);
      } catch (error) {
        console.error("Ошибка при загрузке гитары", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!guitar) {
    return <div>Гитара не найдена</div>;
  }

  return (
    <div className="container mx-auto py-8 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">Редактирование: {guitar.name}</h1>
      <GuitarForm initialData={guitar} />
    </div>
  );
}
