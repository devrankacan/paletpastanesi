import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [orderCount, productCount, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 p-6">
          <p className="text-sm text-stone-500">Toplam Sipariş</p>
          <p className="text-3xl font-bold text-amber-900">{orderCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 p-6">
          <p className="text-sm text-stone-500">Toplam Ürün</p>
          <p className="text-3xl font-bold text-amber-900">{productCount}</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">
            Son Siparişler
          </h2>
          <Link
            href="/admin/siparisler"
            className="text-sm font-medium text-amber-700 hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="divide-y divide-stone-200 rounded-xl border border-stone-200">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span className="text-stone-600">{order.fullName}</span>
              <span className="text-stone-500">{order.status}</span>
              <span className="font-medium">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className="px-4 py-3 text-sm text-stone-500">
              Henüz sipariş yok.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
