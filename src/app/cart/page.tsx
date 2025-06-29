import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CartClient from "@/components/CartClient";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      <CartClient />
    </div>
  );
}
