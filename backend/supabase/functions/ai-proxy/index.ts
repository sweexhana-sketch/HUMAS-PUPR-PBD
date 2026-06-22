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
    // 1. Cek Autentikasi (Hanya user yang login yang boleh panggil API ini)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 2. Ambil prompt & provider dari request body
    const { prompt, provider = 'claude' } = await req.json()
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
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
      if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: { text: SYSTEM_PROMPT } },
          contents: [{ parts: [{ text: prompt }] }]
        }),
      })
      if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`)
      const data = await res.json()
      contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    } else if (provider === 'chatgpt') {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
      if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ]
        }),
      })
      if (!res.ok) throw new Error(`OpenAI API Error: ${res.status}`)
      const data = await res.json()
      contentText = data.choices?.[0]?.message?.content || ''

    } else if (provider === 'nanobanana') {
      // Mock Nano Banana API
      contentText = `[Nano Banana API] Respons simulasi untuk prompt: "${prompt}"\n\n(Catatan: Endpoint API Nano Banana perlu disesuaikan dengan dokumentasi resminya).`
    } else if (provider === 'veo') {
      // Mock Veo 3.1 API
      contentText = `[Veo 3.1 API] Respons simulasi untuk prompt: "${prompt}"\n\n(Catatan: Integrasi Veo 3.1 memerlukan API Key dan endpoint Google/Veo yang valid).`
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
