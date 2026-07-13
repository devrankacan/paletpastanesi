import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-stone-800">
        Ürünü Düzenle
      </h1>
      <form action={updateProductWithId} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Ürün Adı
          </label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Açıklama
          </label>
          <textarea
            name="description"
            defaultValue={product.description}
            required
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Fiyat (TL)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={(product.price / 100).toFixed(2)}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Stok
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={product.stock}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Kategori
          </label>
          <select
            name="categoryId"
            defaultValue={product.categoryId}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product.isActive}
          />
          Sitede yayında
        </label>
        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
