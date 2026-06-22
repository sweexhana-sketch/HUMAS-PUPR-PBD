# SIM-HUMAS Dinas PUPR Papua Barat Daya

Sistem Informasi Manajemen Humas (SIM-HUMAS) adalah aplikasi web full-stack modern yang dirancang khusus untuk mengelola publikasi, informasi, dan alur kerja komunikasi publik Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR) Provinsi Papua Barat Daya.

## 🚀 Fitur Utama

- **Manajemen Berita**: Buat, edit, dan kelola alur publikasi berita.
- **AI Content Studio**: Generator konten otomatis dengan Claude AI.
- **Galeri Media**: Penyimpanan tersentralisasi untuk aset foto & video (via Supabase Storage).
- **Agenda Kegiatan**: Jadwal kegiatan dinas.
- **Publikasi Resmi**: Manajemen dokumen formal, regulasi, dan peta.
- **Monitoring Konten**: Lacak status persetujuan konten secara real-time.
- **Laporan & Statistik**: Analitik performa tayangan dan engagement konten.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+). Tanpa build step (langsung buka di browser).
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL).
- **Auth**: Supabase Authentication.
- **AI Backend**: Supabase Edge Functions + Anthropic Claude API.
- **Icons**: Tabler Icons.

## 📁 Struktur Proyek

Proyek ini dipisah antara frontend dan backend:
- `frontend/` berisi semua UI, styling, dan logika aplikasi SPA.
- `backend/` berisi migrasi database SQL dan konfigurasi Supabase.
- `docs/` berisi dokumentasi.

Lihat [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) untuk detail lengkap.

## ⚙️ Cara Menjalankan (Development Lokal)

### Mode Demo (Tanpa Database)
Aplikasi ini sudah dilengkapi dengan sistem **Mode Demo**. Jika Anda belum mengkonfigurasi Supabase, aplikasi akan menggunakan data dummy yang tersimpan secara lokal.

1. Buka file `frontend/index.html` menggunakan browser Anda.
2. Login dengan kredensial demo:
   - Email: `admin@pupr-papbd.go.id`
   - Password: `admin123`

### Menggunakan Live Server (Direkomendasikan)
Untuk mencegah error CORS (Cross-Origin Resource Sharing) saat memuat file JS modular:
1. Buka folder ini di VS Code.
2. Install ekstensi **Live Server**.
3. Klik kanan pada `frontend/index.html` -> "Open with Live Server".

## 🔌 Setup Database (Supabase)

Untuk menjalankan dengan database nyata:
1. Buat project di [supabase.com](https://supabase.com).
2. Jalankan skrip SQL di `backend/supabase/migrations/001_init_schema.sql` pada SQL Editor Supabase.
3. Salin `URL` dan `anon key` Supabase Anda.
4. Buka file `frontend/assets/js/supabase.config.js` dan tempelkan kredensial Anda.

Lihat panduan lengkap di [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## 🔒 Keamanan AI (Claude API)

API Key Claude **TIDAK BOLEH** ditaruh di sisi Frontend (`frontend/assets/js/ai-studio.js`) untuk versi production.

Sistem ini sudah dilengkapi dengan **Supabase Edge Function** (`backend/supabase/functions/ai-proxy`) yang bertindak sebagai proxy aman. Ikuti instruksi di `SUPABASE_SETUP.md` untuk mendeploy fungsi ini.

---
*Dibuat untuk Dinas PUPR Provinsi Papua Barat Daya © 2025*
