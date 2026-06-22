# Panduan Setup Supabase

Aplikasi SIM-HUMAS ini dirancang menggunakan **Supabase** sebagai Backend as a Service (BaaS) untuk menangani Database, Authentication, Storage, dan Edge Functions.

Ikuti panduan berikut untuk menghubungkan aplikasi ke Supabase.

---

## Tahap 1: Buat Proyek Supabase

1. Kunjungi [supabase.com](https://supabase.com) dan login/daftar.
2. Klik **"New Project"**.
3. Pilih organisasi Anda, beri nama (misal: `sim-humas-papbd`), dan buat password database yang kuat.
4. Pilih region terdekat (misal: Singapore) dan klik **"Create new project"**.
5. Tunggu beberapa menit hingga database selesai disiapkan.

---

## Tahap 2: Terapkan Skema Database

Kita perlu membuat tabel-tabel di Supabase agar sesuai dengan kode frontend.

1. Di dashboard Supabase, buka menu **"SQL Editor"** (ikon terminal di sidebar kiri).
2. Klik **"New Query"**.
3. Buka file `backend/supabase/migrations/001_init_schema.sql` dari komputer Anda.
4. Salin seluruh isinya dan tempel (paste) ke SQL Editor Supabase.
5. Klik **"Run"** (Ctrl+Enter / Cmd+Enter).
6. Pesan "Success" akan muncul, artinya semua tabel dan aturan keamanan (RLS) berhasil dibuat.

---

## Tahap 3: Sambungkan Frontend

Sekarang kita beritahu frontend di mana lokasi database-nya.

1. Di dashboard Supabase, buka **"Project Settings"** (ikon roda gigi) -> **"API"**.
2. Salin nilai dari:
   - **Project URL**
   - **Project API Keys (anon / public)**
3. Buka file `frontend/assets/js/supabase.config.js`.
4. Ganti nilai variabel di bagian atas file:
   ```javascript
   const SUPABASE_URL     = 'https://xxxxx.supabase.co'; // <- Tempel URL di sini
   const SUPABASE_ANON_KEY = 'eyJhbG...';                // <- Tempel Anon Key di sini
   ```
5. Simpan file.

---

## Tahap 4: Buat Akun Pengguna Pertama

Karena pendaftaran publik (signup) dimatikan untuk keamanan, Anda harus membuat user pertama secara manual.

1. Di dashboard Supabase, buka menu **"Authentication"** -> **"Users"**.
2. Klik **"Add User"** -> **"Create New User"**.
3. Masukkan email (misal: `admin@pupr-papbd.go.id`) dan password (misal: `admin123`).
4. Centang "Auto Confirm User?".
5. Klik **"Create User"**.

Sekarang Anda bisa login di `frontend/pages/login.html` menggunakan email dan password tersebut!

---

## Tahap 5: Setup Storage (Penyimpanan File)

Agar fitur Galeri bisa berfungsi:

1. Di dashboard Supabase, buka menu **"Storage"**.
2. Klik **"New Bucket"**.
3. Beri nama bucket: **`media`**.
4. Jadikan bucket ini **"Public"** (toggle public aktif) agar gambar bisa dilihat.
5. Klik **Save**.
6. (Opsional) Ulangi untuk bucket bernama **`dokumen`** jika ingin menyimpan PDF.

---

## Tahap 6 (Opsional tapi Penting): Deploy AI Proxy

Fitur AI Content Studio memanggil Claude API. Agar API Key Anda tidak bocor ke publik, Anda harus menggunakan Supabase Edge Function yang sudah kami sediakan.

*(Pastikan Anda sudah menginstal Docker dan Supabase CLI di komputer Anda)*

1. Buka terminal di root folder proyek ini.
2. Login ke CLI Supabase:
   ```bash
   supabase login
   ```
3. Hubungkan ke proyek Anda:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```
   *(Project ID adalah bagian tengah URL Supabase Anda: `https://[PROJECT_ID].supabase.co`)*
4. Set API Key Anthropic/Claude Anda sebagai environment variable rahasia di server:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
5. Deploy Edge Function:
   ```bash
   supabase functions deploy ai-proxy
   ```
6. Update frontend untuk menggunakan Edge Function. Buka `frontend/assets/js/ai-studio.js` dan ubah variabel `AI_PROXY_URL`:
   ```javascript
   const AI_PROXY_URL = 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/ai-proxy';
   ```

**Selamat! Aplikasi SIM-HUMAS Anda sekarang sudah berjalan dengan Supabase sebagai Backend.**
