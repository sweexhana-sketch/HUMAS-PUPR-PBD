# Struktur Folder SIM-HUMAS

Proyek ini telah direstrukturisasi dari satu file HTML monolitik menjadi aplikasi full-stack modular dengan pemisahan _frontend_ dan _backend_ yang rapi.

```text
aplikasi SIM-HUMAS Dinas PUPR Papua Barat Daya/
│
├── frontend/                          ← Root Aplikasi Frontend
│   ├── index.html                     ← Entry point, auto-redirect ke login/app
│   ├── pages/
│   │   ├── app.html                   ← Aplikasi Utama (SPA)
│   │   └── login.html                 ← Halaman Login
│   │
│   └── assets/                        ← Aset Statis (CSS, JS, Images)
│       ├── css/
│       │   ├── main.css               ← Variabel global, reset, font (Tokens)
│       │   ├── components.css         ← Sidebar, topbar, modal, tombol, toast
│       │   └── pages.css              ← Styling khusus per halaman (dashboard, dll)
│       │
│       ├── js/
│       │   ├── supabase.config.js     ← Init Supabase & mode demo fallback
│       │   ├── auth.js                ← Logic Login, Logout, Session guard
│       │   ├── api.js                 ← Wrapper API CRUD (Supabase & Dummy Data)
│       │   ├── router.js              ← Single Page App router navigation
│       │   ├── utils.js               ← Format tanggal, toast, modal, utils lain
│       │   │
│       │   ├── dashboard.js           ← Logic khusus halaman Dashboard
│       │   ├── berita.js              ← Logic Manajemen Berita
│       │   ├── galeri.js              ← Logic Galeri & Agenda & lainnya
│       │   └── ai-studio.js           ← Logic AI Generator & Proxy ke Claude
│       │
│       └── images/                    ← Folder gambar logo & icon statis
│
├── backend/                           ← Konfigurasi & Migrasi Backend
│   ├── supabase/
│   │   ├── config.toml                ← Konfigurasi lokal Supabase CLI
│   │   ├── migrations/
│   │   │   └── 001_init_schema.sql    ← Skema DB, RLS, Trigger, Functions
│   │   │
│   │   └── functions/                 ← Supabase Edge Functions (Deno/TS)
│   │       └── ai-proxy/
│   │           └── index.ts           ← Proxy aman untuk Anthropic API Key
│   │
│   └── docs/
│       └── schema.md                  ← Dokumentasi skema database
│
├── docs/                              ← Dokumentasi Proyek
│   ├── README.md                      ← Panduan utama proyek
│   ├── SUPABASE_SETUP.md              ← Panduan koneksi Supabase & DB
│   └── FOLDER_STRUCTURE.md            ← File ini
│
├── .env.example                       ← Contoh environment variable
└── .gitignore                         ← File untuk git ignore
```

## Arsitektur Aplikasi (Frontend)

Aplikasi ini menggunakan pola **Single Page Application (SPA)** murni (Vanilla JS), di mana:
1. `app.html` memuat kerangka utama (Sidebar & Topbar) beserta semua _container_ halaman (yang disembunyikan menggunakan CSS `display: none`).
2. `router.js` bertugas mengubah _class active_ untuk menampilkan halaman yang diminta tanpa perlu reload browser.
3. Semua panggilan data dienkapsulasi di `api.js`. File ini cukup cerdas: Jika Supabase dikonfigurasi, ia akan _fetch_ data ke database. Jika tidak, ia akan menampilkan _Dummy Data_ secara otomatis agar desain UI tetap dapat dilihat/dikembangkan tanpa backend.
