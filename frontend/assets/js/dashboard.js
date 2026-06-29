/**
 * dashboard.js
 * Logic Halaman Dashboard
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const DashboardPage = (() => {

  async function init() {
    renderCurrentDate();
    await renderStats();
    await renderRecentNews();
    await renderActivities();
    renderMonthlyChart();
    await renderUpcomingAgenda();
  }

  // ── TANGGAL ───────────────────────────────────────────────────
  function renderCurrentDate() {
    const el = document.getElementById('curr-date');
    if (el) el.textContent = Utils.formatDateFull();
  }

  // ── STATISTIK ─────────────────────────────────────────────────
  async function renderStats() {
    const { data: stats, demo } = await API.Stats.getDashboard();
    if (!stats) return;

    if (demo) Utils.showDemoBadge();

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('stat-berita',    Utils.formatNumber(stats.totalBerita));
    setEl('stat-tayangan',  Utils.formatNumber(stats.totalTayangan));
    setEl('stat-media',     Utils.formatNumber(stats.totalMedia));
    setEl('stat-review',    stats.menungguReview);
    setEl('stat-performa',  (stats.performa || 89) + '%');
    setEl('stat-tugas',     stats.tugasAktif || 12);
  }

  // ── BERITA TERBARU ─────────────────────────────────────────────
  async function renderRecentNews() {
    const tbody = document.getElementById('news-table-body');
    if (!tbody) return;

    Utils.setLoading('news-table-body', true);
    const { data: news } = await API.Berita.getAll({ limit: 5 });
    tbody.innerHTML = '';

    (news || []).forEach(n => {
      const tanggal = n.tanggal
        ? Utils.formatDate(n.tanggal)
        : (n.date || '-');

      tbody.innerHTML += `
        <tr>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;color:var(--navy)">
            ${n.judul || n.title}
          </td>
          <td><span class="tag infra" style="font-size:10px">${n.kategori || n.cat}</span></td>
          <td>${Utils.statusBadge(n.status)}</td>
          <td style="font-size:12px;color:var(--text3)">${tanggal}</td>
        </tr>`;
    });
  }

  // ── AKTIVITAS ──────────────────────────────────────────────────
  async function renderActivities() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const { data: activities } = await API.Activities.getRecent();
    container.innerHTML = '';

    (activities || []).forEach(a => {
      container.innerHTML += `
        <div class="activity-item">
          <div class="activity-dot ${a.cls}">
            <i class="${a.icon}" style="font-size:14px"></i>
          </div>
          <div>
            <div class="activity-text">${a.text}</div>
            <div class="activity-time">${a.time}</div>
          </div>
        </div>`;
    });
  }

  // ── CHART BULANAN ──────────────────────────────────────────────
  function renderMonthlyChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const values = [45, 62, 38, 71, 89, 148];
    const colors = months.map((_, i) => i === months.length - 1 ? 'var(--green)' : 'var(--gray2)');
    Utils.buildBarChart('chart-bars', months, values, colors);
  }

  // ── AGENDA MENDATANG ───────────────────────────────────────────
  async function renderUpcomingAgenda() {
    const container = document.getElementById('agenda-dash');
    if (!container) return;

    const { data: agenda } = await API.Agenda.getAll();
    container.innerHTML = '';

    (agenda || []).slice(0, 3).forEach(e => {
      container.innerHTML += `
        <div class="event-chip">
          <div class="event-color" style="background:${e.warna || e.color}"></div>
          <div>
            <div class="event-title">${e.judul || e.title}</div>
            <div class="event-time">
              <i class="ti ti-clock" style="font-size:11px"></i>
              ${e.waktu || e.time} — ${e.lokasi || e.loc}
            </div>
          </div>
        </div>`;
    });

    if (!agenda?.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">Tidak ada agenda mendatang</div></div>';
    }
  }

  return { init };

})();

window.DashboardPage = DashboardPage;
