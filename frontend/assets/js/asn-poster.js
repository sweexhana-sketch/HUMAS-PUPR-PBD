/**
 * asn-poster.js  v3.0
 * Generator Poster Ucapan Hari Besar — desain referensi resmi PUPR PBD
 * Hasil: poster portrait 1080×1350 px (Instagram/cetak)
 * SIM-HUMAS PUPR Papua Barat Daya
 */

// ── LOAD FONTS ──────────────────────────────────────────────────
if (!document.getElementById('asn-fonts')) {
  const link = document.createElement('link');
  link.id   = 'asn-fonts';
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,500&family=Great+Vibes&display=swap';
  document.head.appendChild(link);
}

const ASNPoster = (() => {
  let uploadedImage = null;   // HTMLImageElement foto ASN (setelah bg-removal)
  let uploadedFile  = null;   // File asli
  let isGenerating  = false;
  const TAHUN   = new Date().getFullYear();
  const CANVAS_W = 1080;
  const CANVAS_H = 1350;

  // ── KONFIGURASI HARI BESAR ────────────────────────────────────
  const HARI_BESAR = {
    'hut-ri': {
      scriptText : 'Dirgahayu',
      line1      : 'REPUBLIK',
      line2      : 'INDONESIA',
      numText    : String(TAHUN - 1945),
      supText    : 'TH',
      slogan1    : 'BERSATU BERDAULAT',
      slogan2    : 'RAKYAT SEJAHTERA',
      slogan3    : 'INDONESIA MAJU',
      dateText   : `17 AGUSTUS 1945 - 17 AGUSTUS ${TAHUN}`,
      primary    : '#cc0000',
      dark       : '#8b0000',
    },
    'hari-bakti-pu': {
      scriptText : 'Selamat',
      line1      : 'HARI BAKTI',
      line2      : 'PU',
      numText    : String(TAHUN - 1945),
      supText    : 'TH',
      slogan1    : 'MEMBANGUN INFRASTRUKTUR',
      slogan2    : 'UNTUK NEGERI',
      slogan3    : 'PAPUA BARAT DAYA',
      dateText   : `3 DESEMBER ${TAHUN}`,
      primary    : '#f97316',
      dark       : '#9a3412',
    },
    'hari-jadi-pbd': {
      scriptText : 'Selamat',
      line1      : 'HARI JADI',
      line2      : 'PAPUA BARAT DAYA',
      numText    : String(TAHUN - 2022),
      supText    : 'TH',
      slogan1    : 'BERSAMA MEMBANGUN',
      slogan2    : 'PAPUA BARAT DAYA',
      slogan3    : 'YANG MAJU & SEJAHTERA',
      dateText   : `25 NOVEMBER ${TAHUN}`,
      primary    : '#2563eb',
      dark       : '#1e3a8a',
    },
    'idul-fitri': {
      scriptText : 'Selamat Hari Raya',
      line1      : 'IDUL',
      line2      : 'FITRI',
      numText    : String(TAHUN - 622),
      supText    : 'H',
      slogan1    : 'TAQABBALALLAHU MINNA',
      slogan2    : 'WA MINKUM',
      slogan3    : 'MOHON MAAF LAHIR & BATIN',
      dateText   : `1 SYAWAL ${TAHUN - 622} H / ${TAHUN} M`,
      primary    : '#16a34a',
      dark       : '#14532d',
    },
    'natal': {
      scriptText : 'Selamat',
      line1      : 'HARI',
      line2      : 'NATAL',
      numText    : String(TAHUN),
      supText    : 'M',
      slogan1    : 'DAMAI NATAL',
      slogan2    : 'DAN SUKACITA',
      slogan3    : 'UNTUK SELURUH KELUARGA',
      dateText   : `25 DESEMBER ${TAHUN}`,
      primary    : '#15803d',
      dark       : '#052e16',
    },
    'tahun-baru': {
      scriptText : 'Selamat',
      line1      : 'TAHUN',
      line2      : 'BARU',
      numText    : String(TAHUN),
      supText    : 'M',
      slogan1    : 'SEMANGAT BARU',
      slogan2    : 'KARYA LEBIH NYATA',
      slogan3    : 'UNTUK PAPUA BARAT DAYA',
      dateText   : `1 JANUARI ${TAHUN}`,
      primary    : '#1d4ed8',
      dark       : '#1e3a8a',
    },
    'hari-pahlawan': {
      scriptText : 'Selamat',
      line1      : 'HARI',
      line2      : 'PAHLAWAN',
      numText    : String(TAHUN),
      supText    : '',
      slogan1    : 'MENGHARGAI JASA',
      slogan2    : 'PARA PAHLAWAN BANGSA',
      slogan3    : 'DENGAN KARYA NYATA',
      dateText   : `10 NOVEMBER ${TAHUN}`,
      primary    : '#b45309',
      dark       : '#78350f',
    },
  };

  // ── FILE UPLOAD ────────────────────────────────────────────────
  function handleFileInput(input) {
    if (input.files && input.files[0]) loadFile(input.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    const area = document.getElementById('asn-upload-area');
    if (area) { area.style.borderColor = 'var(--gray2)'; area.style.background = 'var(--gray1)'; }
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) loadFile(file);
  }

  function loadFile(file) {
    if (file.size > 8 * 1024 * 1024) {
      if (window.Utils) Utils.showToast('Ukuran foto melebihi 8 MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        uploadedFile  = file;
        uploadedImage = img;
        const previewEl = document.getElementById('asn-preview-img');
        const phEl      = document.getElementById('asn-upload-placeholder');
        const pvEl      = document.getElementById('asn-foto-preview');
        if (previewEl) previewEl.src = ev.target.result;
        if (phEl) phEl.style.display = 'none';
        if (pvEl) pvEl.style.display = 'block';
        if (window.Utils) Utils.showToast('Foto berhasil diupload! Klik Generate.', 'success');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── GENERATE (main entry) ──────────────────────────────────────
  async function generate() {
    if (!uploadedFile) {
      if (window.Utils) Utils.showToast('Upload foto ASN/Pejabat terlebih dahulu!', 'error');
      const area = document.getElementById('asn-upload-area');
      if (area) { area.style.borderColor = 'var(--red)'; setTimeout(() => area.style.borderColor = 'var(--gray2)', 2000); }
      return;
    }
    if (isGenerating) return;
    isGenerating = true;

    const hariId  = document.getElementById('asn-hari-besar')?.value || 'hut-ri';
    const nama    = document.getElementById('asn-nama')?.value.trim()    || 'NAMA ASN / PEJABAT';
    const jabatan = document.getElementById('asn-jabatan')?.value.trim() || 'JABATAN';
    const config  = HARI_BESAR[hariId] || HARI_BESAR['hut-ri'];

    const canvas      = document.getElementById('asn-poster-canvas');
    const placeholder = document.getElementById('asn-canvas-placeholder');
    const bar         = document.getElementById('asn-download-bar');

    canvas.style.display = 'none';
    if (bar) bar.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'flex';
      placeholder.innerHTML = `
        <div class="spinner spinner-dark" style="margin:0 auto 12px"></div>
        <div style="font-weight:700;color:var(--navy);font-size:13px">Langkah 1: Menghapus latar belakang foto...</div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px">AI memotong foto pejabat (5–20 detik)</div>
      `;
    }

    // Coba hapus background
    try {
      if (typeof imglyRemoveBackground === 'undefined') throw new Error('imgly not loaded');
      const blob = await imglyRemoveBackground(uploadedFile, { 
        publicPath: "https://unpkg.com/@imgly/background-removal@1.4.5/dist/",
        output: { format: 'image/png' } 
      });
      const blobUrl = URL.createObjectURL(blob);
      const cutImg  = new Image();
      cutImg.onload = () => { uploadedImage = cutImg; renderCanvas(config, nama, jabatan, canvas, placeholder, bar); };
      cutImg.src = blobUrl;
    } catch (e) {
      console.warn('Background removal skipped:', e.message);
      // Fallback: jika gagal hapus bg, gunakan foto asli tapi tetap render
      renderCanvas(config, nama, jabatan, canvas, placeholder, bar);
    }
  }

  // ── RENDER CANVAS (load logos dulu) ───────────────────────────
  function renderCanvas(config, nama, jabatan, canvas, placeholder, bar) {
    if (placeholder) {
      placeholder.innerHTML = `
        <div class="spinner spinner-dark" style="margin:0 auto 12px"></div>
        <div style="font-weight:700;color:var(--navy);font-size:13px">Langkah 2: Menyusun Poster...</div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px">Menyatukan elemen grafis...</div>
      `;
    }

    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    document.fonts.ready.then(() => {
      const pbdLogo  = new Image();
      const puprLogo = new Image();
      let loaded = 0;

      const done = () => {
        loaded++;
        if (loaded < 2) return;
        const ctx = canvas.getContext('2d');
        drawPoster(ctx, config, nama, jabatan, pbdLogo, puprLogo);

        if (placeholder) { placeholder.style.display = 'none'; placeholder.innerHTML = `<div style="font-size:48px;margin-bottom:8px">🖼️</div><div style="font-size:12px">Poster muncul setelah generate</div>`; }
        canvas.style.display = 'block';
        if (bar) bar.style.display = 'flex';
        isGenerating = false;
        if (window.Utils) Utils.showToast('🎨 Poster berhasil dibuat!', 'success');
      };

      pbdLogo.onload  = done; pbdLogo.onerror  = done;
      puprLogo.onload = done; puprLogo.onerror = done;
      pbdLogo.src  = '../components/Logo_Papua_Barat_Daya.png';
      puprLogo.src = '../components/Logo_PUPR.png';
    });
  }

  // ── DRAW POSTER (canvas API) ──────────────────────────────────
  function drawPoster(ctx, cfg, nama, jabatan, pbdLogo, puprLogo) {
    const W = CANVAS_W, H = CANVAS_H;
    const RED    = cfg.primary;
    const DARK   = cfg.dark;
    const WHITE  = '#ffffff';
    const BLACK  = '#111111';

    // ── 1. BACKGROUND ─────────────────────────────────────────────
    ctx.fillStyle = '#f0f0ee';
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow center
    const bgGrad = ctx.createRadialGradient(W * 0.6, H * 0.4, 0, W * 0.6, H * 0.4, W);
    bgGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
    bgGrad.addColorStop(1, 'rgba(230,228,225,0.4)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── 2. TOP-RIGHT WAVY RED FLAG DECORATION ─────────────────────
    // Merah (bawah)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W * 0.38, 0);
    ctx.bezierCurveTo(W * 0.6, 0, W * 0.85, 80, W, 140);
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fillStyle = RED;
    ctx.fill();
    // Putih (atas, lebih sempit)
    ctx.beginPath();
    ctx.moveTo(W * 0.56, 0);
    ctx.bezierCurveTo(W * 0.75, 0, W * 0.92, 55, W, 90);
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fillStyle = WHITE;
    ctx.fill();
    ctx.restore();

    // ── 3. BOTTOM AREA: Smooth red wave + dark footer ──────────────
    // Wave merah dimulai dari kiri tengah ke kanan
    ctx.save();

    // gelombang putih (separator)
    ctx.beginPath();
    ctx.moveTo(0, H * 0.715);
    ctx.bezierCurveTo(W * 0.25, H * 0.685, W * 0.6, H * 0.74, W, H * 0.70);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = DARK;
    ctx.fill();

    // gelombang merah utama
    ctx.beginPath();
    ctx.moveTo(0, H * 0.69);
    ctx.bezierCurveTo(W * 0.25, H * 0.66, W * 0.6, H * 0.72, W, H * 0.68);
    ctx.lineTo(W, H * 0.73);
    ctx.bezierCurveTo(W * 0.6, H * 0.77, W * 0.25, H * 0.71, 0, H * 0.74);
    ctx.closePath();
    ctx.fillStyle = WHITE;
    ctx.fill();

    // background merah footer
    ctx.beginPath();
    ctx.moveTo(0, H * 0.76);
    ctx.bezierCurveTo(W * 0.25, H * 0.73, W * 0.65, H * 0.79, W, H * 0.745);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = RED;
    ctx.fill();

    ctx.restore();

    // ── 4. HEADER LOGOS ────────────────────────────────────────────
    const LOGO_H   = 80;
    const LOGO_Y   = 38;
    let logoX = 44;

    if (pbdLogo.naturalHeight) {
      const lw = pbdLogo.naturalWidth * (LOGO_H / pbdLogo.naturalHeight);
      ctx.drawImage(pbdLogo, logoX, LOGO_Y, lw, LOGO_H);
      logoX += lw + 18;
    }
    if (puprLogo.naturalHeight) {
      const lw = puprLogo.naturalWidth * (LOGO_H / puprLogo.naturalHeight);
      ctx.drawImage(puprLogo, logoX, LOGO_Y, lw, LOGO_H);
      logoX += lw + 22;
    }

    // Garis vertikal pemisah
    ctx.save();
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(logoX, LOGO_Y + 6); ctx.lineTo(logoX, LOGO_Y + LOGO_H - 6); ctx.stroke();
    ctx.restore();
    logoX += 18;

    // Nama instansi
    ctx.textAlign = 'left';
    ctx.fillStyle = BLACK;
    ctx.font = '800 22px "Montserrat", sans-serif';
    ctx.fillText('DINAS PEKERJAAN UMUM', logoX, LOGO_Y + 26);
    ctx.fillText('DAN PERUMAHAN RAKYAT', logoX, LOGO_Y + 52);
    ctx.font = '600 19px "Montserrat", sans-serif';
    ctx.fillStyle = '#444444';
    ctx.fillText('PROVINSI PAPUA BARAT DAYA', logoX, LOGO_Y + 76);

    // ── 5. TYPOGRAPHY (KANAN TENGAH) ───────────────────────────────
    const TX = W - 55; // right-aligned anchor
    let   TY = 195;

    // "Dirgahayu" – script font
    ctx.textAlign  = 'right';
    ctx.fillStyle  = BLACK;
    ctx.font       = 'italic 88px "Great Vibes", cursive';
    ctx.fillText(cfg.scriptText, TX, TY);
    TY += 10;

    // Line 1 bold merah
    ctx.font       = '900 86px "Montserrat", sans-serif';
    ctx.fillStyle  = RED;
    TY += 84;
    ctx.fillText(cfg.line1, TX, TY);

    // Line 2 bold merah
    TY += 84;
    ctx.fillText(cfg.line2, TX, TY);
    TY += 20;

    // Angka besar (outline style) + superscript
    const numFontSize = 280;
    ctx.font      = `900 ${numFontSize}px "Montserrat", sans-serif`;
    ctx.textAlign = 'right';

    // Shadow/outline merah tebal
    ctx.strokeStyle = RED;
    ctx.lineWidth   = 22;
    ctx.lineJoin    = 'round';
    ctx.strokeText(cfg.numText, TX, TY + numFontSize - 40);

    // Inner white stroke (membuat efek outline berlapis)
    ctx.strokeStyle = WHITE;
    ctx.lineWidth   = 8;
    ctx.strokeText(cfg.numText, TX, TY + numFontSize - 40);

    // Isi merah untuk angka
    ctx.fillStyle = RED;
    ctx.fillText(cfg.numText, TX, TY + numFontSize - 40);

    // Superscript "TH"
    if (cfg.supText) {
      ctx.font      = '900 68px "Montserrat", sans-serif';
      ctx.fillStyle = RED;
      ctx.textAlign = 'right';
      ctx.fillText(cfg.supText, TX, TY + 60);
    }

    TY += numFontSize - 20;

    // Slogan (3 baris, hitam, bold)
    ctx.font      = '800 26px "Montserrat", sans-serif';
    ctx.fillStyle = BLACK;
    ctx.textAlign = 'right';
    ctx.fillText(cfg.slogan1, TX, TY + 10);
    ctx.fillText(cfg.slogan2, TX, TY + 42);
    ctx.fillText(cfg.slogan3, TX, TY + 74);
    TY += 74;

    // Date pill
    const pillText = cfg.dateText;
    ctx.font = '700 20px "Montserrat", sans-serif';
    const pillW  = ctx.measureText(pillText).width + 56;
    const pillH  = 44;
    const pillX  = TX - pillW;
    const pillY  = TY + 26;
    drawRoundRect(ctx, pillX, pillY, pillW, pillH, 22);
    ctx.fillStyle = RED;
    ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.textAlign = 'center';
    ctx.fillText(pillText, pillX + pillW / 2, pillY + 29);

    // ── 6. FOTO ASN (kiri, bottom-aligned, tanpa background) ───────
    if (uploadedImage) {
      const photoMaxH = H * 0.72;
      const photoMaxW = W * 0.58;
      let   pH = photoMaxH;
      let   pW = uploadedImage.naturalWidth * (pH / uploadedImage.naturalHeight);
      if (pW > photoMaxW) { pW = photoMaxW; pH = uploadedImage.naturalHeight * (pW / uploadedImage.naturalWidth); }

      const pX = -40;
      const pY = H * 0.72 - pH;      // bottom aligned ke awal area merah

      ctx.save();
      ctx.drawImage(uploadedImage, pX, pY, pW, pH);
      ctx.restore();
    }

    // ── 7. FOOTER: NAMA & JABATAN ──────────────────────────────────
    const FOOT_Y = H * 0.785;

    ctx.textAlign = 'left';
    ctx.fillStyle = WHITE;
    ctx.font      = '900 46px "Montserrat", sans-serif';
    wrapText(ctx, nama.toUpperCase(), 52, FOOT_Y + 50, W - 100, 52);

    ctx.font      = '700 23px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    wrapText(ctx, jabatan.toUpperCase(), 52, FOOT_Y + 115, W - 100, 28);

    ctx.font      = '500 19px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('DINAS PEKERJAAN UMUM DAN PERUMAHAN RAKYAT', 52, FOOT_Y + 155);
    ctx.fillText('PROVINSI PAPUA BARAT DAYA', 52, FOOT_Y + 178);
  }

  // ── HELPER: draw text with line wrap ──────────────────────────
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let   line  = '';
    let   curY  = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, curY);
        line = word; curY += lineHeight;
      } else { line = test; }
    }
    if (line) ctx.fillText(line, x, curY);
  }

  // ── HELPER: rounded rect path ──────────────────────────────────
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

  // ── DOWNLOAD ───────────────────────────────────────────────────
  function download() {
    const canvas = document.getElementById('asn-poster-canvas');
    const hariId = document.getElementById('asn-hari-besar')?.value || 'poster';
    const nama   = (document.getElementById('asn-nama')?.value.trim() || 'asn').replace(/\s+/g, '-').toLowerCase();
    const link   = document.createElement('a');
    link.download = `poster-${hariId}-${nama}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
    if (window.Utils) Utils.showToast('✅ Poster berhasil didownload!', 'success');
  }

  // ── SHARE ─────────────────────────────────────────────────────
  async function share() {
    const canvas = document.getElementById('asn-poster-canvas');
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'poster-pupr.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'Poster PUPR Papua Barat Daya' }); }
        catch { download(); }
      } else { download(); }
    });
  }

  // update prompt (compat)
  function updateCustomPrompt() {}

  return { handleFileInput, handleDrop, generate, download, share, updateCustomPrompt };
})();

window.ASNPoster = ASNPoster;
