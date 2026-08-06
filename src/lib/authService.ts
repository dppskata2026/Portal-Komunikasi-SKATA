export type UserRole = 'guest' | 'dpw' | 'dpp' | 'superadmin';

export interface UserSession {
  uid: string;
  name: string;
  email: string;
  nik?: string;
  role: UserRole;
  dpwRegion?: string;
  position?: string;
  loginAt: string;
}

export const ROLE_LABELS: Record<UserRole, { label: string; color: string; bg: string; description: string }> = {
  guest: {
    label: 'Guest / Anggota Umum',
    color: '#4b5563',
    bg: '#f3f4f6',
    description: 'Akses publik untuk membaca berita, AD/ART, PKB V, e-KTA Digital, Sahabat SKATA AI, dan mengirim aspirasi.'
  },
  dpw: {
    label: 'Pengurus DPW (Wilayah)',
    color: '#1d4ed8',
    bg: '#dbeafe',
    description: 'Akses Pengurus Wilayah untuk mengelola data anggota wilayah, berita regional, dan koordinasi daerah.'
  },
  dpp: {
    label: 'Pengurus DPP (Pusat)',
    color: '#b91c1c',
    bg: '#fee2e2',
    description: 'Akses Pengurus Pusat untuk kelola berita nasional, database seluruh anggota, dokumen regulasi, dan aspirasi.'
  },
  superadmin: {
    label: 'Super Admin',
    color: '#6b21a8',
    bg: '#f3e8ff',
    description: 'Akses Master Administrator dengan kontrol penuh seluruh fitur portal, manajemen akun pengurus, dan reset data.'
  }
};

// Default Accounts Matrix
export const PRESET_ACCOUNTS: Array<{
  name: string;
  email: string;
  pass: string;
  role: UserRole;
  dpwRegion?: string;
  position: string;
  nik: string;
}> = [
  {
    name: 'Super Admin Master',
    email: 'admin@skata-gsd.or.id',
    pass: 'admin2026',
    role: 'superadmin',
    position: 'Administrator Utama Portal',
    nik: '99999999'
  },
  {
    name: 'Amiruddin Ahmad',
    email: 'dpp@skata-gsd.or.id',
    pass: 'dpp2026',
    role: 'dpp',
    position: 'Ketua Umum DPP SKATA 2026-2028',
    nik: '10002026'
  },
  {
    name: 'Ade Hermansyah',
    email: 'dpw1@skata-gsd.or.id',
    pass: 'dpw2026',
    role: 'dpw',
    dpwRegion: 'DPW 1 Sumatera',
    position: 'Ketua DPW 1 Sumatera',
    nik: '20012026'
  },
  {
    name: 'Asep Saipul Bahry',
    email: 'dpw2@skata-gsd.or.id',
    pass: 'dpw2026',
    role: 'dpw',
    dpwRegion: 'DPW 2 Jabodetabek & Jabar',
    position: 'Ketua DPW 2 Jabodetabek & Jabar',
    nik: '20022026'
  },
  {
    name: 'Angga Eka Saputra',
    email: 'dpw3@skata-gsd.or.id',
    pass: 'dpw2026',
    role: 'dpw',
    dpwRegion: 'DPW 3 Jateng, Jatim, Bali & Nusra',
    position: 'Ketua DPW 3 Jateng, Jatim, Bali & Nusra',
    nik: '20032026'
  },
  {
    name: 'Moh. Abdulloh Hadi',
    email: 'dpw4@skata-gsd.or.id',
    pass: 'dpw2026',
    role: 'dpw',
    dpwRegion: 'DPW 4 Kalimantan',
    position: 'Ketua DPW 4 Kalimantan',
    nik: '20042026'
  },
  {
    name: 'Muhammad Afdhal Syahrullah',
    email: 'dpw5@skata-gsd.or.id',
    pass: 'dpw2026',
    role: 'dpw',
    dpwRegion: 'DPW 5 Kawasan Timur Indonesia',
    position: 'Ketua DPW 5 Kawasan Timur Indonesia',
    nik: '20052026'
  },
  {
    name: 'Tamu / Anggota Umum',
    email: 'guest@skata-gsd.or.id',
    pass: 'guest2026',
    role: 'guest',
    position: 'Tamu / Karyawan Umum',
    nik: '00000000'
  }
];

const AUTH_STORAGE_KEY = 'skata_user_session';

export function getActiveSession(): UserSession {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) return parsed;
    }
  } catch (err) {
    console.warn('Error reading auth session:', err);
  }

  // Default fallback is Guest
  return {
    uid: 'guest_default',
    name: 'Tamu / Anggota',
    email: 'guest@skata-gsd.or.id',
    role: 'guest',
    position: 'Pengunjung Publik',
    loginAt: new Date().toISOString()
  };
}

export function setActiveSession(session: UserSession | null): void {
  try {
    if (!session || session.role === 'guest') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.warn('Error setting auth session:', err);
  }
  window.dispatchEvent(new Event('skata_auth_changed'));
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event('skata_auth_changed'));
}

// Permission checking utilities
export function canManageAllMembers(role: UserRole): boolean {
  return role === 'superadmin' || role === 'dpp';
}

export function canManageDpwMembers(role: UserRole): boolean {
  return role === 'superadmin' || role === 'dpp' || role === 'dpw';
}

export function canPublishNews(role: UserRole): boolean {
  return role === 'superadmin' || role === 'dpp' || role === 'dpw';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'superadmin';
}
