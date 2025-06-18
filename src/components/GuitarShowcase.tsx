export function GuitarShowcase() {
  const guitars = [
    { id: 1, name: "Fender Stratocaster", price: 1500 },
    { id: 2, name: "Gibson Les Paul", price: 2000 },
    { id: 3, name: "Ibanez RG", price: 1200 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {guitars.map((guitar) => (
        <div
          key={guitar.id}
          className="border p-4 rounded shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{guitar.name}</h2>
          <p className="text-gray-700 mt-1">{guitar.price} ₽</p>
        </div>
      ))}
    </div>
  );
}
