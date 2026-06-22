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

    // 2. Ambil prompt dari request body
    const { prompt } = await req.json()
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 3. Panggil Anthropic API (API Key aman di environment variable server)
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
    }

    const SYSTEM_PROMPT = `Kamu adalah asisten HUMAS profesional untuk Dinas PUPR (Pekerjaan Umum dan Perumahan Rakyat) Provinsi Papua Barat Daya, Indonesia. Tugas kamu adalah membantu membuat konten komunikasi publik yang:
- Formal dan informatif sesuai standar pemerintah daerah
- Menggunakan Bahasa Indonesia baku yang baik dan benar
- Relevan dengan konteks infrastruktur, pembangunan, dan layanan publik di Papua Barat Daya
- Terstruktur dengan baik dan mudah dipahami masyarakat`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620', // Gunakan model Claude 3.5 Sonnet
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text()
      console.error('Anthropic API Error:', errorData)
      throw new Error(`Anthropic API returned status ${anthropicResponse.status}`)
    }

    const anthropicData = await anthropicResponse.json()
    const contentText = anthropicData.content?.[0]?.text || ''

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
