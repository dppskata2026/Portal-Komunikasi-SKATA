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
    description: 'Akses publik terbatas.'
  },
  dpw: {
    label: 'Pengurus DPW (Wilayah)',
    color: '#1d4ed8',
    bg: '#dbeafe',
    description: 'Akses Pengurus Wilayah.'
  },
  dpp: {
    label: 'Pengurus DPP (Pusat)',
    color: '#b91c1c',
    bg: '#fee2e2',
    description: 'Akses Pengurus Pusat.'
  },
  superadmin: {
    label: 'Super Admin',
    color: '#6b21a8',
    bg: '#f3e8ff',
    description: 'Akses Master Administrator Portal SKATA.'
  }
};

// Registered Accounts (Only 1 active account: dppskata@gmail.com)
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
    name: 'DPP SKATA Super Admin',
    email: 'dppskata@gmail.com',
    pass: 'DPPSkata2026!',
    role: 'superadmin',
    position: 'Super Administrator Portal SKATA',
    nik: '99999999'
  }
];

const AUTH_STORAGE_KEY = 'skata_user_session';

export function getActiveSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) return parsed;
    }
  } catch (err) {
    console.warn('Error reading auth session:', err);
  }

  // Private portal: default is null (unauthenticated)
  return null;
}

export function setActiveSession(session: UserSession | null): void {
  try {
    if (!session) {
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

