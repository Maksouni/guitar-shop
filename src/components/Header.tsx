import Link from "next/link";

export function Header() {
  return (
    <header className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold">
          Guitar Shop
        </Link>
        <nav className="space-x-6">
          <Link href="/admin">Для админа</Link>
          <Link href="/">Главная</Link>
          <Link href="/catalog">Каталог</Link>
          {/* <Link href="/about">О нас</Link> */}
          {/* <Link href="/cart">Корзина</Link> */}
        </nav>
      </div>
    </header>
  );
}
