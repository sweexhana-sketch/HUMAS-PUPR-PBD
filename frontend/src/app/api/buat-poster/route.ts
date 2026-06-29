import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { acara, tema } = body;

    if (!acara || !tema) {
      return NextResponse.json(
        { error: "Acara dan tema wajib diisi" },
        { status: 400 }
      );
    }

    // Buat prompt profesional dalam bahasa Inggris agar AI lebih akurat
    const prompt = [
      `Official Indonesian government poster for ${acara}.`,
      `Theme: ${tema}.`,
      `Featuring Papuan civil servants (ASN Orang Asli Papua) in yellow PUPR official uniforms.`,
      `Background: Papua infrastructure development — roads, bridges, housing, clean water.`,
      `Style: Ministry-level, modern, professional, elegant, official government design.`,
      `Typography overlay: event name and PUPR Papua Barat Daya identity.`,
      `Cinematic lighting, ultra-realistic, premium poster quality, vertical format.`,
    ].join(" ");

    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 999999);

    // Gunakan Pollinations.ai — gratis, tanpa API key
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1536&nologo=true&enhance=true`;

    // Tunggu sebentar agar Pollinations memproses (opsional ping)
    await fetch(imageUrl, { method: "HEAD" }).catch(() => {});

    return NextResponse.json({
      status: "success",
      hasil: imageUrl,
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    return NextResponse.json(
      { error: "Gagal menghasilkan poster. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
