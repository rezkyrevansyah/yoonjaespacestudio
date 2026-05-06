# Dokumen Handover Project

## Yoonjaespace Studio Management

Tanggal dokumen: 6 Mei 2026  
Repository: `https://github.com/rezkyrevansyah/yoonjaespacestudio.git`  
Branch utama: `main`  
Nama package: `yoonjae-space`  
Status project: Aplikasi web operasional studio berbasis Next.js dan Supabase.

---

## 1. Ringkasan Eksekutif

Yoonjaespace Studio Management adalah aplikasi operasional internal studio fotografi untuk mengelola booking, customer, jadwal, invoice, reminder WhatsApp, pengiriman foto, finance, vendor, komisi staff, activity log, user, role, dan master data studio.

Aplikasi ini dibuat mobile-first dan sudah mendukung PWA, sehingga dapat dibuka dari browser desktop maupun mobile dan dapat ditambahkan ke home screen perangkat.

Fokus utama sistem:

| Area | Fungsi |
| --- | --- |
| Booking | Membuat, melihat, mengubah status, reschedule, delete, dan tracking booking |
| Calendar | Melihat jadwal studio dalam tampilan day, week, dan month |
| Customer | Menyimpan data customer dan riwayat booking |
| Photo Delivery | Mengelola link Google Drive dan progress cetak/pengiriman foto |
| Reminder | Membuat link WhatsApp reminder berdasarkan template |
| Finance | Menghitung income, expense, profit, export, dan close booking |
| Vendor | Mencatat vendor dan histori expense terkait vendor |
| Commission | Mengelola komisi staff per periode |
| Role & User | Mengelola user internal, menu access, dan permission status booking |
| Public Page | Customer page, invoice publik, dan kalender publik MUA tanpa login |

---

## 2. Tech Stack

Stack aktual berdasarkan konfigurasi project saat dokumen ini dibuat:

| Komponen | Teknologi |
| --- | --- |
| Framework | Next.js `^16.2.4` |
| Router | Next.js App Router |
| Bahasa | TypeScript |
| UI | React `^19.2.5` |
| Styling | Tailwind CSS `^3.4.1` |
| Komponen UI | Radix UI, shadcn/ui style components |
| Icon | `lucide-react` |
| Form | `react-hook-form`, `zod`, `@hookform/resolvers` |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| PWA | `@ducanh2912/next-pwa` |
| Export Excel | `xlsx` |
| Lint | ESLint 9 dengan `eslint-config-next` |
| Package manager | npm dengan `package-lock.json` |
| Target deploy | Vercel |

Catatan: jika ada perbedaan antara README lama dan `package.json`, gunakan `package.json` sebagai sumber versi dependency yang aktif.

---

## 3. Prasyarat

Sebelum menjalankan project, pastikan perangkat developer/client memiliki:

| Kebutuhan | Versi/Rekomendasi |
| --- | --- |
| Node.js | 20 LTS atau lebih baru |
| npm | Mengikuti instalasi Node.js |
| Git | Versi stabil terbaru |
| Akun Supabase | Untuk database, auth, dan storage |
| Akun Vercel | Untuk deployment production |
| Browser | Chrome/Edge/Safari/Firefox versi modern |

---

## 4. Cara Mendapatkan Source Code

### 4.1 Clone dari GitHub

Gunakan cara ini untuk developer yang akan melanjutkan maintenance.

```bash
git clone https://github.com/rezkyrevansyah/yoonjaespacestudio.git
cd yoonjaespacestudio
git checkout main
```

### 4.2 Download ZIP dari GitHub

Gunakan cara ini jika client hanya ingin menyimpan backup source code.

1. Buka repository GitHub:
   `https://github.com/rezkyrevansyah/yoonjaespacestudio`
2. Klik tombol `Code`.
3. Pilih `Download ZIP`.
4. Extract file ZIP.
5. Buka folder hasil extract di editor.

Catatan: jika menggunakan download ZIP, folder tersebut tidak otomatis terhubung ke Git remote. Untuk development jangka panjang, clone via Git lebih direkomendasikan.

---

## 5. Instalasi Lokal

### 5.1 Install Dependency

Untuk environment baru, gunakan:

```bash
npm ci
```

Jika `npm ci` gagal karena dependency lock berubah, gunakan:

```bash
npm install
```

### 5.2 Buat Environment File

Copy `.env.example` menjadi `.env.local`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

Isi variable berikut:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Alternatif key Supabase yang juga didukung:

```txt
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Prioritas pembacaan publishable key di kode:

1. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 5.3 Jalankan Development Server

```bash
npm run dev
```

Buka:

```txt
http://localhost:3000
```

Script `dev` menggunakan:

```txt
next dev --webpack
```

---

## 6. Script Project

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan hasil production build |
| `npm run lint` | Menjalankan ESLint |
| `npm run test` | Menjalankan lint lalu build |

Rekomendasi sebelum deploy atau handover final:

```bash
npm run test
```

---

## 7. Struktur Folder

```txt
.
|-- public/                         Asset publik, logo, icon PWA, manifest
|-- src/
|   |-- app/                         Next.js App Router pages dan API routes
|   |   |-- (auth)/login              Halaman login internal
|   |   |-- (dashboard)/              Area dashboard yang membutuhkan login
|   |   |-- (public)/                 Halaman publik tanpa login
|   |   `-- api/                      API routes server-side
|   |-- components/
|   |   |-- layout/                   Sidebar, header, mobile navigation
|   |   `-- ui/                       Komponen UI reusable
|   |-- hooks/                       Custom React hooks
|   |-- lib/                         Constants, utilities, cached queries, types
|   `-- utils/supabase/              Supabase client, server, admin, middleware
|-- supabase/migrations/            SQL setup database dan bootstrap owner
|-- package.json                    Script dan dependency project
|-- next.config.mjs                 Konfigurasi Next.js, image remote, PWA
|-- tailwind.config.ts              Konfigurasi Tailwind CSS
|-- eslint.config.mjs               Konfigurasi ESLint
|-- test-cases.md                   Daftar test case frontend
`-- DOKUMENTASI_HANDOVER.md         Dokumen handover ini
```

---

## 8. Environment Variable

| Variable | Scope | Wajib | Fungsi |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client dan server | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Client dan server | Ya | Publishable key Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client dan server | Opsional | Alternatif nama publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Ya | Akses admin Supabase untuk API server tertentu |
| `NEXT_PUBLIC_APP_URL` | Client dan server | Ya | Base URL aplikasi untuk link publik invoice/customer |

Panduan keamanan:

- Jangan commit `.env.local`.
- Jangan membagikan `SUPABASE_SERVICE_ROLE_KEY` ke frontend, browser, atau pihak yang tidak berwenang.
- Di Vercel, simpan semua variable melalui dashboard Environment Variables.
- Untuk production, `NEXT_PUBLIC_APP_URL` harus berisi domain production, contoh:

```txt
NEXT_PUBLIC_APP_URL=https://app.yoonjaespace.com
```

---

## 9. Setup Supabase

Project membutuhkan Supabase untuk:

1. PostgreSQL database.
2. Supabase Auth.
3. Supabase Storage bucket `images-yoonjae`.
4. Service role key untuk operasi server tertentu.

### 9.1 Buat Project Supabase

1. Login ke Supabase.
2. Buat project baru.
3. Simpan:
   - Project URL
   - Publishable key
   - Service role key
4. Masukkan value tersebut ke `.env.local` dan Vercel Environment Variables.

### 9.2 Jalankan Setup Database

File utama:

```txt
supabase/migrations/setup_yoonjae_database.sql
```

Langkah:

1. Buka Supabase Dashboard.
2. Masuk ke SQL Editor.
3. Copy seluruh isi `supabase/migrations/setup_yoonjae_database.sql`.
4. Run query.

Script ini membuat:

- Enum aplikasi.
- Semua tabel public.
- Foreign key, unique constraint, check constraint.
- Index penting.
- Trigger `updated_at`.
- RPC `generate_booking_number`.
- RPC `generate_invoice_number`.
- Singleton settings default.
- Role default.
- Storage bucket `images-yoonjae`.
- Storage policy untuk read/upload/update/delete.
- Grant akses untuk role Supabase.

Catatan penting: setup script saat ini tidak mengaktifkan RLS untuk tabel public. Proteksi akses menu dan role dilakukan pada layer aplikasi. Jika client membutuhkan hardening keamanan tingkat database, perlu dibuat migration lanjutan untuk RLS policy.

### 9.3 Buat User Owner Pertama

Setup database tidak membuat password Auth. User pertama harus dibuat dari Supabase Auth.

Langkah:

1. Buka Supabase Dashboard.
2. Masuk ke `Authentication > Users`.
3. Buat user pertama, misalnya:

```txt
email: owner@yoonjaespace.com
password: dibuat manual dari dashboard Supabase
```

4. Buka file:

```txt
supabase/migrations/bootstrap_initial_data.sql
```

5. Ubah bagian konfigurasi berikut sesuai data owner:

```sql
bootstrap_owner_email text := 'owner@yoonjaespace.com';
bootstrap_owner_name text := 'Nama Owner';
bootstrap_owner_phone text := '';
```

6. Jalankan seluruh isi `bootstrap_initial_data.sql` di Supabase SQL Editor.

Script bootstrap ini membuat atau memperbarui:

- Role `Owner`.
- Role `Administrator`.
- Role `Staff`.
- Profile `public.users` untuk Auth user owner.
- Flag `is_primary = true` untuk owner.

### 9.4 Storage Bucket

Bucket yang dibutuhkan:

```txt
images-yoonjae
```

Digunakan untuk:

- Logo studio.
- Foto depan studio.
- Asset studio lain yang diupload dari Settings.

Konfigurasi bucket di setup script:

| Properti | Nilai |
| --- | --- |
| Public | `true` |
| File size limit | 10 MB |
| Allowed MIME | `image/png`, `image/jpeg`, `image/webp`, `image/gif` |

---

## 10. Database

### 10.1 Enum

| Enum | Value |
| --- | --- |
| `booking_status` | `BOOKED`, `DP_PAID`, `PAID`, `SHOOT_DONE`, `PHOTOS_DELIVERED`, `ADDON_UNPAID`, `CLOSED`, `CANCELED` |
| `print_order_status` | `SELECTION`, `VENDOR`, `PRINTING`, `RECEIVE`, `PACKING`, `SHIPPED`, `DONE` |
| `discount_type` | `percentage`, `fixed` |
| `custom_field_type` | `text`, `select`, `checkbox`, `number`, `url` |
| `commission_status` | `unpaid`, `paid` |

### 10.2 Tabel Utama

| Tabel | Fungsi |
| --- | --- |
| `roles` | Master role, menu access, dan permission |
| `users` | Profile user internal yang terhubung ke Supabase Auth |
| `settings_general` | Jam operasional, interval slot, default payment, cutoff komisi |
| `settings_reminder_templates` | Template pesan WhatsApp reminder dan thank you |
| `settings_studio_info` | Logo, nama studio, alamat, Maps, WhatsApp, Instagram, footer |
| `studio_holidays` | Hari libur studio |
| `leads` | Master sumber lead customer |
| `photo_for` | Master kebutuhan foto |
| `domiciles` | Master kota/domisili customer |
| `package_categories` | Kategori paket |
| `addon_categories` | Kategori add-on |
| `packages` | Master paket foto |
| `addons` | Master add-on |
| `backgrounds` | Master background |
| `custom_fields` | Field tambahan untuk booking |
| `vouchers` | Voucher diskon |
| `vendors` | Master vendor |
| `customers` | Data customer |
| `bookings` | Data booking utama |
| `booking_packages` | Snapshot paket pada booking |
| `booking_backgrounds` | Snapshot background pada booking |
| `booking_addons` | Snapshot add-on pada booking |
| `booking_custom_fields` | Jawaban custom field booking |
| `booking_status_dates` | Tanggal perubahan status booking |
| `booking_reminders` | Penanda reminder sudah dikirim |
| `invoices` | Data invoice dan public token |
| `expenses` | Data pengeluaran |
| `commissions` | Data komisi staff |
| `activity_log` | Audit trail aktivitas sistem |

### 10.3 RPC dan Trigger

| Nama | Fungsi |
| --- | --- |
| `set_updated_at()` | Mengisi kolom `updated_at` saat row diupdate |
| `generate_booking_number()` | Membuat nomor booking berurutan |
| `generate_invoice_number()` | Membuat nomor invoice berurutan |

RPC nomor booking dan invoice menggunakan advisory lock agar aman saat ada beberapa transaksi bersamaan.

---

## 11. Auth, Role, dan Permission

### 11.1 Auth

Sistem memakai Supabase Auth dengan email dan password.

Alur root route `/`:

1. Cek session user.
2. Jika belum login, redirect ke `/login`.
3. Jika user punya akses `dashboard`, redirect ke `/dashboard`.
4. Jika tidak punya akses dashboard, redirect ke menu pertama yang dimiliki user.
5. Jika tidak ada menu valid, redirect ke `/login`.

### 11.2 Profile User

Supabase Auth user harus memiliki pasangan row di tabel:

```txt
public.users
```

Kolom penting:

| Kolom | Fungsi |
| --- | --- |
| `auth_id` | Relasi ke `auth.users.id` |
| `role_id` | Relasi ke tabel `roles` |
| `is_active` | Status aktif user |
| `is_primary` | Owner utama, dapat melewati guard menu |

### 11.3 Role Default

| Role | Deskripsi |
| --- | --- |
| `Owner` | Akses penuh, dibuat oleh bootstrap, `is_primary=true` untuk user owner |
| `Administrator` | Akses penuh operasional |
| `Staff` | Akses operasional harian tanpa pengaturan role dan user |

### 11.4 Menu Access

Menu internal:

| Slug | Route | Fungsi |
| --- | --- | --- |
| `dashboard` | `/dashboard` | Ringkasan operasional |
| `bookings` | `/bookings` | List, create, detail, dan delete booking |
| `calendar` | `/calendar` | Kalender internal studio |
| `photo-delivery` | `/photo-delivery` | Link foto dan progress print |
| `customers` | `/customers` | Data customer dan histori booking |
| `reminders` | `/reminders` | Reminder WhatsApp |
| `finance` | `/finance` | Income, expense, profit, export |
| `vendors` | `/vendors` | Data vendor |
| `commissions` | `/commissions` | Komisi staff |
| `activities` | `/activities` | Activity log |
| `user-management` | `/user-management` | Kelola user internal |
| `role-management` | `/role-management` | Kelola role dan permission |
| `settings` | `/settings` | Master data dan konfigurasi |

Permission tambahan:

```txt
booking_full_access
sc:BOOKED:PAID
sc:PAID:SHOOT_DONE
sc:SHOOT_DONE:PHOTOS_DELIVERED
sc:PHOTOS_DELIVERED:CLOSED
sc:PAID:BOOKED
sc:SHOOT_DONE:PAID
sc:PHOTOS_DELIVERED:SHOOT_DONE
sc:CLOSED:PHOTOS_DELIVERED
sc:cancel
```

---

## 12. Halaman dan Modul

### 12.1 Login

Route:

```txt
/login
```

Fungsi:

- Login user internal.
- Menampilkan logo dan nama studio dari `settings_studio_info`.
- Redirect setelah login berhasil.

### 12.2 Dashboard

Route:

```txt
/dashboard
```

Fungsi:

- Greeting berbasis waktu WIB.
- Quick menu.
- Statistik bulan berjalan.
- Total booking bulan ini.
- Estimasi revenue.
- Booking belum lunas.
- Action item print order.
- Jadwal hari ini.

### 12.3 Bookings

Routes:

```txt
/bookings
/bookings/new
/bookings/[id]
```

Fungsi utama:

- List booking.
- Filter booking berdasarkan search, status, print status, reschedule, tanggal.
- Pagination dan page size.
- Wizard booking baru 10 step.
- Detail booking dengan tab overview, progress, dan pricing.
- Reschedule booking.
- Edit detail booking.
- Delete booking dengan konfirmasi.
- Link ke customer page dan invoice publik.
- Activity log untuk perubahan penting.

Step booking baru:

| Step | Nama |
| --- | --- |
| 1 | Tipe Booking |
| 2 | Data Customer |
| 3 | Paket dan Add-on |
| 4 | Sesi dan Waktu |
| 5 | Estimasi Waktu |
| 6 | Detail |
| 7 | Diskon |
| 8 | Pembayaran |
| 9 | Staff |
| 10 | Ringkasan |

### 12.4 Calendar

Route:

```txt
/calendar
```

Fungsi:

- Kalender internal day, week, month.
- Navigasi previous, next, today.
- Date picker.
- Popup detail booking.
- Filter legend status.
- Modal availability.
- Link ke public MUA calendar.

### 12.5 Photo Delivery

Routes:

```txt
/photo-delivery
/photo-delivery/[id]
```

Fungsi:

- Menampilkan booking yang masuk fase pengiriman foto.
- Input/update Google Drive link.
- Deliver photos dari `SHOOT_DONE` ke `PHOTOS_DELIVERED`.
- Kelola status print order.
- Activity log untuk update link dan status.

### 12.6 Customers

Routes:

```txt
/customers
/customers/[id]
```

Fungsi:

- List customer.
- Search dan filter lead/domicile.
- Add/edit/delete customer.
- Export CSV dan Excel.
- Detail customer.
- Riwayat booking customer.
- Total booking, total spend, dan last visit.

### 12.7 Reminders

Route:

```txt
/reminders
```

Fungsi:

- Menampilkan booking hari ini, 7 hari, dan 30 hari.
- Generate link WhatsApp berdasarkan template.
- Tandai booking sudah di-remind.
- Batalkan tanda reminder.

Variable template:

```txt
{customer_name}
{booking_date}
{booking_time}
{package_name}
{studio_name}
{customer_page}
{notes}
```

### 12.8 Finance

Route:

```txt
/finance
```

Fungsi:

- Summary income, expense, gross profit, booking count.
- Income table.
- Expense table.
- Popular packages.
- Export Excel.
- Add/edit/delete expense.
- Close booking.

### 12.9 Vendors

Route:

```txt
/vendors
```

Fungsi:

- Add/edit vendor.
- Detail vendor.
- Set active/inactive.
- Delete vendor tanpa menghapus histori expense.
- Statistik transaksi dan total spend.

### 12.10 Commissions

Route:

```txt
/commissions
```

Fungsi:

- Menghitung komisi staff per periode.
- Periode mengikuti `commission_cutoff_day`.
- Mark paid membuat expense komisi.
- Unpaid menghapus expense komisi terkait.
- Reset period.
- Edit default bonus dan bonus package.

### 12.11 Activities

Route:

```txt
/activities
```

Fungsi:

- Audit trail sistem.
- Filter search, entity, action.
- Pagination.
- Mencatat aktivitas booking, customer, expense, vendor, commission, reminder, user, role, dan settings.

### 12.12 User Management

Route:

```txt
/user-management
```

Fungsi:

- Add user lewat API server.
- Edit user.
- Delete user.
- Primary user tidak dapat dihapus.
- Password minimal 8 karakter pada API create user.

API terkait:

```txt
POST /api/users/create
POST /api/users/delete
```

### 12.13 Role Management

Route:

```txt
/role-management
```

Fungsi:

- Add/edit/delete role.
- Atur menu access.
- Atur permission fitur booking.
- Atur permission perubahan status.
- System role tidak dapat dihapus.
- Role yang sedang digunakan user tidak dapat dihapus.
- Save/delete role dibatasi untuk primary user.

### 12.14 Settings

Route:

```txt
/settings
```

Tab settings:

| Tab | Isi |
| --- | --- |
| General | Jam operasional, interval slot, default payment status, cutoff komisi, hari libur |
| Reminder Template | Template WhatsApp reminder dan thank you |
| Studio Info | Logo, foto depan, nama studio, alamat, Maps, WhatsApp, email, Instagram, footer |
| Packages | Master paket foto |
| Backgrounds | Master background |
| Add-ons | Master add-on |
| Kategori | Kategori package dan add-on |
| Vouchers | Voucher diskon |
| Custom Fields | Field tambahan booking |
| Leads | Master sumber lead |
| Photo For | Master kebutuhan foto |
| Domisili | Master kota/domisili customer |

---

## 13. Halaman Publik

Halaman publik tidak membutuhkan login dan diakses melalui token atau endpoint yang sudah dibatasi data output-nya.

### 13.1 Customer Page

Route:

```txt
/customer/[token]
```

Fungsi:

- Menampilkan status booking customer.
- Menampilkan status print order jika ada.
- Tombol view photos jika Google Drive link tersedia.
- Detail sesi, package, background, invoice link, dan info studio.
- Diakses menggunakan `public_token`, bukan ID database biasa.

### 13.2 Invoice Page

Route:

```txt
/invoice/[token]
```

Fungsi:

- Menampilkan invoice publik.
- Rincian package, add-on, extra add-on, discount, DP, total, dan sisa pembayaran.
- Copy/share link.
- Print/download menggunakan browser print.
- Jika user internal sedang login, tersedia navigasi kembali ke booking.

### 13.3 Public MUA Calendar

Route:

```txt
/mua
```

API:

```txt
GET /api/mua-bookings?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Fungsi:

- Menampilkan jadwal MUA publik.
- Data berasal dari booking yang package atau add-on-nya memiliki `is_mua = true`.
- Tidak mengembalikan nama customer, nomor WhatsApp, invoice, atau detail sensitif.
- Range query maksimal 90 hari.
- Booking `CANCELED` tidak ditampilkan.

Response aman:

```txt
id
booking_date
start_time
end_time
mua_service
```

---

## 14. Flow Bisnis Utama

### 14.1 Flow Booking

```txt
Admin/Staff login
-> Buka /bookings/new
-> Pilih customer baru/existing
-> Pilih paket, background, add-on
-> Pilih tanggal dan jam sesi
-> Sistem menghitung durasi dan konflik jadwal
-> Isi detail, custom field, diskon, pembayaran, staff
-> Submit booking
-> Sistem membuat booking number dan invoice number
-> Sistem membuat public token
-> Booking tampil di list, calendar, invoice, dan customer page
```

### 14.2 Flow Status Booking

Flow normal:

```txt
BOOKED -> PAID -> SHOOT_DONE -> PHOTOS_DELIVERED -> CLOSED
```

Status tambahan:

| Status | Arti |
| --- | --- |
| `DP_PAID` | Booking sudah memiliki DP |
| `ADDON_UNPAID` | Foto sudah dikirim, tetapi ada extra add-on belum lunas |
| `CANCELED` | Booking dibatalkan |

### 14.3 Flow Print Order

```txt
SELECTION -> VENDOR -> PRINTING -> RECEIVE -> PACKING -> SHIPPED -> DONE
```

Status ini digunakan untuk paket yang memiliki kebutuhan print.

### 14.4 Flow Reminder WhatsApp

```txt
Admin/Staff buka /reminders
-> Pilih rentang Hari Ini, 7 Hari, atau 30 Hari
-> Sistem generate pesan dari template
-> Klik WhatsApp
-> Tandai booking sebagai sudah di-remind
```

### 14.5 Flow Finance dan Komisi

```txt
Booking masuk sebagai income
-> Expense manual/vendor dicatat di Finance
-> Komisi staff dihitung dari periode cutoff
-> Mark commission paid membuat expense source commission
-> Finance menampilkan income, expense, gross profit, dan export Excel
```

---

## 15. PWA

Project sudah disiapkan sebagai PWA.

File terkait:

```txt
public/manifest.json
public/icons/icon-192.png
public/icons/icon-512.png
public/icons/maskable-192.png
public/icons/maskable-512.png
public/icons/apple-touch-icon.png
src/app/layout.tsx
next.config.mjs
```

Konfigurasi penting:

| Properti | Nilai |
| --- | --- |
| App name | `Yoonjaespace Studio` |
| Short name | `Yoonjaespace` |
| Start URL | `/` |
| Display | `standalone` |
| Orientation | `portrait` |
| Theme color | `#8B1A1A` |

Service worker digenerate saat production build. File generated berikut tidak perlu diedit manual dan sudah masuk `.gitignore`:

```txt
public/sw.js
public/workbox-*.js
public/swe-worker-*.js
```

---

## 16. Deployment ke Vercel

### 16.1 Import Repository

1. Login ke Vercel.
2. Klik `Add New Project`.
3. Import repository:

```txt
https://github.com/rezkyrevansyah/yoonjaespacestudio.git
```

4. Pilih framework preset `Next.js`.
5. Pastikan branch production adalah `main`.

### 16.2 Environment Variables di Vercel

Tambahkan variable:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

Untuk production:

```txt
NEXT_PUBLIC_APP_URL=https://domain-production-client.com
```

Jika menggunakan preview deployment, isi `NEXT_PUBLIC_APP_URL` sesuai kebutuhan preview atau gunakan domain production hanya saat release final.

### 16.3 Build Settings

Default Vercel biasanya cukup:

| Setting | Nilai |
| --- | --- |
| Framework Preset | Next.js |
| Install Command | `npm install` atau default Vercel |
| Build Command | `npm run build` |
| Output Directory | Next.js default |

### 16.4 Setelah Deploy

Checklist:

1. Buka domain production.
2. Pastikan redirect ke `/login`.
3. Login sebagai owner/admin.
4. Cek `/dashboard`.
5. Cek upload logo/foto studio di `/settings`.
6. Buat satu booking test.
7. Cek link invoice publik.
8. Cek link customer page publik.
9. Cek `/mua`.
10. Pastikan PWA manifest terbaca di browser devtools.

---

## 17. Testing dan Quality Assurance

### 17.1 Automated Check

Jalankan:

```bash
npm run lint
npm run build
```

Atau:

```bash
npm run test
```

### 17.2 Manual Test Cases

Project memiliki file:

```txt
test-cases.md
```

File tersebut berisi 96 test case frontend yang dapat digunakan sebagai checklist QA.

Area yang perlu dites sebelum handover final:

| Area | Minimal pengecekan |
| --- | --- |
| Login | Valid credential, invalid credential, redirect |
| Settings | General, Studio Info, master data |
| Booking | Create, detail, status progress, reschedule, delete |
| Calendar | Day/week/month, availability modal |
| Customer | Add, edit, detail, export |
| Reminder | Generate WhatsApp link, mark reminded |
| Finance | Expense, income, export Excel |
| Commission | Save, mark paid/unpaid, reset |
| Public Page | Customer page, invoice, MUA calendar |
| User/Role | Add user, permission, role access |
| PWA | Manifest, icon, add to home screen |

---

## 18. Maintenance Guide

### 18.1 Update Dependency

Rekomendasi:

1. Update dependency di branch development.
2. Jalankan `npm install`.
3. Jalankan `npm run lint`.
4. Jalankan `npm run build`.
5. Test flow utama secara manual.
6. Merge ke `main` jika aman.

### 18.2 Menambah Menu Baru

Umumnya perlu update:

```txt
src/lib/constants.ts
src/app/(dashboard)/...
src/components/layout/sidebar.tsx
src/components/layout/mobile-nav.tsx
supabase/migrations/... atau role menu_access
```

Tambahkan slug menu ke role yang membutuhkan akses.

### 18.3 Menambah Tabel Database

Rekomendasi:

1. Buat migration SQL baru di `supabase/migrations`.
2. Jalankan di Supabase SQL Editor.
3. Update type database di `src/lib/types/database.ts` jika diperlukan.
4. Update query/component terkait.
5. Jalankan lint dan build.

### 18.4 Mengubah Template Reminder

Client dapat mengubah template dari:

```txt
/settings -> Reminder Template
```

Variable yang tersedia:

```txt
{customer_name}
{booking_date}
{booking_time}
{package_name}
{studio_name}
{customer_page}
{notes}
```

### 18.5 Mengubah Logo dan Informasi Studio

Client dapat mengubah dari:

```txt
/settings -> Studio Info
```

Data ini dipakai pada:

- Login page.
- Sidebar/header.
- Customer page.
- Invoice page.
- Public MUA page.

---

## 19. Keamanan dan Catatan Penting

1. `SUPABASE_SERVICE_ROLE_KEY` hanya boleh berada di server environment.
2. `.env.local` tidak boleh dicommit ke repository.
3. Halaman public menggunakan token, bukan ID database biasa.
4. API `/api/mua-bookings` sudah membatasi data agar tidak mengembalikan PII customer.
5. Setup database saat ini tidak mengaktifkan RLS pada tabel public.
6. Jika client membutuhkan compliance lebih ketat, rekomendasi lanjutan adalah menambahkan RLS policy per tabel.
7. User owner pertama harus dibuat manual di Supabase Auth lalu dihubungkan melalui bootstrap SQL.
8. Primary user tidak dapat dihapus dari UI.
9. User deletion menghapus Supabase Auth terlebih dahulu, lalu profile aplikasi.
10. Generated PWA files tidak perlu diedit manual.

---

## 20. Checklist Handover ke Client

Gunakan checklist berikut saat penyerahan:

| Item | Status |
| --- | --- |
| Repository GitHub sudah diberikan ke client | Belum/Sudah |
| Client memiliki akses GitHub repository | Belum/Sudah |
| Client memiliki akses Supabase project | Belum/Sudah |
| Client memiliki akses Vercel project | Belum/Sudah |
| Environment variables production sudah diserahkan dengan aman | Belum/Sudah |
| User owner/admin client sudah dibuat | Belum/Sudah |
| Database migration sudah dijalankan | Belum/Sudah |
| Storage bucket `images-yoonjae` tersedia | Belum/Sudah |
| Domain production sudah terhubung | Belum/Sudah |
| Build production berhasil | Belum/Sudah |
| Flow login sudah dites | Belum/Sudah |
| Flow booking sudah dites | Belum/Sudah |
| Public invoice/customer page sudah dites | Belum/Sudah |
| Dokumentasi ini sudah diterima client | Belum/Sudah |

---

## 21. Data yang Perlu Diserahkan Terpisah

Jangan tulis data rahasia langsung di repository atau dokumen publik. Serahkan data berikut melalui channel aman:

| Data | Keterangan |
| --- | --- |
| Supabase Project URL | Digunakan di env |
| Supabase Publishable Key | Digunakan di env |
| Supabase Service Role Key | Rahasia, server only |
| Vercel Project Access | Untuk deployment |
| GitHub Repository Access | Untuk source code |
| Akun owner/admin awal | Email dan password diserahkan aman |
| Domain/DNS access | Jika domain dikelola client |

---

## 22. Troubleshooting

### 22.1 Login Gagal

Cek:

- User sudah dibuat di Supabase Auth.
- User memiliki row di `public.users`.
- `auth_id` di `public.users` sesuai dengan `auth.users.id`.
- User memiliki role.
- `is_active = true`.

### 22.2 Supabase Error Saat Development

Cek:

- `.env.local` sudah ada.
- `NEXT_PUBLIC_SUPABASE_URL` benar.
- Publishable key benar.
- Service role key benar untuk API admin.
- Database migration sudah dijalankan.

### 22.3 Upload Logo atau Foto Studio Gagal

Cek:

- Bucket `images-yoonjae` tersedia.
- Storage policy sudah dibuat.
- User sudah login.
- File bertipe `png`, `jpeg`, `webp`, atau `gif`.
- Ukuran file maksimal 10 MB.

### 22.4 Invoice atau Customer Link Salah Domain

Cek:

```txt
NEXT_PUBLIC_APP_URL
```

Untuk production, variable ini harus menunjuk ke domain production.

### 22.5 Build Gagal

Cek:

- Versi Node.js minimal 20.
- Dependency sudah terinstall.
- Jalankan `npm ci`.
- Jalankan `npm run lint` untuk melihat error static analysis.
- Pastikan env variable production sudah tersedia jika build membutuhkan akses env.

---

## 23. Kesimpulan

Project Yoonjaespace Studio Management sudah memiliki fondasi aplikasi operasional studio yang lengkap: dashboard internal, booking workflow, customer management, calendar, reminder, finance, vendor, commission, role/user management, public invoice, public customer page, public MUA calendar, Supabase database, Supabase Auth, Supabase Storage, dan dukungan PWA.

Untuk handover production, bagian paling penting yang harus dipastikan adalah akses GitHub, Supabase, Vercel, environment variables, user owner pertama, serta hasil QA flow utama. Setelah semua checklist handover terpenuhi, client dapat melanjutkan penggunaan, maintenance, dan pengembangan aplikasi dengan mengikuti struktur dan panduan pada dokumen ini.
