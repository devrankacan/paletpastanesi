import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().min(2),
  message: z.string().min(5),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Lütfen tüm zorunlu alanları doğru doldurun." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  await prisma.contactMessage.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      subject: data.subject,
      message: data.message,
    },
  });

  return NextResponse.json({ success: true });
}
