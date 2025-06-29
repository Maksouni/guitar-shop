import Filters from "@/components/Filters";
import { GuitarShowcase } from "@/components/GuitarShowcase";
import { guitars } from "@/generated/prisma";

async function fetchGuitars() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/guitars?fields=id`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось загрузить гитары");
  }

  return res.json() as Promise<guitars[]>;
}

export default async function Catalog() {
  const guitarsList = await fetchGuitars();

  const handleFilterChange = () => {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Каталог гитар</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 w-full h-fit sticky border rounded-lg p-4 bg-gray-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
          <Filters />
        </div>

        <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Гитары</h2>

          {guitarsList.length === 0 ? (
            <p className="text-gray-500">Нет доступных гитар.</p>
          ) : (
            <GuitarShowcase ids={guitarsList.map((guitar) => guitar.id)} />
          )}
        </div>
      </div>
    </div>
  );
}
