import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Faq } from "@/components/faq";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            #TrabzonunTatlıYüzü
          </span>
          <h1 className="text-4xl font-bold text-amber-900 sm:text-5xl">
            Taze Pasta ve Tatlılar Kapınızda
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Palet Pastaneleri&apos;nin özenle hazırladığı pastalar, şerbetli
            tatlılar, kuru pastalar ve adet tatlıları artık birkaç tıkla
            sipariş edebilirsiniz.
          </p>
          <Link
            href="/urunler"
            className="rounded-full bg-amber-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-amber-700"
          >
            Ürünleri İncele
          </Link>
        </div>
      </section>

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
