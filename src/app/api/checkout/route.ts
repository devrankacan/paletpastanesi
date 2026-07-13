import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  initializeCheckoutForm,
  isIyzicoConfigured,
} from "@/lib/payment/iyzico";

const checkoutSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email(),
  city: z.string().min(2),
  district: z.string().min(2),
  addressLine: z.string().min(5),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz sipariş bilgisi.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, isActive: true },
  });

  if (products.length !== data.items.length) {
    return NextResponse.json(
      { error: "Sepetteki bazı ürünler artık mevcut değil." },
      { status: 400 },
    );
  }

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product?.name ?? "Ürün"} için yeterli stok yok.` },
        { status: 400 },
      );
    }
  }

  const totalPrice = data.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      district: data.district,
      addressLine: data.addressLine,
      totalPrice,
      items: {
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          };
        }),
      },
      payment: { create: {} },
    },
  });

  if (!isIyzicoConfigured()) {
    return NextResponse.json({
      orderId: order.id,
      demoMode: true,
      message:
        "iyzico API anahtarları henüz tanımlanmadı, bu yüzden ödeme adımı atlandı (test modu). Gerçek ödeme almak için .env dosyasına IYZICO_API_KEY / IYZICO_SECRET_KEY ekleyin.",
    });
  }

  try {
    const origin = request.nextUrl.origin;
    const result = await initializeCheckoutForm({
      conversationId: order.id,
      basketId: order.id,
      totalPriceTl: totalPrice / 100,
      callbackUrl: `${origin}/api/payment/iyzico/callback`,
      buyer: {
        id: order.id,
        name: data.fullName.split(" ")[0] ?? data.fullName,
        surname: data.fullName.split(" ").slice(1).join(" ") || "-",
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.addressLine,
        ip: request.headers.get("x-forwarded-for") ?? "85.34.78.112",
      },
      items: data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return {
          id: product.id,
          name: product.name,
          category: "Pastane Ürünü",
          price: (product.price * item.quantity) / 100,
        };
      }),
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        conversationId: order.id,
        providerPaymentId: result.token,
        rawResponse: result.checkoutFormContent,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      demoMode: false,
    });
  } catch (error) {
    console.error("iyzico başlatma hatası:", error);
    return NextResponse.json(
      { error: "Ödeme başlatılamadı. Lütfen tekrar deneyin." },
      { status: 502 },
    );
  }
}
