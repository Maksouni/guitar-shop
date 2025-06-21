"use client";
import Filters from "@/components/Filters";
import { GuitarShowcase } from "@/components/GuitarShowcase";
import ProductCard from "@/components/ProductCard";
import { guitars } from "@/generated/prisma";
import { useEffect, useState } from "react";

export default function Catalog() {
  const [guitars, setGuitars] = useState<guitars[]>([]);

  const handleFilterChange = () => {};

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
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 mx-auto">
        <div className="border-2">search</div>

        <div className="flex gap-2">
          <div className="border-2 max-w-84">
            <Filters onChange={handleFilterChange} />
          </div>
          <div className="border-2 min-w-120 p-2">
            <h1>Гитары</h1>
            <GuitarShowcase ids={guitars.map((guitar) => guitar.id)} />
            {/* <ul className="list-none">
              {guitars.map((guitar) => (
                <ProductCard key={guitar.id} product={guitar} />
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
}
