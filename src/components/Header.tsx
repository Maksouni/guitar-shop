"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide hover:text-gray-300 transition-colors"
        >
          Guitar Shop
        </Link>
        <nav className="flex items-center gap-6 text-lg">
          {user?.role === 1 && (
            <Link
              href="/admin"
              className="hover:text-yellow-400 transition-colors"
            >
              Для админа
            </Link>
          )}
          <Link href="/" className="hover:text-yellow-400 transition-colors">
            Главная
          </Link>
          <Link
            href="/catalog"
            className="hover:text-yellow-400 transition-colors"
          >
            Каталог
          </Link>

          {!user ? (
            <Link
              href="/auth"
              className="hover:text-yellow-400 transition-colors"
            >
              Вход
            </Link>
          ) : (
            <>
              <Link
                href="/cart"
                className="hover:text-yellow-400 transition-colors"
              >
                Корзина
              </Link>
              <button
                onClick={() => signOut()}
                className="hover:text-red-400 transition-colors"
              >
                Выйти
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
