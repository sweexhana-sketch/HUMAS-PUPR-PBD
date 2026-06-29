# Skema Database SIM-HUMAS PUPR Papua Barat Daya

Skema database berjalan di atas **Supabase (PostgreSQL)**.  
Akses data dari frontend dilindungi menggunakan **Row Level Security (RLS)**.

## Tabel Utama

### 1. `profiles`
Tabel ini extend dari tabel `auth.users` bawaan Supabase. Dibuat otomatis via Trigger saat user baru daftar.
- `id` (UUID, PK) -> Referensi ke `auth.users(id)`
- `email` (TEXT)
- `full_name` (TEXT)
- `role` (TEXT) -> Default: 'Editor'
- `avatar_url` (TEXT)

### 2. `berita`
Menyimpan konten berita dan artikel.
- `id` (BIGINT, PK)
- `judul` (TEXT)
- `isi` (TEXT)
- `kategori` (TEXT)
- `status` (TEXT) -> 'draft', 'review', 'published'
- `tanggal` (DATE)
- `penulis` (TEXT)
- `views` (INT)
- `user_id` (UUID, FK ke profiles)

### 3. `galeri_media`
Menyimpan metadata file foto/video yang diupload ke Supabase Storage.
- `id` (BIGINT, PK)
- `judul` (TEXT)
- `url` (TEXT) -> URL publik dari Supabase Storage
- `type` (TEXT) -> 'foto', 'video'
- `caption` (TEXT)
- `uploaded_by` (TEXT)

### 4. `agenda`
Menyimpan jadwal kegiatan.
- `id` (BIGINT, PK)
- `judul` (TEXT)
- `tanggal` (DATE)
- `waktu` (TEXT)
- `lokasi` (TEXT)
- `keterangan` (TEXT)
- `warna` (TEXT) -> CSS var, e.g. `var(--green)`

### 5. `publikasi`
Menyimpan dokumen regulasi atau laporan (PDF/Word).
- `id` (BIGINT, PK)
- `judul` (TEXT)
- `icon` (TEXT)
- `tanggal` (DATE)
- `tipe` (TEXT)
- `tags` (TEXT[])
- `file_url` (TEXT)

### 6. `monitoring`
Alur kerja persetujuan konten. Otomatis dibuat via Trigger saat baris baru ditambahkan ke tabel `berita`.
- `id` (BIGINT, PK)
- `berita_id` (BIGINT, FK ke berita)
- `judul` (TEXT)
- `penulis` (TEXT)
- `tahap` (TEXT) -> 'draft', 'review', 'approval', 'published'
- `reviewer` (TEXT)
- `deadline` (TEXT)
- `catatan` (TEXT)

### 7. `ai_history`
Riwayat penggunaan AI Content Studio.
- `id` (BIGINT, PK)
- `prompt` (TEXT)
- `hasil` (TEXT)
- `user_id` (UUID, FK ke profiles)

---

## Supabase Storage (Buckets)
- **`media`**: Menyimpan aset foto/video galeri.
- **`dokumen`**: Menyimpan file PDF untuk publikasi.
