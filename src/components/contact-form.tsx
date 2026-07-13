"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "Teşekkür",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        subject: "Teşekkür",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="iletisim" className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-amber-900">
        Fikirlerinizi Önemsiyoruz!
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-stone-500">
        Şikayet, öneri, teşekkür ve diğer tüm konulardaki mesajlarınızı
        aşağıdaki formu doldurarak bizlere ulaştırabilirsiniz.
      </p>

      {status === "sent" ? (
        <p className="mt-10 rounded-xl bg-green-50 p-6 text-green-700">
          Mesajınız için teşekkür ederiz, en kısa sürede dönüş yapacağız.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Ad Soyad *
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Telefon *
            </label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Konu *
            </label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            >
              <option>Teşekkür</option>
              <option>Öneri</option>
              <option>Şikayet</option>
              <option>Diğer</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Mesaj *
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 sm:col-span-2">
              Bir hata oluştu, lütfen tekrar deneyin.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:bg-stone-300 sm:col-span-2"
          >
            {status === "sending" ? "Gönderiliyor..." : "✉ Gönder"}
          </button>
        </form>
      )}
    </section>
  );
}
