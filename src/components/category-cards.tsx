import Image from "next/image";
import Link from "next/link";

const categoryInfo: Record<string, { image: string; tagline: string }> = {
  pastalar: {
    image: "/site-gorselleri/kategori-pastalar.png",
    tagline: "Mutluluğunuzu taçlandıran lezzetler.",
  },
  "serbetli-tatlilar": {
    image: "/site-gorselleri/kategori-serbetli-tatlilar.png",
    tagline: "Bol fıstıklı, çıtır çıtır lezzet şöleni.",
  },
  "kuru-pastalar": {
    image: "/site-gorselleri/kategori-kuru-pastalar.png",
    tagline: "Çay saatlerinin vazgeçilmez lezzeti.",
  },
  "sutlu-ve-adet-tatlilar": {
    image: "/site-gorselleri/kategori-sutlu-ve-adet-tatlilar.png",
    tagline: "Hafif ve ferahlatıcı gurme dokunuşlar.",
  },
};

export function CategoryCards({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const info = categoryInfo[category.slug];
          return (
            <Link
              key={category.id}
              href={`/urunler?kategori=${category.slug}`}
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-md"
            >
              {info?.image ? (
                <Image
                  src={info.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-amber-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative p-5 text-white">
                <h3 className="text-lg font-bold">{category.name}</h3>
                {info?.tagline && (
                  <p className="mt-1 text-sm text-white/90">{info.tagline}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
