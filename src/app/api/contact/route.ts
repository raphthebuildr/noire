import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ message: "Thank you. We have received your message." });
  }

  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      { message: "Contact is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json(
      { message: "We could not send your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message:
      "Thank you. We have received your message and will reply within 1–2 business days.",
  });
}
