import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-stone-800">
        Yeni Ürün Ekle
      </h1>
      <form action={createProduct} className="flex flex-col gap-4">
        <Field label="Ürün Adı" name="name" required />
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Açıklama
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fiyat (TL)" name="price" type="number" step="0.01" required />
          <Field label="Stok" name="stock" type="number" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Kategori
          </label>
          <select
            name="categoryId"
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
        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        step={step}
        required={required}
        className="w-full rounded-lg border border-stone-300 px-3 py-2"
      />
    </div>
  );
}
