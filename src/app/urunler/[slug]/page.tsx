import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-2xl bg-amber-50 text-8xl">
          🍰
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-wide text-amber-600">
            {product.category.name}
          </span>
          <h1 className="text-3xl font-bold text-stone-900">
            {product.name}
          </h1>
          <p className="text-stone-600">{product.description}</p>
          <p className="text-2xl font-semibold text-amber-700">
            {formatPrice(product.price)}
          </p>
          <AddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            imageUrl={product.imageUrl}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
