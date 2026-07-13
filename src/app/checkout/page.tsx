"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    addressLine: "",
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-stone-500">
        Sepetiniz boş. Sipariş vermek için önce ürün ekleyin.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Sipariş oluşturulamadı.");
        return;
      }

      clearCart();

      if (data.demoMode) {
        router.push(`/siparis/${data.orderId}`);
      } else {
        router.push(`/odeme/${data.orderId}`);
      }
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-amber-900">
        Teslimat Bilgileri
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Ad Soyad"
          value={form.fullName}
          onChange={(v) => setForm({ ...form, fullName: v })}
          required
        />
        <Field
          label="Telefon"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          required
        />
        <Field
          label="E-posta"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Şehir"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
            required
          />
          <Field
            label="İlçe"
            value={form.district}
            onChange={(v) => setForm({ ...form, district: v })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Adres
          </label>
          <textarea
            required
            value={form.addressLine}
            onChange={(e) =>
              setForm({ ...form, addressLine: e.target.value })
            }
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
          <span className="text-lg font-semibold text-stone-900">
            Toplam: {formatPrice(totalPrice)}
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:bg-stone-300"
          >
            {isSubmitting ? "İşleniyor..." : "Ödemeye Geç"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2"
      />
    </div>
  );
}
