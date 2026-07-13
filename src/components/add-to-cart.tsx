"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type Props = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

export function AddToCart({
  productId,
  name,
  slug,
  price,
  imageUrl,
  stock,
}: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <p className="rounded-lg bg-stone-100 px-4 py-3 text-sm font-medium text-stone-500">
        Bu ürün şu anda stokta yok.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={stock}
        value={quantity}
        onChange={(e) =>
          setQuantity(Math.max(1, Math.min(stock, Number(e.target.value))))
        }
        className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-center"
      />
      <button
        type="button"
        onClick={() => {
          addItem({ productId, name, slug, price, imageUrl }, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="rounded-full bg-amber-600 px-6 py-2 font-medium text-white transition hover:bg-amber-700"
      >
        {added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
      </button>
    </div>
  );
}
