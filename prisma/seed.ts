import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// palet.com.tr'deki gerçek kategori ve ürün adı/fiyatları referans alınmıştır.
// Kuru Pastalar ve Şerbetli Tatlılar için gerçek ürün listesi henüz elimizde
// olmadığından bu iki kategoride yer tutucu (placeholder) ürünler var.
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
    ],
  },
  {
    name: "Şerbetli Tatlılar",
    slug: "serbetli-tatlilar",
    products: [
      {
        name: "Fıstıklı Baklava",
        slug: "fistikli-baklava",
        description: "Bol Antep fıstıklı, ince yufkalı geleneksel baklava (1 kg).",
        price: 89999,
        stock: 20,
      },
      {
        name: "Şöbiyet",
        slug: "sobiyet",
        description: "Kaymaklı ve fıstıklı, şerbetli geleneksel şöbiyet (1 kg).",
        price: 94999,
        stock: 15,
      },
    ],
  },
  {
    name: "Kuru Pastalar",
    slug: "kuru-pastalar",
    products: [
      {
        name: "Kakaolu Çay Kurabiyesi",
        slug: "kakaolu-cay-kurabiyesi",
        description: "Çay saatlerinin vazgeçilmezi, kakaolu kuru pasta çeşidi (500g).",
        price: 24999,
        stock: 30,
      },
      {
        name: "Karışık Kuru Pasta Tepsisi",
        slug: "karisik-kuru-pasta-tepsisi",
        description: "Çeşit çeşit kuru pastalardan oluşan ikramlık tepsi.",
        price: 39999,
        stock: 20,
      },
    ],
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
        imageUrl: "/urun-gorselleri/profiterol.png",
        stock: 15,
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
