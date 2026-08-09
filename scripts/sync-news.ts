import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const cfg = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(cfg);
const db = cfg.firestoreDatabaseId && cfg.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, cfg.firestoreDatabaseId)
  : getFirestore(app);

const NEWS_COLLECTION = 'news_articles';

const newsItems = [
  {
    category: 'Berita Utama',
    title: 'Perkuat Sinergi, Pengurus Baru SKATA Audiensi dengan Manajemen Telkom Property',
    excerpt: 'Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028 melangsungkan pertemuan audiensi dan silaturahmi perdana bersama jajaran Manajemen PT Graha Sarana Duta (Telkom Property).',
    body: `Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028 melangsungkan pertemuan audiensi dan silaturahmi perdana bersama jajaran Manajemen PT Graha Sarana Duta (Telkom Property) di Kantor Pusat Jakarta.

Audiensi ini bertujuan untuk memperkuat sinergi hubungan industrial yang harmonis, dinamis, dan berkeadilan, serta menyampaikan pokok-pokok program kerja strategis kepengurusan baru dalam rangka peningkatan kesejahteraan dan profesionalisme karyawan.`,
    date: '6 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date('2026-08-06T09:00:00.000Z').toISOString()
  },
  {
    category: 'Berita Utama',
    title: 'Regenerasi dan Kolaborasi Lintas Generasi, SKATA Bentuk Kepengurusan Baru Periode 2026–2028',
    excerpt: 'Jakarta, 31 Juli 2026 – Semangat regenerasi dan kolaborasi menjadi warna baru dalam perjalanan Serikat Karyawan Graha Sarana Duta (SKATA).',
    body: `Jakarta, 31 Juli 2026 – Semangat regenerasi dan kolaborasi menjadi warna baru dalam perjalanan Serikat Karyawan Graha Sarana Duta (SKATA) menyongsong kepengurusan baru Periode 2026–2028.

Melalui sinergi antar-generasi, DPP SKATA berkomitmen menghadirkan kepemimpinan yang adaptif, inovatif, dan responsif terhadap tantangan era digital serta dinamika industri ketenagakerjaan.`,
    date: '31 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date('2026-07-31T09:00:00.000Z').toISOString()
  },
  {
    category: 'Berita Utama',
    title: 'MUNAS VI SKATA BERLANGSUNG SUKSES, AMIRUDIN AHMAD TERPILIH SEBAGAI KETUA UMUM SKATA PERIODE 2026–2028',
    excerpt: 'Musyawarah Nasional (MUNAS) VI SKATA 2026 menetapkan Amirudin Ahmad secara resmi sebagai Ketua Umum DPP SKATA Periode 2026–2028.',
    body: `Musyawarah Nasional (MUNAS) VI SKATA Tahun 2026 yang berlangsung khidmat dan sukses secara resmi menetapkan Sdr. Amirudin Ahmad sebagai Ketua Umum Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028.

MUNAS VI juga berhasil menetapkan penyempurnaan Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) serta menyusun susunan kepengurusan DPP dan Dewan Pembina SKATA untuk memperkokoh organisasi serikat pekerja.`,
    date: '23 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date('2026-07-23T09:00:00.000Z').toISOString()
  },
  {
    category: 'Pengumuman',
    title: 'Sosialisasi Perjanjian Kerja Bersama (PKB) V Periode 2025–2027',
    excerpt: 'DPP SKATA bersama Manajemen menyelenggarakan kegiatan sosialisasi pasal-pasal kunci Perjanjian Kerja Bersama (PKB V) Periode 2025–2027.',
    body: `Dewan Pengurus Pusat SKATA bersama Manajemen Perusahaan menyelenggarakan agenda Sosialisasi Perjanjian Kerja Bersama (PKB) V Periode 2025–2027 bagi seluruh anggota dan pengurus wilayah.

Sosialisasi ini membahas secara mendalam hak dan kewajiban pekerja, ketentuan cuti, jaminan kesejahteraan, serta penafsiran pasal-pasal baru dalam PKB V guna mewujudkan kepastian hukum dan iklim kerja yang kondusif.`,
    date: '21 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date('2026-07-21T09:00:00.000Z').toISOString()
  },
  {
    category: 'Pengumuman',
    title: 'Pengumuman Resmi: Pemutakhiran Database e-KTA Karyawan GSD',
    excerpt: 'Himbauan bagi seluruh anggota aktif SKATA untuk memperbarui biodata dan verifikasi e-KTA melalui Portal Digital.',
    body: `Dalam rangka penataan tertib administrasi keanggotaan nasional, DPP SKATA GSD menghimbau seluruh anggota aktif untuk melakukan pemutakhiran data pribadi dan nomor e-KTA.

Proses verifikasi data dilakukan secara mandiri melalui menu 'Daftar Anggota' pada Portal SKATA Digital. Data yang diperbarui akan menjadi acuan resmi distribusi fasilitas dan hak keanggotaan serikat.`,
    date: '15 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date('2026-07-15T09:00:00.000Z').toISOString()
  }
];

async function sync() {
  console.log('Fetching existing news articles...');
  const colRef = collection(db, NEWS_COLLECTION);
  const snap = await getDocs(colRef);
  
  console.log('Deleting existing docs...');
  for (const d of snap.docs) {
    await deleteDoc(doc(db, NEWS_COLLECTION, d.id));
  }

  console.log('Inserting updated news articles...');
  for (let i = 0; i < newsItems.length; i++) {
    const customId = `news_doc_${i + 1}`;
    await setDoc(doc(db, NEWS_COLLECTION, customId), newsItems[i]);
    console.log(`Added ${newsItems[i].title} (${newsItems[i].date})`);
  }

  console.log('Sync complete!');
  process.exit(0);
}

sync().catch((err) => {
  console.error('Error syncing news:', err);
  process.exit(1);
});
