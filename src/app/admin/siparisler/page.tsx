import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus } from "./actions";

const statuses = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PAID: "Ödeme Alındı",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-stone-800">Siparişler</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-stone-200 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-stone-800">
                  {order.fullName} · {order.phone}
                </p>
                <p className="text-xs text-stone-500">
                  {order.id} ·{" "}
                  {new Date(order.createdAt).toLocaleString("tr-TR")}
                </p>
              </div>
              <form
                action={async (formData) => {
                  "use server";
                  await updateOrderStatus(
                    order.id,
                    formData.get("status") as (typeof statuses)[number],
                  );
                }}
                className="flex items-center gap-2"
              >
                <select
                  key={order.status}
                  name="status"
                  defaultValue={order.status}
                  className="rounded-lg border border-stone-300 px-2 py-1 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-full bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
                >
                  Güncelle
                </button>
              </form>
            </div>
            <div className="divide-y divide-stone-100 text-sm">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-end text-sm font-semibold text-stone-900">
              Toplam: {formatPrice(order.totalPrice)}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-stone-500">Henüz sipariş yok.</p>
        )}
      </div>
    </div>
  );
}
