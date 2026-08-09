import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import { supabase } from './supabase';
import { SKATA_REGULATIONS_DATABASE, SkataRegulationDoc } from '../data/skataRegulationsDatabase';

// Collection Names
export const NEWS_COLLECTION = 'news_articles';
export const ASPIRATIONS_COLLECTION = 'aspirations';
export const MEMBERSHIPS_COLLECTION = 'memberships';
export const REGULATIONS_COLLECTION = 'skata_regulations';
export const DPP_PHOTOS_COLLECTION = 'dpp_photos';

// Interfaces
export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  image?: string;
  createdAt?: string;
}

export interface AspirasiRecord {
  id?: string;
  ticketNumber: string;
  category: string;
  title: string;
  description: string;
  urgency: string;
  confidentiality: string;
  dpw: string;
  contactPreference: string;
  status: string;
  createdAt: string;
}

export interface MembershipSubmission {
  id?: string;
  nik: string;
  fullName: string;
  corpEmail: string;
  phone: string;
  unit: string;
  position: string;
  workLocation: string;
  dpw: string;
  dpc: string;
  dateJoined: string;
  submittedAt: string;
  status: string;
}

// ---------------- STORAGE HELPER ----------------
export function safeSetLocalStorage(key: string, value: any): void {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
  } catch (e) {
    console.warn(`localStorage setItem failed for key "${key}":`, e);
    try {
      if (Array.isArray(value)) {
        // Strip large data URLs to fit into quota
        const sanitized = value.map((item) => {
          if (item && typeof item === 'object' && typeof item.image === 'string' && item.image.length > 500) {
            return { ...item, image: '/assets/skata-hero-visual.png' };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(sanitized));
      }
    } catch {
      // Ignore quota error safely
    }
  }
}

// ---------------- NEWS ARTICLES ----------------
const DEFAULT_INITIAL_NEWS: Omit<NewsArticle, 'id'>[] = [
  {
    category: 'Berita Utama',
    title: 'Perkuat Sinergi, Pengurus Baru SKATA Audiensi dengan Manajemen Telkom Property',
    excerpt: 'Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028 melangsungkan pertemuan audiensi dan silaturahmi perdana bersama jajaran Manajemen PT Graha Sarana Duta (Telkom Property).',
    body: `Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028 melangsungkan pertemuan audiensi dan silaturahmi perdana bersama jajaran Manajemen PT Graha Sarana Duta (Telkom Property) di Kantor Pusat Jakarta.

Audiensi ini bertujuan untuk memperkuat sinergi hubungan industrial yang harmonis, dinamis, dan berkeadilan, serta menyampaikan pokok-pokok program kerja strategis kepengurusan baru dalam rangka peningkatan kesejahteraan dan profesionalisme karyawan.`,
    date: '6 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: '2026-08-06T09:00:00.000Z'
  },
  {
    category: 'Berita Utama',
    title: 'Regenerasi dan Kolaborasi Lintas Generasi, SKATA Bentuk Kepengurusan Baru Periode 2026–2028',
    excerpt: 'Jakarta, 31 Juli 2026 – Semangat regenerasi dan kolaborasi menjadi warna baru dalam perjalanan Serikat Karyawan Graha Sarana Duta (SKATA).',
    body: `Jakarta, 31 Juli 2026 – Semangat regenerasi dan kolaborasi menjadi warna baru dalam perjalanan Serikat Karyawan Graha Sarana Duta (SKATA) menyongsong kepengurusan baru Periode 2026–2028.

Melalui sinergi antar-generasi, DPP SKATA berkomitmen menghadirkan kepemimpinan yang adaptif, inovatif, dan responsif terhadap tantangan era digital serta dinamika industri ketenagakerjaan.`,
    date: '31 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: '2026-07-31T09:00:00.000Z'
  },
  {
    category: 'Berita Utama',
    title: 'MUNAS VI SKATA BERLANGSUNG SUKSES, AMIRUDIN AHMAD TERPILIH SEBAGAI KETUA UMUM SKATA PERIODE 2026–2028',
    excerpt: 'Musyawarah Nasional (MUNAS) VI SKATA 2026 menetapkan Amirudin Ahmad secara resmi sebagai Ketua Umum DPP SKATA Periode 2026–2028.',
    body: `Musyawarah Nasional (MUNAS) VI SKATA Tahun 2026 yang berlangsung khidmat dan sukses secara resmi menetapkan Sdr. Amirudin Ahmad sebagai Ketua Umum Dewan Pengurus Pusat (DPP) SKATA Periode 2026–2028.

MUNAS VI juga berhasil menetapkan penyempurnaan Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) serta menyusun susunan kepengurusan DPP dan Dewan Pembina SKATA untuk memperkokoh organisasi serikat pekerja.`,
    date: '23 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: '2026-07-23T09:00:00.000Z'
  },
  {
    category: 'Pengumuman',
    title: 'Sosialisasi Perjanjian Kerja Bersama (PKB) V Periode 2025–2027',
    excerpt: 'DPP SKATA bersama Manajemen menyelenggarakan kegiatan sosialisasi pasal-pasal kunci Perjanjian Kerja Bersama (PKB V) Periode 2025–2027.',
    body: `Dewan Pengurus Pusat SKATA bersama Manajemen Perusahaan menyelenggarakan agenda Sosialisasi Perjanjian Kerja Bersama (PKB) V Periode 2025–2027 bagi seluruh anggota dan pengurus wilayah.

Sosialisasi ini membahas secara mendalam hak dan kewajiban pekerja, ketentuan cuti, jaminan kesejahteraan, serta penafsiran pasal-pasal baru dalam PKB V guna mewujudkan kepastian hukum dan iklim kerja yang kondusif.`,
    date: '21 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: '2026-07-21T09:00:00.000Z'
  },
  {
    category: 'Pengumuman',
    title: 'Pengumuman Resmi: Pemutakhiran Database e-KTA Karyawan GSD',
    excerpt: 'Himbauan bagi seluruh anggota aktif SKATA untuk memperbarui biodata dan verifikasi e-KTA melalui Portal Digital.',
    body: `Dalam rangka penataan tertib administrasi keanggotaan nasional, DPP SKATA GSD menghimbau seluruh anggota aktif untuk melakukan pemutakhiran data pribadi dan nomor e-KTA.

Proses verifikasi data dilakukan secara mandiri melalui menu 'Daftar Anggota' pada Portal SKATA Digital. Data yang diperbarui akan menjadi acuan resmi distribusi fasilitas dan hak keanggotaan serikat.`,
    date: '15 Juli 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: '2026-07-15T09:00:00.000Z'
  }
];

let hasSeededNews = false;

async function seedInitialNewsArticles() {
  if (hasSeededNews) return;
  hasSeededNews = true;
  try {
    for (const item of DEFAULT_INITIAL_NEWS) {
      await addDoc(collection(db, NEWS_COLLECTION), item);
    }
  } catch (e) {
    console.warn("Failed to seed initial news articles:", e);
  }
}

function parseArticleTimestamp(article: NewsArticle): number {
  if (article.date) {
    const indonesianMonths: Record<string, string> = {
      'januari': 'January',
      'februari': 'February',
      'maret': 'March',
      'april': 'April',
      'mei': 'May',
      'juni': 'June',
      'juli': 'July',
      'agustus': 'August',
      'september': 'September',
      'oktober': 'October',
      'november': 'November',
      'desember': 'December'
    };
    let dateStr = article.date.toLowerCase().trim();
    for (const [indo, eng] of Object.entries(indonesianMonths)) {
      if (dateStr.includes(indo)) {
        dateStr = dateStr.replace(indo, eng);
        break;
      }
    }
    const t = new Date(dateStr).getTime();
    if (!isNaN(t)) return t;
  }
  if (article.createdAt) {
    const t = new Date(article.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

export function subscribeNewsArticles(callback: (articles: NewsArticle[]) => void) {
  try {
    const q = query(collection(db, NEWS_COLLECTION));
    return onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          await seedInitialNewsArticles();
          return;
        }

        const articles: NewsArticle[] = [];
        snapshot.forEach((docSnap) => {
          articles.push({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
        });
        // Sort descending by numeric timestamp (newest first)
        articles.sort((a, b) => parseArticleTimestamp(b) - parseArticleTimestamp(a));
        safeSetLocalStorage('skata_news_articles', articles);
        callback(articles);
      },
      (error) => {
        console.warn('Firestore news listener warning:', error);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to news articles:', err);
    return () => {};
  }
}

export async function addNewsArticleFirebase(article: Omit<NewsArticle, 'id'>): Promise<string> {
  const newDoc = await addDoc(collection(db, NEWS_COLLECTION), {
    ...article,
    createdAt: article.createdAt || new Date().toISOString()
  });
  return newDoc.id;
}

export async function updateNewsArticleFirebase(id: string, article: Partial<NewsArticle>): Promise<void> {
  await updateDoc(doc(db, NEWS_COLLECTION, id), article);
}

export async function deleteNewsArticleFirebase(id: string): Promise<void> {
  await deleteDoc(doc(db, NEWS_COLLECTION, id));
}

// ---------------- ASPIRATIONS ----------------
export function subscribeAspirations(callback: (items: AspirasiRecord[]) => void) {
  try {
    const q = query(collection(db, ASPIRATIONS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: AspirasiRecord[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as AspirasiRecord);
        });
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        callback(items);
      },
      (error) => {
        console.warn('Firestore aspirations listener warning:', error);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to aspirations:', err);
    return () => {};
  }
}

export async function createAspirationFirebase(record: Omit<AspirasiRecord, 'id'>): Promise<string> {
  const newDoc = await addDoc(collection(db, ASPIRATIONS_COLLECTION), record);
  return newDoc.id;
}

// ---------------- MEMBERSHIPS ----------------
export function subscribeMemberships(callback: (items: MembershipSubmission[]) => void) {
  try {
    const q = query(collection(db, MEMBERSHIPS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: MembershipSubmission[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as MembershipSubmission);
        });
        callback(items);
      },
      (error) => {
        console.warn('Firestore memberships listener warning:', error);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to memberships:', err);
    return () => {};
  }
}

export async function saveMembershipSubmissionFirebase(data: any): Promise<boolean> {
  try {
    const submission: MembershipSubmission = {
      ...data,
      submittedAt: new Date().toISOString(),
      status: data.status || 'Diverifikasi / Aktif'
    };
    await addDoc(collection(db, MEMBERSHIPS_COLLECTION), submission);
    return true;
  } catch (err) {
    console.error('Error saving membership to Firestore:', err);
    return false;
  }
}

export async function saveBulkMembershipsFirebase(records: any[]): Promise<boolean> {
  try {
    if (supabase) {
      try {
        const rows = records.map(r => ({
          id: r.id || r.nik,
          nik: r.nik,
          full_name: r.fullName,
          unit: r.unit,
          work_location: r.workLocation,
          dpw: r.dpw,
          phone: r.phone || '',
          corp_email: r.corpEmail || '',
          status: r.status || 'Aktif',
          updated_at: new Date().toISOString()
        }));
        await supabase.from('memberships').upsert(rows);
      } catch (sErr) {
        console.warn('Supabase bulk memberships sync warning:', sErr);
      }
    }

    for (const r of records) {
      const docId = (r.nik || r.id || `MEMBER_${Math.random()}`).toString().replace(/[^a-zA-Z0-9_-]/g, '_');
      const docRef = doc(db, MEMBERSHIPS_COLLECTION, docId);
      await setDoc(docRef, {
        nik: r.nik,
        fullName: r.fullName,
        unit: r.unit,
        workLocation: r.workLocation,
        dpw: r.dpw,
        phone: r.phone || '',
        corpEmail: r.corpEmail || '',
        status: r.status || 'Aktif',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return true;
  } catch (err) {
    console.error('Error saving bulk memberships to Firestore:', err);
    return false;
  }
}

export async function clearMembershipsFirebase(): Promise<boolean> {
  try {
    const q = query(collection(db, MEMBERSHIPS_COLLECTION));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (err) {
    console.error('Error clearing memberships in Firestore:', err);
    return false;
  }
}

// ---------------- DPP MEMBER PHOTOS (SYNCED TO FIREBASE) ----------------
export function subscribeDppPhotos(callback: (photos: Record<string, string>) => void) {
  try {
    const q = query(collection(db, DPP_PHOTOS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const photos: Record<string, string> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.name && data.photoUrl) {
            photos[data.name] = data.photoUrl;
          }
        });
        callback(photos);
      },
      (error) => {
        console.warn('Firestore DPP photos listener warning:', error);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to DPP photos:', err);
    return () => {};
  }
}

export async function saveDppPhotoFirebase(memberName: string, photoUrl: string): Promise<boolean> {
  try {
    // 1. Sync to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('dpp_photos').upsert({
          id: memberName.replace(/[^a-zA-Z0-9_-]/g, '_'),
          name: memberName,
          photo_url: photoUrl,
          updated_at: new Date().toISOString()
        });
      } catch (sErr) {
        console.warn('Supabase DPP photo sync warning:', sErr);
      }
    }

    // 2. Sync to Firebase Firestore
    const docId = memberName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, DPP_PHOTOS_COLLECTION, docId);
    await setDoc(docRef, {
      name: memberName,
      photoUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving DPP photo to Firestore/Supabase:', err);
    return false;
  }
}

export async function seedRegulationsToFirebase(): Promise<boolean> {
  try {
    for (const regDoc of SKATA_REGULATIONS_DATABASE) {
      const docRef = doc(db, REGULATIONS_COLLECTION, regDoc.id);
      await setDoc(docRef, {
        ...regDoc,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    console.log('SKATA Regulations (AD, ART, PKB V) successfully synced to Firebase Firestore.');
    return true;
  } catch (err) {
    console.warn('Error seeding SKATA Regulations to Firestore:', err);
    return false;
  }
}

export function subscribeRegulations(callback: (items: SkataRegulationDoc[]) => void) {
  try {
    const q = query(collection(db, REGULATIONS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: SkataRegulationDoc[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as SkataRegulationDoc);
        });
        if (items.length === 0) {
          // If empty in Firestore, trigger seed and pass local fallback
          seedRegulationsToFirebase();
          callback(SKATA_REGULATIONS_DATABASE);
        } else {
          callback(items);
        }
      },
      (error) => {
        console.warn('Firestore regulations listener warning, using fallback:', error);
        callback(SKATA_REGULATIONS_DATABASE);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to regulations:', err);
    callback(SKATA_REGULATIONS_DATABASE);
    return () => {};
  }
}
