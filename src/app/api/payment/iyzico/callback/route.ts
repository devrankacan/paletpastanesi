import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retrieveCheckoutForm } from "@/lib/payment/iyzico";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString();

  if (!token) {
    return NextResponse.redirect(new URL("/sepet", request.url));
  }

  const payment = await prisma.payment.findFirst({
    where: { providerPaymentId: token },
  });

  if (!payment) {
    return NextResponse.redirect(new URL("/sepet", request.url));
  }

  try {
    const result = await retrieveCheckoutForm(token);
    const isSuccess = result.paymentStatus === "SUCCESS";

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccess ? "SUCCESS" : "FAILED",
        rawResponse: JSON.stringify(result),
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: isSuccess ? "PAID" : "CANCELLED" },
    });
  } catch (error) {
    console.error("iyzico callback doğrulama hatası:", error);
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.redirect(
    new URL(`/siparis/${payment.orderId}`, request.url),
  );
}
