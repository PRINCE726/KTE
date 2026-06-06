import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/resend";
import { demandeCaravaneSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = demandeCaravaneSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    const record = {
      lycee: validatedData.lycee,
      arrondissement: validatedData.arrondissement,
      responsable: validatedData.responsable,
      telephone: validatedData.telephone,
      email: validatedData.email || null,
      nb_eleves: validatedData.nb_eleves || null,
      message: validatedData.message || null,
      statut: "nouveau",
    };

    const { data, error } = await supabase
      .from("demandes_caravane")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    // Version ultra-sécurisée : Remplacement des accents par des entités HTML standards pour éviter les conflits d'encodage
    const emailHtml = '<div style="font-family: Arial, sans-serif;">' +
      '<h2>Nouvelle demande Caravane</h2>' +
      '<p><strong>Lyc&eacute;e:</strong> ' + validatedData.lycee + '</p>' +
      '<p><strong>Arrondissement:</strong> ' + validatedData.arrondissement + '</p>' +
      '<p><strong>Responsable:</strong> ' + validatedData.responsable + '</p>' +
      '<p><strong>T&eacute;l&eacute;phone:</strong> ' + validatedData.telephone + '</p>' +
      '<p><strong>Email:</strong> ' + (validatedData.email || 'N/A') + '</p>' +
      '<p><strong>Nombre d\'&eacute;l&egrave;ves:</strong> ' + (validatedData.nb_eleves || 'N/A') + '</p>' +
      '<p><strong>Message:</strong><br/>' + (validatedData.message || 'Aucun message') + '</p>' +
      '</div>';

    // Remplacement du template string (backticks) par une concaténation classique avec "+" pour bypasser le bug de Turbopack
    await sendEmail({
      to: "kimiaprimeevents@gmail.com",
      from: "KTE <noreply@kimiaevents.com>",
      subject: "Nouvelle demande Caravane - " + validatedData.lycee,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("Caravane API Route Error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de la demande." },
      { status: 500 }
    );
  }
}