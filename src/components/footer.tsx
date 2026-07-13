import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  // Next.js'in otomatik oluşturduğu /_not-found gibi sayfalar build sırasında
  // statik olarak üretilmeye çalışıldığında veritabanı erişimi olmayabilir;
  // footer navigasyonu kritik olmadığından bu durumda sessizce boş liste kullanılır.
  const categories = await prisma.category
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <footer className="border-t border-amber-100 bg-amber-50/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div id="hakkimizda">
          <Image
            src="/site-gorselleri/logo.png"
            alt="Palet Pastaneleri"
            width={140}
            height={62}
            className="mb-3 h-10 w-auto object-contain"
          />
          <p className="mb-1 text-sm font-semibold text-stone-700">
            Bize Ulaşın
          </p>
          <p className="mb-3 text-sm text-stone-600">(0462) 321 35 79</p>
          <div className="flex gap-4 text-sm text-stone-600">
            <a
              href="https://www.instagram.com/paletpastane/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/PaletPastane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-amber-900">
            Sayfalar
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            <li>
              <Link href="/" className="hover:text-amber-700">
                Anasayfa
              </Link>
            </li>
            <li>
              <Link href="/#hakkimizda" className="hover:text-amber-700">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/urunler" className="hover:text-amber-700">
                Mağaza
              </Link>
            </li>
            <li>
              <Link href="/#iletisim" className="hover:text-amber-700">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-amber-900">
            Ürünler
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/urunler?kategori=${category.slug}`}
                  className="hover:text-amber-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-amber-900">
            Sözleşmeler
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            <li>
              <Link
                href="/iptal-ve-iade-politikasi"
                className="hover:text-amber-700"
              >
                İptal ve İade Politikası
              </Link>
            </li>
            <li>
              <Link
                href="/mesafeli-satis-sozlesmesi"
                className="hover:text-amber-700"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>
            <li>
              <Link
                href="/gizlilik-sozlesmesi"
                className="hover:text-amber-700"
              >
                Gizlilik Sözleşmesi
              </Link>
            </li>
            <li>
              <Link
                href="/teslimat-sozlesmesi"
                className="hover:text-amber-700"
              >
                Teslimat Sözleşmesi
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-amber-100 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Palet Pastaneleri. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
