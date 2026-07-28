# Yoonjaespace Studio Management

Aplikasi operasional studio foto berbasis web — booking, jadwal, pengiriman foto, finance, dan komisi staff dalam satu sistem.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.98-3FCF8E?logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)

Yoonjaespace Studio Management mengelola seluruh alur kerja studio: booking dibuat oleh staff, bergerak melalui status sesi foto, sampai ke pengiriman hasil dan pelunasan pembayaran — sementara Finance dan Komisi menghitung pendapatan serta bonus staff secara otomatis. Dibangun mobile-first dengan dukungan PWA (Add to Home Screen) agar nyaman dipakai langsung dari HP di studio.

## ✨ Fitur Utama

| Modul | Deskripsi |
|---|---|
| 📅 **Booking** | Wizard multi-step buat booking baru, list dengan filter & pencarian, detail progress per sesi |
| 🗓️ **Kalender** | Kalender internal studio (day/week/month) untuk cek ketersediaan jadwal |
| 📦 **Photo Delivery** | Kelola link Google Drive dan progress cetak/pengiriman foto |
| 👥 **Customer** | Data pelanggan, riwayat booking, export CSV/Excel |
| 💬 **Reminder** | Reminder WhatsApp berbasis template, tersegmentasi Hari Ini / 7 Hari / 30 Hari |
| 💰 **Finance** | Income, expense, gross profit, paket terpopuler, export Excel |
| 🧾 **Komisi** | Perhitungan komisi staff per periode cutoff, status bayar, riwayat |
| 🏢 **Vendor** | Data vendor cetak/produksi dan statistik pengeluaran terkait |
| 📝 **Activity Log** | Audit trail seluruh perubahan penting di sistem |
| 🔐 **Role & User** | Kontrol akses berbasis role dengan menu access per pengguna |
| ⚙️ **Settings** | Master data: paket, add-on, background, voucher, template, dan konfigurasi studio |

Booking, invoice, dan jadwal publik MUA juga tersedia lewat halaman publik (`/customer/[token]`, `/invoice/[token]`, `/mua`) tanpa perlu login.

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16.2.4 (App Router) |
| UI Library | React 19.2.5, TypeScript 5 |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) |
| Backend & Auth | Supabase (PostgreSQL, Auth, Storage) |
| Form & Validasi | React Hook Form + Zod |
| Drag & Drop | dnd-kit |
| Tanggal | date-fns, react-day-picker |
| Export | xlsx |
| PWA | @ducanh2912/next-pwa |
| Deploy | Vercel |

## 🚀 Quick Start

**Kebutuhan:** Node.js 20+, project Supabase aktif.

```bash
git clone <repo-url>
cd yoonjaespacestudio
npm install
```

Salin environment variables:

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Siapkan database — buka Supabase SQL Editor lalu jalankan seluruh isi `supabase/migrations/setup_yoonjae_database.sql` (membuat enum, tabel, RLS policy, bucket storage `images-yoonjae`, dan role default).

Jalankan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm run start   # build production
npm run lint                     # lint
```

## 📁 Struktur Proyek

```
src/
├─ app/
│  ├─ (auth)/login              Login
│  ├─ (dashboard)/
│  │  ├─ dashboard              Ringkasan & statistik
│  │  ├─ bookings               List, wizard create, detail booking
│  │  ├─ calendar                Kalender internal
│  │  ├─ photo-delivery          Pengiriman foto & print
│  │  ├─ customers               Data & riwayat customer
│  │  ├─ reminders               Reminder WhatsApp
│  │  ├─ finance                 Income, expense, profit
│  │  ├─ commissions             Komisi staff
│  │  ├─ vendors                 Data vendor
│  │  ├─ activities              Activity log
│  │  ├─ user-management         Kelola user
│  │  ├─ role-management         Role & akses menu
│  │  └─ settings                Master data & konfigurasi
│  ├─ (public)/
│  │  ├─ customer                Halaman publik customer
│  │  ├─ invoice                 Invoice publik
│  │  └─ mua                     Kalender publik MUA
│  └─ api                        API routes
├─ components/
│  ├─ layout                     Sidebar, header, mobile nav
│  └─ ui                         Komponen shadcn/ui
├─ hooks                         Custom React hooks
├─ lib                           Constants, utils, types, shared logic
└─ utils/supabase                Supabase client/server/middleware/admin
```

## 📖 Dokumentasi Lengkap

Business rules, status booking & print order, flow detail tiap halaman, dan checklist handover ada di [`DOKUMENTASI_HANDOVER.md`](./DOKUMENTASI_HANDOVER.md).

## 🔒 Lisensi

Proprietary — proyek internal untuk Yoonjaespace Studio. Bukan open source, tidak menerima kontribusi publik.
