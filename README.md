# SKATA Digital Portal — AI Studio Ready Homepage

Homepage React + TypeScript yang dibuat khusus untuk mendekati referensi desain SKATA yang dipilih.

## Isi

- Logo resmi SKATA di navbar dan login modal
- Hero 16:9 dengan visual ribbon merah, emblem, city skyline, dan quote
- Executive dashboard 6 kartu
- Quick-access panel 12 layanan
- Dark-mode toggle
- Mobile navigation
- Login modal dummy
- Responsive desktop, tablet, dan mobile

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build produksi

```bash
npm run build
```

## Import ke Google AI Studio

Metode paling stabil adalah:

1. Ekstrak ZIP ini.
2. Upload seluruh folder ke repository GitHub baru.
3. Di Google AI Studio pilih **New app**.
4. Klik tombol **+** di prompt, lalu pilih **Import from GitHub**.
5. Pilih repository ini.
6. Setelah project terbuka, kirim prompt singkat berikut:

> Run the imported React TypeScript application without redesigning the UI. Install the existing dependencies, preserve all local assets, and show the live preview. Do not replace the official SKATA logo or the hero visual.

## Catatan aset

- `/public/assets/skata-logo-official.png` — logo resmi transparan
- `/public/assets/skata-hero-visual.png` — visual hero hasil crop dari referensi pilihan
- `/public/assets/skata-home-reference.png` — referensi desain asli

Homepage ini menggunakan data statis untuk Sprint 1. Firebase Authentication, Firestore, role access, dan backend akan ditambahkan pada sprint berikutnya.
