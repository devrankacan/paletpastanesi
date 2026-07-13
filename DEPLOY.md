# VPS Deploy Rehberi (test.palet.com.tr)

Bu rehber, siteyi Docker ile VPS'ine, mevcut sitelerini etkilemeden ve tek
bir boş port kullanarak kurmanı sağlar. Nginx bu portu `test.palet.com.tr`
subdomain'ine yönlendirir.

## 0) Ön koşullar

VPS'inde şunlar kurulu olmalı:

```bash
docker --version
docker compose version
nginx -v
```

Yoksa (Ubuntu/Debian için):

```bash
curl -fsSL https://get.docker.com | sh
sudo apt install -y nginx certbot python3-certbot-nginx
```

**Boş bir port belirle** (örn. `3010`). Kullanımda olup olmadığını kontrol et:

```bash
sudo ss -tulpn | grep 3010
```
Çıktı boşsa port müsait demektir.

## 1) Repoyu VPS'e çek

```bash
git clone <bu-reponun-git-url'i> palet-pastaneleri
cd palet-pastaneleri
git checkout claude/bold-pasteur-m4175p   # veya main'e merge edildiyse main
```

## 2) .env dosyasını hazırla

```bash
cp .env.example .env
nano .env
```

Doldurman gerekenler:

- `POSTGRES_PASSWORD` — güçlü, rastgele bir şifre
- `DATABASE_URL` — `POSTGRES_PASSWORD` ile aynı şifreyi kullanacak şekilde güncelle (docker-compose için bu değer aslında kullanılmaz, sadece dokümantasyon amaçlı; gerçek bağlantıyı `POSTGRES_*` değerlerinden otomatik kurar)
- `APP_PORT` — 0. adımda belirlediğin boş port (örn. `3010`)
- `AUTH_SECRET` — `openssl rand -hex 32` ile üret
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin panel girişin (üretimde güçlü bir şifre kullan)
- `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` — hazırsa gerçek iyzico anahtarların, yoksa boş bırak (site test modunda çalışmaya devam eder)

## 3) Container'ları ayağa kaldır

```bash
docker compose up -d --build
docker compose logs -f app   # "Ready" mesajını görünce Ctrl+C
```

Bu komut:
- `palet-pastaneleri-db` (PostgreSQL, sadece Docker network'ü içinde erişilebilir, host'a port açmaz)
- `palet-pastaneleri-app` (Next.js, sadece `APP_PORT` host portunda erişilebilir)

container'larını, kendi izole `palet-pastaneleri-net` network'ünde ve
`palet_pastaneleri_pgdata` volume'ünde çalıştırır. Sunucudaki diğer siteler/
container'lar bundan etkilenmez.

Migration'lar container başlarken otomatik uygulanır (`docker-entrypoint.sh`).

## 4) Örnek veri + admin kullanıcı oluştur (bir kere)

```bash
docker compose --profile tools run --rm seed
```

## 5) Portun çalıştığını doğrula

```bash
curl -I http://localhost:3010
```

`200 OK` dönmeli.

## 6) Nginx reverse proxy kur

`/etc/nginx/sites-available/test.palet.com.tr` dosyasını oluştur:

```nginx
server {
    listen 80;
    server_name test.palet.com.tr;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`3010` yerine kendi `APP_PORT` değerini yaz. Sonra:

```bash
sudo ln -s /etc/nginx/sites-available/test.palet.com.tr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7) DNS kaydı ekle

Domain sağlayıcında (palet.com.tr'nin DNS yönetimi neredeyse orada):

```
Tip: A
Ad: test
Değer: <VPS IP adresin>
```

Yayılması birkaç dakika-birkaç saat sürebilir. `dig test.palet.com.tr` ile kontrol edebilirsin.

## 8) SSL sertifikası al

```bash
sudo certbot --nginx -d test.palet.com.tr
```

Artık `https://test.palet.com.tr` üzerinden siteye erişebilirsin.

## Bakım komutları

```bash
# Logları izle
docker compose logs -f app

# Kod güncellemesi sonrası yeniden build+deploy
git pull
docker compose up -d --build

# Container'ları durdur
docker compose down

# Veritabanını yedekle
docker compose exec db pg_dump -U palet palet > yedek_$(date +%F).sql
```

## Gerçek domaine (palet.com.tr) geçiş

Subdomain'de test edip onayladıktan sonra:

1. Aynı sunucuda `/etc/nginx/sites-available/palet.com.tr` için de aynı
   `proxy_pass http://127.0.0.1:3010;` bloğunu ekle (mevcut WordPress
   site için kullanılan konfigürasyonun **yerine** geçecek — WordPress'i
   tamamen kapatmadan önce mutlaka yedek al).
2. `sudo certbot --nginx -d palet.com.tr -d www.palet.com.tr`
3. DNS'te `palet.com.tr` A kaydının VPS IP'ne işaret ettiğinden emin ol
   (muhtemelen zaten öyle, WordPress de aynı sunucuda).
4. `.env`'deki `IYZICO_BASE_URL`'i `https://api.iyzipay.com` yap ve
   gerçek (sandbox olmayan) `IYZICO_API_KEY`/`IYZICO_SECRET_KEY` değerlerini gir.
5. `docker compose up -d --build` ile yeniden başlat.

WordPress sitesinin dosyalarını/veritabanını hemen silme — bir süre yedek
olarak sunucuda tut.
