import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'PERJANJIAN_KERJA_BERSAMA_V_SKATA_GSD.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margin: 40,
  info: {
    Title: 'PERJANJIAN KERJA BERSAMA V SKATA DENGAN GSD',
    Author: 'Serikat Karyawan Graha Sarana Duta (SKATA)',
    Subject: 'Dokumen Resmi PKB V Periode 2025-2027',
    Keywords: 'PKB, SKATA, GSD, Telkom Property, Kemenaker',
  }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Primary colors
const RED = '#d97706';
const DARK_RED = '#b91c1c';
const NAVY = '#0f172a';
const TEXT_DARK = '#334155';

// Helper for header
function addPageHeader(doc, pageNum) {
  if (pageNum === 1) return; // Cover page no header
  doc.save();
  doc.fontSize(8).fillColor('#64748b').text('SERIKAT KARYAWAN GRAHA SARANA DUTA (SKATA) — PERJANJIAN KERJA BERSAMA V (2025–2027)', 40, 25, { align: 'left' });
  doc.moveTo(40, 36).lineTo(555, 36).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  doc.fontSize(8).fillColor('#94a3b8').text(`Halaman ${pageNum}`, 40, 815, { align: 'center' });
  doc.restore();
}

// ================= PAGE 1: COVER PAGE =================
doc.rect(20, 20, 555, 802).strokeColor('#cbd5e1').lineWidth(1.5).stroke();
doc.rect(25, 25, 545, 792).strokeColor('#e2e8f0').lineWidth(0.5).stroke();

doc.fontSize(13).fillColor(DARK_RED).font('Helvetica-Bold').text('SKATA', 45, 45);
doc.fontSize(8).fillColor('#64748b').font('Helvetica').text('Serikat Karyawan Graha Sarana Duta', 45, 60);

doc.fontSize(11).fillColor('#0284c7').font('Helvetica-Bold').text('Telkom Property', 430, 45, { align: 'right' });
doc.fontSize(8).fillColor('#64748b').font('Helvetica').text('by Telkom Indonesia', 430, 60, { align: 'right' });

doc.moveDown(5);

doc.fontSize(20).fillColor(NAVY).font('Helvetica-Bold').text('PERJANJIAN KERJA BERSAMA V', { align: 'center' });
doc.fontSize(14).fillColor(DARK_RED).font('Helvetica-Bold').text('ANTARA', { align: 'center' });
doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text('SERIKAT KARYAWAN GRAHA SARANA DUTA\n(SKATA)', { align: 'center' });
doc.fontSize(10).fillColor('#475569').font('Helvetica').text('No : 001/HK.810/SKT-000/2025', { align: 'center' });

doc.moveDown(1);
doc.fontSize(14).fillColor(DARK_RED).font('Helvetica-Bold').text('DENGAN', { align: 'center' });
doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text('PT GRAHA SARANA DUTA (GSD)', { align: 'center' });
doc.fontSize(10).fillColor('#475569').font('Helvetica').text('No : 1126/HK.810/GSD-000/2025', { align: 'center' });

doc.moveDown(3);

// Decorative box for Year
doc.rect(190, 360, 215, 60).fillAndStroke('#fff1f2', DARK_RED);
doc.fontSize(32).fillColor(DARK_RED).font('Helvetica-Bold').text('2025', 190, 372, { width: 215, align: 'center' });

doc.moveDown(5);
doc.fontSize(11).fillColor(NAVY).font('Helvetica-Bold').text('JAKARTA, 12 NOVEMBER 2025', 40, 450, { align: 'center' });
doc.fontSize(10).fillColor('#64748b').font('Helvetica').text('Periode Berlaku: 12 November 2025 s.d. 12 November 2027', { align: 'center' });

doc.moveDown(4);

// Kemenaker Register Box
doc.rect(50, 520, 495, 120).fillAndStroke('#f8fafc', '#cbd5e1');
doc.fontSize(10).fillColor(NAVY).font('Helvetica-Bold').text('SURAT KEPUTUSAN KEMENTERIAN KETENAGAKERJAAN RI', 60, 532, { align: 'center' });
doc.fontSize(9).fillColor(DARK_RED).font('Helvetica-Bold').text('NOMOR: KEP. 4/HI.00.01/00.0000.251120020/P-1/I/2026', 60, 548, { align: 'center' });
doc.fontSize(8.5).fillColor(TEXT_DARK).font('Helvetica').text('Direktur Jenderal Pembinaan Hubungan Industrial dan Jaminan Sosial Tenaga Kerja\nTanggal Penetapan: 02 Januari 2026 | Nomor Bukti Pendaftaran: 251120020', 60, 565, { align: 'center', width: 475 });

doc.fontSize(8).fillColor('#64748b').font('Helvetica-Oblique').text('Dokumen Resmi Arsip Digital DPP SKATA — Graha Sarana Duta (Telkom Property)', 40, 780, { align: 'center' });

// ================= PAGE 2: KEPUTUSAN KEMENAKER =================
doc.addPage();
addPageHeader(doc, 2);

doc.fontSize(11).fillColor(NAVY).font('Helvetica-Bold').text('KEMENTERIAN KETENAGAKERJAAN REPUBLIK INDONESIA', { align: 'center' });
doc.fontSize(10).fillColor(TEXT_DARK).font('Helvetica-Bold').text('KEPUTUSAN DIREKTUR JENDERAL PEMBINAAN HUBUNGAN INDUSTRIAL\nDAN JAMINAN SOSIAL TENAGA KERJA', { align: 'center' });
doc.fontSize(9).fillColor(DARK_RED).font('Helvetica-Bold').text('NOMOR KEP. 4/HI.00.01/00.0000.251120020/P-1/I/2026', { align: 'center' });
doc.moveDown(0.5);

doc.fontSize(9.5).fillColor(NAVY).font('Helvetica-Bold').text('TENTANG PERJANJIAN KERJA BERSAMA ANTARA\nPT. GRAHA SARANA DUTA DENGAN SERIKAT KARYAWAN PT GRAHA SARANA DUTA (SKATA)', { align: 'center' });
doc.moveDown(1);

doc.fontSize(9).fillColor(TEXT_DARK).font('Helvetica').text('MEMUTUSKAN:', { align: 'left' });
doc.moveDown(0.5);

const keputusanText = [
  { label: 'Menetapkan :', val: 'KEPUTUSAN DIREKTUR JENDERAL PEMBINAAN HUBUNGAN INDUSTRIAL DAN JAMINAN SOSIAL TENAGA KERJA TENTANG PERJANJIAN KERJA BERSAMA ANTARA PT GRAHA SARANA DUTA DENGAN SERIKAT KARYAWAN PT GRAHA SARANA DUTA (SKATA).' },
  { label: 'KESATU :', val: 'Mendaftarkan Perjanjian Kerja Bersama antara PT Graha Sarana Duta dengan Serikat Karyawan PT Graha Sarana Duta (SKATA) yang tercatat pada Dinas Tenaga Kerja dan Transmigrasi Kota Adm. Jakarta Pusat No. 621/I/P/X/2013 dan telah ditandatangani pada tanggal 12 November 2025.' },
  { label: 'KEDUA :', val: 'Perjanjian Kerja Bersama PT Graha Sarana Duta DENGAN Serikat Karyawan PT Graha Sarana Duta (SKATA) mulai berlaku terhitung tanggal 12 November 2025 s.d. 12 November 2027 dan telah terdaftar pada Ketenagakerjaan RI Nomor: 251120020.' },
  { label: 'KETIGA :', val: 'Pengusaha dan serikat pekerja/serikat buruh wajib memberitahukan dan menjelaskan isi serta memberikan naskah Perjanjian Kerja Bersama kepada pekerja/buruh.' },
  { label: 'KEEMPAT :', val: 'Draf dan isi Perjanjian Kerja Bersama berlaku sesuai ketentuan perundang-undangan ketenagakerjaan yang berlaku.' }
];

keputusanText.forEach(item => {
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(NAVY).text(item.label, { continued: true });
  doc.font('Helvetica').fillColor(TEXT_DARK).text(' ' + item.val);
  doc.moveDown(0.6);
});

doc.moveDown(1);
doc.fontSize(8.5).fillColor(NAVY).font('Helvetica-Bold').text('Ditetapkan di Jakarta, Pada Tanggal: 02 Januari 2026\nA.N. DIREKTUR JENDERAL, DIREKTUR HUBUNGAN KERJA DAN PENGUPAHAN', { align: 'right' });

// ================= PAGE 3: MUKADIMAH & PIHAK-PIHAK =================
doc.addPage();
addPageHeader(doc, 3);

doc.fontSize(12).fillColor(NAVY).font('Helvetica-Bold').text('MUKADIMAH', { align: 'center' });
doc.fontSize(10).fillColor(DARK_RED).font('Helvetica-Bold').text('Dengan Rahmat Tuhan Yang Maha Esa', { align: 'center' });
doc.moveDown(1);

doc.fontSize(8.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'Perjanjian Kerja Bersama antara Karyawan PT Graha Sarana Duta yang dalam hal ini diwakili secara sah oleh Serikat Karyawan Graha Sarana Duta yang selanjutnya disebut SKATA dengan perusahaan PT Graha Sarana Duta yang selanjutnya disebut GSD, untuk melaksanakan Hubungan Industrial dalam rangka menciptakan hubungan kerja yang serasi, aman, mantap, tenteram dan dinamis serta terwujudnya ketenangan kerja dan perbaikan kesejahteraan karyawan, keberlangsungan usaha, kepastian hak dan kewajiban masing-masing SKATA dan GSD yang disusun dengan pokok-pokok pikiran sebagai berikut:\n\n' +
  '1. Bahwa SKATA dan GSD wajib untuk saling mendukung dalam upaya menciptakan pelaksanaan tugas perusahaan secara jujur, bertanggung jawab, efisien dan efektif berdasarkan peraturan Perundang-undangan yang berlaku serta kepatutan dan kewajaran.\n' +
  '2. Bahwa SKATA dan GSD sepakat untuk menjadikan Perjanjian Kerja Bersama ini sebagai pedoman yang mengatur hubungan kerja sehingga harus dipatuhi dan dilaksanakan secara tepat, benar dan dapat diuji berdasarkan rasa keadilan, kepatutan dan kewajaran.\n' +
  '3. Bahwa SKATA dan GSD sepakat tentang dasar hukum Perjanjian Kerja Bersama ini.',
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(1.5);
doc.fontSize(11).fillColor(NAVY).font('Helvetica-Bold').text('PIHAK-PIHAK YANG MENGADAKAN PERJANJIAN KERJA BERSAMA', { align: 'center' });
doc.fontSize(9).fillColor(DARK_RED).font('Helvetica-Bold').text('Nomor GSD: 1126/HK.810/GSD-000/2025 | Nomor SKATA: 001/HK.810/SKT-000/2025', { align: 'center' });
doc.moveDown(1);

doc.fontSize(8.5).fillColor(TEXT_DARK).font('Helvetica').text(
  'Pada hari ini Rabu Tanggal Dua Belas bulan November tahun Dua ribu dua puluh Lima (12-11-2025), bertempat di Jl. Kebon Sirih No. 10 Jakarta Pusat, oleh dan antara:\n\n' +
  'I. SERIKAT KARYAWAN GRAHA SARANA DUTA (SKATA), yang didirikan pada tanggal 1 Maret 2013 berkedudukan di Gedung Menara Multimedia, Jl. Kebon Sirih No. 12 Jakarta Pusat, diwakili secara sah oleh FAZRIWANSYAH selaku Ketua Umum Dewan Pengurus Pusat SKATA, selanjutnya disebut SKATA;\n\n' +
  'II. PT GRAHA SARANA DUTA (GSD), perseroan terbatas berkedudukan di Jl. Kebon Sirih No. 10 Jakarta Pusat, diwakili secara sah oleh DIDIT SULISTYO selaku Plt President Director, selanjutnya disebut GSD.',
  { align: 'justify', lineGap: 3 }
);

// ================= PAGE 4: RINGKASAN STRUKTUR BAB & PASAL =================
doc.addPage();
addPageHeader(doc, 4);

doc.fontSize(12).fillColor(NAVY).font('Helvetica-Bold').text('DAFTAR ISI & STRUKTUR REGULASI PKB V (PASAL 1 – 75)', { align: 'center' });
doc.moveDown(1);

const chapters = [
  { bab: 'BAB I', title: 'KETENTUAN UMUM', pasals: 'Pasal 1 (Pengertian & Istilah) s.d. Pasal 2 (Ruang Lingkup)' },
  { bab: 'BAB II', title: 'KEWAJIBAN DAN HAK', pasals: 'Pasal 3 (Kewajiban) s.d. Pasal 5 (Larangan SKATA & GSD)' },
  { bab: 'BAB III', title: 'BATASAN KEPENGURUSAN DAN DUKUNGAN', pasals: 'Pasal 6 (Pengakuan) s.d. Pasal 10 (Jaminan Bagi GSD)' },
  { bab: 'BAB IV', title: 'HUBUNGAN KERJA', pasals: 'Pasal 11 (Rekrutasi) s.d. Pasal 13 (Data Pribadi)' },
  { bab: 'BAB V', title: 'WAKTU KERJA, LEMBUR DAN HARI LIBUR', pasals: 'Pasal 14 (Jam Kerja) s.d. Pasal 16 (Hari Libur Resmi)' },
  { bab: 'BAB VI', title: 'CUTI DAN ISTIRAHAT', pasals: 'Pasal 17 (Cuti) s.d. Pasal 27 (Moments That Matter)' },
  { bab: 'BAB VII', title: 'COMPENSATION AND BENEFIT', pasals: 'Pasal 28 (Upah/Gaji) s.d. Pasal 42 (Uang Pisah)' },
  { bab: 'BAB VIII', title: 'PENGEMBANGAN DAN PEMBINAAN KARYAWAN', pasals: 'Pasal 43 (Penilaian Kinerja) s.d. Pasal 53 (Olah Raga/IBO)' },
  { bab: 'BAB IX', title: 'PERJALANAN DINAS', pasals: 'Pasal 54 (Perjalanan Dinas Dalam & Luar Negeri)' },
  { bab: 'BAB X', title: 'KESELAMATAN DAN KESEHATAN KERJA (K3)', pasals: 'Pasal 55 (Sistem Manajemen K3 & SMK3)' },
  { bab: 'BAB XI', title: 'DISIPLIN KARYAWAN', pasals: 'Pasal 56 (Kewajiban/Larangan) s.d. Pasal 62 (Sanksi Hukum)' },
  { bab: 'BAB XII', title: 'PEMUTUSAN HUBUNGAN KERJA (PHK)', pasals: 'Pasal 63 (Umum) s.d. Pasal 71 (Usia Pensiun Karyawan 56 Th)' },
  { bab: 'BAB XIII', title: 'PERSELISIHAN HUBUNGAN INDUSTRIAL', pasals: 'Pasal 72 (Skorsing) s.d. Pasal 73 (Musyawarah Mufakat)' },
  { bab: 'BAB XIV', title: 'KETENTUAN PENUTUP', pasals: 'Pasal 74 (Aturan Peralihan) s.d. Pasal 75 (Penutup & Pengesahan)' }
];

chapters.forEach((ch, idx) => {
  doc.rect(40, doc.y, 515, 32).fillAndStroke(idx % 2 === 0 ? '#f8fafc' : '#ffffff', '#e2e8f0');
  const currentY = doc.y - 28;
  doc.fontSize(9).font('Helvetica-Bold').fillColor(DARK_RED).text(ch.bab, 50, currentY);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text(ch.title, 110, currentY);
  doc.fontSize(8).font('Helvetica').fillColor('#64748b').text(ch.pasals, 330, currentY, { align: 'right', width: 215 });
  doc.moveDown(0.2);
});

// ================= PAGE 5: TANDA TANGAN & PENGESAHAN =================
doc.addPage();
addPageHeader(doc, 5);

doc.fontSize(12).fillColor(NAVY).font('Helvetica-Bold').text('LEMBAR PENGESAHAN & PENATAN DANGANAN', { align: 'center' });
doc.fontSize(10).fillColor(TEXT_DARK).font('Helvetica').text('Ditandatangani di Jakarta, Pada tanggal 12 November 2025', { align: 'center' });
doc.moveDown(2);

doc.rect(50, doc.y, 230, 180).strokeColor('#cbd5e1').stroke();
const box1Y = doc.y - 170;
doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('PIHAK SKATA', 60, box1Y, { align: 'center', width: 210 });
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_DARK).text('Dewan Pengurus Pusat\nSerikat Karyawan Graha Sarana Duta', 60, box1Y + 15, { align: 'center', width: 210 });
doc.fontSize(8).font('Helvetica-Bold').fillColor('#16a34a').text('[METERAI TEMPEL 10.000 RESMI]', 60, box1Y + 70, { align: 'center', width: 210 });
doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_RED).text('FAZRIWANSYAH', 60, box1Y + 130, { align: 'center', width: 210 });
doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('Ketua Umum DPP SKATA', 60, box1Y + 145, { align: 'center', width: 210 });

doc.rect(310, box1Y - 10, 230, 180).strokeColor('#cbd5e1').stroke();
doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('PIHAK GSD', 320, box1Y, { align: 'center', width: 210 });
doc.fontSize(8.5).font('Helvetica').fillColor(TEXT_DARK).text('Manajemen Perusahaan\nPT Graha Sarana Duta', 320, box1Y + 15, { align: 'center', width: 210 });
doc.fontSize(8).font('Helvetica-Bold').fillColor('#16a34a').text('[METERAI TEMPEL 10.000 RESMI]', 320, box1Y + 70, { align: 'center', width: 210 });
doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_RED).text('DIDIT SULISTYO', 320, box1Y + 130, { align: 'center', width: 210 });
doc.fontSize(9).font('Helvetica').fillColor(NAVY).text('Plt President Director PT GSD', 320, box1Y + 145, { align: 'center', width: 210 });

doc.moveDown(10);
doc.rect(40, doc.y + 40, 515, 60).fillAndStroke('#f0fdf4', '#16a34a');
doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#15803d').text('STATUS DOKUMEN: RESMI & TERVERIFIKASI KEMENAKER RI', 50, doc.y + 52, { align: 'center' });
doc.fontSize(8.5).font('Helvetica').fillColor('#166534').text('Salinan sah Perjanjian Kerja Bersama V SKATA-GSD tersimpan secara aman dalam Pusat Arsip Digital SKATA.\nSetiap karyawan dan pengurus berhak mengunduh dan membaca naskah resmi ini.', 50, doc.y + 68, { align: 'center', width: 495 });

doc.end();

stream.on('finish', () => {
  console.log('PDF successfully generated at:', outputPath);
});
