"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧁</span>
          <span className="text-xl font-semibold text-amber-900">
            Palet Pastaneleri
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 sm:flex">
          <Link href="/" className="hover:text-amber-700">
            Ana Sayfa
          </Link>
          <Link href="/urunler" className="hover:text-amber-700">
            Ürünler
          </Link>
          <Link href="/#hakkimizda" className="hover:text-amber-700">
            Hakkımızda
          </Link>
          <Link href="/#iletisim" className="hover:text-amber-700">
            İletişim
          </Link>
          <Link href="/siparis-takip" className="hover:text-amber-700">
            Sipariş Takip
          </Link>
        </nav>
        <Link
          href="/sepet"
          className="relative flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        >
          Sepetim
          {totalItems > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-amber-700">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
