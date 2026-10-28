import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      { message: "Newsletter signup is temporarily unavailable." },
      { status: 503 },
    );
  }

  const { error } = await admin.from("newsletter_subscribers").upsert(
    {
      email: parsed.data.email,
      source: "storefront",
    },
    { onConflict: "email", ignoreDuplicates: true },
  );

  if (error) {
    return NextResponse.json(
      { message: "We could not add you to the list. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Thank you. You are on the list.",
  });
}
