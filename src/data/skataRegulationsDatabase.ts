export interface RegulationChapter {
  bab: string;
  title: string;
  pasals: string;
  detail: string;
}

export interface SkataRegulationDoc {
  id: string;
  docId: string;
  title: string;
  category: 'Anggaran Dasar' | 'Anggaran Rumah Tangga' | 'Perjanjian Kerja Bersama';
  number?: string;
  effectiveDate: string;
  location: string;
  signatories: string;
  summary: string;
  chapters: RegulationChapter[];
  updatedAt?: string;
}

export const SKATA_REGULATIONS_DATABASE: SkataRegulationDoc[] = [
  {
    id: 'anggaran-dasar-skata-2026',
    docId: 'AD-SKATA-2026',
    title: 'Anggaran Dasar (AD) Serikat Karyawan Graha Sarana Duta (SKATA)',
    category: 'Anggaran Dasar',
    number: 'Hasil MUNAS VI SKATA 2026',
    effectiveDate: '23 Juli 2026',
    location: 'Bandung',
    signatories: 'Pimpinan Sidang MUNAS VI SKATA: Prasetyo Arif Wibowo (Ketua), Ugana Raharja (Anggota), Nicky Darmawan (Anggota)',
    summary: 'Anggaran Dasar SKATA merupakan landasan hukum tertinggi dan pedoman utama organisasi Serikat Karyawan Graha Sarana Duta (PT GSD / TelkomProperty).',
    chapters: [
      {
        bab: 'BAB I',
        title: 'NAMA, SIFAT, WAKTU DAN KEDUDUKAN',
        pasals: 'Pasal 1 s.d. Pasal 4',
        detail: 'Pasal 1: Nama organisasi Serikat Karyawan GRAHA SARANA DUTA disingkat SKATA. Pasal 2: Sifat organisasi independen, demokratis, tidak berafiliasi partai politik, beranggotakan karyawan tetap PT GSD di seluruh Indonesia. Pasal 3: Waktu berdiri di Jakarta pada Jumat, 04 Oktober 2013. Pasal 4: Kedudukan di Jakarta Pusat, Gedung Menara Multimedia Jl. Kebon Sirih No. 12 Jakarta Pusat 10110.'
      },
      {
        bab: 'BAB II',
        title: 'LOGO',
        pasals: 'Pasal 5',
        detail: 'Bentuk dasar logo turunan dari TelkomProperty. Membentuk huruf "S" (Serikat & SKATA) dan manifestasi lambang Petir yang melambangkan kekuatan, kecerdasan, intuisi, dan pencerahan spiritual. Warna merah huruf T melambangkan obor perjuangan dan semangat.'
      },
      {
        bab: 'BAB III',
        title: 'ASAS, VISI DAN MISI',
        pasals: 'Pasal 6 s.d. Pasal 8',
        detail: 'Pasal 6 (Asas): Pancasila dan UUD 1945. Pasal 7 (Visi): SKATA menjadi organisasi yang berjalan selaras dengan visi perusahaan untuk mewujudkan kesejahteraan dan pemberdayaan anggota sehingga menjadi asset berharga bagi Perusahaan. Pasal 8 (Misi): 1. Menjadi organisasi mandiri yang membawa keseimbangan hubungan kerja dan strategis. 2. Menambah nilai kesejahteraan dan soliditas pengurus, anggota dan keluarganya.'
      },
      {
        bab: 'BAB IV',
        title: 'KEANGGOTAAN',
        pasals: 'Pasal 9 s.d. Pasal 14',
        detail: 'Anggota adalah Karyawan Tetap PT Graha Sarana Duta. Hak anggota meliputi memilih dan dipilih, mengajukan usul/saran, kartu tanda keanggotaan (e-KTA), perlindungan & pembelaan advokasi, informasi berkala. Sanksi anggota: Teguran tertulis, SP-1, SP-2, hingga pencabutan keanggotaan.'
      },
      {
        bab: 'BAB V',
        title: 'SUSUNAN ORGANISASI DAN KEPENGURUSAN',
        pasals: 'Pasal 15 s.d. Pasal 22',
        detail: 'Tingkatan Organisasi: 1. Tingkat Pusat (Dewan Pembina & DPP SKATA). 2. Tingkat Wilayah (DPW SKATA). 3. Tingkat Cabang (DPC SKATA). Pengurus Harian DPP terdiri dari Ketua Umum (Ketum), Wakil Ketua I, Wakil Ketua II, Sekretaris Umum (Sekum), dan Bendahara Umum (Bendum).'
      },
      {
        bab: 'BAB VI',
        title: 'SANKSI DAN KEHILANGAN HAK KEPENGURUSAN',
        pasals: 'Pasal 23 s.d. Pasal 24',
        detail: 'Sanksi pengurus berupa peringatan lisan, peringatan tertulis, dan pemberhentian pengurus. Kehilangan hak kepengurusan jika meninggal dunia, kehilangan status karyawan, atau diberhentikan/mengundurkan diri.'
      },
      {
        bab: 'BAB VII',
        title: 'KEUANGAN',
        pasals: 'Pasal 25',
        detail: 'Sumber keuangan SKATA berasal dari iuran bulanan anggota, sumbangan tidak mengikat, dan usaha-usaha organisasi yang sah.'
      },
      {
        bab: 'BAB VIII',
        title: 'KEPUTUSAN-KEPUTUSAN',
        pasals: 'Pasal 26 s.d. Pasal 28',
        detail: 'Pengambilan keputusan musyawarah sah jika dihadiri 50% + 1 anggota/delegasi. Keputusan disetujui 50% + 1. Perubahan AD/ART hanya melalui MUNAS/MUNASLUB yang disetujui 2/3 delegasi hadir.'
      },
      {
        bab: 'BAB IX & X',
        title: 'PERATURAN PERALIHAN & PENUTUP',
        pasals: 'Pasal 29 s.d. Pasal 30',
        detail: 'Anggaran Dasar ditetapkan di Bandung pada 23 Juli 2026 oleh Pimpinan Sidang MUNAS VI SKATA.'
      }
    ]
  },
  {
    id: 'anggaran-rumah-tangga-skata-2026',
    docId: 'ART-SKATA-2026',
    title: 'Anggaran Rumah Tangga (ART) Serikat Karyawan Graha Sarana Duta (SKATA)',
    category: 'Anggaran Rumah Tangga',
    number: 'Hasil MUNAS IV SKATA 2026',
    effectiveDate: '23 Juli 2026',
    location: 'Bandung',
    signatories: 'Pimpinan Sidang MUNAS IV SKATA: Prasetyo Arif Wibowo (Ketua), Ugana Raharja (Anggota), Nicky Darmawan (Anggota)',
    summary: 'Anggaran Rumah Tangga (ART) SKATA mengatur rinci mekanisme kerja, tata laksana kepengurusan, pemilihan, persidangan, keuangan, serta atribut organisasi SKATA.',
    chapters: [
      {
        bab: 'BAB I',
        title: 'KEANGGOTAAN',
        pasals: 'Pasal 1 s.d. Pasal 2',
        detail: 'Pasal 1: Pendaftaran anggota mengisi formulir & Surat Kuasa Pemotongan Iuran. Terhitung sah sejak terbit surat persetujuan dari Ketua DPW. Pasal 2: Berakhirnya keanggotaan jika mengundurkan diri, resign/pensiun dari PT GSD, meninggal dunia, menjadi anggota serikat lain, kena sanksi pembekuan DPP, melanggar AD/ART, vonis pidana min 3 bulan, atau gangguan jiwa tetap.'
      },
      {
        bab: 'BAB II',
        title: 'TUGAS DAN FUNGSI PENGURUS',
        pasals: 'Pasal 3 s.d. Pasal 7',
        detail: 'Pasal 3: Tugas Dewan Pembina mengawasi SKATA & menelaah pertanggungjawaban keuangan per triwulan. Pasal 4: Tugas Pengurus Harian DPP (Ketum, Waketum I Organisasi & Advokasi, Waketum II Usaha & Komunikasi, Sekum, Bendum). Pasal 5: Tugas Pengurus Bidang DPP (Organisasi, Usaha, Advokasi, Kominfo). Pasal 6: Tugas Pengurus Harian DPW. Pasal 7: Tugas Pengurus Harian DPC.'
      },
      {
        bab: 'BAB III',
        title: 'SANKSI BAGI PENGURUS',
        pasals: 'Pasal 8 s.d. Pasal 13',
        detail: 'Pasal 8-10: Sanksi berupa teguran lisan, peringatan tertulis, dan pemberhentian. Peringatan tertulis jika indisipliner, melalaikan tugas, menyalahgunakan jabatan/uang SKATA. Pasal 11: Hak pembelaan diri di rapat pleno. Pasal 12: Pembekuan kepengurusan oleh pengurus tingkat atasnya. Pasal 13: Masa bakti kepengurusan selama 2 (dua) tahun. Ketum, Ketua DPW & DPC maks 2 periode.'
      },
      {
        bab: 'BAB IV',
        title: 'TATA CARA PEMILIHAN PENGURUS',
        pasals: 'Pasal 14 s.d. Pasal 22',
        detail: 'Pasal 14: Steering Committee (SC). Pasal 15: Pemilihan DPP via MUNAS. Setiap DPW mengirim delegasi (0-30 anggota = 1 delegasi, 30-60 anggota = 2 delegasi, dst kelipatan 30). Ketum terpilih wajib menyusun pengurus max 7 hari kerja. Pasal 16-17: Pemilihan Ketua DPW via MUSWIL & Ketua DPC via MUSCAB. Pasal 19: Demisioner. Pasal 20-21: Pembekuan Dewan Pengurus jika 3 bulan tak aktif.'
      },
      {
        bab: 'BAB V',
        title: 'JENIS-JENIS RAPAT & WEWENANG',
        pasals: 'Pasal 23 s.d. Pasal 30',
        detail: 'Jenis Rapat: MUNAS (tiap 2 tahun), MUNASLUB, MUKERNAS (1 tahun sekali), MUSWIL (tiap 2 tahun), MUSCAB (tiap 1 tahun), Rapat Rutin Bulanan. Wewenang MUNAS: Meminta & menilai LPJ DPP, menetapkan AD/ART, mengesahkan Ketum & Dewan Pembina.'
      },
      {
        bab: 'BAB VI',
        title: 'KEUANGAN DAN PERBENDAHARAAN',
        pasals: 'Pasal 31 s.d. Pasal 32',
        detail: 'Pasal 31: Sumber dana dari iuran anggota, hibah, sumbangan, usaha halal. Pasal 32: Pembagian Distribusi Iuran: 75% untuk DPP dan 25% untuk DPW asal. Pembagian Keuntungan Unit Usaha DPW: 90% untuk DPW dan 10% untuk DPP. Laporan keuangan disampaikan tiap 3 bulan.'
      },
      {
        bab: 'BAB VII & VIII',
        title: 'ATRIBUT DAN PENUTUP',
        pasals: 'Pasal 33 s.d. Pasal 36',
        detail: 'Atribut: Topi (kegiatan lapangan), ikat kepala & rompi (aksi/demonstrasi/mogok kerja), jas/seragam/kaos (kegiatan resmi/kolosal ruangan). Berlakunya ART sejak ditetapkan di Bandung, 23 Juli 2026.'
      }
    ]
  },
  {
    id: 'pkb-v-skata-gsd-2025-2027',
    docId: 'PKB-V-GSD-2025-2027',
    title: 'Perjanjian Kerja Bersama V (PKB V) SKATA & PT Graha Sarana Duta (GSD) 2025–2027',
    category: 'Perjanjian Kerja Bersama',
    number: 'No SKATA: 001/HK.810/SKT-000/2025 | No GSD: 1126/HK.810/GSD-000/2025 | SK Kemenaker RI: No. 4/HI.00.01/00.0000.251120020/P-1/I/2026',
    effectiveDate: '12 November 2025 s.d. 12 November 2027',
    location: 'Jakarta',
    signatories: 'Fazriwansyah (Ketua Umum SKATA) & Didit Sulistyo (Plt President Director PT Graha Sarana Duta)',
    summary: 'PKB V 2025–2027 adalah kesepakatan resmi ketenagakerjaan antara Serikat Karyawan SKATA dan Manajemen PT Graha Sarana Duta (TelkomProperty) yang disahkan oleh Kementerian Ketenagakerjaan Republik Indonesia.',
    chapters: [
      {
        bab: 'BAB I',
        title: 'KETENTUAN UMUM (PENGERTIAN & ISTILAH)',
        pasals: 'Pasal 1',
        detail: 'Mengatur istilah resmi: Ahli Waris, Anak Tanggungan (s.d. 21 th / 25 th jika kuliah), Atasan Langsung, Attractiveness, BFP (Bantuan Perumahan), BPFKJ (Kendaraan Jabatan), Bonus, Cuti Tidak Dibayar, Merit System, THP, Uang Pisah, UPH, TKWT, Karyawan Tetap, dll.'
      },
      {
        bab: 'BAB II & III',
        title: 'RUANG LINGKUP, HAK DAN KEWAJIBAN',
        pasals: 'Pasal 2 s.d. Pasal 5',
        detail: 'Berlaku bagi seluruh karyawan PT GSD. Pengakuan hak SKATA untuk mewakili karyawan secara kolektif/perorangan dalam hubungan industrial. GSD dan SKATA dilarang melakukan diskriminasi, intimidasi, provokasi, atau teror.'
      },
      {
        bab: 'BAB IV',
        title: 'BATASAN KEPENGURUSAN & DUKUNGAN UNTUK SKATA',
        pasals: 'Pasal 6 s.d. Pasal 10',
        detail: 'GSD mengakui SKATA sebagai satu-satunya serikat pekerja karyawan GSD. Pengurus unit SDM Kantor Pusat & Kepala Unit Regional dilarang jadi pengurus SKATA (mencegah conflict of interest). Dispensasi kegiatan serikat maks 6 hari kerja/tahun dengan upah penuh. Fasilitas pemotongan iuran anggota via Payroll disetor tiap tanggal 20.'
      },
      {
        bab: 'BAB V',
        title: 'HUBUNGAN KERJA & WAKTU KERJA',
        pasals: 'Pasal 11 s.d. Pasal 16',
        detail: 'Larangan hubungan kekeluargaan (suami/istri, adik/kakak, anak/orang tua) dalam satu unit kantor pusat/regional/area. Waktu Kerja: 8 jam/hari, 40 jam/minggu (Senin - Jumat 08:00 - 17:00, Istirahat 12:00 - 13:00). Kompensasi kerja lembur & hak libur resmi pemerintah.'
      },
      {
        bab: 'BAB VI',
        title: 'CUTI, ISTIRAHAT MELAHIRKAN DAN ISTIRAHAT PANJANG',
        pasals: 'Pasal 17 s.d. Pasal 27',
        detail: 'Mekanisme Pengajuan Cuti (3 hari kerja sebelum cuti). Cuti Tahunan: 12 hari kerja/tahun. Cuti Alasan Penting (CAP): 3 hari (keluarga sakit keras, duka, nikah pertama, dampingi melahirkan/keguguran), 2 hari (nikahkan anak, khitan/baptis), 1 hari (duka luar). Cuti Sakit & Haid. Cuti Sakit Berkepanjangan (>21 hari berturut-turut: gaji 4 bln I 100%, 4 bln II 75%, 4 bln III 50%, selanjutnya 25%). Istirahat Melahirkan: 3 bulan. Cuti Haji (5 hari), Cuti Umroh/Ziarah (7 hari). Istirahat Panjang: 30 hari kalender setelah 6 tahun kerja. CLTP (Cuti Di Luar Tanggungan) min 2 thn kerja. Cuti Moments That Matter (MTM): 1 hari/tahun (hari pertama sekolah anak, wisuda anak, wisuda karyawan, ultah karyawan, ultah pernikahan).'
      },
      {
        bab: 'BAB VII',
        title: 'COMPENSATION AND BENEFIT',
        pasals: 'Pasal 28 s.d. Pasal 42',
        detail: 'Upah/Gaji bulanan dibayarkan tiap akhir bulan. Kenaikan gaji reguler terhitung awal tahun via Merit System. THR: Indeks 2x (Basic salary + Position allowance) untuk Karyawan Tetap, 1x untuk TKWT, dibayarkan maks H-14 Idul Fitri. BPFKJ & BFP. Bonus RUPS Tahunan. Pajak PPh ditanggung Perusahaan (GSD). BPJS Kesehatan & Ketenagakerjaan. Fasilitas Kesehatan Tambahan. Bantuan Perkawinan Pertama, Bantuan Duka/Pemakaman, Bantuan Bencana Alam. Manfaat Purna Tugas / UP & UPMK (Uang Pesangon & Uang Penghargaan Masa Kerja). Uang Pisah bagi karyawan resign: <60 bulan = 20%, 60-120 bulan = 30%, >120 bulan = 50% dari metode perhitungan penghargaan masa kerja.'
      },
      {
        bab: 'BAB VIII',
        title: 'PENGEMBANGAN DAN PEMBINAAN KARYAWAN',
        pasals: 'Pasal 43 s.d. Pasal 53',
        detail: 'Sistem Penilaian Kinerja (Merit System). Reward karyawan (penghargaan, TIP, ESOP, promosi). STT (Surat Teguran Tertulis). Job Rotation, Promosi Jabatan via Sidang Sijab, Demosi, Formasi Non Posisi, Talent Mobility, Training, dan Pembinaan IBO (Iman, Budaya & Olahraga).'
      },
      {
        bab: 'BAB IX & X',
        title: 'PERJALANAN DINAS & K3 (SMK3)',
        pasals: 'Pasal 54 s.d. Pasal 55',
        detail: 'Perjalanan dinas operasional/pindah tugas ditanggung penuh GSD. Penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3).'
      },
      {
        bab: 'BAB XI',
        title: 'DISIPLIN KARYAWAN & SANKSI',
        pasals: 'Pasal 56 s.d. Pasal 62',
        detail: 'Kewajiban & Larangan Karyawan. STT (Surat Teguran Tertulis) oleh Kepala Unit max 1 kali. Pelanggaran SP-1 (masa berlaku 6 bulan, sanksi pemotongan bonus/allowance 3 bulan). Pelanggaran SP-2 & SP-3 (sanksi pemotongan bonus/allowance 12 bulan & demosi). Pelanggaran Mendesak (sanksi PHK langsung, misal: pemalsuan data, perkelahian/intimidasi, perjudian, narkoba, tindak pidana, pencurian/korupsi).'
      },
      {
        bab: 'BAB XII',
        title: 'PEMUTUSAN HUBUNGAN KERJA (PHK)',
        pasals: 'Pasal 63 s.d. Pasal 71',
        detail: 'Sebab PHK: Dugaan pidana (bantuan keluarga 1 org 25%, 2 org 35%, 3 org 45%, >=4 org 50% upah max 6 bulan), Pelanggaran PKB, Pengunduran Diri (mengajukan surat 30 hari sebelumnya), Mangkir (5 hari kerja berturut-turut tanpa izin sah), Sakit Berkepanjangan (>12 bulan), Meninggal Dunia, Hilang, Usia Pensiun Karyawan 56 Tahun.'
      },
      {
        bab: 'BAB XIII & XIV',
        title: 'PERSELISIHAN INDUSTRIAL & PENUTUP',
        pasals: 'Pasal 72 s.d. Pasal 75',
        detail: 'Skorsing & Penyelesaian Perselisihan secara Musyawarah Mufakat. Masa berlaku PKB V selama 2 (dua) tahun (12 November 2025 s.d. 12 November 2027).'
      }
    ]
  }
];
