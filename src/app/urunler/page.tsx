import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "Ürünler | Palet Pastanesi",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(kategori ? { category: { slug: kategori } } : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { category: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-amber-900">Ürünlerimiz</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryLink slug={undefined} label="Tümü" active={!kategori} />
        {categories.map((category) => (
          <CategoryLink
            key={category.id}
            slug={category.slug}
            label={category.name}
            active={kategori === category.slug}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-stone-500">Bu kategoride ürün bulunamadı.</p>
      )}
    </div>
  );
}

function CategoryLink({
  slug,
  label,
  active,
}: {
  slug?: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={slug ? `/urunler?kategori=${slug}` : "/urunler"}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-amber-600 bg-amber-600 text-white"
          : "border-amber-200 bg-white text-stone-700 hover:border-amber-400"
      }`}
    >
      {label}
    </a>
  );
}
