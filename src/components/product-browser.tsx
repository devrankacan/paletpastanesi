import Link from "next/link";
import { ProductCard } from "@/components/product-card";

type Category = { id: string; name: string; slug: string };
type ProductWithImage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

export function ProductBrowser({
  categories,
  products,
  selectedSlugs,
  min,
  max,
  clearHref = "/urunler",
}: {
  categories: Category[];
  products: ProductWithImage[];
  selectedSlugs: string[];
  min?: string;
  max?: string;
  clearHref?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <form className="h-fit rounded-2xl border border-stone-200 p-5">
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-stone-800">Fiyat</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="min"
              min={0}
              defaultValue={min}
              placeholder="Min"
              className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            />
            <span className="text-stone-400">-</span>
            <input
              type="number"
              name="max"
              min={0}
              defaultValue={max}
              placeholder="Max"
              className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-stone-800">
            Ürün Kategorileri
          </h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 text-sm text-stone-600"
              >
                <input
                  type="checkbox"
                  name="kategori"
                  value={category.slug}
                  defaultChecked={selectedSlugs.includes(category.slug)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-700 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
        >
          Filtrele
        </button>
        <Link
          href={clearHref}
          className="mt-2 block text-center text-sm text-stone-500 hover:underline"
        >
          Temizle
        </Link>
      </form>

      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-stone-500">Bu filtreye uygun ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
