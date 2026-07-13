import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Pastalar",
    slug: "pastalar",
    products: [
      {
        name: "Yaş Pasta (Çilekli)",
        slug: "yas-pasta-cilekli",
        description: "Taze çilek ve kremalı, yumuşak pandispanya tabanlı yaş pasta.",
        price: 45000,
        stock: 10,
      },
      {
        name: "Çikolatalı Islak Pasta",
        slug: "cikolatali-islak-pasta",
        description: "Bol çikolata soslu, yoğun kakaolu ıslak pasta dilimi.",
        price: 18000,
        stock: 20,
      },
      {
        name: "Red Velvet Pasta",
        slug: "red-velvet-pasta",
        description: "Cream cheese kremalı klasik red velvet pasta.",
        price: 48000,
        stock: 8,
      },
    ],
  },
  {
    name: "Kekler",
    slug: "kekler",
    products: [
      {
        name: "Limonlu Kek",
        slug: "limonlu-kek",
        description: "Taze limon kabuğu ile hazırlanmış, sulu kek.",
        price: 9000,
        stock: 30,
      },
      {
        name: "Cevizli Kek",
        slug: "cevizli-kek",
        description: "Bol cevizli, geleneksel tarif ile yapılan ev keki.",
        price: 9500,
        stock: 25,
      },
    ],
  },
  {
    name: "Kurabiyeler",
    slug: "kurabiyeler",
    products: [
      {
        name: "Un Kurabiyesi",
        slug: "un-kurabiyesi",
        description: "Ağızda dağılan, geleneksel un kurabiyesi (250g).",
        price: 7500,
        stock: 40,
      },
      {
        name: "Damla Çikolatalı Kurabiye",
        slug: "damla-cikolatali-kurabiye",
        description: "Bol damla çikolatalı, çıtır kurabiye (250g).",
        price: 8000,
        stock: 40,
      },
    ],
  },
  {
    name: "Tatlılar",
    slug: "tatlilar",
    products: [
      {
        name: "Profiterol",
        slug: "profiterol",
        description: "Bol çikolata soslu, kremalı profiterol (porsiyon).",
        price: 12000,
        stock: 15,
      },
      {
        name: "Tiramisu",
        slug: "tiramisu",
        description: "İtalyan usulü kahveli, mascarpone kremalı tiramisu.",
        price: 14000,
        stock: 15,
      },
    ],
  },
];

async function main() {
  for (const [order, category] of categories.entries()) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order },
      create: { name: category.name, slug: category.slug, order },
    });

    for (const product of category.products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: createdCategory.id,
        },
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
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
