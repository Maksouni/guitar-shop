"use client";
import ProductCard from "./ProductCard";

interface GuitarsShowcaseProps {
  ids: string[];
}

export function GuitarShowcase({ ids }: GuitarsShowcaseProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {ids.map((id) => (
        <ProductCard key={id} id={id} />
      ))}
    </div>
  );
}
