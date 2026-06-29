/**
 * router.js
 * SPA Router — Navigasi Antar Halaman
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const Router = (() => {

  const routes = {
    dashboard:  { title: 'Dashboard',          breadcrumb: 'SIM-HUMAS › Dashboard' },
    berita:     { title: 'Manajemen Berita',    breadcrumb: 'SIM-HUMAS › Manajemen Berita' },
    ai:         { title: 'AI Content Studio',  breadcrumb: 'SIM-HUMAS › AI Content Studio' },
    galeri:     { title: 'Galeri Media',        breadcrumb: 'SIM-HUMAS › Galeri Media' },
    publikasi:  { title: 'Publikasi Resmi',     breadcrumb: 'SIM-HUMAS › Publikasi Resmi' },
    agenda:     { title: 'Agenda Kegiatan',     breadcrumb: 'SIM-HUMAS › Agenda Kegiatan' },
    laporan:    { title: 'Laporan & Statistik', breadcrumb: 'SIM-HUMAS › Laporan & Statistik' },
    monitoring: { title: 'Monitoring Konten',   breadcrumb: 'SIM-HUMAS › Monitoring Konten' },
    pengaturan: { title: 'Pengaturan',          breadcrumb: 'SIM-HUMAS › Pengaturan' },
  };

  // Callbacks yang dijalankan saat navigasi
  const onNavigateCallbacks = {};

  let currentPage = 'dashboard';

  // ── NAVIGATE ─────────────────────────────────────────────────
  function navigate(page) {
    if (!routes[page]) {
      console.warn(`[Router] Unknown page: ${page}`);
      return;
    }

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => {
      const onclick = el.getAttribute('onclick') || '';
      el.classList.toggle('active', onclick === `Router.navigate('${page}')`);
    });

    // Switch halaman
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    // Update topbar
    const route = routes[page];
    const titleEl = document.getElementById('topbar-title');
    const crumbEl = document.getElementById('topbar-crumb');
    if (titleEl) titleEl.textContent = route.title;
    if (crumbEl) crumbEl.textContent = route.breadcrumb;

    // Update URL hash (opsional, untuk browser history)
    history.pushState({ page }, route.title, `#${page}`);

    // Fire callback
    if (onNavigateCallbacks[page]) {
      onNavigateCallbacks[page]();
    }

    currentPage = page;
  }

  // ── REGISTER CALLBACK ─────────────────────────────────────────
  function onNavigate(page, callback) {
    onNavigateCallbacks[page] = callback;
  }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'dashboard';
      navigate(page);
    });

    // Handle initial hash
    const hash = window.location.hash.replace('#', '');
    if (hash && routes[hash]) {
      navigate(hash);
    } else {
      navigate('dashboard');
    }
  }

  // ── GET CURRENT ────────────────────────────────────────────────
  function getCurrent() {
    return currentPage;
  }

  // ── PUBLIC API ─────────────────────────────────────────────────
  return { navigate, onNavigate, init, getCurrent, routes };

})();

window.Router = Router;
