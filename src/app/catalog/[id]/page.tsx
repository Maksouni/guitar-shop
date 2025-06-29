import { notFound } from "next/navigation";

export default async function GuitarPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/guitars/${params.id}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    notFound();
  }

  const guitar = await res.json();

  if (guitar.error) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0 max-h-[900px] w-full md:w-1/2 bg-gray-100 flex items-center justify-center rounded shadow">
        {guitar.image_url ? (
          <img
            src={guitar.image_url}
            alt={guitar.name}
            className="object-cover w-full h-full p-4"
          />
        ) : (
          <div className="text-gray-500">Нет изображения</div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">{guitar.name}</h1>
        <p className="text-xl text-gray-700 mb-2">{guitar.price} ₽</p>

        {guitar.description && (
          <p className="text-gray-600 mb-4">{guitar.description}</p>
        )}

        <ul className="text-gray-500 text-sm mb-4 space-y-1">
          <li>
            Бренд: {guitar.brands?.name || guitar.brand_id || "Не указан"}
          </li>
          <li>
            Форма: {guitar.shapes?.name || guitar.shape_id || "Не указана"}
          </li>
          <li>
            Тип: {guitar.guitar_types?.name || guitar.type_id || "Не указан"}
          </li>
          <li>
            Количество струн:{" "}
            {guitar.string_counts?.count ||
              guitar.string_count_id ||
              "Не указано"}
          </li>
          <li>
            Конфиг звукоснимателей:{" "}
            {guitar.pickup_configurations?.name ||
              guitar.pickup_config_id ||
              "Не указан"}
          </li>
          <li>
            Количество ладов:{" "}
            {guitar.fret_counts?.count || guitar.fret_count_id || "Не указано"}
          </li>
          <li>В наличии: {guitar.in_stock ? "Да" : "Нет"}</li>
        </ul>
      </div>
    </div>
  );
}
