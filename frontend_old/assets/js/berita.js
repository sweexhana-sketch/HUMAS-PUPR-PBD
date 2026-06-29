/**
 * berita.js
 * Logic Halaman Manajemen Berita
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 */

const BeritaPage = (() => {

  let allNews = [];
  let initialized = false;

  async function init() {
    if (initialized) return;
    initialized = true;

    await loadBerita();
    initSearch();
  }

  // ── LOAD DATA ─────────────────────────────────────────────────
  async function loadBerita() {
    const { data } = await API.Berita.getAll();
    allNews = data || [];

    renderNewsCards(allNews.slice(0, 3));
    renderNewsTable(allNews);
  }

  // ── RENDER CARDS ───────────────────────────────────────────────
  function renderNewsCards(news) {
    const grid = document.getElementById('news-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    news.forEach(n => {
      const emoji = Utils.kategoriEmoji(n.kategori || n.cat);
      const judul = n.judul || n.title;
      const status = n.status;
      const tanggal = n.tanggal ? Utils.formatDate(n.tanggal) : (n.date || '-');
      const views = n.views || 0;

      grid.innerHTML += `
        <div class="news-card" onclick="BeritaPage.openEdit(${n.id})">
          <div class="news-card-img">${emoji}</div>
          <div class="news-card-body">
            ${Utils.statusBadge(status)}
            <div class="news-title">${judul}</div>
            <div class="news-meta">
              <i class="ti ti-calendar" style="font-size:12px"></i>${tanggal}
              &nbsp;·&nbsp;
              <i class="ti ti-eye" style="font-size:12px"></i>${views || '-'}
            </div>
          </div>
        </div>`;
    });
  }

  // ── RENDER TABLE ───────────────────────────────────────────────
  function renderNewsTable(news) {
    const tbody = document.getElementById('all-news-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    news.forEach(n => {
      const judul = n.judul || n.title;
      const penulis = n.penulis || n.author || '-';
      const kategori = n.kategori || n.cat || '-';
      const views = n.views || 0;

      tbody.innerHTML += `
        <tr>
          <td style="font-weight:600;color:var(--navy);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${judul}
          </td>
          <td>${penulis}</td>
          <td><span class="tag infra" style="font-size:10px">${kategori}</span></td>
          <td>${Utils.statusBadge(n.status)}</td>
          <td style="font-weight:600">${views || '-'}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-outline btn-icon btn-xs" onclick="BeritaPage.openEdit(${n.id})" title="Edit">
                <i class="ti ti-edit"></i>
              </button>
              <button class="btn btn-outline btn-icon btn-xs" onclick="BeritaPage.deleteBerita(${n.id})" title="Hapus" style="color:var(--red)">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });

    if (!news.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:32px;color:var(--text3)">Tidak ada berita ditemukan.</td></tr>`;
    }
  }

  // ── SEARCH ────────────────────────────────────────────────────
  function initSearch() {
    const searchInput = document.getElementById('berita-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', Utils.debounce((e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allNews.filter(n =>
        (n.judul || n.title || '').toLowerCase().includes(q) ||
        (n.kategori || n.cat || '').toLowerCase().includes(q) ||
        (n.penulis || n.author || '').toLowerCase().includes(q)
      );
      renderNewsTable(filtered);
    }, 250));
  }

  // ── SAVE BERITA ───────────────────────────────────────────────
  async function saveBerita() {
    const judul    = document.getElementById('news-title-input')?.value?.trim();
    const isi      = document.getElementById('news-body-input')?.value?.trim();
    const kategori = document.getElementById('news-kategori')?.value;
    const status   = document.getElementById('news-status')?.value || 'draft';

    if (!judul || !isi) {
      Utils.showToast('Judul dan isi berita wajib diisi.', 'error');
      return;
    }

    const beritaData = {
      judul,
      isi,
      kategori,
      status,
      tanggal: new Date().toISOString().split('T')[0],
      penulis: (await Auth.getCurrentUser())?.full_name || 'Admin',
      views: 0,
    };

    const { error } = await API.Berita.create(beritaData);

    if (error) {
      Utils.showToast('Gagal menyimpan berita: ' + error.message, 'error');
      return;
    }

    Utils.hideModal('modal-news-editor');
    Utils.showToast('Berita berhasil disimpan!', 'success');

    // Reload
    initialized = false;
    await init();
  }

  // ── OPEN EDIT ─────────────────────────────────────────────────
  function openEdit(id) {
    const berita = allNews.find(b => b.id === id);
    if (!berita) return;

    const titleInput = document.getElementById('news-title-input');
    const bodyInput  = document.getElementById('news-body-input');
    const katInput   = document.getElementById('news-kategori');
    const statInput  = document.getElementById('news-status');

    if (titleInput) titleInput.value = berita.judul || berita.title || '';
    if (bodyInput)  bodyInput.value  = berita.isi || '';
    if (katInput)   katInput.value   = berita.kategori || berita.cat || '';
    if (statInput)  statInput.value  = berita.status || 'draft';

    Utils.showModal('modal-news-editor');
  }

  // ── DELETE ────────────────────────────────────────────────────
  async function deleteBerita(id) {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;

    const { error } = await API.Berita.delete(id);
    if (error) {
      Utils.showToast('Gagal menghapus berita.', 'error');
      return;
    }

    Utils.showToast('Berita berhasil dihapus.', 'success');
    allNews = allNews.filter(b => b.id !== id);
    renderNewsCards(allNews.slice(0, 3));
    renderNewsTable(allNews);
  }

  return { init, saveBerita, openEdit, deleteBerita };

})();

window.BeritaPage = BeritaPage;
