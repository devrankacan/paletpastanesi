const faqs = [
  {
    question: "Özel tasarım pasta siparişimi ne kadar süre önce vermeliyim?",
    answer:
      "Özel günlerinizde her detayın kusursuz olması için butik pasta siparişlerinizi teslimat tarihinden en az 3 gün önce oluşturmanızı rica ediyoruz. Düğün veya büyük organizasyon pastaları için ise 1 hafta - 10 gün öncesinden iletişime geçmeniz önerilir.",
  },
  {
    question: "Adrese teslimat yapıyor musunuz?",
    answer:
      "Evet, özel soğutmalı araçlarımızla belirli bölgelere teslimat sağlıyoruz. Bulunduğunuz bölgeye teslimat yapılıp yapılmadığını ve teslimat ücretlerini öğrenmek için sipariş sırasında ekibimizden bilgi alabilirsiniz.",
  },
  {
    question: "Glutensiz, vegan veya şekersiz ürün seçenekleriniz var mı?",
    answer:
      "Evet! Glutensiz, rafine şekersiz ve vegan seçeneklerimiz mevcuttur. Ancak üretim alanımızda unlu mamuller de bulunduğu için şiddetli çölyak hassasiyeti olan misafirlerimizin sipariş öncesinde bilgi vermesini rica ederiz.",
  },
  {
    question: "Pastaların saklama koşulları ve tüketim süresi nedir?",
    answer:
      "Ürünlerimiz koruyucu katkı maddesi içermez ve günlük taze malzemelerle hazırlanır. Kremalı pastalarınızı buzdolabında (+4°C) muhafaza etmenizi ve teslim aldıktan sonra 2 gün içerisinde tüketmenizi tavsiye ederiz.",
  },
  {
    question: "Pastaların içeriğinde değişiklik yapabiliyor muyuz?",
    answer:
      "Elbette. Standart menümüzdeki pastaların içeriğini damak zevkinize göre değiştirebiliriz. Siparişinizi oluştururken alerjen durumunuzu veya sevmediğiniz malzemeleri belirtmeniz yeterlidir.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="mb-8 text-2xl font-semibold text-amber-900">
        Sıkça Sorulan Sorular
      </h2>
      <div className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200">
        {faqs.map((faq) => (
          <details key={faq.question} className="group p-4">
            <summary className="cursor-pointer list-none font-medium text-stone-800 marker:content-none">
              <span className="flex items-center justify-between">
                {faq.question}
                <span className="ml-4 text-amber-600 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-stone-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
