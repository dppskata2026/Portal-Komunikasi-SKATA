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
    title: 'Peluncuran Portal SKATA Digital 2026 versi Terintegrasi & Modern',
    excerpt: 'Dewan Pengurus Pusat Serikat Karyawan PT Grahasentra Santosa (SKATA GSD) secara resmi meluncurkan pembaruan sistem portal terintegrasi untuk mendukung keterbukaan informasi dan pelayanan anggota.',
    body: `Dewan Pengurus Pusat Serikat Karyawan PT Grahasentra Santosa (SKATA GSD) secara resmi meluncurkan pembaruan sistem portal terintegrasi untuk mendukung keterbukaan informasi dan pelayanan anggota.

Melalui portal ini, seluruh anggota dan pengurus dapat mengakses informasi terkini mengenai AD/ART, Perjanjian Kerja Bersama (PKB V), direktori keanggotaan digital, konsultasi ketenagakerjaan berbasis AI (Sahabat SKATA), hingga penyampaian aspirasi secara terpusat.

Ketua Umum DPP SKATA GSD menyampaikan bahwa transformasi digital ini bertujuan untuk mempererat silaturahmi antaranggota lintas DPW di seluruh Indonesia sekaligus mewujudkan tata kelola organisasi yang transparan, akuntabel, dan efisien.`,
    date: '09 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    category: 'Agenda',
    title: 'Rapat Anggota Tahunan & Silaturahmi Nasional SKATA GSD 2026',
    excerpt: 'Undangan Rapat Anggota Tahunan dan Konsolidasi Pengurus DPP & DPW SKATA seluruh Indonesia.',
    body: `DPP SKATA GSD mengundang seluruh perwakilan DPW dan anggota aktif untuk menghadiri Rapat Anggota Tahunan (RAT) & Silaturahmi Nasional 2026.

Agenda utama RAT kali ini meliputi:
1. Laporan Pertanggungjawaban Pengurus DPP SKATA GSD Tahun 2025/2026.
2. Evaluasi pelaksanaan Perjanjian Kerja Bersama (PKB V).
3. Pembahasan program kerja strategis Kesejahteraan & Pengembangan Anggota Tahun 2026/2027.
4. Konsolidasi organisasi dan penguatan solidaritas antarwilayah.

Jadwal pelaksanaan: Sabtu, 15 Agustus 2026 pukul 09.00 WIB. Tautan pendaftaran dan konfirmasi kehadiran dapat diakses melalui sekretariat DPW masing-masing.`,
    date: '15 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    category: 'Pengumuman',
    title: 'Pengumuman Resmi: Pemutakhiran Database e-KTA Karyawan GSD',
    excerpt: 'Himbauan bagi seluruh anggota aktif SKATA untuk memperbarui biodata dan verifikasi e-KTA melalui Portal Digital.',
    body: `Dalam rangka penataan tertib administrasi keanggotaan nasional, DPP SKATA GSD menghimbau seluruh anggota aktif untuk melakukan pemutakhiran data pribadi dan nomor e-KTA.

Proses verifikasi data dilakukan secara mandiri melalui menu 'Daftar Anggota' pada Portal SKATA Digital. Data yang diperbarui akan menjadi acuan resmi distribusi fasilitas dan hak keanggotaan serikat.

Batas waktu pemutakhiran data adalah tanggal 31 Agustus 2026. Bagi anggota yang mengalami kendala teknis dapat menghubungi tim sekretariat melalui menu Kontak.`,
    date: '05 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    category: 'Pendidikan',
    title: 'Workshop Pelatihan Hubungan Industrial & Pemahaman PKB V SKATA',
    excerpt: 'Program edukasi dan bimbingan teknis pemahaman Perjanjian Kerja Bersama (PKB V) bagi pengurus wilayah dan anggota.',
    body: `Bidang Pendidikan dan Advokasi DPP SKATA GSD menyelenggarakan Workshop Pelatihan Hubungan Industrial & Pemahaman PKB V bagi perwakilan pengurus dan anggota.

Materi pelatihan meliputi pemahaman hak dan kewajiban pekerja, mekanisme penyelesaian perselisihan hubungan industrial, penafsiran pasal-pasal kunci dalam PKB V, serta teknik advokasi keanggotaan.

Pelatihan diselenggarakan secara interaktif dengan narasumber pakar hukum ketenagakerjaan dan jajaran Pengurus Pusat SKATA.`,
    date: '01 Agustus 2026',
    image: '/assets/skata-hero-visual.png',
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString()
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
  if (article.createdAt) {
    const t = new Date(article.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (article.date) {
    const t = new Date(article.date).getTime();
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
