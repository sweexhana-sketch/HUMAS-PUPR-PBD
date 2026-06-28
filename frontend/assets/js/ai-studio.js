/**
 * ai-studio.js
 * Logic AI Content Studio — Claude AI via Supabase Edge Function
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const AIStudioPage = (() => {

  let isGenerating = false;

  // ── SUPABASE EDGE FUNCTION URL (proxy aman) ───────────────────
  const AI_PROXY_URL = 'https://udirpbfyqritfzecfcrb.supabase.co/functions/v1/ai-proxy';

  // API Key langsung (HANYA untuk development lokal, ganti dengan proxy di production!)
  const ANTHROPIC_KEY = 'YOUR_ANTHROPIC_API_KEY'; // Ganti dengan kunci Anda

  const SYSTEM_PROMPT = `Kamu adalah asisten HUMAS profesional untuk Dinas PUPR (Pekerjaan Umum dan Perumahan Rakyat) Provinsi Papua Barat Daya, Indonesia. 
Tugas kamu adalah membantu membuat konten komunikasi publik yang:
- Formal dan informatif sesuai standar pemerintah daerah
- Menggunakan Bahasa Indonesia baku yang baik dan benar
- Relevan dengan konteks infrastruktur, pembangunan, dan layanan publik di Papua Barat Daya
- Terstruktur dengan baik dan mudah dipahami masyarakat

Sertakan detail teknis infrastruktur yang relevan jika diminta. Format output dengan rapi menggunakan paragraf yang terstruktur.`;

  // ── INIT ──────────────────────────────────────────────────────
  async function init() {
    await loadAIHistory();
    // Render kartu template hari besar
    setTimeout(() => renderTemplateGrid('all'), 100);
  }

  // ── SET PROMPT ────────────────────────────────────────────────
  function setPrompt(text) {
    const input = document.getElementById('ai-prompt');
    if (input) {
      input.value = text;
      input.focus();
    }
    Router.navigate('ai');
    Utils.showToast('Prompt diisi otomatis', '');
  }

  // ── GENERATE KONTEN ───────────────────────────────────────────
  async function generateContent() {
    if (isGenerating) return;

    const promptEl = document.getElementById('ai-prompt');
    const prompt   = promptEl?.value?.trim();
    const providerEl = document.getElementById('ai-provider');
    const provider = providerEl ? providerEl.value : 'claude';

    if (!prompt) {
      Utils.showToast('Masukkan prompt terlebih dahulu.', 'error');
      return;
    }

    isGenerating = true;
    setGeneratingState(true);

    try {
      let resultText = '';

      if (AI_PROXY_URL) {
        // ── Via Supabase Edge Function (production) ─────────────
        const sb = window.SupabaseConfig?.client();
        const { data: { session } } = sb ? await sb.auth.getSession() : { data: {} };

        const res = await fetch(AI_PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({ prompt, provider }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        resultText = json.text || json.content || 'Tidak ada respons dari AI.';

      } else if (ANTHROPIC_KEY && !ANTHROPIC_KEY.includes('YOUR_')) {
        // ── Langsung ke Anthropic (development lokal) ───────────
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        resultText = data.content?.[0]?.text || 'Tidak ada respons.';

      } else {
        // ── Mode Demo (simulasi AI) ─────────────────────────────
        await new Promise(r => setTimeout(r, 1800)); // simulasi loading
        resultText = generateDemoContent(prompt);
      }

      showResult(resultText);
      Utils.showToast('Konten AI berhasil dibuat!', 'success');

      // Simpan ke history
      const user = await Auth.getCurrentUser();
      await API.AIHistory.save(prompt, resultText, user?.id);
      await loadAIHistory();

    } catch (err) {
      console.error('[AI Studio]', err);
      showResult(`⚠️ Gagal menghubungi AI: ${err.message}\n\nTips:\n- Periksa koneksi internet\n- Pastikan API key sudah diisi\n- Atau gunakan Supabase Edge Function sebagai proxy`);
      Utils.showToast('Gagal terhubung ke AI.', 'error');
    }

    isGenerating = false;
    setGeneratingState(false);
  }

  // ── GENERATE UNTUK EDITOR ─────────────────────────────────────
  async function generateForEditor() {
    const topicEl = document.getElementById('editor-ai-prompt');
    const topic   = topicEl?.value?.trim();
    if (!topic) { Utils.showToast('Masukkan topik dahulu', 'error'); return; }

    Utils.showToast('AI sedang menyusun berita...', '');
    await new Promise(r => setTimeout(r, 1200));

    const content = generateDemoContent(`Buat berita lengkap tentang: ${topic}`);
    const lines   = content.split('\n').filter(l => l.trim());

    const titleInput = document.getElementById('news-title-input');
    const bodyInput  = document.getElementById('news-body-input');

    if (titleInput && lines[0]) titleInput.value = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '');
    if (bodyInput)  bodyInput.value  = lines.slice(1).join('\n');

    Utils.showToast('Konten AI berhasil diisi di editor!', 'success');
  }

  // ── LOAD HISTORY ──────────────────────────────────────────────
  async function loadAIHistory() {
    const container = document.getElementById('ai-history');
    if (!container) return;

    const { data: history } = await API.AIHistory.getAll({ limit: 5 });
    container.innerHTML = '';

    (history || []).forEach(h => {
      const prompt = h.prompt || '';
      const time   = h.created_at ? Utils.formatRelative(h.created_at) : 'Baru saja';

      container.innerHTML += `
        <div class="ai-history-item"
          style="padding:10px;background:var(--gray1);border-radius:8px;cursor:pointer;transition:.15s;margin-bottom:4px"
          onmouseover="this.style.background='var(--green3)'"
          onmouseout="this.style.background='var(--gray1)'"
          onclick="AIStudioPage.setPrompt('${prompt.replace(/'/g, "\\'")}')">
          <div style="font-size:13px;font-weight:600;color:var(--navy)">${prompt}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${time}</div>
        </div>`;
    });

    if (!history?.length) {
      container.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;padding:20px">Belum ada riwayat AI.</div>';
    }
  }

  // ── COPY RESULT ────────────────────────────────────────────────
  function copyResult() {
    const resultEl = document.getElementById('ai-result');
    if (resultEl) Utils.copyToClipboard(resultEl.textContent);
  }

  // ── USE IN EDITOR ──────────────────────────────────────────────
  function useInEditor() {
    const resultEl = document.getElementById('ai-result');
    const bodyInput = document.getElementById('news-body-input');
    if (resultEl && bodyInput) {
      bodyInput.value = resultEl.textContent;
    }
    Utils.showModal('modal-news-editor');
    Utils.showToast('Konten dipindah ke Editor Berita', 'success');
  }

  // ── GENERATE TEMPLATE ─────────────────────────────────────────
  function generateTemplate(type) {
    const promptEl = document.getElementById('ai-prompt');
    const userPrompt = promptEl?.value?.trim();
    
    if (!userPrompt) {
      Utils.showToast('Masukkan topik atau prompt di atas terlebih dahulu!', 'error');
      if (promptEl) promptEl.focus();
      return;
    }

    if (type === 'infografis' || type === 'banner') {
      Utils.showToast('AI sedang memvisualisasikan gambar...', 'success');
      setGeneratingState(true);
      
      // Menggunakan Pollinations AI untuk Text-to-Image (Gratis)
      const imagePrompt = `Desain ${type} profesional dengan topik: ${userPrompt}, desain elegan, resolusi tinggi, kementerian PUPR, Indonesia`;
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;
      
      const imgHtml = `
      <div style="text-align:center; padding:10px;">
        <h4 style="margin-bottom:15px; color:var(--navy);">Hasil Visualisasi (${type === 'infografis' ? 'Infografis' : 'Banner'})</h4>
        <img src="${imageUrl}" alt="Visualisasi AI" style="max-width:100%; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 15px;">
        <p style="font-size:12px; color:var(--text3);">*Gambar divisualisasikan secara otomatis oleh AI Text-to-Image</p>
      </div>`;
      
      // Delay sedikit agar spinner terlihat sebelum gambar mulai dimuat browser
      setTimeout(() => {
        showResult(imgHtml, true);
        setGeneratingState(false);
      }, 800);
      
    } else {
      // Untuk siaran pers / sosmed, gabungkan prompt
      const prefix = type === 'siaran' ? 'Buatkan format Siaran Pers formal untuk:' : 'Buatkan konten Sosial Media (Instagram/Facebook) yang menarik untuk:';
      setPrompt(`${prefix} ${userPrompt}`);
      setTimeout(() => {
        generateContent();
      }, 300);
    }
  }

  // ── HELPERS ───────────────────────────────────────────────────
  function setGeneratingState(loading) {
    const loadingEl = document.getElementById('ai-loading');
    const resultEl  = document.getElementById('ai-result');
    const actionsEl = document.getElementById('ai-actions');
    const btnEl     = document.getElementById('ai-generate-btn');

    if (loading) {
      if (loadingEl) loadingEl.style.display = 'block';
      if (resultEl)  resultEl.style.display  = 'none';
      if (actionsEl) actionsEl.style.display = 'none';
      if (btnEl)     btnEl.disabled = true;
    } else {
      if (loadingEl) loadingEl.style.display = 'none';
      if (btnEl)     btnEl.disabled = false;
    }
  }

  function showResult(text, isHtml = false) {
    const resultEl  = document.getElementById('ai-result');
    const actionsEl = document.getElementById('ai-actions');

    if (resultEl) {
      resultEl.style.display = 'block';
      if (isHtml) {
        resultEl.innerHTML = text;
      } else {
        resultEl.textContent = text;
      }
    }
    if (actionsEl) actionsEl.style.display = 'flex';
  }

  function generateDemoContent(prompt) {
Kepala Dinas PUPR Papua Barat Daya menyampaikan bahwa seluruh proyek infrastruktur dilaksanakan dengan mengutamakan kualitas, transparansi, dan akuntabilitas. Koordinasi lintas sektor terus diperkuat untuk memastikan kelancaran pelaksanaan program.

Informasi lebih lanjut dapat menghubungi Bagian Humas Dinas PUPR Papua Barat Daya:
📞 Telp: (0951) XXX-XXXX
📧 Email: humas@pupr-papbd.go.id

Catatan: Isi ini adalah contoh. Sambungkan API Claude untuk konten otomatis berkualitas tinggi.`;
  }

  return {
    init,
    setPrompt,
    generateContent,
    generateForEditor,
    copyResult,
    useInEditor,
    generateTemplate,
  };

})();

window.AIStudioPage = AIStudioPage;
