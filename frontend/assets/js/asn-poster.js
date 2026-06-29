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
  let uploadedImage = null;  // HTMLImageElement dari foto ASN (setelah dihapus background)
  let uploadedFile = null;   // File asli yang diupload
  let isGenerating = false;
  const TAHUN = new Date().getFullYear();
  const CANVAS_W = 1080;
  const CANVAS_H = 1350;

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
        uploadedFile = file;
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
  async function generate() {
    if (!uploadedFile) {
      Utils.showToast('Upload foto ASN/Pejabat terlebih dahulu!', 'error');
      document.getElementById('asn-upload-area').style.borderColor = 'var(--red)';
      setTimeout(() => document.getElementById('asn-upload-area').style.borderColor = 'var(--gray2)', 2000);
      return;
    }
    if (isGenerating) return;

    isGenerating = true;
    const hariId  = document.getElementById('asn-hari-besar').value;
    const nama    = document.getElementById('asn-nama').value.trim()    || 'Nama ASN / Pejabat';
    const jabatan = document.getElementById('asn-jabatan').value.trim() || 'Jabatan — Dinas PUPR Papua Barat Daya';
    const config  = HARI_BESAR[hariId];
    
    const canvas = document.getElementById('asn-poster-canvas');
    const placeholder = document.getElementById('asn-canvas-placeholder');
    const bar = document.getElementById('asn-download-bar');

    canvas.style.display = 'none';
    bar.style.display = 'none';
    placeholder.style.display = 'block';
    
    // 1. HAPUS BACKGROUND OTOMATIS
    placeholder.innerHTML = `
      <div class="spinner spinner-dark" style="margin:0 auto 12px"></div>
      <div style="font-weight:700;color:var(--navy);font-size:13px">Langkah 1: Memproses Foto & Layout...</div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">AI sedang memotong foto Pejabat (Bisa memakan waktu 5-15 detik)</div>
    `;

    try {
      const imglyRemoveBackground = (await import('https://unpkg.com/@imgly/background-removal@1.4.5/dist/browser/bundle.mjs')).default;
      const blob = await imglyRemoveBackground(uploadedFile, {
        publicPath: 'https://unpkg.com/@imgly/background-removal@1.4.5/dist/browser/models/',
        output: { format: 'image/png' }
      });
      const url = URL.createObjectURL(blob);
      const transImg = new Image();
      
      transImg.onload = () => {
        uploadedImage = transImg;
        renderPoster(config, nama, jabatan, canvas, placeholder, bar);
      };
      transImg.src = url;
    } catch (e) {
      console.error('Bg removal error:', e);
      // Fallback ke foto asli
      renderPoster(config, nama, jabatan, canvas, placeholder, bar);
    }
  }

  function renderPoster(config, nama, jabatan, canvas, placeholder, bar) {
    placeholder.innerHTML = `
      <div class="spinner spinner-dark" style="margin:0 auto 12px"></div>
      <div style="font-weight:700;color:var(--navy);font-size:13px">Langkah 2: Menyatukan Poster...</div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Menyusun elemen grafis...</div>
    `;

    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');
    
    // Tunggu font load sebelum menggambar
    document.fonts.ready.then(() => {
      drawPoster(ctx, config, nama, jabatan);

      placeholder.style.display = 'none';
      canvas.style.display = 'block';
      bar.style.display = 'flex';
      
      // Reset placeholder konten
      placeholder.innerHTML = `
        <div style="font-size:48px;margin-bottom:8px">🖼️</div>
        <div style="font-size:12px">Poster akan muncul di sini setelah generate</div>
      `;

      isGenerating = false;
      Utils.showToast('🎨 Poster berhasil dibuat!', 'success');
    });
  }

  // ── DRAW POSTER ────────────────────────────────────────────────
  function drawPoster(ctx, cfg, nama, jabatan) {
    const W = CANVAS_W, H = CANVAS_H;
    const primaryColor = cfg.bg1 || '#cc0000';
    const darkColor = cfg.bg2 || '#7f1d1d';

    // 1. Background Image dari AI (Tidak Dipakai, Pakai Desain Vector)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, W, H);
    
    // Abstract faint background gradient
    const bgGrad = ctx.createRadialGradient(W/2, H/2, 100, W/2, H/2, W);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Top Right Wavy Ribbon (Red & White)
    ctx.beginPath();
    ctx.moveTo(W * 0.4, 0);
    ctx.bezierCurveTo(W * 0.7, 50, W * 0.8, 200, W, 250);
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(W * 0.55, 0);
    ctx.bezierCurveTo(W * 0.8, 30, W * 0.9, 150, W, 180);
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // 3. Bottom Wavy Design
    ctx.beginPath();
    ctx.moveTo(0, H * 0.65);
    ctx.bezierCurveTo(W * 0.3, H * 0.55, W * 0.7, H * 0.8, W, H * 0.65);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = darkColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, H * 0.75);
    ctx.bezierCurveTo(W * 0.4, H * 0.65, W * 0.6, H * 0.9, W, H * 0.75);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = -5;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // 4. Draw Logos
    const logoY = 60;
    // PU Logo (Draw circle for now, or use image)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(170, logoY+10, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '900 24px "Montserrat", sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.textAlign = 'center';
    ctx.fillText('PU', 170, logoY+20);

    // PBD Logo Placeholder (circle)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(85, logoY+10, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Montserrat", sans-serif';
    ctx.fillText('PBD', 85, logoY+14);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.font = '800 16px "Montserrat", sans-serif';
    ctx.fillText('DINAS PEKERJAAN UMUM', 220, logoY);
    ctx.fillText('DAN PERUMAHAN RAKYAT', 220, logoY+20);
    ctx.font = '600 15px "Montserrat", sans-serif';
    ctx.fillText('PROVINSI PAPUA BARAT DAYA', 220, logoY+40);

    // 5. Text / Typography (Right side)
    const lines = cfg.judul.split('\n');
    let title1 = lines[0] || 'Dirgahayu';
    let title2 = lines[1] || 'REPUBLIK';
    let title3 = lines[2] || 'INDONESIA';

    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';
    ctx.font = 'normal 90px "Great Vibes", cursive';
    ctx.fillText(title1, W - 60, 230);
    
    ctx.font = '900 80px "Montserrat", sans-serif';
    ctx.fillStyle = primaryColor;
    ctx.fillText(title2, W - 60, 320);
    ctx.fillText(title3, W - 60, 400);
    
    // Tag Number (e.g. 81 TH)
    const numMatch = cfg.tag.match(/\d+/);
    const tagNum = numMatch ? numMatch[0] : '81';
    
    ctx.font = '900 280px "Montserrat", sans-serif';
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 18;
    ctx.strokeText(tagNum, W - 180, 680);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(tagNum, W - 180, 680);
    
    ctx.font = '900 60px "Montserrat", sans-serif';
    ctx.fillStyle = primaryColor;
    ctx.fillText('TH', W - 60, 480);

    // Tagline / Slogan
    ctx.fillStyle = '#000000';
    ctx.font = '800 24px "Montserrat", sans-serif';
    
    // Parse taglines
    const taglines = cfg.tagline.split('\n');
    // If it's HUT RI we override with specific slogan to match screenshot
    if (cfg.bg1 === '#b91c1c') { // Just a heuristic
      ctx.fillText('BERSATU BERDAULAT', W - 60, 780);
      ctx.fillText('RAKYAT SEJAHTERA', W - 60, 815);
      ctx.fillText('INDONESIA MAJU', W - 60, 850);
    } else {
      let ty = 780;
      taglines.forEach(t => {
        ctx.fillText(t.toUpperCase(), W - 60, ty);
        ty += 35;
      });
    }
    
    // Date Pill
    ctx.fillStyle = primaryColor;
    const dateText = cfg.sub;
    const dateW = Math.max(450, ctx.measureText(dateText).width + 60);
    drawRoundRect(ctx, W - 60 - dateW, 880, dateW, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dateText.toUpperCase(), W - 60 - dateW/2, 907);

    // 6. Draw Photo ASN (Left Side, Bottom aligned)
    if (uploadedImage) {
      const photoW = W * 0.7; // Large photo
      const ratio = photoW / uploadedImage.width;
      const photoH = uploadedImage.height * ratio;
      
      const photoX = -50;
      const photoY = H - photoH + 100; 
      
      ctx.drawImage(uploadedImage, photoX, photoY, photoW, photoH);
    }

    // 7. Footer Text (Name and Title)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 45px "Montserrat", sans-serif';
    ctx.fillText(nama.toUpperCase(), 60, H - 150);
    
    ctx.font = '700 22px "Montserrat", sans-serif';
    ctx.fillText(jabatan.toUpperCase(), 60, H - 100);
    ctx.font = '500 18px "Montserrat", sans-serif';
    ctx.fillText('DINAS PEKERJAAN UMUM DAN PERUMAHAN RAKYAT', 60, H - 70);
    ctx.fillText('PROVINSI PAPUA BARAT DAYA', 60, H - 45);
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
