# Palet Pastaneleri — Online Sipariş Sitesi

Next.js (App Router) + Prisma + iyzico ile geliştirilmiş, WordPress'ten
taşınmakta olan Palet Pastaneleri için özel yazılım altyapılı e-ticaret sitesi.

## Teknolojiler

- **Next.js 16** (TypeScript, App Router, Tailwind CSS)
- **Prisma** + **PostgreSQL** (yerelde de, üretimde de)
- **NextAuth** (Credentials) — admin paneli girişi
- **iyzico** — kredi kartı ile online ödeme (Checkout Form API)
- **Docker / docker-compose** — VPS'e izole şekilde kurulum için (bkz. [DEPLOY.md](./DEPLOY.md))

## Kurulum (yerel geliştirme)

Bir PostgreSQL sunucusuna ihtiyacın var (yerelde kurulu Postgres, ya da
`docker run -e POSTGRES_PASSWORD=palet -e POSTGRES_USER=palet -e POSTGRES_DB=palet -p 5432:5432 postgres:16-alpine`).

```bash
cp .env.example .env   # DATABASE_URL'i kendi Postgres'ine göre düzenle
npm install
npx prisma migrate dev
npm run db:seed         # örnek kategoriler/ürünler + admin kullanıcı oluşturur
npm run dev
```

Site: http://localhost:3000
Admin paneli: http://localhost:3000/admin (varsayılan giriş `.env` dosyasındaki
`ADMIN_EMAIL` / `ADMIN_PASSWORD` değerleridir, seed çalıştırıldığında bu
bilgilerle bir admin kullanıcı oluşturulur)

## VPS'e Deploy

Siteyi kendi VPS'ine (Docker ile, diğer sitelerini etkilemeden, tek bir
subdomain + boş port üzerinden) kurmak için adım adım rehber:
**[DEPLOY.md](./DEPLOY.md)**

## Ortam Değişkenleri (.env)

`.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldur:

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantısı |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | docker-compose ile deploy ederken kullanılan veritabanı kimlik bilgileri |
| `APP_PORT` | docker-compose ile deploy ederken sitenin yayınlanacağı host portu |
| `AUTH_SECRET` | NextAuth için rastgele, gizli bir anahtar |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed script'in oluşturacağı admin girişi |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` | iyzico merchant panelinden alınan sandbox/production anahtarları |
| `IYZICO_BASE_URL` | Sandbox: `https://sandbox-api.iyzipay.com`, canlıya geçince `https://api.iyzipay.com` |

**iyzico anahtarları boşken** site "test modu"nda çalışır: sipariş oluşturulur
ama ödeme adımı atlanır ve sipariş "Ödeme Bekleniyor" durumunda kalır. Gerçek
kredi kartı tahsilatı için iyzico'dan (https://www.iyzico.com) merchant hesabı
alıp `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` değerlerini girmen yeterli — kodda
başka bir değişiklik gerekmez.

## WordPress İçeriğinin Aktarımı

Mevcut WordPress/WooCommerce sitesindeki ürünler bu siteye taşınacaksa:

1. WooCommerce kullanılıyorsa **Ürünler → Dışa Aktar** ile CSV alınabilir ya da
   WooCommerce REST API üzerinden ürünler çekilebilir.
2. Alınan veriler `prisma/seed.ts` dosyasındaki `categories` dizisine uygun
   şekilde eklenir (veya ayrı bir aktarım script'i yazılır) ve
   `npm run db:seed` ile veritabanına işlenir.
3. Ürün görselleri `public/` altına konup `Product.imageUrl` alanına
   yollarının eklenmesiyle gösterilebilir (şu an ürünler emoji ikonla
   gösteriliyor, gerçek görseller eklenince otomatik kullanılacak şekilde
   `product-card.tsx` ve ürün detay sayfası güncellenebilir).

## Proje Yapısı

```
prisma/schema.prisma       Veritabanı şeması (Kategori, Ürün, Sipariş, Ödeme, Kullanıcı)
prisma/seed.ts             Örnek pastane ürünleri + admin kullanıcı
src/app/                   Sayfalar (ana sayfa, ürünler, sepet, checkout, admin)
src/app/api/checkout       Sipariş oluşturma + iyzico ödeme başlatma
src/app/api/payment/iyzico Ödeme sonrası iyzico callback'i
src/lib/payment/iyzico.ts  iyzico entegrasyon katmanı
src/lib/cart-context.tsx   Tarayıcıda (localStorage) tutulan sepet durumu
```

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx prisma migrate dev` — veritabanı migration'larını uygula
- `npm run db:seed` — örnek veri + admin kullanıcı oluşturur
- `npx prisma studio` — veritabanını tarayıcıda görüntüle/düzenle
- `docker compose up -d --build` — Docker ile ayağa kaldır (bkz. DEPLOY.md)
