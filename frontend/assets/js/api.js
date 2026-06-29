/**
 * api.js
 * Semua Operasi CRUD ke Supabase Database
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 *
 * Setiap fungsi mengembalikan { data, error }
 * dan otomatis fallback ke data dummy jika Supabase belum dikonfigurasi.
 */

// ── DATA DUMMY (fallback lokal) ─────────────────────────────────
const DummyData = {

  berita: [
    { id: 1, judul: 'Pembangunan Jalan Trans Papua Barat Daya Capai 68%', kategori: 'Infrastruktur Jalan', status: 'published', tanggal: '2025-06-12', penulis: 'Budi S.', views: 1240 },
    { id: 2, judul: 'Peresmian Embung Irigasi Maybrat oleh Gubernur', kategori: 'Sumber Daya Air', status: 'published', tanggal: '2025-06-10', penulis: 'Siti R.', views: 876 },
    { id: 3, judul: 'Program Bedah Rumah 500 Unit Kota Sorong', kategori: 'Permukiman', status: 'review', tanggal: '2025-06-09', penulis: 'Ahmad F.', views: 0 },
    { id: 4, judul: 'Rapat Koordinasi Infrastruktur Otsus 2025', kategori: 'Kegiatan Pimpinan', status: 'published', tanggal: '2025-06-08', penulis: 'Budi S.', views: 534 },
    { id: 5, judul: 'Perbaikan Jembatan Aimas – Salawati', kategori: 'Bina Marga', status: 'draft', tanggal: '2025-06-07', penulis: 'Roni K.', views: 0 },
    { id: 6, judul: 'Tender Pengadaan Alat Berat PUPR 2025', kategori: 'Pengumuman', status: 'published', tanggal: '2025-06-05', penulis: 'Admin', views: 2100 },
  ],

  galeri: [
    { id: 1, emoji: '🏗️', judul: 'Konstruksi Jalan Trans Papua', type: 'foto', created_at: '2025-06-12' },
    { id: 2, emoji: '🌉', judul: 'Jembatan Salawati', type: 'foto', created_at: '2025-06-11' },
    { id: 3, emoji: '💧', judul: 'Embung Irigasi Maybrat', type: 'foto', created_at: '2025-06-10' },
    { id: 4, emoji: '🏘️', judul: 'Permukiman Bedah Rumah', type: 'foto', created_at: '2025-06-09' },
    { id: 5, emoji: '🚧', judul: 'Proyek Jalan Sorong-Aimas', type: 'foto', created_at: '2025-06-08' },
    { id: 6, emoji: '🏛️', judul: 'Gedung PUPR Sorong', type: 'foto', created_at: '2025-06-07' },
    { id: 7, emoji: '🌊', judul: 'Sistem Drainase Perkotaan', type: 'foto', created_at: '2025-06-06' },
    { id: 8, emoji: '🛣️', judul: 'Jalan Provinsi Km 45', type: 'foto', created_at: '2025-06-05' },
    { id: 9, emoji: '🔧', judul: 'Survei Lapangan Tim PUPR', type: 'foto', created_at: '2025-06-04' },
  ],

  agenda: [
    { id: 1, judul: 'Rapat Koordinasi Infrastruktur Otsus', waktu: '08:00 – 12:00', lokasi: 'Aula PUPR Sorong', warna: '#2D8A4E', tanggal: '2025-06-22' },
    { id: 2, judul: 'Kunjungan Lapangan Jalan Trans Papua', waktu: '13:00 – 17:00', lokasi: 'Kabupaten Sorong Selatan', warna: '#F0A500', tanggal: '2025-06-23' },
    { id: 3, judul: 'Presentasi RAP DTI ke Gubernur', waktu: '09:00 – 11:00', lokasi: 'Kantor Gubernur PBD', warna: '#1565c0', tanggal: '2025-06-24' },
  ],

  publikasi: [
    { id: 1, icon: '📋', judul: 'Rencana Strategis PUPR Papua Barat Daya 2024–2029', tanggal: '2025-01-01', tipe: 'policy', tags: ['policy', 'infra'] },
    { id: 2, icon: '📊', judul: 'Laporan Kinerja Triwulan I 2025', tanggal: '2025-04-01', tipe: 'report', tags: ['report'] },
    { id: 3, icon: '📢', judul: 'Siaran Pers: Peresmian Embung Maybrat', tanggal: '2025-06-10', tipe: 'siaran', tags: ['infra', 'env'] },
    { id: 4, icon: '📜', judul: 'Peraturan Gubernur No. 12/2025 tentang Infrastruktur Dasar', tanggal: '2025-03-01', tipe: 'reg', tags: ['policy'] },
    { id: 5, icon: '🗺️', judul: 'Peta Jaringan Jalan Provinsi Papua Barat Daya', tanggal: '2025-02-01', tipe: 'gis', tags: ['infra'] },
  ],

  monitoring: [
    { id: 1, judul: 'Trans Papua Barat Daya Update', penulis: 'Budi S.', tahap: 'review', reviewer: 'Editor Senior', deadline: '13 Jun' },
    { id: 2, judul: 'Bedah Rumah 500 Unit', penulis: 'Siti R.', tahap: 'approval', reviewer: 'Kabid Humas', deadline: '14 Jun' },
    { id: 3, judul: 'Tender Alat Berat 2025', penulis: 'Ahmad F.', tahap: 'draft', reviewer: '-', deadline: '20 Jun' },
    { id: 4, judul: 'Jembatan Aimas Laporan', penulis: 'Roni K.', tahap: 'review', reviewer: 'Editor Senior', deadline: '15 Jun' },
  ],

  ai_history: [
    { id: 1, prompt: 'Siaran pers jalan Trans Papua', created_at: '5 menit lalu' },
    { id: 2, prompt: 'Caption sosmed embung Maybrat', created_at: '2 jam lalu' },
    { id: 3, prompt: 'Laporan progress proyek irigasi', created_at: 'Kemarin' },
  ],

  activities: [
    { icon: 'ti ti-file-check', cls: 'a-green', text: '<strong>Budi Santoso</strong> menerbitkan berita tentang Trans Papua Barat Daya', time: '10 menit lalu' },
    { icon: 'ti ti-brain', cls: 'a-gold', text: 'AI Studio menghasilkan <strong>3 draft berita</strong> otomatis', time: '45 menit lalu' },
    { icon: 'ti ti-photo', cls: 'a-blue', text: '<strong>12 foto</strong> kegiatan peresmian diunggah ke Galeri', time: '2 jam lalu' },
    { icon: 'ti ti-alert-triangle', cls: 'a-red', text: 'Konten "<strong>Pengadaan Tender</strong>" perlu revisi editor', time: '3 jam lalu' },
    { icon: 'ti ti-check', cls: 'a-green', text: '<strong>Siti Rahayu</strong> menyetujui 2 berita dari antrean review', time: '5 jam lalu' },
  ],
};

// ── API MODULE ──────────────────────────────────────────────────
const API = (() => {

  function getClient() {
    return window.SupabaseConfig?.client();
  }

  // ── BERITA ─────────────────────────────────────────────────────
  const Berita = {

    async getAll({ status, kategori, limit } = {}) {
      const sb = getClient();
      if (!sb) return { data: DummyData.berita, error: null, demo: true };

      let query = sb.from('berita').select('*').order('created_at', { ascending: false });
      if (status)   query = query.eq('status', status);
      if (kategori) query = query.eq('kategori', kategori);
      if (limit)    query = query.limit(limit);

      const { data, error } = await query;
      return { data: data || [], error };
    },

    async getById(id) {
      const sb = getClient();
      if (!sb) return { data: DummyData.berita.find(b => b.id === id) || null, error: null };

      const { data, error } = await sb.from('berita').select('*').eq('id', id).single();
      return { data, error };
    },

    async create(beritaData) {
      const sb = getClient();
      if (!sb) {
        const newItem = { ...beritaData, id: Date.now(), views: 0, created_at: new Date().toISOString() };
        DummyData.berita.unshift(newItem);
        return { data: newItem, error: null, demo: true };
      }

      const { data, error } = await sb.from('berita').insert([beritaData]).select().single();
      return { data, error };
    },

    async update(id, updates) {
      const sb = getClient();
      if (!sb) {
        const idx = DummyData.berita.findIndex(b => b.id === id);
        if (idx !== -1) DummyData.berita[idx] = { ...DummyData.berita[idx], ...updates };
        return { data: DummyData.berita[idx], error: null, demo: true };
      }

      const { data, error } = await sb.from('berita').update(updates).eq('id', id).select().single();
      return { data, error };
    },

    async delete(id) {
      const sb = getClient();
      if (!sb) {
        DummyData.berita = DummyData.berita.filter(b => b.id !== id);
        return { data: null, error: null, demo: true };
      }

      const { error } = await sb.from('berita').delete().eq('id', id);
      return { data: null, error };
    },

    async incrementViews(id) {
      const sb = getClient();
      if (!sb) return;
      await sb.rpc('increment_views', { berita_id: id });
    },
  };

  // ── GALERI ─────────────────────────────────────────────────────
  const Galeri = {

    async getAll({ type, limit } = {}) {
      const sb = getClient();
      if (!sb) return { data: DummyData.galeri, error: null, demo: true };

      let query = sb.from('galeri_media').select('*').order('created_at', { ascending: false });
      if (type)  query = query.eq('type', type);
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      return { data: data || [], error };
    },

    async upload(file, caption, uploadedBy) {
      const sb = getClient();
      if (!sb) {
        const newItem = { id: Date.now(), emoji: '🖼️', judul: caption, type: 'foto', created_at: new Date().toISOString() };
        DummyData.galeri.unshift(newItem);
        return { data: newItem, error: null, demo: true };
      }

      // Upload ke Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await sb.storage
        .from('media')
        .upload(`gallery/${fileName}`, file);

      if (storageError) return { data: null, error: storageError };

      const url = sb.storage.from('media').getPublicUrl(`gallery/${fileName}`).data.publicUrl;

      const { data, error } = await sb.from('galeri_media').insert([{
        judul: caption,
        url,
        type: file.type.startsWith('video') ? 'video' : 'foto',
        caption,
        uploaded_by: uploadedBy,
      }]).select().single();

      return { data, error };
    },

    async delete(id) {
      const sb = getClient();
      if (!sb) {
        DummyData.galeri = DummyData.galeri.filter(g => g.id !== id);
        return { data: null, error: null, demo: true };
      }

      const { error } = await sb.from('galeri_media').delete().eq('id', id);
      return { data: null, error };
    },
  };

  // ── AGENDA ─────────────────────────────────────────────────────
  const Agenda = {

    async getAll({ startDate, endDate } = {}) {
      const sb = getClient();
      if (!sb) return { data: DummyData.agenda, error: null, demo: true };

      let query = sb.from('agenda').select('*').order('tanggal', { ascending: true });
      if (startDate) query = query.gte('tanggal', startDate);
      if (endDate)   query = query.lte('tanggal', endDate);

      const { data, error } = await query;
      return { data: data || [], error };
    },

    async create(agendaData) {
      const sb = getClient();
      if (!sb) {
        const newItem = { ...agendaData, id: Date.now() };
        DummyData.agenda.push(newItem);
        return { data: newItem, error: null, demo: true };
      }

      const { data, error } = await sb.from('agenda').insert([agendaData]).select().single();
      return { data, error };
    },

    async delete(id) {
      const sb = getClient();
      if (!sb) {
        DummyData.agenda = DummyData.agenda.filter(a => a.id !== id);
        return { data: null, error: null, demo: true };
      }

      const { error } = await sb.from('agenda').delete().eq('id', id);
      return { data: null, error };
    },
  };

  // ── PUBLIKASI ──────────────────────────────────────────────────
  const Publikasi = {

    async getAll({ tipe } = {}) {
      const sb = getClient();
      if (!sb) return { data: DummyData.publikasi, error: null, demo: true };

      let query = sb.from('publikasi').select('*').order('tanggal', { ascending: false });
      if (tipe) query = query.eq('tipe', tipe);

      const { data, error } = await query;
      return { data: data || [], error };
    },

    async create(pubData) {
      const sb = getClient();
      if (!sb) {
        const newItem = { ...pubData, id: Date.now() };
        DummyData.publikasi.unshift(newItem);
        return { data: newItem, error: null, demo: true };
      }

      const { data, error } = await sb.from('publikasi').insert([pubData]).select().single();
      return { data, error };
    },
  };

  // ── MONITORING ─────────────────────────────────────────────────
  const Monitoring = {

    async getAll() {
      const sb = getClient();
      if (!sb) return { data: DummyData.monitoring, error: null, demo: true };

      const { data, error } = await sb
        .from('monitoring')
        .select('*, berita(judul, penulis)')
        .order('deadline', { ascending: true });

      return { data: data || [], error };
    },

    async updateTahap(id, tahap, catatan = '') {
      const sb = getClient();
      if (!sb) {
        const idx = DummyData.monitoring.findIndex(m => m.id === id);
        if (idx !== -1) DummyData.monitoring[idx].tahap = tahap;
        return { data: null, error: null, demo: true };
      }

      const { data, error } = await sb
        .from('monitoring')
        .update({ tahap, catatan, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select().single();

      return { data, error };
    },
  };

  // ── AI HISTORY ─────────────────────────────────────────────────
  const AIHistory = {

    async getAll({ limit = 10 } = {}) {
      const sb = getClient();
      if (!sb) return { data: DummyData.ai_history, error: null, demo: true };

      const { data, error } = await sb
        .from('ai_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data: data || [], error };
    },

    async save(prompt, hasil, userId) {
      const sb = getClient();
      if (!sb) {
        DummyData.ai_history.unshift({ id: Date.now(), prompt, created_at: 'Baru saja' });
        return { data: null, error: null, demo: true };
      }

      const { data, error } = await sb
        .from('ai_history')
        .insert([{ prompt, hasil, user_id: userId }])
        .select().single();

      return { data, error };
    },
  };

  // ── ACTIVITIES ─────────────────────────────────────────────────
  const Activities = {
    async getRecent() {
      // Untuk sementara pakai data dummy; bisa disambungkan ke tabel `activity_log`
      return { data: DummyData.activities, error: null };
    },
  };

  // ── STATS / ANALYTICS ──────────────────────────────────────────
  const Stats = {

    async getDashboard() {
      const sb = getClient();

      if (!sb) {
        return {
          data: {
            totalBerita: 148,
            totalTayangan: 24700,
            totalMedia: 436,
            menungguReview: 7,
            performa: 89,
            tugasAktif: 12,
          },
          error: null,
          demo: true,
        };
      }

      const [
        { count: totalBerita },
        { count: menungguReview },
        { count: totalMedia },
      ] = await Promise.all([
        sb.from('berita').select('*', { count: 'exact', head: true }),
        sb.from('berita').select('*', { count: 'exact', head: true }).eq('status', 'review'),
        sb.from('galeri_media').select('*', { count: 'exact', head: true }),
      ]);

      // Jumlah tayangan dari semua berita
      const { data: viewsData } = await sb.from('berita').select('views');
      const totalTayangan = viewsData?.reduce((sum, b) => sum + (b.views || 0), 0) || 0;

      return {
        data: { totalBerita: totalBerita || 0, totalTayangan, totalMedia: totalMedia || 0, menungguReview: menungguReview || 0 },
        error: null,
      };
    },
  };

  // ── PUBLIC API ─────────────────────────────────────────────────
  return { Berita, Galeri, Agenda, Publikasi, Monitoring, AIHistory, Activities, Stats };

})();

window.API = API;
window.DummyData = DummyData;
