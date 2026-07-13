"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-amber-900">
          Sepetiniz Boş
        </h1>
        <p className="mb-8 text-stone-500">
          Sepetinize henüz ürün eklemediniz.
        </p>
        <Link
          href="/urunler"
          className="rounded-full bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-700"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-amber-900">Sepetim</h1>
      <div className="flex flex-col divide-y divide-stone-200 border-y border-stone-200">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50 text-3xl">
                🍰
              </div>
              <div>
                <Link
                  href={`/urunler/${item.slug}`}
                  className="font-medium text-stone-800 hover:text-amber-700"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-stone-500">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.productId, Number(e.target.value))
                }
                className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-center"
              />
              <span className="w-24 text-right font-medium text-stone-800">
                {formatPrice(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-stone-400 transition hover:text-red-600"
                aria-label="Ürünü kaldır"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="text-xl font-semibold text-stone-900">
          Toplam: {formatPrice(totalPrice)}
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          Siparişi Tamamla
        </Link>
      </div>
    </div>
  );
}
