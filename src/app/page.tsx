import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { CategoryCards } from "@/components/category-cards";
import { Faq } from "@/components/faq";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      take: 6,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <section className="relative flex h-[420px] items-center justify-center overflow-hidden bg-amber-900 text-center sm:h-[520px]">
        <Image
          src="/site-gorselleri/hero-1.png"
          alt="Palet Pastaneleri"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative flex flex-col items-center gap-6 px-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            #TrabzonunTatlıYüzü
          </span>
          <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
            Palet&apos;in Eşsiz Lezzet Dünyasını Keşfedin
          </h1>
          <p className="max-w-xl text-lg text-white/90">
            Her damak tadına uygun, günlük ve taze pasta, tatlı ve kuru pasta
            seçenekleri artık birkaç tıkla kapınızda.
          </p>
          <Link
            href="/urunler"
            className="rounded-full bg-amber-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
          >
            Ürünleri İncele
          </Link>
        </div>
      </section>

      <CategoryCards categories={categories} />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-amber-900">
            Öne Çıkan Ürünler
          </h2>
          <Link
            href="/urunler"
            className="text-sm font-medium text-amber-700 hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featuredProducts.length === 0 && (
          <p className="text-stone-500">
            Henüz ürün eklenmedi. Yakında burada olacaklar!
          </p>
        )}
      </section>

      <Faq />
    </div>
  );
}
