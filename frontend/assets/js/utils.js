/**
 * utils.js
 * Helper Functions: Toast, Modal, Format, dll.
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const Utils = (() => {

  // ── TOAST NOTIFICATION ─────────────────────────────────────────
  function showToast(msg, type = '') {
    const toast = document.getElementById('toast');
    const icon  = document.getElementById('toast-icon');
    const msgEl = document.getElementById('toast-msg');

    if (!toast) return;

    const icons = {
      success: 'ti ti-check',
      error:   'ti ti-x',
      warning: 'ti ti-alert-triangle',
      '':      'ti ti-info-circle',
    };

    toast.className = `toast${type ? ' ' + type : ''}`;
    msgEl.textContent = msg;
    if (icon) icon.className = icons[type] || icons[''];

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // ── MODAL ──────────────────────────────────────────────────────
  function showModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // Tutup modal saat klik backdrop
  function initModalBackdrop() {
    document.querySelectorAll('.modal-bg').forEach(bg => {
      bg.addEventListener('click', (e) => {
        if (e.target === bg) bg.classList.remove('open');
      });
    });
  }

  // ── TANGGAL & WAKTU ────────────────────────────────────────────
  function formatDate(dateStr, options = {}) {
    const defaults = { weekday: undefined, day: 'numeric', month: 'long', year: 'numeric' };
    const opts = { ...defaults, ...options };
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', opts);
  }

  function formatDateFull(date = new Date()) {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function formatRelative(dateStr) {
    const now  = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60)     return 'Baru saja';
    if (diff < 3600)   return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return formatDate(dateStr);
  }

  // ── NUMBER FORMAT ──────────────────────────────────────────────
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000)    return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('id-ID');
  }

  // ── BADGE HTML ─────────────────────────────────────────────────
  function statusBadge(status) {
    const map = {
      published: { cls: 'published', label: 'Terbit' },
      draft:     { cls: 'draft',     label: 'Draft' },
      review:    { cls: 'review',    label: 'Review' },
      urgent:    { cls: 'urgent',    label: 'Mendesak' },
    };
    const s = map[status] || { cls: 'draft', label: status };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  function stageBadge(tahap) {
    const map = {
      draft:    { cls: 'draft',  label: 'Draft' },
      review:   { cls: 'review', label: 'Review' },
      approval: { cls: 'review', label: 'Menunggu Persetujuan' },
      published:{ cls: 'published', label: 'Terbit' },
    };
    const s = map[tahap] || { cls: 'draft', label: tahap };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  // ── KATEGORI EMOJI ─────────────────────────────────────────────
  function kategoriEmoji(kat) {
    const map = {
      'Infrastruktur Jalan': '🛣️',
      'Sumber Daya Air':     '💧',
      'Permukiman':          '🏘️',
      'Kegiatan Pimpinan':   '🎖️',
      'Bina Marga':          '🌉',
      'Pengumuman':          '📢',
    };
    return map[kat] || '📰';
  }

  // ── CLIPBOARD ─────────────────────────────────────────────────
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Berhasil disalin ke clipboard!', 'success');
    } catch {
      showToast('Gagal menyalin teks.', 'error');
    }
  }

  // ── DEBOUNCE ───────────────────────────────────────────────────
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ── GENERATE INITIALS ──────────────────────────────────────────
  function getInitials(name = '') {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ── RENDER USER INFO ───────────────────────────────────────────
  function renderUserInfo(user) {
    const avatarEl = document.getElementById('user-avatar');
    const nameEl   = document.getElementById('user-name');
    const emailEl  = document.getElementById('user-email');

    if (!user) return;
    if (avatarEl) avatarEl.textContent = user.initials || getInitials(user.full_name || user.email);
    if (nameEl)   nameEl.textContent   = user.full_name || user.email;
    if (emailEl)  emailEl.textContent  = user.email;
  }

  // ── CHART BAR BUILDER ──────────────────────────────────────────
  function buildBarChart(containerId, labels, values, colors) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const max = Math.max(...values);
    container.innerHTML = '';

    labels.forEach((label, i) => {
      const h = max > 0 ? Math.round((values[i] / max) * 100) : 0;
      const color = Array.isArray(colors) ? (colors[i] || 'var(--green)') : colors;
      container.innerHTML += `
        <div class="bar-wrap">
          <div class="bar-val">${formatNumber(values[i])}</div>
          <div class="bar" style="height:${h}%;background:${color}"></div>
          <div class="bar-label">${label}</div>
        </div>`;
    });
  }

  // ── LOADING STATE ──────────────────────────────────────────────
  function setLoading(elementId, isLoading, placeholder = 'Memuat...') {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (isLoading) {
      el.innerHTML = `<div class="empty-state"><div class="spinner spinner-dark"></div><div class="empty-state-text" style="margin-top:12px">${placeholder}</div></div>`;
    }
  }

  // ── DEMO MODE BADGE ────────────────────────────────────────────
  function showDemoBadge() {
    const existing = document.getElementById('demo-badge');
    if (existing) return;

    const badge = document.createElement('div');
    badge.id = 'demo-badge';
    badge.style.cssText = `
      position: fixed;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--gold);
      color: var(--navy);
      font-size: 11px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 20px;
      z-index: 9000;
      box-shadow: 0 2px 8px rgba(0,0,0,.2);
    `;
    badge.textContent = '⚡ MODE DEMO — Supabase belum dikonfigurasi';
    document.body.appendChild(badge);
  }

  // ── PUBLIC API ─────────────────────────────────────────────────
  return {
    showToast,
    showModal,
    hideModal,
    initModalBackdrop,
    formatDate,
    formatDateFull,
    formatRelative,
    formatNumber,
    statusBadge,
    stageBadge,
    kategoriEmoji,
    copyToClipboard,
    debounce,
    getInitials,
    renderUserInfo,
    buildBarChart,
    setLoading,
    showDemoBadge,
  };

})();

window.Utils = Utils;
