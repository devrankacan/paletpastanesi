export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-amber-50/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div id="hakkimizda">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            Palet Pastanesi
          </h3>
          <p className="text-sm text-stone-600">
            1998&apos;den bu yana taze malzemelerle hazırladığımız pasta,
            kek, kurabiye ve tatlılarımızı artık online sipariş ile
            kapınıza kadar getiriyoruz.
          </p>
        </div>
        <div id="iletisim">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            İletişim
          </h3>
          <ul className="space-y-1 text-sm text-stone-600">
            <li>Telefon: (0212) 000 00 00</li>
            <li>E-posta: info@paletpastanesi.com</li>
            <li>Adres: Örnek Mah. Tatlı Sok. No:1, İstanbul</li>
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
        © {new Date().getFullYear()} Palet Pastanesi. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
