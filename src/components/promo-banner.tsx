import Image from "next/image";

export function PromoBanner({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-amber-900">
      <Image src={image} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="relative mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-md text-white/90">{description}</p>
          <a
            href="tel:+904623213579"
            className="w-fit rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
          >
            Sipariş İçin
          </a>
        </div>
      </div>
    </section>
  );
}
