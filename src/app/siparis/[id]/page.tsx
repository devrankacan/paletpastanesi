import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PAID: "Ödeme Alındı",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, payment: true },
  });

  if (!order) {
    notFound();
  }

  const isDemoMode = !order.payment?.providerPaymentId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-amber-900">
        Siparişiniz Alındı
      </h1>
      <p className="mb-6 text-sm text-stone-500">Sipariş No: {order.id}</p>

      {isDemoMode && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          iyzico ödeme entegrasyonu henüz aktif değil (test modu). Bu sipariş
          ödeme alınmadan oluşturuldu; gerçek ödeme almak için .env dosyasına
          IYZICO_API_KEY / IYZICO_SECRET_KEY eklendiğinde sipariş akışı
          otomatik olarak iyzico ödeme formuna yönlenecek.
        </div>
      )}

      <div className="mb-6 rounded-xl border border-stone-200 p-4">
        <p className="font-medium text-stone-800">
          Durum: {statusLabels[order.status] ?? order.status}
        </p>
      </div>

      <div className="mb-6 divide-y divide-stone-200 rounded-xl border border-stone-200">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3 font-semibold text-stone-900">
          <span>Toplam</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-stone-200 p-4 text-sm text-stone-600">
        <p className="font-medium text-stone-800">Teslimat Bilgileri</p>
        <p>{order.fullName}</p>
        <p>{order.phone}</p>
        <p>
          {order.addressLine}, {order.district}/{order.city}
        </p>
      </div>

      <Link
        href="/urunler"
        className="rounded-full bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-700"
      >
        Alışverişe Devam Et
      </Link>
    </div>
  );
}
