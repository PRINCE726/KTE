import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter")
      .select("id")
      .eq("email", validatedData.email)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: "already subscribed" });
    }

    const { data, error } = await supabase
      .from("newsletter")
      .insert([{ email: validatedData.email }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("Newsletter API Route Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'abonnement." }, { status: 500 });
  }
}
