/**
 * galeri.js — Logic Galeri Media
 * agenda.js — Logic Agenda Kegiatan
 * laporan.js — Logic Laporan & Statistik
 * monitoring.js — Logic Monitoring Konten
 * publikasi.js — Logic Publikasi Resmi
 * ai-studio.js — Logic AI Content Studio
 *
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

// ══════════════════════════════════════════════════════════════
//  GALERI MEDIA
// ══════════════════════════════════════════════════════════════
const GaleriPage = (() => {

  async function init() {
    await renderGallery();
    initUploadZone();
  }

  async function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    Utils.setLoading('gallery-grid', true);
    const { data: items } = await API.Galeri.getAll();
    grid.innerHTML = '';

    (items || []).forEach(item => {
      const emoji = item.emoji || '🖼️';
      const cap   = item.judul || item.caption || '';

      grid.innerHTML += `
        <div class="gallery-item" onclick="Utils.showToast('Membuka preview: ${cap.replace(/'/g, '')}', '')">
          <div class="gallery-img">${emoji}</div>
          <div class="gallery-overlay">
            <div class="gallery-caption">${cap}</div>
          </div>
        </div>`;
    });

    if (!items?.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:span 3"><div class="empty-state-icon">📷</div><div class="empty-state-text">Belum ada media</div></div>';
    }
  }

  function initUploadZone() {
    const zone = document.getElementById('upload-zone');
    if (!zone) return;

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      Utils.showToast('Upload media diterima! (Sambungkan Supabase Storage)', 'success');
    });
    zone.addEventListener('click', () => Utils.showToast('Klik untuk memilih file upload', ''));
  }

  return { init };
})();

window.GaleriPage = GaleriPage;


// ══════════════════════════════════════════════════════════════
//  AGENDA KEGIATAN
// ══════════════════════════════════════════════════════════════
const AgendaPage = (() => {

  async function init() {
    renderCalendarWeek();
    await renderAgendaEvents();
    initSaveAgenda();
  }

  function renderCalendarWeek() {
    const cw = document.getElementById('cal-week');
    if (!cw) return;

    const today = new Date();
    const days  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    cw.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - today.getDay() + i);
      const isToday = d.toDateString() === today.toDateString();

      cw.innerHTML += `
        <div class="cal-day${isToday ? ' today' : ''}">
          <div class="dn">${days[d.getDay()]}</div>
          <div class="dd">${d.getDate()}</div>
        </div>`;
    }
  }

  async function renderAgendaEvents() {
    const container = document.getElementById('agenda-events');
    if (!container) return;

    const { data: agenda } = await API.Agenda.getAll();
    container.innerHTML = '';

    (agenda || []).forEach(e => {
      container.innerHTML += `
        <div class="event-chip">
          <div class="event-color" style="background:${e.warna || e.color || 'var(--green)'}"></div>
          <div>
            <div class="event-title">${e.judul || e.title}</div>
            <div class="event-time">${e.waktu || e.time} | ${e.lokasi || e.loc}</div>
          </div>
        </div>`;
    });

    if (!agenda?.length) {
      container.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:13px">Belum ada agenda.</div>';
    }
  }

  function initSaveAgenda() {
    const btn = document.getElementById('btn-save-agenda');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const judul   = document.getElementById('agenda-judul')?.value?.trim();
      const tanggal = document.getElementById('agenda-tanggal')?.value;
      const waktu   = document.getElementById('agenda-waktu')?.value;
      const lokasi  = document.getElementById('agenda-lokasi')?.value?.trim();

      if (!judul || !tanggal) {
        Utils.showToast('Judul dan tanggal wajib diisi.', 'error');
        return;
      }

      const { error } = await API.Agenda.create({ judul, tanggal, waktu, lokasi, warna: 'var(--green)' });
      if (error) { Utils.showToast('Gagal menyimpan agenda.', 'error'); return; }

      Utils.showToast('Agenda berhasil disimpan!', 'success');
      await renderAgendaEvents();
    });
  }

  return { init };
})();

window.AgendaPage = AgendaPage;


// ══════════════════════════════════════════════════════════════
//  LAPORAN & STATISTIK
// ══════════════════════════════════════════════════════════════
const LaporanPage = (() => {

  async function init() {
    await renderReportStats();
    renderCategoryChart();
    renderMonthlyChart();
    await renderTopContent();
  }

  async function renderReportStats() {
    const { data: stats } = await API.Stats.getDashboard();
    if (!stats) return;

    const setEl = (id, val, color) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = Utils.formatNumber(val); if (color) el.style.color = color; }
    };

    setEl('r-stat-berita',   stats.totalBerita,   'var(--green)');
    setEl('r-stat-tayangan', stats.totalTayangan, 'var(--gold)');
    setEl('r-stat-media',    stats.totalMedia,    'var(--blue)');
  }

  function renderCategoryChart() {
    const cats = [
      { n: 'Infrastruktur Jalan', v: 52, c: 'var(--blue)' },
      { n: 'Sumber Daya Air',     v: 28, c: 'var(--green)' },
      { n: 'Permukiman',          v: 34, c: 'var(--gold)' },
      { n: 'Bina Marga',          v: 19, c: 'var(--red)' },
      { n: 'Pengumuman',          v: 15, c: '#7b1fa2' },
    ];
    const max = Math.max(...cats.map(c => c.v));
    const cc  = document.getElementById('category-chart');
    if (!cc) return;
    cc.innerHTML = '';

    cats.forEach(c => {
      const pct = Math.round((c.v / max) * 100);
      cc.innerHTML += `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="color:var(--text2);font-weight:500">${c.n}</span>
            <span style="font-weight:700;color:var(--navy)">${c.v}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;background:${c.c}"></div>
          </div>
        </div>`;
    });
  }

  function renderMonthlyChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const views  = [1200, 2400, 1800, 4100, 5800, 9200];
    const colors = months.map(() => 'linear-gradient(to top, var(--green), var(--green2))');

    const mc = document.getElementById('monthly-chart');
    if (!mc) return;
    const max = Math.max(...views);
    mc.innerHTML = '';

    months.forEach((m, i) => {
      const h = Math.round((views[i] / max) * 100);
      mc.innerHTML += `
        <div class="bar-wrap">
          <div class="bar-val" style="font-size:10px">${Utils.formatNumber(views[i])}</div>
          <div class="bar" style="height:${h}%;background:${colors[i]}"></div>
          <div class="bar-label">${m}</div>
        </div>`;
    });
  }

  async function renderTopContent() {
    const tbody = document.getElementById('top-content-table');
    if (!tbody) return;

    const { data: news } = await API.Berita.getAll({ status: 'published' });
    const sorted = (news || [])
      .filter(n => n.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    tbody.innerHTML = '';
    sorted.forEach((n, i) => {
      const engagement = ((Math.random() * 7 + 2).toFixed(1)) + '%';
      tbody.innerHTML += `
        <tr>
          <td style="font-weight:800;color:var(--text3)">${i + 1}</td>
          <td style="font-weight:600;color:var(--navy)">${n.judul || n.title}</td>
          <td><span class="tag infra" style="font-size:10px">${n.kategori || n.cat}</span></td>
          <td style="font-weight:700;color:var(--navy)">${(n.views).toLocaleString('id-ID')}</td>
          <td><span style="color:var(--green);font-weight:700">${engagement}</span></td>
        </tr>`;
    });

    if (!sorted.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:24px">Belum ada data tayangan.</td></tr>';
    }
  }

  return { init };
})();

window.LaporanPage = LaporanPage;


// ══════════════════════════════════════════════════════════════
//  MONITORING KONTEN
// ══════════════════════════════════════════════════════════════
const MonitoringPage = (() => {

  async function init() {
    await renderMonitoringTable();
  }

  async function renderMonitoringTable() {
    const tbody = document.getElementById('monitoring-table');
    if (!tbody) return;

    Utils.setLoading('monitoring-table', true);
    const { data: items } = await API.Monitoring.getAll();
    tbody.innerHTML = '';

    (items || []).forEach(m => {
      tbody.innerHTML += `
        <tr>
          <td style="font-weight:600;color:var(--navy)">${m.judul || m.title}</td>
          <td>${m.penulis || m.author}</td>
          <td>${Utils.stageBadge(m.tahap || m.stage)}</td>
          <td>${m.reviewer || '-'}</td>
          <td style="font-weight:600;color:var(--text2)">${m.deadline}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-outline btn-icon btn-xs" onclick="Utils.showToast('Membuka review...', '')" title="Review">
                <i class="ti ti-eye"></i>
              </button>
              <button class="btn btn-primary btn-icon btn-xs" onclick="MonitoringPage.approve(${m.id})" title="Setujui">
                <i class="ti ti-check"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });

    if (!items?.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">Tidak ada konten dalam antrian.</td></tr>';
    }
  }

  async function approve(id) {
    const { error } = await API.Monitoring.updateTahap(id, 'approval');
    if (error) { Utils.showToast('Gagal mengupdate status.', 'error'); return; }
    Utils.showToast('Konten disetujui dan dikirim ke persetujuan!', 'success');
    await renderMonitoringTable();
  }

  return { init, approve };
})();

window.MonitoringPage = MonitoringPage;


// ══════════════════════════════════════════════════════════════
//  PUBLIKASI RESMI
// ══════════════════════════════════════════════════════════════
const PublikasiPage = (() => {

  async function init() {
    await renderPublikasi();
  }

  async function renderPublikasi() {
    const container = document.getElementById('pub-list');
    if (!container) return;

    Utils.setLoading('pub-list', true);
    const { data: items } = await API.Publikasi.getAll();
    container.innerHTML = '';

    (items || []).forEach(pub => {
      const tags = (pub.tags || []).map(t =>
        `<span class="tag ${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</span>`
      ).join('');

      const tanggal = pub.tanggal
        ? Utils.formatDate(pub.tanggal)
        : (pub.date || '-');

      container.innerHTML += `
        <div class="pub-card">
          <div class="pub-icon" style="background:var(--gray1)">${pub.icon || '📄'}</div>
          <div class="pub-content" style="flex:1">
            <div class="pub-title">${pub.judul || pub.title}</div>
            <div class="pub-meta">
              <i class="ti ti-calendar" style="font-size:11px"></i> ${tanggal}
            </div>
            <div class="pub-tags">${tags}</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="Utils.showToast('Mengunduh dokumen...', 'success')" style="flex-shrink:0">
            <i class="ti ti-download"></i>
          </button>
        </div>`;
    });

    if (!items?.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">Belum ada publikasi.</div></div>';
    }
  }

  return { init };
})();

window.PublikasiPage = PublikasiPage;
