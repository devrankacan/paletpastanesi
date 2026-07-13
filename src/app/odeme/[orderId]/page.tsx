import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IyzicoCheckoutForm } from "@/components/iyzico-checkout-form";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment || !payment.rawResponse) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-amber-900">
        Ödeme Bilgilerinizi Girin
      </h1>
      <div className="rounded-2xl border border-amber-100 p-4">
        <IyzicoCheckoutForm html={payment.rawResponse} />
      </div>
    </div>
  );
}
