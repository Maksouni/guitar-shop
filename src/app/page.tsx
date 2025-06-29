import Link from "next/link";

type Guitar = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/guitars?popular=true`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось загрузить популярные гитары");
  }

  const guitars: Guitar[] = await res.json();

  return (
    <section className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Добро пожаловать в Guitar Shop
      </h1>

      <h2 className="text-2xl font-semibold mb-4">Популярные гитары</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {guitars.map((guitar) => (
          <div
            key={guitar.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {guitar.image_url && (
              <img
                src={guitar.image_url}
                alt={guitar.name}
                className="w-full h-48 object-contain rounded mb-4"
              />
            )}
            <h3 className="text-lg font-bold mb-2">{guitar.name}</h3>
            <p className="text-gray-700 mb-2">{guitar.price} ₽</p>
            <Link
              href={`/catalog/${guitar.id}`}
              className="inline-block mt-auto text-indigo-600 hover:underline"
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
