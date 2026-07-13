export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-amber-50/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div id="hakkimizda">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            Palet Pastaneleri
          </h3>
          <p className="mb-3 text-sm text-stone-600">
            Trabzon&apos;un tatlı yüzü. Taze malzemelerle hazırladığımız
            pasta, tatlı ve kuru pastalarımızı artık online sipariş ile
            kapınıza kadar getiriyoruz.
          </p>
          <p className="text-sm font-semibold text-amber-700">
            #TrabzonunTatlıYüzü
          </p>
          <div className="mt-3 flex gap-4 text-sm text-stone-600">
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
        <div id="iletisim">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            İletişim
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            <li>Telefon: (0462) 321 35 79</li>
            <li>E-posta: info@palet.com.tr</li>
            <li>Adres: Uzun Sokak, Trabzon</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            Çalışma Saatleri
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            <li>Hafta içi: 08:00 - 21:00</li>
            <li>Hafta sonu: 09:00 - 22:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-amber-100 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Palet Pastaneleri. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
