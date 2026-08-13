export type UserRole = 'guest' | 'dpw' | 'dpp' | 'superadmin';

export interface UserSession {
  uid: string;
  name: string;
  email: string;
  nik?: string;
  role: UserRole;
  dpwRegion?: string;
  position?: string;
  unitName?: string;
  office?: string;
  phone?: string;
  membershipStatus?: string;
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
  unitName?: string;
  office?: string;
  phone?: string;
  membershipStatus?: string;
}> = [
  {
    name: 'DPP SKATA Super Admin',
    email: 'dppskata@gmail.com',
    pass: 'DPPSkata2026!',
    role: 'superadmin',
    position: 'Super Administrator & Pengurus Pusat',
    nik: '99999999',
    dpwRegion: 'DPP SKATA Pusat - Jakarta',
    unitName: 'Sekretariat DPP SKATA GSD',
    office: 'Gedung Graha Sarana Duta Pusat (Telkom Property)',
    phone: '0811-9922-3847',
    membershipStatus: 'Anggota Aktif Terverifikasi (Pengurus DPP)'
  },
  {
    name: 'ALYA ADIANTA',
    email: '98551624@telpro.co.id',
    pass: '98551624!',
    role: 'superadmin',
    position: 'OFFICER 3 CUSTOMER CARE & ADMINISTRATION',
    nik: '98551624',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'SALES TELKOM SUBSIDIARIES & OTHERS',
    office: 'DIREKTORAT BISNIS - KANTOR PUSAT',
    phone: '081283466000',
    membershipStatus: 'Anggota Aktif Terverifikasi (Admin SKATA)'
  },
  {
    name: 'Amiruddin Ahmad',
    email: '835228@telpro.co.id',
    pass: '835228!',
    role: 'superadmin',
    position: 'Administrator & Pengurus SKATA Telpro',
    nik: '835228',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'OPERASIONAL & LAYANAN TELPRO GSD',
    office: 'PT GRAHA SARANA DUTA (TELPRO) - KANTOR PUSAT',
    phone: '081283522800',
    membershipStatus: 'Anggota Aktif Terverifikasi (Admin SKATA)'
  },
  {
    name: 'Ronald Ishack',
    email: '78001211@telpro.co.id',
    pass: '78001211!',
    role: 'dpp',
    position: 'MANAGER LEVERAGING ASSET DELIVERY & OPERATION',
    nik: '78001211',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'LEVERAGING ASSET',
    office: 'Direktorat Bisnis - KANTOR PUSAT',
    phone: '081386162162',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Jerry Pratama Yendy',
    email: '87007114@telpro.co.id',
    pass: '87007114!',
    role: 'dpp',
    position: 'MANAGER FINANCE, PERFORMANCE & ADMINISTRATION SUPPORT',
    nik: '87007114',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'MANAGED SERVICE OPERATION',
    office: 'Direktorat Operation - KANTOR PUSAT',
    phone: '081299153337',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Rifky Fernanda',
    email: '95510017@telpro.co.id',
    pass: '95510017!',
    role: 'dpp',
    position: 'OFFICER 1 FINANCIAL PERFORMANCE, ANALYSIS & REPORTING',
    nik: '95510017',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'RISK MANAGEMENT & BUSINESS PERFORMANCE',
    office: 'Direktorat FRM - KANTOR PUSAT',
    phone: '081318554098',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'I Gede Aditya W.',
    email: '88000911@telpro.co.id',
    pass: '88000911!',
    role: 'dpp',
    position: 'MANAGER CORPORATE SECRETARY, GCG & SUSTAINABILLITY',
    nik: '88000911',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'CORPORATE SECRETARY, GCG & SUSTAINABILLITY',
    office: 'CORPORATE SECRETARY - KANTOR PUSAT',
    phone: '082232439934',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Heri Santoso',
    email: '84003611@telpro.co.id',
    pass: '84003611!',
    role: 'dpp',
    position: 'MANAGER SMART BUILDING & OUTSOURCING PLANNING',
    nik: '84003611',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'PROPERTY & OUTSOURCING MANAGEMENT',
    office: 'Direktorat Operation - KANTOR PUSAT',
    phone: '08117910222',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Muji Rahmad',
    email: '78003011@telpro.co.id',
    pass: '78003011!',
    role: 'dpp',
    position: 'MANAGER SMART BUILDING & OUTSOURCING PERFORMANCE',
    nik: '78003011',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'PROPERTY & OUTSOURCING MANAGEMENT',
    office: 'Direktorat Operation - KANTOR PUSAT',
    phone: '08118123966',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Iskandar Zulkarnaen',
    email: '89005915@telpro.co.id',
    pass: '89005915!',
    role: 'dpp',
    position: 'OFFICER 1 OM OPERATION & WORKFORCE MANAGEMENT 1',
    nik: '89005915',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'PROPERTY & OUTSOURCING MANAGEMENT',
    office: 'Direktorat Operation - KANTOR PUSAT',
    phone: '082119180971',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Gremmy Jordan Sitanggang',
    email: '93546018@telpro.co.id',
    pass: '93546018!',
    role: 'dpp',
    position: 'OFFICER 1 LEVERAGING ASSET PLANNING',
    nik: '93546018',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'LEVERAGING ASSET',
    office: 'Direktorat Bisnis - KANTOR PUSAT',
    phone: '08111737793',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Andri',
    email: '81004113@telpro.co.id',
    pass: '81004113!',
    role: 'dpp',
    position: 'SENIOR ACCOUNT MANAGER SUBSIDIARY 2',
    nik: '81004113',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'SALES TELKOM SUBSIDIARIES & OTHERS',
    office: 'Direktorat Bisnis - KANTOR PUSAT',
    phone: '081360005646',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Nuronia Zulva',
    email: '95606922@telpro.co.id',
    pass: '95606922!',
    role: 'dpp',
    position: 'OFFICER 2 DIGITAL MARKETING & INTEGRATED MARKETING COMMUNICATION',
    nik: '95606922',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'MARKETING MANAGEMENT & BUSINESS SOLUTION',
    office: 'Direktorat Bisnis - KANTOR PUSAT',
    phone: '081294810809',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  },
  {
    name: 'Wisnu Yogi Prabowo',
    email: '93545617@telpro.co.id',
    pass: '93545617!',
    role: 'dpp',
    position: 'OFFICER 1 CORPORATE SECRETARY, GCG & SUSTAINABILLITY',
    nik: '93545617',
    dpwRegion: 'Dewan Pengurus Pusat (DPP)',
    unitName: 'CORPORATE SECRETARY',
    office: 'CORPORATE SECRETARY - KANTOR PUSAT',
    phone: '085332844752',
    membershipStatus: 'Anggota Aktif Terverifikasi'
  }
];

const AUTH_STORAGE_KEY = 'skata_user_session';
const PASS_OVERRIDE_KEY = 'skata_user_custom_pass';

export function getCustomPassword(): string | null {
  try {
    return localStorage.getItem(PASS_OVERRIDE_KEY);
  } catch {
    return null;
  }
}

export function setCustomPassword(newPass: string): void {
  try {
    localStorage.setItem(PASS_OVERRIDE_KEY, newPass);
  } catch (err) {
    console.warn('Error saving password:', err);
  }
}

export function getActiveSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed: UserSession = JSON.parse(raw);
      if (parsed && parsed.role) {
        // Sync with updated preset account details if available
        const preset = PRESET_ACCOUNTS.find(
          a => a.email.toLowerCase() === parsed.email?.toLowerCase() || a.nik === parsed.nik
        );
        if (preset) {
          return {
            ...parsed,
            name: preset.name,
            position: preset.position,
            unitName: preset.unitName,
            office: preset.office,
            dpwRegion: preset.dpwRegion,
            phone: preset.phone,
            membershipStatus: preset.membershipStatus
          };
        }
        return parsed;
      }
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
  return role === 'superadmin';
}

export function canManageNews(role: UserRole): boolean {
  return role === 'superadmin';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'superadmin';
}

