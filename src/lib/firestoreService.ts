import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import { SKATA_REGULATIONS_DATABASE, SkataRegulationDoc } from '../data/skataRegulationsDatabase';

// Collection Names
export const NEWS_COLLECTION = 'news_articles';
export const ASPIRATIONS_COLLECTION = 'aspirations';
export const MEMBERSHIPS_COLLECTION = 'memberships';
export const REGULATIONS_COLLECTION = 'skata_regulations';

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
export function subscribeNewsArticles(callback: (articles: NewsArticle[]) => void) {
  try {
    const q = query(collection(db, NEWS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const articles: NewsArticle[] = [];
        snapshot.forEach((docSnap) => {
          articles.push({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
        });
        // Sort descending
        articles.sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || ''));
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

// ---------------- SKATA REGULATIONS (AD, ART, PKB V) ----------------
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
