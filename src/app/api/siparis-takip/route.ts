import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();
  const phone = request.nextUrl.searchParams.get("phone")?.trim();

  if (!orderId || !phone) {
    return NextResponse.json(
      { error: "Sipariş numarası ve telefon gereklidir." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, phone },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Bu bilgilerle eşleşen bir sipariş bulunamadı." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
    })),
  });
}
