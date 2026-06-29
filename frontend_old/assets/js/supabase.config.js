/**
 * supabase.config.js
 * Inisialisasi Supabase Client
 * SIM-HUMAS Dinas PUPR Papua Barat Daya
 *
 * CARA SETUP:
 * 1. Buat project di https://supabase.com
 * 2. Salin URL dan Anon Key dari Settings > API
 * 3. Isi nilai SUPABASE_URL dan SUPABASE_ANON_KEY di bawah
 */

// ── KONFIGURASI SUPABASE ────────────────────────────────────────
// Ganti dengan kredensial project Supabase Anda
const SUPABASE_URL     = 'https://udirpbfyqritfzecfcrb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NA1NHkAGZRE_YjLceWTDjA_QLzi1UeK'; // Kunci anon/publishable yang aman untuk frontend

// ── INISIALISASI CLIENT ─────────────────────────────────────────
// Menggunakan Supabase JS SDK via CDN (dimuat di HTML)
let supabase = null;

function initSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.error('[Supabase] SDK belum dimuat. Pastikan script CDN sudah ada di HTML.');
    return null;
  }

  if (!SUPABASE_URL.includes('YOUR_PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('[Supabase] Client berhasil diinisialisasi ✓');
  } else {
    console.warn('[Supabase] Konfigurasi belum diisi. Mode demo (data lokal) aktif.');
    // Gunakan data lokal/dummy saat Supabase belum dikonfigurasi
    supabase = null;
  }

  return supabase;
}

// ── STATUS CONFIG ───────────────────────────────────────────────
function isSupabaseConfigured() {
  return supabase !== null;
}

// ── EXPORT ─────────────────────────────────────────────────────
window.SupabaseConfig = {
  init: initSupabase,
  client: () => supabase,
  isConfigured: isSupabaseConfigured,
  URL: SUPABASE_URL,
};

// Auto-init saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
});
