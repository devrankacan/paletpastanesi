import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Ürünler | Palet Pastaneleri",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string | string[]; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  const selectedSlugs = Array.isArray(params.kategori)
    ? params.kategori
    : params.kategori
      ? [params.kategori]
      : [];
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(selectedSlugs.length
          ? { category: { slug: { in: selectedSlugs } } }
          : {}),
        ...(min !== undefined || max !== undefined
          ? {
              price: {
                ...(min !== undefined ? { gte: Math.round(min * 100) } : {}),
                ...(max !== undefined ? { lte: Math.round(max * 100) } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { category: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-amber-900">Ürünlerimiz</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <form className="h-fit rounded-2xl border border-stone-200 p-5">
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-stone-800">Fiyat</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="min"
                min={0}
                defaultValue={params.min}
                placeholder="Min"
                className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
              />
              <span className="text-stone-400">-</span>
              <input
                type="number"
                name="max"
                min={0}
                defaultValue={params.max}
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
            href="/urunler"
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
    </div>
  );
}
