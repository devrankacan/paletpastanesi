"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const priceTl = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const categoryId = String(formData.get("categoryId"));

  await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description,
      price: Math.round(priceTl * 100),
      stock,
      categoryId,
    },
  });

  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  redirect("/admin/urunler");
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const priceTl = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const categoryId = String(formData.get("categoryId"));
  const isActive = formData.get("isActive") === "on";

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price: Math.round(priceTl * 100),
      stock,
      categoryId,
      isActive,
    },
  });

  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  redirect("/admin/urunler");
}

export async function toggleProductActive(
  productId: string,
  isActive: boolean,
) {
  await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
}
