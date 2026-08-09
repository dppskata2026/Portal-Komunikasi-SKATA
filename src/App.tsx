import React, { useEffect, useMemo, useState } from 'react';
import { subscribeNewsArticles, subscribeMemberships, safeSetLocalStorage } from './lib/firestoreService';
import { deduplicateMembers } from './components/TotalAnggotaTable';
import {
  Bell,
  Bot,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Landmark,
  Menu,
  Moon,
  Newspaper,
  PenSquare,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  UserRoundCheck,
  UsersRound,
  X,
} from 'lucide-react';

import { Breadcrumbs } from './components/Breadcrumbs';
import { SkataWordmark } from './components/SkataWordmark';
import { useAuth } from './lib/useAuth';
import { ROLE_LABELS, PRESET_ACCOUNTS, setActiveSession, logoutUser, UserSession } from './lib/authService';
import { ProfilSKATA } from './components/ProfilSKATA';
import { VisiMisi } from './components/VisiMisi';
import { StrukturOrganisasi } from './components/StrukturOrganisasi';
import { PengurusDPP } from './components/PengurusDPP';
import { DPWPage } from './components/DPWPage';
import { DPCPage } from './components/DPCPage';
import { KeanggotaanPage } from './components/KeanggotaanPage';
import { AspirasiPage } from './components/AspirasiPage';
import { KeuanganPage } from './components/KeuanganPage';
import { DokumenPage } from './components/DokumenPage';
import { ProgramKerja } from './components/ProgramKerja';
import { LoginPage } from './components/LoginPage';
import { Branded404 } from './components/Branded404';
import { SahabatSkataChat } from './components/SahabatSkataChat';

import {
  EKtaPage,
  AdvokasiPage,
  PelatihanPage,
  KesejahteraanPage,
  KoperasiPage,
  SurveyPage,
  BeritaPage,
  KontakPage,
} from './components/SubPages';

import { organizationProfile } from './data/skataMasterData';
import { DotMap } from './components/DotMap';
import { SKATA_LOGO_BASE64 } from './assets/logoBase64';

type IconComponent = typeof User;

const navItems = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Tentang SKATA',
    href: '#',
    dropdown: [
      { label: 'Profil SKATA', href: '/tentang' },
      { label: 'Visi, Misi & Nilai', href: '/tentang/visi-misi' },
      { label: 'Struktur Organisasi', href: '/tentang/struktur-organisasi' },
      { label: 'Pengurus DPP 2026–2028', href: '/tentang/pengurus-dpp' },
      { label: 'Direktori DPW', href: '/tentang/dpw' },
    ],
  },
  {
    label: 'Layanan Anggota',
    href: '#',
    dropdown: [
      { label: 'Sahabat SKATA AI', href: '/layanan/sahabat-skata' },
      { label: 'Total Anggota Aktif', href: '/layanan/total-anggota' },
      { label: 'Pendaftaran Anggota Baru', href: '/layanan/keanggotaan' },
      { label: 'e-KTA Digital', href: '/layanan/e-kta' },
      { label: 'Keuangan & Iuran', href: '/layanan/keuangan' },
      { label: 'Program Kerja 2026–2028', href: '/layanan/program-kerja' },
      { label: 'Advokasi & Hukum', href: '/layanan/advokasi' },
      { label: 'Pelatihan Anggota', href: '/layanan/pelatihan' },
      { label: 'Kesejahteraan', href: '/layanan/kesejahteraan' },
      { label: 'Unduh Dokumen', href: '/layanan/download' },
      { label: 'Survey & Polling', href: '/layanan/survey' },
    ],
  },
  { label: 'Aspirasi', href: '/aspirasi' },
  { label: 'Berita', href: '/berita' },
  { label: 'Kontak', href: '/kontak' },
];

function OfficialSkataLogo({ className = '' }: { className?: string }) {
  const [logoSrc, setLogoSrc] = useState(SKATA_LOGO_BASE64);

  return (
    <img
      className={className}
      src={logoSrc}
      alt="Logo resmi SKATA — Serikat Karyawan GSD"
      onError={() => {
        if (logoSrc === SKATA_LOGO_BASE64) {
          setLogoSrc('/skata-logo-official.png');
        } else if (logoSrc === '/skata-logo-official.png') {
          setLogoSrc('/assets/skata-logo-official.png');
        } else if (logoSrc === '/assets/skata-logo-official.png') {
          setLogoSrc('/logo.png');
        }
      }}
    />
  );
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1100;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {new Intl.NumberFormat('id-ID').format(display)}
      {suffix}
    </>
  );
}

function Navbar({
  currentPath,
  navigate,
  onLogin,
}: {
  currentPath: string;
  navigate: (path: string) => void;
  onLogin: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <header className="navbar-shell">
      <nav className="navbar container" aria-label="Navigasi utama">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          aria-label="SKATA Beranda"
        >
          <OfficialSkataLogo className="brand-logo" />
          <SkataWordmark size="md" />
        </a>

        <div className={`nav-links ${mobileOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? currentPath === '/' || currentPath === '/beranda'
                : currentPath.startsWith(item.href);

            if (item.dropdown) {
              return (
                <div key={item.label} className="dropdown-container">
                  <a
                    className={`${isActive ? 'active' : ''} nav-dropdown-trigger`}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href === '#') {
                        e.preventDefault();
                      }
                    }}
                  >
                    {item.label}
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </a>
                  <div className="dropdown-menu">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileOpen(false);
                          navigate(subItem.href);
                        }}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.label}
                className={isActive ? 'active' : ''}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  navigate(item.href);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="nav-actions">
          <button className="icon-button" aria-label="Cari" onClick={() => navigate('/layanan/total-anggota')}>
            <Search size={21} />
          </button>
          <button className="icon-button notification" aria-label="Notifikasi" onClick={() => navigate('/berita')}>
            <Bell size={21} />
            <span>3</span>
          </button>
          <button
            className="theme-toggle"
            aria-label="Ubah tema"
            aria-pressed={darkMode}
            onClick={() => setDarkMode((current) => !current)}
          >
            <Moon size={16} />
            <span className="theme-knob">{darkMode ? <Moon size={14} /> : <Sun size={14} />}</span>
          </button>

          {isLoggedIn && user ? (
            <button
              className="login-button"
              onClick={() => navigate('/login')}
              title={`Akses: ${ROLE_LABELS[user.role]?.label || 'Super Admin'} - ${user.name}`}
              style={{
                background: ROLE_LABELS[user.role]?.bg || '#f3e8ff',
                color: ROLE_LABELS[user.role]?.color || '#6b21a8',
                border: `1.5px solid ${ROLE_LABELS[user.role]?.color || '#6b21a8'}60`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 14px',
                fontWeight: 800,
                fontSize: '13px',
                borderRadius: '10px'
              }}
            >
              <ShieldCheck size={16} />
              <span>
                {user.role === 'superadmin'
                  ? 'Super Admin'
                  : user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              <User size={18} />
              Login / Otorisasi
            </button>
          )}

          <button
            className="mobile-menu-button"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
}

function HeroSection({ navigate }: { navigate: (path: string) => void }) {
  const values = [
    { icon: ShieldCheck, title: 'Profesional', copy: 'Bekerja dengan integritas' },
    { icon: UsersRound, title: 'Transparan', copy: 'Terbuka & akuntabel' },
    { icon: UserRoundCheck, title: 'Berintegritas', copy: 'Demi anggota, untuk bersama' },
  ];

  return (
    <section id="beranda" className="hero">
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> Portal Digital Resmi SKATA GSD
          </div>
          <h1>
            Bersatu,<br />
            Berkarya,<br />
            <em>Sejahtera Bersama</em>
          </h1>
          <p>
            SKATA hadir sebagai rumah bersama seluruh karyawan GSD untuk memperjuangkan hak,
            meningkatkan kesejahteraan, dan membangun hubungan industrial yang profesional,
            transparan, dan berkelanjutan.
          </p>
          <div className="hero-actions">
            <a
              className="button primary"
              href="/tentang"
              onClick={(e) => {
                e.preventDefault();
                navigate('/tentang');
              }}
            >
              <User size={18} /> Tentang SKATA
            </a>
            <a
              className="button outline"
              href="/aspirasi"
              onClick={(e) => {
                e.preventDefault();
                navigate('/aspirasi');
              }}
            >
              <Send size={18} /> Hub Aspirasi
            </a>
            <a
              className="button soft"
              href="/layanan/keanggotaan"
              onClick={(e) => {
                e.preventDefault();
                navigate('/layanan/keanggotaan');
              }}
            >
              <UserRoundCheck size={18} /> Daftar Anggota
            </a>
          </div>
          <div className="value-row">
            {values.map(({ icon: Icon, title, copy }) => (
              <div className="value-item" key={title}>
                <span className="value-icon"><Icon size={26} /></span>
                <span><strong>{title}</strong><small>{copy}</small></span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Visual identitas SKATA">
          <img
            src="/assets/skata-hero-visual.png"
            alt="Emblem SKATA dengan pita merah, aksen emas, dan latar kota"
            loading="eager"
          />
          <div className="hero-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function MiniLineChart() {
  return (
    <svg className="mini-chart" viewBox="0 0 170 55" role="img" aria-label="Tren anggota meningkat">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff2d2d" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#ff2d2d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 48 L18 44 L35 45 L52 35 L70 38 L88 25 L104 31 L122 18 L140 21 L158 5 L170 12 L170 55 L0 55 Z" fill="url(#lineFill)" />
      <path d="M0 48 L18 44 L35 45 L52 35 L70 38 L88 25 L104 31 L122 18 L140 21 L158 5 L170 12" fill="none" stroke="#ff2424" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  suffix,
  subtitle,
  accent = 'red',
  href,
  onClick,
  children,
  strongStyle,
  spanStyle,
}: {
  icon: IconComponent;
  title: string;
  value?: number | string | null;
  suffix?: string;
  subtitle: string;
  accent?: 'red' | 'gold';
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  strongStyle?: React.CSSProperties;
  spanStyle?: React.CSSProperties;
}) {
  const renderValue = () => {
    if (value === undefined) return null;
    if (value === null) {
      return <span style={{ fontSize: '15px', color: 'var(--red, #ff2424)', fontWeight: 600, ...spanStyle }}>Data sedang diverifikasi</span>;
    }
    if (typeof value === 'string') {
      return <span style={{ fontSize: '15px', color: 'var(--red, #ff2424)', fontWeight: 600, ...spanStyle }}>{value}</span>;
    }
    return <AnimatedNumber value={value} suffix={suffix} />;
  };

  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`stat-card ${accent} stat-card-link`}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', position: 'relative' }}
    >
      <div className="stat-top" style={{ zIndex: 2, position: 'relative' }}>
        <span className="stat-icon"><Icon size={25} /></span>
        <div className="stat-info">
          <small>{title}</small>
          {value !== undefined && <strong style={{ color: '#ffffff', ...strongStyle }}>{renderValue()}</strong>}
          <span className="stat-subtitle">
            {subtitle}
          </span>
        </div>
      </div>
      {children}
    </a>
  );
}

function computeActiveMemberCount(firestoreItems: any[] = []): number {
  const isCleared = localStorage.getItem('skata_members_is_cleared') === 'true';
  if (isCleared) return 0;

  let localMembers: any[] = [];
  try {
    const stored = localStorage.getItem('skata_total_active_members');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localMembers = parsed;
      }
    }
  } catch {}

  let mappedFirestore: any[] = [];
  if (firestoreItems && firestoreItems.length > 0) {
    mappedFirestore = firestoreItems.map((f: any, index: number) => ({
      id: f.id || `FS-${index}`,
      nik: f.nik || `100020${26 + index}`,
      fullName: f.fullName || f.name || f.nama || f.namaLengkap || 'Anggota SKATA',
      unit: f.unit || 'Unit Kerja Umum',
      workLocation: f.workLocation || f.dpc || f.dpw || 'Kantor Pusat / FM',
      status: f.status || 'Anggota Aktif',
      dpw: f.dpw || (f.workLocation?.toUpperCase().includes('PUSAT') ? 'DPP' : 'DPW 1'),
      position: f.position || '',
      corpEmail: f.corpEmail || '',
      phone: f.phone || ''
    }));
  }

  const combined = [...mappedFirestore, ...localMembers];
  const deduplicated = deduplicateMembers(combined);
  return deduplicated.length;
}

function useActiveMemberCount() {
  const [count, setCount] = useState<number | null>(() => computeActiveMemberCount());

  useEffect(() => {
    const syncCount = () => {
      setCount(computeActiveMemberCount());
    };

    syncCount();

    const unsubscribe = subscribeMemberships((firestoreItems) => {
      setCount(computeActiveMemberCount(firestoreItems));
    });

    window.addEventListener('storage', syncCount);
    window.addEventListener('skata_members_updated', syncCount);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', syncCount);
      window.removeEventListener('skata_members_updated', syncCount);
    };
  }, []);

  return count;
}

function ExecutiveDashboard({ navigate }: { navigate: (path: string) => void }) {
  const activeMemberCount = useActiveMemberCount();

  return (
    <section className="dashboard-stage" aria-label="Dashboard ringkas SKATA">
      <div className="container dashboard-panel">
        <StatCard
          icon={UsersRound}
          title="Total Anggota Aktif"
          value={activeMemberCount}
          suffix=" Anggota"
          subtitle="Terdaftar secara sistem"
          href="/layanan/keanggotaan"
          onClick={() => navigate('/layanan/keanggotaan')}
          spanStyle={{ color: '#fffdfd' }}
        >
          <MiniLineChart />
        </StatCard>
        <StatCard
          icon={Building2}
          title="Total DPW"
          value={organizationProfile.dpwCount}
          suffix=" Wilayah"
          subtitle="Tersebar di seluruh Indonesia"
          accent="gold"
          href="/tentang/dpw"
          onClick={() => navigate('/tentang/dpw')}
          strongStyle={{ color: '#f9f0f0' }}
        >
          <DotMap tone="gold" />
        </StatCard>
        <StatCard
          icon={Send}
          title="Aspirasi Tersampaikan"
          value={4}
          suffix=" Aspirasi"
          subtitle="Ditinjau oleh pengurus"
          accent="gold"
          href="/aspirasi"
          onClick={() => navigate('/aspirasi')}
          strongStyle={{ color: '#ffffff' }}
        >
          <div className="progress-row"><span /><strong>100%</strong></div>
        </StatCard>
        <a
          href="/berita"
          onClick={(e) => {
            e.preventDefault();
            navigate('/berita');
          }}
          className="stat-card red action-card"
        >
          <div className="stat-top">
            <span className="stat-icon"><CalendarDays size={25} /></span>
            <div><small>Agenda Terdekat</small><strong style={{ color: '#ffffff', fontSize: '18px' }}>Penyusunan Program Kerja</strong></div>
          </div>
          <p>Penyusunan Program Kerja SKATA</p>
        </a>
      </div>
    </section>
  );
}

function getCategoryBadgeStyle(category?: string) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('utama') || cat.includes('headline')) {
    return {
      bg: 'linear-gradient(135deg, #e51b23 0%, #dc2626 100%)',
      color: '#ffffff',
      shadow: '0 4px 12px rgba(229, 27, 35, 0.4)',
      border: 'rgba(255,255,255,0.3)'
    };
  } else if (cat.includes('agenda') || cat.includes('kegiatan')) {
    return {
      bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: '#ffffff',
      shadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
      border: 'rgba(255,255,255,0.3)'
    };
  } else if (cat.includes('organisasi') || cat.includes('serikat')) {
    return {
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: '#ffffff',
      shadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
      border: 'rgba(255,255,255,0.3)'
    };
  } else if (cat.includes('pengumuman') || cat.includes('info')) {
    return {
      bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      color: '#ffffff',
      shadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
      border: 'rgba(255,255,255,0.3)'
    };
  }
  return {
    bg: 'linear-gradient(135deg, #e51b23 0%, #b91c1c 100%)',
    color: '#ffffff',
    shadow: '0 4px 12px rgba(229, 27, 35, 0.35)',
    border: 'rgba(255,255,255,0.25)'
  };
}

function SorotanSKATA({ navigate }: { navigate: (path: string) => void }) {
  const { isSuperAdmin } = useAuth();
  const [articles, setArticles] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('skata_news_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    const unsubscribe = subscribeNewsArticles((items) => {
      setArticles(items);
      safeSetLocalStorage('skata_news_articles', items);
    });
    return () => unsubscribe();
  }, []);

  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="sorotan-section container" style={{ margin: '40px auto 48px' }}>
      <div
        className="section-header"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(229, 27, 35, 0.08)',
              border: '1px solid rgba(229, 27, 35, 0.2)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#e51b23',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#e51b23',
                boxShadow: '0 0 8px #e51b23'
              }}
            />
            KABAR & AGENDA SERIKAT
          </div>
          <h2 className="section-title" style={{ paddingTop: '2px', fontSize: '28px', fontWeight: 900, margin: 0 }}>
            SOROTAN SKATA
          </h2>
          <p className="section-subtitle" style={{ margin: '6px 0 0', fontSize: '14.5px', color: '#64748b' }}>
            Informasi, agenda, dan perkembangan terbaru Serikat Karyawan GSD.
          </p>
        </div>
        <button
          className="button outline"
          onClick={() => navigate('/berita')}
          style={{
            fontSize: '13px',
            fontWeight: 750,
            padding: '8px 18px',
            borderRadius: '30px',
            border: '1.5px solid #e51b23',
            color: '#e51b23',
            background: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Lihat Semua Berita <ChevronRight size={15} />
        </button>
      </div>

      {articles.length === 0 ? (
        <div
          style={{
            padding: '44px 24px',
            textAlign: 'center',
            background: 'linear-gradient(145deg, rgba(229,27,35,0.03), rgba(0,0,0,0.01))',
            border: '1px dashed rgba(229,27,35,0.25)',
            borderRadius: '24px',
            margin: '16px 0 24px'
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📰</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
            Belum Ada Berita Terpublikasi
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#64748b',
              margin: '0 0 18px',
              maxWidth: '540px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            Seluruh berita, kabar, dan agenda yang ditulis dan diterbitkan melalui Laman Berita akan otomatis
            ditampilkan sebagai sorotan utama di sini.
          </p>
          <button
            className="button primary"
            onClick={() => navigate('/berita')}
            style={{
              fontSize: '13.5px',
              padding: '10px 22px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #e51b23 0%, #c1121f 100%)',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 6px 18px rgba(229,27,35,0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isSuperAdmin ? (
              <>
                <PenSquare size={16} /> Tulis Berita Baru di Laman Berita
              </>
            ) : (
              <>
                <Newspaper size={16} /> Lihat Semua Berita di Laman Berita
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="sorotan-grid">
          {/* Left Featured Article */}
          {featured && (
            <div
              className="sorotan-left"
              style={
                sideArticles.length === 0
                  ? { gridColumn: 'span 12', maxWidth: '880px', margin: '0 auto', width: '100%' }
                  : undefined
              }
            >
              <div className="editorial-featured-card-vibrant" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden' }}>
                  <img
                    src={featured.image || '/assets/skata-hero-visual.png'}
                    alt={featured.title}
                    className="featured-img-zoom"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/skata-hero-visual.png';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                  {/* Category Pill */}
                  {(() => {
                    const b = getCategoryBadgeStyle(featured.category);
                    return (
                      <span
                        style={{
                          position: 'absolute',
                          top: '18px',
                          left: '18px',
                          background: b.bg,
                          color: b.color,
                          padding: '6px 16px',
                          fontSize: '12px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          borderRadius: '30px',
                          boxShadow: b.shadow,
                          border: `1px solid ${b.border}`
                        }}
                      >
                        {featured.category || 'Berita Utama'}
                      </span>
                    );
                  })()}
                  {/* Top Right Beacon Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Sparkles size={12} color="#f59e0b" /> SOROTAN UTAMA
                  </span>
                </div>

                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                  <time
                    style={{
                      fontSize: '13px',
                      color: '#e51b23',
                      fontWeight: 750,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CalendarDays size={14} /> {featured.date || 'Terkini'} — DPP SKATA GSD
                  </time>
                  <h3
                    style={{
                      fontSize: '22px',
                      fontWeight: 850,
                      lineHeight: '1.35',
                      margin: 0,
                      color: 'var(--text-main, #0f172a)'
                    }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14.5px',
                      lineHeight: '1.65',
                      color: '#475569',
                      margin: 0,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {featured.excerpt || featured.body}
                  </p>
                  <div style={{ paddingTop: '8px' }}>
                    <a
                      href={`/berita?id=${featured.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/berita?id=${featured.id}`);
                      }}
                      className="read-more-btn-pill"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 22px',
                        background: 'linear-gradient(135deg, #e51b23 0%, #c1121f 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '13.5px',
                        borderRadius: '50px',
                        boxShadow: '0 6px 18px rgba(229, 27, 35, 0.3)',
                        textDecoration: 'none',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Baca Selengkapnya <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side Articles */}
          {sideArticles.length > 0 && (
            <div className="sorotan-right" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sideArticles.map((item, index) => {
                const bStyle = getCategoryBadgeStyle(item.category);
                return (
                  <a
                    key={`side-art-${item.id || index}-${index}`}
                    href={`/berita?id=${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/berita?id=${item.id}`);
                    }}
                    className="editorial-small-card-vibrant"
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '110px',
                        height: '92px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}
                    >
                      <img
                        src={item.image || '/assets/skata-hero-visual.png'}
                        alt={item.title}
                        className="small-card-img-zoom"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/skata-hero-visual.png';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: bStyle.bg,
                            color: '#ffffff',
                            letterSpacing: '0.03em'
                          }}
                        >
                          {item.category || 'Berita'}
                        </span>
                        <time style={{ fontSize: '12px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarDays size={12} /> {item.date}
                        </time>
                      </div>
                      <h4
                        style={{
                          fontSize: '15px',
                          fontWeight: 800,
                          color: 'var(--text-main, #0f172a)',
                          lineHeight: '1.4',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <div className="arrow-hover-indicator" style={{ color: '#94a3b8', transition: 'transform 0.2s ease, color 0.2s ease' }}>
                      <ChevronRight size={18} />
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function InspirasiBanner() {
  const quoteText =
    'Kesejahteraan bukanlah hadiah dari belas kasihan, melainkan hasil perjuangan kolektif yang terorganisir dengan profesionalisme dan integritas.';
  const authorText = 'Dewan Pengurus Pusat SKATA';

  const runningItems = [
    'Kesejahteraan bukanlah hadiah dari belas kasihan, melainkan hasil perjuangan kolektif yang terorganisir dengan profesionalisme dan integritas.',
    'SOLIDARITAS • INTEGRITAS • KESEJAHTERAAN • PROFESIONALISME',
    'SERIKAT KARYAWAN PT GRAHA SARANA DUTA (SKATA) PERIODE 2026–2028'
  ];

  return (
    <section className="inspirasi-section container" style={{ margin: '40px auto 52px' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0b0f19 0%, #151d2a 50%, #080b12 100%)',
          border: '1px solid rgba(229, 27, 35, 0.3)',
          boxShadow: '0 20px 45px -15px rgba(229, 27, 35, 0.25), 0 10px 30px rgba(0, 0, 0, 0.35)',
          padding: '36px 32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Top glowing accent border line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #e51b23 0%, #f59e0b 50%, #e51b23 100%)',
            zIndex: 10
          }}
        />

        {/* Background Decorative Large Watermark Quote Icon */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            bottom: '16px',
            opacity: 0.05,
            pointerEvents: 'none',
            color: '#e51b23'
          }}
        >
          <Quote size={180} />
        </div>

        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 18px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(229, 27, 35, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)',
              border: '1px solid rgba(229, 27, 35, 0.4)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(229, 27, 35, 0.2)'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#e51b23',
                color: '#ffffff'
              }}
            >
              <Quote size={12} />
            </span>
            INSPIRASI & PERJUANGAN
          </div>

          <span
            style={{
              fontSize: '12px',
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} color="#f59e0b" /> PESAN DPP SKATA
          </span>
        </div>

        {/* Main Quote Content (Substantial Vertical Space) */}
        <div style={{ position: 'relative', zIndex: 2, padding: '8px 4px' }}>
          <p
            style={{
              fontSize: '21px',
              fontWeight: 700,
              lineHeight: '1.6',
              color: '#f8fafc',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              margin: '0 0 16px',
              maxWidth: '960px'
            }}
          >
            "{quoteText}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '2px', background: '#e51b23' }} />
            <cite
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#f59e0b',
                fontStyle: 'normal',
                letterSpacing: '0.04em'
              }}
            >
              — {authorText}
            </cite>
          </div>
        </div>

        {/* Bottom Running Text Marquee Strip */}
        <div
          className="marquee-container"
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: '8px',
            background: 'rgba(15, 23, 42, 0.65)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            padding: '12px 0',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Edge gradient masks */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '32px',
              background: 'linear-gradient(to right, #0b0f19, transparent)',
              zIndex: 4,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '32px',
              background: 'linear-gradient(to left, #0b0f19, transparent)',
              zIndex: 4,
              pointerEvents: 'none'
            }}
          />

          <div
            className="marquee-track"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              animation: 'marqueeScroll 32s linear infinite',
              gap: '0'
            }}
          >
            {[1, 2, 3].map((loopIdx) => (
              <div
                key={`marquee-loop-${loopIdx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '24px',
                  paddingRight: '48px'
                }}
              >
                {runningItems.map((item, itemIdx) => (
                  <React.Fragment key={`mitem-${loopIdx}-${itemIdx}`}>
                    <span style={{ color: '#e51b23', fontSize: '14px', fontWeight: 'bold' }}>✦</span>
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="footer-shell">
      <div className="container footer-panel">
        <div className="footer-brand-column">
          <div className="footer-brand">
            <OfficialSkataLogo className="footer-logo" />
            <SkataWordmark size="md" />
          </div>
          <p className="footer-brand-desc">
            Wadah pemersatu seluruh karyawan GSD untuk memperjuangkan hak, meningkatkan kesejahteraan, dan membangun
            hubungan industrial yang harmonis.
          </p>
        </div>

        <div className="footer-links-column">
          <h3>Profil & Informasi</h3>
          <ul>
            <li>
              <a
                href="/tentang"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tentang');
                }}
              >
                Tentang SKATA
              </a>
            </li>
            <li>
              <a
                href="/tentang"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tentang');
                }}
              >
                Visi & Misi
              </a>
            </li>
            <li>
              <a
                href="/tentang?section=struktur-organisasi"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tentang?section=struktur-organisasi');
                }}
              >
                Struktur Organisasi
              </a>
            </li>
            <li>
              <a
                href="/layanan/download"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/layanan/download');
                }}
              >
                Anggaran Dasar
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links-column">
          <h3>Layanan Anggota</h3>
          <ul>
            <li>
              <a
                href="/layanan/e-kta"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/layanan/e-kta');
                }}
              >
                Kartu Anggota (e-KTA)
              </a>
            </li>
            <li>
              <a
                href="/layanan/advokasi"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/layanan/advokasi');
                }}
              >
                Advokasi Hukum
              </a>
            </li>
            <li>
              <a
                href="/layanan/program-kerja"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/layanan/program-kerja');
                }}
              >
                Program Kerja
              </a>
            </li>
            <li>
              <a
                href="/layanan/download"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/layanan/download');
                }}
              >
                Unduh Regulasi
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links-column">
          <h3>Hubungi Kami</h3>
          <p className="footer-contact">
            <strong>Sekretariat DPP SKATA</strong>
            <br />
            Ruang Merapi Gedung Menara Multimedia
            <br />
            Jl. Kebon Sirih No.10 11, RT.11/RW.2, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110
            <br />
            <span className="contact-item">Email: dppskata@gmail.com</span>
            <br />
            <span className="contact-item">Telepon: +62 853-3284-4752 (Wisnu) | +62 812-8346-6000 (Alya)</span>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-panel">
          <p>&copy; {new Date().getFullYear()} SKATA GSD. Hak Cipta Dilindungi.</p>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Kebijakan Privasi
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose} style={{ zIndex: 9999 }}>
      <div
        style={{ width: '100%', maxWidth: '1080px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '28px', position: 'relative' }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          aria-label="Tutup"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100, background: 'rgba(255,255,255,0.9)', color: '#0f172a', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        >
          <X size={20} />
        </button>
        <LoginPage onSuccess={onClose} onBack={onClose} />
      </div>
    </div>
  );
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate('/');
  };

  // Intercept normal local link click events to enable seamless single-page routing
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === 'function') {
        const anchor = target.closest('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          const isDownload = anchor.hasAttribute('download');
          const isTargetBlank = anchor.getAttribute('target') === '_blank';
          const isStaticFile = href && (href.startsWith('/assets/') || href.match(/\.(pdf|png|jpe?g|svg|zip|docx?|xlsx?)$/i));

          if (href && href.startsWith('/') && !href.startsWith('//') && !isDownload && !isTargetBlank && !isStaticFile) {
            e.preventDefault();
            navigate(href);
          }
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Private Portal Guard: If not logged in, force Login Page for all routes
  if (!isLoggedIn) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <LoginPage onSuccess={() => navigate('/')} />
      </main>
    );
  }

  // Routing Switch
  const renderContent = () => {
    const fullPath = currentPath.toLowerCase();
    const path = fullPath.split('?')[0];


    // Beranda
    if (path === '/' || path === '/beranda' || path === '') {
      return (
        <>
          <HeroSection navigate={navigate} />
          <ExecutiveDashboard navigate={navigate} />
          <SorotanSKATA navigate={navigate} />
          <InspirasiBanner />
        </>
      );
    }

    // Tentang SKATA Routes
    if (path === '/tentang' || path === '/tentang/profil') {
      return <ProfilSKATA onBack={handleBack} />;
    }
    if (path === '/tentang/visi-misi') {
      return <VisiMisi onBack={handleBack} />;
    }
    if (path === '/tentang/struktur' || path === '/tentang/struktur-organisasi') {
      return <StrukturOrganisasi onBack={handleBack} navigate={navigate} />;
    }
    if (path === '/tentang/pengurus-dpp') {
      return <PengurusDPP onBack={handleBack} />;
    }
    if (path.startsWith('/tentang/dpw/')) {
      const parts = currentPath.split('/');
      const selectedId = parts[parts.length - 1];
      return <DPWPage onBack={handleBack} selectedId={selectedId} navigate={navigate} />;
    }
    if (path === '/tentang/dpw') {
      return <DPWPage onBack={handleBack} navigate={navigate} />;
    }
    if (path === '/tentang/dpc') {
      return <DPCPage onBack={handleBack} />;
    }
    if (path === '/tentang/dokumen') {
      return <DokumenPage onBack={handleBack} />;
    }

    // Layanan Anggota Routes
    if (path === '/layanan/sahabat-skata' || path === '/sahabat-skata') {
      return <SahabatSkataChat mode="standalone" onBack={handleBack} />;
    }
    if (path === '/layanan/total-anggota' || path === '/total-anggota') {
      return <KeanggotaanPage onBack={handleBack} defaultTab="total" />;
    }
    if (path === '/layanan/keanggotaan' || path === '/layanan/pendaftaran') {
      return <KeanggotaanPage onBack={handleBack} defaultTab="total" />;
    }
    if (path === '/layanan/e-kta') {
      return <EKtaPage onBack={handleBack} />;
    }
    if (path === '/layanan/keuangan') {
      return <KeuanganPage onBack={handleBack} />;
    }
    if (path === '/layanan/program-kerja') {
      return <ProgramKerja onBack={handleBack} />;
    }
    if (path === '/layanan/advokasi') {
      return <AdvokasiPage onBack={handleBack} />;
    }
    if (path === '/layanan/pelatihan') {
      return <PelatihanPage onBack={handleBack} />;
    }
    if (path === '/layanan/kesejahteraan') {
      return <KesejahteraanPage onBack={handleBack} />;
    }
    if (path === '/layanan/download') {
      return <DokumenPage onBack={handleBack} />;
    }
    if (path === '/layanan/koperasi') {
      return <KoperasiPage onBack={handleBack} />;
    }
    if (path === '/layanan/survey') {
      return <SurveyPage onBack={handleBack} />;
    }

    // Aspirasi Routes
    if (path === '/aspirasi') {
      return <AspirasiPage onBack={handleBack} navigate={navigate} />;
    }
    if (path === '/aspirasi/baru') {
      return <AspirasiPage onBack={handleBack} subpath="baru" navigate={navigate} />;
    }
    if (path === '/aspirasi/lacak') {
      return <AspirasiPage onBack={handleBack} subpath="lacak" navigate={navigate} />;
    }
    if (path === '/aspirasi/faq') {
      return <AspirasiPage onBack={handleBack} subpath="faq" navigate={navigate} />;
    }

    // Other core pages
    if (path === '/berita') {
      return <BeritaPage onBack={handleBack} />;
    }
    if (path === '/kontak') {
      return <KontakPage onBack={handleBack} />;
    }
    if (path === '/login') {
      return <LoginPage onBack={handleBack} />;
    }

    // Fallback 404 Page
    return <Branded404 onBack={handleBack} />;
  };

  return (
    <>
      <Navbar currentPath={currentPath} navigate={navigate} onLogin={() => navigate('/login')} />
      {currentPath !== '/' && currentPath !== '/beranda' && currentPath !== '' && (
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '0px' }}>
          <Breadcrumbs path={currentPath} navigate={navigate} />
        </div>
      )}
      <main style={{ minHeight: '600px' }}>{renderContent()}</main>
      <Footer navigate={navigate} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Floating Sahabat SKATA AI Widget */}
      {currentPath !== '/layanan/sahabat-skata' && currentPath !== '/sahabat-skata' && (
        <>
          {isChatOpen ? (
            <SahabatSkataChat mode="widget" onClose={() => setIsChatOpen(false)} />
          ) : (
            <button
              className="skata-floating-launcher"
              onClick={() => setIsChatOpen(true)}
              title="Tanya Sahabat SKATA AI"
            >
              <div className="skata-floating-launcher-icon">
                <Bot size={22} />
                <span className="skata-launcher-badge" />
              </div>
              <span>Sahabat SKATA AI</span>
            </button>
          )}
        </>
      )}
    </>
  );
}
