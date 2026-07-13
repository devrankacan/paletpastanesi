"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden items-center justify-between bg-amber-800 px-4 py-1.5 text-xs text-amber-100 sm:flex">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/siparis-takip" className="font-semibold hover:text-white">
            Sipariş Takip
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/paletpastane/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/PaletPastane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-amber-400 to-amber-700 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/site-gorselleri/logo.png"
              alt="Palet Pastaneleri"
              width={140}
              height={62}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white sm:flex">
            <Link href="/" className="hover:text-gold-400">
              Ana Sayfa
            </Link>
            <Link href="/urunler" className="hover:text-gold-400">
              Ürünler
            </Link>
            <Link href="/#hakkimizda" className="hover:text-gold-400">
              Hakkımızda
            </Link>
            <Link href="/#iletisim" className="hover:text-gold-400">
              İletişim
            </Link>
          </nav>
          <Link
            href="/sepet"
            className="relative flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            Sepetim
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-amber-900">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
