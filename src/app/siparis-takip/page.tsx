"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PAID: "Ödeme Alındı",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

type OrderResult = {
  id: string;
  status: string;
  totalPrice: number;
  items: { name: string; quantity: number }[];
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/siparis-takip?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Sipariş bulunamadı.");
        return;
      }

      setResult(data);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-amber-900">
        Sipariş Takip
      </h1>
      <p className="mb-8 text-sm text-stone-500">
        Siparişinizin durumunu görmek için sipariş numaranızı ve sipariş
        verirken kullandığınız telefon numarasını girin.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Sipariş Numarası
          </label>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Telefon
          </label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-700 disabled:bg-stone-300"
        >
          {isSubmitting ? "Sorgulanıyor..." : "Sorgula"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="rounded-xl border border-stone-200 p-4">
          <p className="mb-2 font-medium text-stone-800">
            Durum: {statusLabels[result.status] ?? result.status}
          </p>
          <ul className="mb-2 space-y-1 text-sm text-stone-600">
            {result.items.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="font-semibold text-stone-900">
            Toplam: {formatPrice(result.totalPrice)}
          </p>
          <Link
            href={`/siparis/${result.id}`}
            className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
          >
            Sipariş detayını gör →
          </Link>
        </div>
      )}
    </div>
  );
}
