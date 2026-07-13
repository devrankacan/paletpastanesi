export function LegalPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-amber-900">{title}</h1>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-stone-600">
        Bu sayfanın içeriği henüz eklenmedi. Gerçek {title.toLowerCase()}{" "}
        metnini gönderdiğinizde bu sayfaya ekleyeceğiz.
      </p>
    </div>
  );
}
