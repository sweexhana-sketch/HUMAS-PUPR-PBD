/**
 * asn-poster.js
 * Generator Poster Ucapan Hari Besar dengan Foto ASN/Pejabat
 * Menggunakan HTML Canvas API — SIM-HUMAS PUPR Papua Barat Daya
 */

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

    const canvas = document.getElementById('asn-poster-canvas');
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext('2d');
    drawPoster(ctx, config, nama, jabatan);

    // Tampilkan canvas
    document.getElementById('asn-canvas-placeholder').style.display = 'none';
    canvas.style.display = 'block';

    // Tampilkan tombol download
    const bar = document.getElementById('asn-download-bar');
    bar.style.display = 'flex';

    Utils.showToast('🎨 Poster berhasil dibuat!', 'success');
  }

  // ── DRAW POSTER ────────────────────────────────────────────────
  function drawPoster(ctx, cfg, nama, jabatan) {
    const W = CANVAS_W, H = CANVAS_H;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.55, H);
    bgGrad.addColorStop(0, cfg.bg1);
    bgGrad.addColorStop(1, cfg.bg2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Right panel — abu-abu gelap untuk foto
    const rightX = W * 0.52;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(rightX, 0, W - rightX, H);

    // 3. Diagonal decorative separator
    ctx.beginPath();
    ctx.moveTo(W * 0.50, 0);
    ctx.lineTo(W * 0.58, 0);
    ctx.lineTo(W * 0.54, H);
    ctx.lineTo(W * 0.46, H);
    ctx.closePath();
    const sepGrad = ctx.createLinearGradient(W * 0.50, 0, W * 0.58, H);
    sepGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
    sepGrad.addColorStop(1, 'rgba(255,255,255,0.04)');
    ctx.fillStyle = sepGrad;
    ctx.fill();

    // 4. Foto ASN — di panel kanan, portrait-cropped
    drawPhoto(ctx, uploadedImage, rightX + 30, 0, W - rightX - 30, H);

    // 5. Gradien gelap di atas foto (untuk teks nama di bawah)
    const photoOverlay = ctx.createLinearGradient(rightX, H * 0.55, rightX, H);
    photoOverlay.addColorStop(0, 'rgba(0,0,0,0)');
    photoOverlay.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = photoOverlay;
    ctx.fillRect(rightX, 0, W - rightX, H);

    // 6. TOP BAR
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(0, 0, W, 68);
    // Logo placeholder kiri
    drawRoundRect(ctx, 14, 12, 44, 44, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = cfg.bg1;
    ctx.font = 'bold 22px Inter,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PU', 36, 40);
    // Teks dinas di kanan logo
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter,Arial';
    ctx.fillText('DINAS PEKERJAAN UMUM DAN PERUMAHAN RAKYAT', 66, 28);
    ctx.font = '10px Inter,Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    ctx.fillText('PROVINSI PAPUA BARAT DAYA', 66, 44);
    // Tag hari besar kanan atas
    const tagW = ctx.measureText(cfg.tag).width + 24;
    drawRoundRect(ctx, W - tagW - 14, 16, tagW, 36, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Inter,Arial';
    ctx.textAlign = 'right';
    ctx.fillText(cfg.tag, W - 26, 39);

    // 7. JUDUL HARI BESAR (kiri)
    const judulLines = cfg.judul.split('\n');
    const startY = 130;
    judulLines.forEach((line, i) => {
      const size = i === 0 ? 40 : i === judulLines.length - 1 ? 68 : 68;
      ctx.font = `900 ${size}px Inter,Arial`;
      ctx.textAlign = 'left';
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillText(line, 32, startY + i * 74 + 3);
      // Teks utama putih
      ctx.fillStyle = i === judulLines.length - 1 ? cfg.accent : '#ffffff';
      ctx.fillText(line, 32, startY + i * 74);
    });

    // 8. SUB-TEKS (tanggal)
    const subY = startY + judulLines.length * 74 + 14;
    // Pill background
    const subW = Math.min(ctx.measureText(cfg.sub).width + 20, 440);
    drawRoundRect(ctx, 30, subY - 20, subW, 30, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();
    ctx.font = '13px Inter,Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'left';
    ctx.fillText(cfg.sub, 40, subY);

    // 9. TAGLINE
    const taglineY = subY + 40;
    ctx.font = '13px Inter,Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    cfg.tagline.split('\n').forEach((line, i) => {
      ctx.fillText(line, 32, taglineY + i * 22);
    });

    // 10. Ribbon dekoratif bawah kiri (merah-putih untuk HUT RI)
    if (cfg.ribbon) {
      drawRibbon(ctx, W, H);
    } else {
      // Garis dekoratif tipis
      ctx.fillStyle = cfg.accent;
      ctx.fillRect(30, H - 100, 180, 3);
    }

    // 11. NAMA & JABATAN (di atas foto, kanan bawah)
    const namaX = rightX + 20;
    const namaY = H - 90;
    // Kotak nama
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    drawRoundRect(ctx, namaX, namaY - 36, W - namaX - 16, 80, 10);
    ctx.fill();
    ctx.strokeStyle = cfg.accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Teks nama
    ctx.font = 'bold 18px Inter,Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    const namaShort = nama.length > 35 ? nama.substring(0, 33) + '…' : nama;
    ctx.fillText(namaShort, namaX + 14, namaY - 12);
    // Teks jabatan
    ctx.font = '11px Inter,Arial';
    ctx.fillStyle = cfg.accent;
    const jabShort = jabatan.length > 55 ? jabatan.substring(0, 53) + '…' : jabatan;
    ctx.fillText(jabShort, namaX + 14, namaY + 14);
    // Garis aksen kiri kotak
    ctx.fillStyle = cfg.accent;
    drawRoundRect(ctx, namaX, namaY - 36, 4, 80, 2);
    ctx.fill();

    // 12. BOTTOM BAR
    ctx.fillStyle = cfg.bottomBar;
    ctx.fillRect(0, H - 52, W, 52);
    // Kiri: PU Membangun
    ctx.font = 'bold 12px Inter,Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('PU Membangun Papua Barat Daya', 20, H - 22);
    // Ikon-ikon
    const icons = ['🏗️ Infrastruktur', '🏠 Permukiman', '💧 Air Bersih', '🛣️ Terhubung'];
    icons.forEach((ic, i) => {
      ctx.font = '10px Inter,Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(ic, W * 0.32 + i * 120, H - 22);
    });
    // Hashtag kanan
    ctx.font = 'bold 11px Inter,Arial';
    ctx.fillStyle = cfg.accent;
    ctx.textAlign = 'right';
    ctx.fillText(cfg.hashtag, W - 16, H - 22);

    // 13. Hashtag vertikal dekoratif (kanan atas foto)
    ctx.save();
    ctx.translate(W - 18, H * 0.35);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '10px Inter,Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.textAlign = 'center';
    ctx.fillText(cfg.hashtag, 0, 0);
    ctx.restore();
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

  return { handleFileInput, handleDrop, generate, download, share };

})();

window.ASNPoster = ASNPoster;
