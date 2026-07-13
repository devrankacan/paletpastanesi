"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/urunler/${product.slug}`}>
        <div className="flex h-40 items-center justify-center bg-amber-50 text-5xl">
          🍰
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-semibold text-stone-800 hover:text-amber-700">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-sm text-stone-500">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-amber-700">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {product.stock > 0 ? "Sepete Ekle" : "Stokta Yok"}
          </button>
        </div>
      </div>
    </div>
  );
}
