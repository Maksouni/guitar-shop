import AddGuitarWindow from "@/components/AddGuitarWindow";
import BrandsList from "@/components/BrandsList";
import { GuitarShowcase } from "@/components/GuitarShowcase";

export default function HomePage() {
  return (
    <section className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Добро пожаловать в Guitar Shop
      </h1>
      <GuitarShowcase />
      <AddGuitarWindow />
    </section>
  );
}
