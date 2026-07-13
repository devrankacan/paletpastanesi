import { prisma } from "@/lib/prisma";
import { ProductBrowser } from "@/components/product-browser";

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

      <ProductBrowser
        categories={categories}
        products={products}
        selectedSlugs={selectedSlugs}
        min={params.min}
        max={params.max}
        clearHref="/urunler"
      />
    </div>
  );
}
