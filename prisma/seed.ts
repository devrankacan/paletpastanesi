import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// palet.com.tr'deki gerçek kategoriler ve gerçek ürün fotoğrafları (repoya
// yüklenen dosyalar) referans alınmıştır. Kuru Pastalar için henüz gerçek
// ürün/görsel elimizde olmadığından bu kategori şimdilik boş.
const categories = [
  {
    name: "Pastalar",
    slug: "pastalar",
    products: [
      {
        name: "Şarlot Yaş Pasta",
        slug: "sarlot-yas-pasta",
        description:
          "Bisküvi kenarlı, bol meyveli klasik şarlot yaş pasta (4-6 kişilik).",
        price: 104999,
        stock: 10,
        imageUrl: "/urun-gorselleri/sarlot-yas-pasta.png",
      },
      {
        name: "Çilekli Profiterol Soslu Yaş Pasta (4-6 Kişilik)",
        slug: "cilekli-profiterol-soslu-yas-pasta",
        description:
          "Taze çilek ve profiterol soslu, bol kremalı yaş pasta.",
        price: 104999,
        stock: 8,
        imageUrl: "/urun-gorselleri/cilekli-profiterol-soslu-yas-pasta.png",
      },
      {
        name: "Çikolatalı Muzlu Rulo Pasta",
        slug: "cikolatali-muzlu-rulo-pasta",
        description: "Çikolata aşklı, muzlu ve taze meyveli rulo pasta.",
        price: 20999,
        stock: 15,
        imageUrl: "/urun-gorselleri/cikolatali-muzlu-rulo-pasta.png",
      },
      {
        name: "Çilekli Magnolyalı Yaş Pasta",
        slug: "cilekli-magnolyali-yas-pasta",
        description: "Taze çilekli, magnolyalı sütlü yaş pasta.",
        price: 104999,
        stock: 8,
        imageUrl: "/urun-gorselleri/cilekli-magnolyali-yas-pasta.png",
      },
      {
        name: "Frambuazlı Yaş Pasta",
        slug: "frambuazli-yas-pasta",
        description: "Taze frambuazlı, hafif kremalı yaş pasta.",
        price: 89999,
        stock: 10,
        imageUrl: "/urun-gorselleri/frambuazli-yas-pasta.png",
      },
      {
        name: "Kara Orman Yaş Pasta (6-8 Kişilik)",
        slug: "kara-orman-yas-pasta",
        description:
          "Vişneli, çikolatalı klasik kara orman pasta (6-8 kişilik).",
        price: 129999,
        stock: 6,
        imageUrl: "/urun-gorselleri/kara-orman-yas-pasta.png",
      },
      {
        name: "Karışık Meyveli Yaş Pasta (2 Kişilik)",
        slug: "karisik-meyveli-yas-pasta",
        description: "Mevsim meyveleriyle süslenmiş, küçük boy yaş pasta (2 kişilik).",
        price: 39999,
        stock: 15,
        imageUrl: "/urun-gorselleri/karisik-meyveli-yas-pasta.png",
      },
      {
        name: "Lotuslu Çilekli Yaş Pasta (4-6 Kişilik)",
        slug: "lotuslu-cilekli-yas-pasta",
        description: "Lotus bisküvili, çilekli, bol kremalı yaş pasta.",
        price: 104999,
        stock: 8,
        imageUrl: "/urun-gorselleri/lotuslu-cilekli-yas-pasta.png",
      },
      {
        name: "Muzlu Profiterol Soslu Yaş Pasta (4-6 Kişilik)",
        slug: "muzlu-profiterol-soslu-yas-pasta",
        description: "Muzlu ve profiterol soslu, bol kremalı yaş pasta.",
        price: 104999,
        stock: 8,
        imageUrl: "/urun-gorselleri/muzlu-profiterol-soslu-yas-pasta.png",
      },
      {
        name: "Special Yaş Pasta (4-6 Kişilik)",
        slug: "special-yas-pasta",
        description: "Palet Pastaneleri'nin özel tarifi, imza yaş pastası.",
        price: 109999,
        stock: 8,
        imageUrl: "/urun-gorselleri/special-yas-pasta.png",
      },
      {
        name: "Uğur Böceği Yaş Pasta (4-6 Kişilik)",
        slug: "ugur-boceyi-yas-pasta",
        description: "Çocuklara özel, uğur böceği temalı süslü yaş pasta.",
        price: 114999,
        stock: 6,
        imageUrl: "/urun-gorselleri/ugur-boceyi-yas-pasta.png",
      },
      {
        name: "Çikolatalı Sarma Pasta (6-8 Kişilik)",
        slug: "cikolatali-sarma-pasta",
        description: "Bol çikolatalı, rulo şeklinde sarma pasta (6-8 kişilik).",
        price: 129999,
        stock: 6,
        imageUrl: "/urun-gorselleri/cikolatali-sarma-pasta.png",
      },
    ],
  },
  {
    name: "Şerbetli Tatlılar",
    slug: "serbetli-tatlilar",
    products: [
      {
        name: "Cevizli Baklava",
        slug: "cevizli-baklava",
        description: "Bol cevizli, ince yufkalı geleneksel baklava (1 kg).",
        price: 89999,
        stock: 20,
        imageUrl: "/urun-gorselleri/cevizli-baklava.png",
      },
      {
        name: "Kuru Baklava",
        slug: "kuru-baklava",
        description: "Az şerbetli, çıtır yufkalı kuru baklava (1 kg).",
        price: 79999,
        stock: 20,
        imageUrl: "/urun-gorselleri/kuru-baklava.png",
      },
      {
        name: "Fındıklı Köy Burması",
        slug: "findikli-koy-burmasi",
        description: "Karadeniz fındığıyla hazırlanan geleneksel köy burması (1 kg).",
        price: 84999,
        stock: 15,
        imageUrl: "/urun-gorselleri/findikli-koy-burmasi.png",
      },
    ],
  },
  {
    name: "Kuru Pastalar",
    slug: "kuru-pastalar",
    products: [],
  },
  {
    name: "Sütlü ve Adet Tatlılar",
    slug: "sutlu-ve-adet-tatlilar",
    products: [
      {
        name: "İzmir Bomba",
        slug: "izmir-bomba",
        description: "Bol kremalı, çikolata kaplamalı adet tatlısı İzmir bomba.",
        price: 6499,
        stock: 25,
        imageUrl: "/urun-gorselleri/izmir-bomba.png",
      },
      {
        name: "İbiza",
        slug: "ibiza",
        description: "Meyveli ve kremalı, davetlerin gözdesi İbiza pasta.",
        price: 32499,
        stock: 12,
        imageUrl: "/urun-gorselleri/ibiza.png",
      },
      {
        name: "Tiramisu",
        slug: "tiramisu",
        description: "İtalyan usulü kahveli, mascarpone kremalı tiramisu.",
        price: 32499,
        stock: 15,
        imageUrl: "/urun-gorselleri/tiramisu.png",
      },
      {
        name: "Profiterol",
        slug: "profiterol",
        description: "Bol çikolata soslu, kremalı profiterol (porsiyon).",
        price: 32499,
        stock: 15,
        imageUrl: "/urun-gorselleri/profiterol.png",
      },
      {
        name: "Ekler",
        slug: "ekler",
        description: "Kremalı, çikolata kaplamalı klasik ekler.",
        price: 8999,
        stock: 25,
        imageUrl: "/urun-gorselleri/ekler.png",
      },
      {
        name: "Laz Böreği",
        slug: "laz-boregi",
        description: "Karadeniz'in meşhur mısır unlu, muhallebili laz böreği.",
        price: 12999,
        stock: 20,
        imageUrl: "/urun-gorselleri/laz-boregi.png",
      },
    ],
  },
];

async function main() {
  // Dev veritabanını sıfırdan gerçek ürün listesiyle doldurmak için
  // önceki test siparişlerini ve eski ürün/kategorileri temizliyoruz.
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const [order, category] of categories.entries()) {
    const createdCategory = await prisma.category.create({
      data: { name: category.name, slug: category.slug, order },
    });

    for (const product of category.products) {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: "imageUrl" in product ? product.imageUrl : null,
          categoryId: createdCategory.id,
        },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@paletpastanesi.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "degistir123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Yönetici",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seed tamamlandı. Admin girişi: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
