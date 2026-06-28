/**
 * asn-poster.js
 * Generator Poster Ucapan Hari Besar dengan Foto ASN/Pejabat
 * Menggunakan HTML Canvas API — SIM-HUMAS PUPR Papua Barat Daya
 */

// Load premium fonts
if (!document.getElementById('asn-fonts')) {
  const link = document.createElement('link');
  link.id = 'asn-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,800;0,900;1,400&family=Great+Vibes&display=swap';
  document.head.appendChild(link);
}

const ASNPoster = (() => {
  let uploadedImage = null;  // HTMLImageElement dari foto ASN
  const TAHUN = new Date().getFullYear();
  const CANVAS_W = 1200;
  const CANVAS_H = 630;

  // ── KONFIGURASI HARI BESAR ─────────────────────────────────────
  const HARI_BESAR = {
    'hut-ri': {
      judul:     `DIRGAHAYU\nREPUBLIK\nINDONESIA`,
      sub:       `17 Agustus 1945 – 17 Agustus ${TAHUN}`,
      tag:       `HUT RI ke-${TAHUN - 1945}`,
      tagline:   'Semangat Kemerdekaan untuk Mewujudkan\nPembangunan Infrastruktur yang Merata',
      hashtag:   '#KaryaNyata #UntukPapua',
      bg1: '#b91c1c', bg2: '#7f1d1d', accent: '#fca5a5',
      topBar: '#dc2626', bottomBar: '#991b1b',
      ribbon: true, ribbonColor: '#ffffff',
      prompt: `Professional photography of a team of Indonesian government officials wearing tan uniforms, smiling, working in a modern office with futuristic glowing holographic infrastructure blueprints, glowing blue wireframe bridges and city data visualizations overlay, photorealistic, cinematic lighting, high resolution, 8k, independence day theme with red and white subtle accents`
    },
    'hari-pahlawan': {
      judul:     `HARI\nPAHLAWAN\nNASIONAL`,
      sub:       `10 November ${TAHUN}`,
      tag:       '10 NOVEMBER',
      tagline:   'Menghormati Jasa Para Pahlawan\ndengan Karya Nyata untuk Rakyat Papua',
      hashtag:   '#HariPahlawan #BangunPapua',
      bg1: '#92400e', bg2: '#451a03', accent: '#fcd34d',
      topBar: '#b45309', bottomBar: '#78350f',
      ribbon: false,
      prompt: `Professional photography of a team of Indonesian government officials wearing tan uniforms, standing respectfully in a high-tech modern office, futuristic holographic blueprints of national monuments and city planning glowing in blue, photorealistic, cinematic lighting, high resolution, 8k, heroes day solemn golden hour atmosphere`
    },
    'sumpah-pemuda': {
      judul:     `SELAMAT\nHARI SUMPAH\nPEMUDA`,
      sub:       `28 Oktober ${TAHUN}`,
      tag:       '28 OKTOBER',
      tagline:   'Bersatu dalam Keberagaman\nMembangun Papua Barat Daya yang Maju',
      hashtag:   '#SumpahPemuda #SatuIndonesia',
      bg1: '#1d4ed8', bg2: '#1e3a8a', accent: '#93c5fd',
      topBar: '#2563eb', bottomBar: '#1e40af',
      ribbon: false,
      prompt: `Professional photography of a diverse team of young Indonesian government officials in tan uniforms, collaborating energetically around a glowing futuristic holographic smart city map and digital blueprints, photorealistic, cinematic lighting, high resolution, 8k, modern PUPR office, unity theme`
    },
    'hari-pancasila': {
      judul:     `SELAMAT HARI\nLAHIR\nPANCASILA`,
      sub:       `1 Juni ${TAHUN}`,
      tag:       '1 JUNI',
      tagline:   'Pancasila sebagai Landasan\nPembangunan Papua Barat Daya',
      hashtag:   '#HariPancasila #PapuaMaju',
      bg1: '#0f766e', bg2: '#042f2e', accent: '#5eead4',
      topBar: '#14b8a6', bottomBar: '#0d9488',
      ribbon: false,
      prompt: `Professional photography of Indonesian government officials in tan uniforms working together in a high-tech control room, massive glowing holographic maps of Indonesia and infrastructure data nodes, photorealistic, cinematic lighting, high resolution, 8k, professional corporate vibe`
    },
    'hari-kartini': {
      judul:     `SELAMAT\nHARI\nKARTINI`,
      sub:       `21 April ${TAHUN}`,
      tag:       '21 APRIL',
      tagline:   'Perempuan Berdaya\nPapua Barat Daya Maju',
      hashtag:   '#HariKartini #WanitaTangguh',
      bg1: '#be185d', bg2: '#831843', accent: '#fbcfe8',
      topBar: '#ec4899', bottomBar: '#be185d',
      ribbon: false,
      prompt: `Professional photography of female Indonesian government officials wearing elegant tan uniforms and subtle traditional touches, leading a presentation with glowing futuristic holographic building models and smart city blueprints, modern glass office, photorealistic, cinematic lighting, high resolution, 8k`
    },
    'hari-pendidikan': {
      judul:     `SELAMAT HARI\nPENDIDIKAN\nNASIONAL`,
      sub:       `2 Mei ${TAHUN}`,
      tag:       'HARDIKNAS',
      tagline:   'Pendidikan Berkualitas\nuntuk Papua Barat Daya Berdaya',
      hashtag:   '#Hardiknas #PendidikanPapua',
      bg1: '#7c3aed', bg2: '#4c1d95', accent: '#c4b5fd',
      topBar: '#8b5cf6', bottomBar: '#6d28d9',
      ribbon: false,
      prompt: `Professional photography of Indonesian government officials in tan uniforms mentoring students in a futuristic laboratory, surrounded by glowing blue holographic data, digital books, and infrastructure wireframes, photorealistic, cinematic lighting, high resolution, 8k`
    },
    'hari-buruh': {
      judul:     `SELAMAT\nHARI BURUH\nINTERNASIONAL`,
      sub:       `1 Mei ${TAHUN}`,
      tag:       'MAY DAY',
      tagline:   'Menghargai Setiap Kerja Keras\nPembangun Infrastruktur Papua',
      hashtag:   '#HariBuruh #MayDay',
      bg1: '#c2410c', bg2: '#7c2d12', accent: '#fdba74',
      topBar: '#ea580c', bottomBar: '#c2410c',
      ribbon: false,
      prompt: `Professional photography of Indonesian government officials in tan uniforms and construction workers with hard hats analyzing a glowing futuristic holographic bridge and heavy machinery blueprints, modern command center, photorealistic, cinematic lighting, high resolution, 8k`
    },
    'idul-fitri': {
      judul:     `SELAMAT\nHARI RAYA\nIDUL FITRI`,
      sub:       `1446 H / ${TAHUN} M`,
      tag:       'EID MUBARAK',
      tagline:   'Taqabbalallahu Minna Wa Minkum\nMohon Maaf Lahir dan Batin',
      hashtag:   '#IdulFitri #EidMubarak',
      bg1: '#15803d', bg2: '#052e16', accent: '#86efac',
      topBar: '#16a34a', bottomBar: '#15803d',
      ribbon: false,
      prompt: `Professional photography of a team of Indonesian government officials wearing tan uniforms and neat modest attire, smiling in a modern office, subtle glowing holographic data grids, festive warm lighting, photorealistic, cinematic lighting, high resolution, 8k`
    },
    'natal': {
      judul:     `SELAMAT\nHARI\nNATAL`,
      sub:       `25 Desember ${TAHUN}`,
      tag:       'CHRISTMAS',
      tagline:   'Damai Natal dan Sukacita\nuntuk Seluruh Keluarga Papua',
      hashtag:   '#HariNatal #MerryChristmas',
      bg1: '#166534', bg2: '#052e16', accent: '#86efac',
      topBar: '#15803d', bottomBar: '#14532d',
      ribbon: false,
      prompt: `Professional photography of Indonesian government officials wearing tan uniforms in a modern office decorated with subtle festive lights, analyzing glowing futuristic holographic blueprints, warm cinematic lighting, photorealistic, high resolution, 8k`
    },
    'tahun-baru': {
      judul:     `SELAMAT\nTAHUN BARU\n${TAHUN}`,
      sub:       `1 Januari ${TAHUN}`,
      tag:       `NEW YEAR ${TAHUN}`,
      tagline:   'Semangat Baru, Karya Lebih Nyata\nuntuk Papua Barat Daya',
      hashtag:   `#HappyNewYear${TAHUN} #PapuaMaju`,
      bg1: '#1e3a8a', bg2: '#0f172a', accent: '#fde68a',
      topBar: '#1d4ed8', bottomBar: '#1e40af',
      ribbon: false,
      prompt: `Professional photography of a team of Indonesian government officials wearing tan uniforms looking forward at a massive glowing futuristic holographic city masterplan and fireworks data visualization, modern high-tech office, photorealistic, cinematic lighting, high resolution, 8k`
    },
  };

  // ── HANDLE FILE UPLOAD ─────────────────────────────────────────
  function handleFileInput(input) {
    if (input.files && input.files[0]) loadFile(input.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    const area = document.getElementById('asn-upload-area');
    area.style.borderColor = 'var(--gray2)';
    area.style.background  = 'var(--gray1)';
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) loadFile(file);
  }

  function loadFile(file) {
    if (file.size > 5 * 1024 * 1024) {
      Utils.showToast('Ukuran foto melebihi 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        // tampilkan preview
        document.getElementById('asn-preview-img').src = ev.target.result;
        document.getElementById('asn-upload-placeholder').style.display = 'none';
        document.getElementById('asn-foto-preview').style.display = 'block';
        Utils.showToast('Foto berhasil diupload! Klik Generate.', 'success');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── UPDATE CUSTOM PROMPT ───────────────────────────────────────
  function updateCustomPrompt() {
    const hariId = document.getElementById('asn-hari-besar').value;
    const config = HARI_BESAR[hariId];
    const promptInput = document.getElementById('asn-custom-prompt');
    if (config && promptInput) {
      promptInput.value = config.prompt;
    }
  }

  // ── MAIN GENERATE ──────────────────────────────────────────────
  function generate() {
    if (!uploadedImage) {
      Utils.showToast('Upload foto ASN/Pejabat terlebih dahulu!', 'error');
      document.getElementById('asn-upload-area').style.borderColor = 'var(--red)';
      setTimeout(() => document.getElementById('asn-upload-area').style.borderColor = 'var(--gray2)', 2000);
      return;
    }

    const hariId  = document.getElementById('asn-hari-besar').value;
    const nama    = document.getElementById('asn-nama').value.trim()    || 'Nama ASN / Pejabat';
    const jabatan = document.getElementById('asn-jabatan').value.trim() || 'Jabatan — Dinas PUPR Papua Barat Daya';
    const config  = HARI_BESAR[hariId];
    
    // Ambil Model dan Custom Prompt
    const aiModelEl = document.getElementById('asn-ai-model');
    const aiModel = aiModelEl ? aiModelEl.value : 'openai';
    const customPromptEl = document.getElementById('asn-custom-prompt');
    const customPrompt = customPromptEl && customPromptEl.value.trim() ? customPromptEl.value.trim() : config.prompt;

    const canvas = document.getElementById('asn-poster-canvas');
    const placeholder = document.getElementById('asn-canvas-placeholder');
    const bar = document.getElementById('asn-download-bar');

    // Tampilkan state loading
    canvas.style.display = 'none';
    bar.style.display = 'none';
    placeholder.style.display = 'block';
    placeholder.innerHTML = `
      <div class="spinner spinner-dark" style="margin:0 auto 12px"></div>
      <div style="font-weight:700;color:var(--navy);font-size:13px">AI Sedang Membuat Background...</div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Model AI sedang menyusun visual realistis (10-20 detik)</div>
    `;

    // ── FETCH AI BACKGROUND ──
    const aiImage = new Image();
    aiImage.crossOrigin = 'Anonymous'; // Penting agar canvas bisa didownload
    
    // Gabungkan prompt kustom dari user dengan suffix wajib untuk hasil terbaik
    const aiPrompt = customPrompt + ", no text, no letters, no words, clear space for typography";
    const encodedPrompt = encodeURIComponent(aiPrompt);
    
    const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${CANVAS_W}&height=${CANVAS_H}&nologo=true&seed=${Math.floor(Math.random()*9999)}&model=${aiModel}`;

    aiImage.onload = () => {
      canvas.width  = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d');
      drawPoster(ctx, config, nama, jabatan, aiImage);

      placeholder.style.display = 'none';
      canvas.style.display = 'block';
      bar.style.display = 'flex';
      
      // Reset placeholder konten
      placeholder.innerHTML = `
        <div style="font-size:48px;margin-bottom:8px">🖼️</div>
        <div style="font-size:12px">Poster akan muncul di sini setelah generate</div>
      `;

      Utils.showToast('🎨 Poster realistis berhasil dibuat!', 'success');
    };

    aiImage.onerror = () => {
      placeholder.innerHTML = `
        <div style="font-size:36px;margin-bottom:8px">⚠️</div>
        <div style="font-size:12px;color:var(--red);font-weight:600">Gagal memuat AI Background</div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px">Server AI sedang sibuk. Silakan coba lagi.</div>
      `;
    };

    aiImage.src = aiUrl;
  }

  // ── DRAW POSTER ────────────────────────────────────────────────
  function drawPoster(ctx, cfg, nama, jabatan, aiImage) {
    const W = CANVAS_W, H = CANVAS_H;

    // Tunggu font load
    document.fonts.ready.then(() => {
      // 1. Background Image dari AI
      if (aiImage) {
        ctx.drawImage(aiImage, 0, 0, W, H);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, W * 0.55, H);
        bgGrad.addColorStop(0, cfg.bg1);
        bgGrad.addColorStop(1, cfg.bg2);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // 2. TINT KIRI (Fading Putih) agar teks kontras dan bersih seperti referensi
      const leftTint = ctx.createLinearGradient(0, 0, W * 0.55, 0);
      leftTint.addColorStop(0, 'rgba(255,255,255,1)');
      leftTint.addColorStop(0.35, 'rgba(255,255,255,0.85)');
      leftTint.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = leftTint;
      ctx.fillRect(0, 0, W, H);

      // 3. TOP RIBBON (Curved elegant)
      drawTopRibbon(ctx, W, cfg.bg1);

      // 4. BOTTOM RIBBON (Curved waves)
      drawBottomRibbon(ctx, W, H, cfg.bg1);

      // 5. FOOTER BAR
      ctx.fillStyle = cfg.bottomBar;
      ctx.fillRect(0, H - 65, W, 65);

      // Footer Content
      // Kiri: QR + Teks
      drawQRPlaceholder(ctx, 25, H - 55, 45);
      
      ctx.font = '700 13px "Montserrat", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('PU Membangun', 80, H - 40);
      ctx.font = '600 14px "Montserrat", sans-serif';
      ctx.fillText('Papua Barat Daya', 80, H - 22);

      // Tengah: Ikon Layanan
      const icons = [
        { ic: '🏢', tx1: 'Infrastruktur', tx2: 'Berkualitas' },
        { ic: '🏠', tx1: 'Permukiman', tx2: 'Layak' },
        { ic: '💧', tx1: 'Air Bersih', tx2: 'untuk Semua' },
        { ic: '🛣️', tx1: 'Terhubung', tx2: 'untuk Maju' }
      ];
      icons.forEach((item, i) => {
        const x = W * 0.30 + (i * 145);
        ctx.font = '24px Arial';
        ctx.fillText(item.ic, x, H - 25);
        ctx.font = '400 11px "Montserrat", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.tx1, x + 35, H - 38);
        ctx.font = '700 11px "Montserrat", sans-serif';
        ctx.fillText(item.tx2, x + 35, H - 22);
      });

      // Kanan: Hashtag
      ctx.font = '900 18px "Montserrat", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'right';
      const hash1 = cfg.hashtag.split(' ')[0] || '';
      const hash2 = cfg.hashtag.split(' ')[1] || '';
      ctx.fillText('#', W - ctx.measureText(hash1.replace('#','')).width - 32, H - 28);
      ctx.font = '700 13px "Montserrat", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hash1.replace('#',''), W - 25, H - 36);
      ctx.fillText(hash2.replace('#',''), W - 25, H - 20);

      // 6. TOP BAR & LOGOS
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(45, 45, 28, 0, Math.PI * 2); // Logo bulat
      ctx.fill();
      ctx.font = '900 18px "Montserrat", sans-serif';
      ctx.fillStyle = cfg.bg1;
      ctx.textAlign = 'center';
      ctx.fillText('PU', 45, 52);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#111827';
      ctx.font = '800 12px "Montserrat", sans-serif';
      ctx.fillText('DINAS PEKERJAAN UMUM', 85, 36);
      ctx.fillText('DAN PERUMAHAN RAKYAT', 85, 52);
      ctx.font = '600 11px "Montserrat", sans-serif';
      ctx.fillText('PROVINSI PAPUA BARAT DAYA', 85, 68);

      // Kanan Atas Logo
      ctx.textAlign = 'right';
      ctx.fillStyle = '#111827';
      ctx.font = '600 14px "Montserrat", sans-serif';
      ctx.fillText('Bersatu Berdaulat', W - 120, 42);
      ctx.fillText('Rakyat Sejahtera', W - 120, 60);
      ctx.fillText('Indonesia Maju', W - 120, 78);

      // Big Number / Tag di Kanan Atas
      const numMatch = cfg.tag.match(/\d+/);
      if (numMatch) {
        ctx.font = '900 65px "Montserrat", sans-serif';
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = cfg.bg1;
        ctx.lineWidth = 2;
        ctx.strokeText(numMatch[0], W - 30, 75);
      }

      // 7. TYPOGRAPHY (Kiri)
      const lines = cfg.judul.split('\n');
      
      // Line 1: Cursive
      if (lines[0]) {
        ctx.font = 'normal 75px "Great Vibes", cursive';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'left';
        ctx.fillText(lines[0], 40, 195);
      }

      // Line 2: Black Bold
      if (lines[1]) {
        ctx.font = '900 95px "Montserrat", sans-serif';
        ctx.fillStyle = '#111827';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 4;
        ctx.fillText(lines[1], 36, 280);
        ctx.shadowColor = 'transparent';
      }

      // Line 3: Red Bold
      if (lines[2]) {
        ctx.font = '900 95px "Montserrat", sans-serif';
        ctx.fillStyle = cfg.bg1;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 4;
        ctx.fillText(lines[2], 36, 370);
        ctx.shadowColor = 'transparent';
      }

      // Date Pill
      ctx.fillStyle = cfg.bg1;
      const subW = Math.max(340, ctx.measureText(cfg.sub).width + 30);
      drawRoundRect(ctx, 40, 400, subW, 32, 8);
      ctx.fill();
      ctx.font = '700 14px "Montserrat", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.sub.toUpperCase(), 40 + subW/2, 421);

      // Tagline Paragraph
      ctx.font = '500 16px "Montserrat", sans-serif';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'left';
      let tagY = 460;
      cfg.tagline.split('\n').forEach(line => {
        ctx.fillText(line, 40, tagY);
        tagY += 24;
      });

      // Big Logo Bottom Left
      if (numMatch) {
        ctx.font = '900 110px "Montserrat", sans-serif';
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = cfg.bg1;
        ctx.lineWidth = 3;
        ctx.strokeText(numMatch[0], 40, 600);
        ctx.font = '900 30px "Montserrat", sans-serif';
        ctx.fillStyle = cfg.bg1;
        ctx.fillText('TH', 40 + ctx.measureText(numMatch[0]).width + 10, 520);
      }

      // 8. FOTO ASN (Kanan Bawah)
      if (uploadedImage) {
        const photoW = 340;
        const photoH = 340;
        const photoX = W - photoW - 40;
        const photoY = H - photoH - 65; // atas footer

        ctx.save();
        // Mask lingkaran pinggiran soft, atau membulat
        drawRoundRect(ctx, photoX, photoY, photoW, photoH, 20);
        ctx.clip();
        drawPhoto(ctx, uploadedImage, photoX, photoY, photoW, photoH);
        ctx.restore();

        // Glow Border
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 6;
        drawRoundRect(ctx, photoX, photoY, photoW, photoH, 20);
        ctx.stroke();

        // Gradient kotak nama
        const nameGrad = ctx.createLinearGradient(0, photoY + photoH - 70, 0, photoY + photoH);
        nameGrad.addColorStop(0, 'rgba(0,0,0,0)');
        nameGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
        
        ctx.fillStyle = nameGrad;
        ctx.fillRect(photoX, photoY + photoH - 70, photoW, 70);

        // Teks Nama
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 18px "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(nama, photoX + photoW/2, photoY + photoH - 26);
        
        // Teks Jabatan
        ctx.fillStyle = cfg.accent;
        ctx.font = '600 12px "Montserrat", sans-serif';
        ctx.fillText(jabatan, photoX + photoW/2, photoY + photoH - 10);
      }

    });
  }

  // ── HELPER: Draw Top Ribbon ──────────────────────────────────
  function drawTopRibbon(ctx, W, color) {
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 4;

    // Belakang (Merah)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, 140);
    ctx.bezierCurveTo(W*0.6, 140, W*0.3, 50, 0, 70);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Depan (Putih)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, 110);
    ctx.bezierCurveTo(W*0.5, 110, W*0.25, 30, 0, 45);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  // ── HELPER: Draw Bottom Ribbon ───────────────────────────────
  function drawBottomRibbon(ctx, W, H, color) {
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = -5;

    // Belakang (Putih)
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W, H);
    ctx.lineTo(W, H - 180);
    ctx.bezierCurveTo(W*0.6, H - 240, W*0.4, H - 60, 0, H - 130);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Depan (Merah)
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W, H);
    ctx.lineTo(W, H - 120);
    ctx.bezierCurveTo(W*0.7, H - 220, W*0.2, H - 80, 0, H - 90);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, H-200, W, H);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  // ── HELPER: Draw QR Code Placeholder ─────────────────────────
  function drawQRPlaceholder(ctx, x, y, size) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x+4, y+4, 10, 10);
    ctx.fillRect(x+size-14, y+4, 10, 10);
    ctx.fillRect(x+4, y+size-14, 10, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x+6, y+6, 6, 6);
    ctx.fillRect(x+size-12, y+6, 6, 6);
    ctx.fillRect(x+6, y+size-12, 6, 6);
  }

  // ── HELPER: Draw photo cropped to area ────────────────────────

  function drawPhoto(ctx, img, x, y, w, h) {
    // Crop foto tetap dalam area tanpa distorsi
    const imgAr = img.width / img.height;
    const areaAr = w / h;
    let sx, sy, sw, sh;
    if (imgAr > areaAr) {
      sh = img.height;
      sw = sh * areaAr;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / areaAr;
      sx = 0;
      sy = Math.max(0, (img.height - sh) * 0.15); // fokus wajah (atas)
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  // ── HELPER: Rounded Rectangle ─────────────────────────────────
  function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── HELPER: Ribbon merah-putih ────────────────────────────────
  function drawRibbon(ctx, W, H) {
    // Pita bawah merah
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H - 80);
    ctx.bezierCurveTo(W * 0.15, H - 60, W * 0.3, H - 100, W * 0.5, H - 75);
    ctx.lineTo(W * 0.5, H - 55);
    ctx.bezierCurveTo(W * 0.3, H - 80, W * 0.15, H - 40, 0, H - 60);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, H - 55);
    ctx.bezierCurveTo(W * 0.15, H - 35, W * 0.3, H - 75, W * 0.5, H - 50);
    ctx.lineTo(W * 0.5, H - 35);
    ctx.bezierCurveTo(W * 0.3, H - 60, W * 0.15, H - 20, 0, H - 40);
    ctx.closePath();
    ctx.fillStyle = 'rgba(220,38,38,0.85)';
    ctx.fill();
    ctx.restore();
  }

  // ── DOWNLOAD ───────────────────────────────────────────────────
  function download() {
    const canvas = document.getElementById('asn-poster-canvas');
    const hariId = document.getElementById('asn-hari-besar').value;
    const nama   = (document.getElementById('asn-nama').value.trim() || 'asn').replace(/\s+/g, '-');
    const link   = document.createElement('a');
    link.download = `poster-${hariId}-${nama}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    Utils.showToast('✅ Poster berhasil didownload!', 'success');
  }

  // ── SHARE (Web Share API) ──────────────────────────────────────
  async function share() {
    const canvas = document.getElementById('asn-poster-canvas');
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'poster-pupr.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Poster PUPR Papua Barat Daya' });
        } catch (e) {
          download(); // fallback
        }
      } else {
        download(); // fallback ke download
        Utils.showToast('Poster didownload, bagikan secara manual.', '');
      }
    });
  }

  return { handleFileInput, handleDrop, generate, download, share, updateCustomPrompt };

})();

window.ASNPoster = ASNPoster;
