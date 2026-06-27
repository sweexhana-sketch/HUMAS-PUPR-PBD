import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Ambil prompt & provider dari request body
    const { prompt, provider = 'gemini' } = await req.json()
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const SYSTEM_PROMPT = `Kamu adalah asisten HUMAS profesional untuk Dinas PUPR (Pekerjaan Umum dan Perumahan Rakyat) Provinsi Papua Barat Daya, Indonesia. Tugas kamu adalah membantu membuat konten komunikasi publik yang:
- Formal dan informatif sesuai standar pemerintah daerah
- Menggunakan Bahasa Indonesia baku yang baik dan benar
- Relevan dengan konteks infrastruktur, pembangunan, dan layanan publik di Papua Barat Daya
- Terstruktur dengan baik dan mudah dipahami masyarakat`;

    let contentText = '';

    if (provider === 'claude') {
      const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
      if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set')

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) throw new Error(`Anthropic API Error: ${res.status}`)
      const data = await res.json()
      contentText = data.content?.[0]?.text || ''

    } else if (provider === 'gemini') {
      // Gemini via Google AI — API Key dari environment variable
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
      if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')

      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 1024 }
        }),
      })
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Gemini API Error ${res.status}: ${errBody}`)
      }
      const data = await res.json()
      contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''



    } else if (provider === 'chatgpt') {
      // ChatGPT via Pollinations AI — GRATIS, tanpa API Key
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
      const encodedPrompt = encodeURIComponent(fullPrompt)
      const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&json=false`, {
        method: 'GET',
        headers: { 'Accept': 'text/plain' },
      })
      if (!res.ok) throw new Error(`Pollinations (ChatGPT) API Error: ${res.status}`)
      contentText = await res.text()

    } else if (provider === 'nanobanana') {
      // Nano Banana via Pollinations AI — GRATIS
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
      const encodedPrompt = encodeURIComponent(fullPrompt)
      const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=mistral&json=false`, {
        method: 'GET',
        headers: { 'Accept': 'text/plain' },
      })
      if (!res.ok) throw new Error(`Nano Banana (Mistral) API Error: ${res.status}`)
      contentText = await res.text()

    } else if (provider === 'veo') {
      // Veo 3.1 via Pollinations AI — GRATIS
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`
      const encodedPrompt = encodeURIComponent(fullPrompt)
      const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=llama&json=false`, {
        method: 'GET',
        headers: { 'Accept': 'text/plain' },
      })
      if (!res.ok) throw new Error(`Veo (Llama) API Error: ${res.status}`)
      contentText = await res.text()

    } else {
      throw new Error(`Unknown provider: ${provider}`)
    }

    // 4. Kembalikan hasil ke frontend
    return new Response(JSON.stringify({ content: contentText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in ai-proxy:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
