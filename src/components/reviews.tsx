const reviews = [
  {
    name: "Levent Kılıç",
    text: "Tavsiye edilen bir yer.",
  },
  {
    name: "Betül Kalafat",
    text: "Bugüne kadar yediğim en güzel pastalardan biriydi 🙏🏼 Sunumu çok şık, tadı ise inanılmazdı. İşini severek yapan insanların farkı gerçekten hissediliyor. Herkese gönül rahatlığıyla tavsiye ederim.",
  },
  {
    name: "Turan Durmuş",
    text: "Uzun sokakta hizmet vermektedir. Ürünler çeşitli ve kaliteli. İçerde servis var. Paket olarak da satın alabilirsiniz.",
  },
];

export function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-amber-900">
        Bizi Değerlendirebilirsiniz
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-stone-500">
        Aldığınız hizmet, ürün ve kaliteyi Google üzerinden
        değerlendirebilirsiniz.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-stone-200 p-6 text-left shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-stone-800">
                {review.name}
              </span>
              <span className="text-xs text-stone-400">Google</span>
            </div>
            <div className="mb-3 text-amber-500">★★★★★</div>
            <p className="text-sm text-stone-600">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
