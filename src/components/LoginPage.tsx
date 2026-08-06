import { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck, CheckCircle, LogOut, KeyRound, Building2, User, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { PRESET_ACCOUNTS, ROLE_LABELS, setActiveSession, logoutUser, UserRole, UserSession } from '../lib/authService';

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { user, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDpwIdx, setSelectedDpwIdx] = useState(0);

  // Group preset accounts
  const superAdminAccount = PRESET_ACCOUNTS.find(a => a.role === 'superadmin')!;
  const dppAccount = PRESET_ACCOUNTS.find(a => a.role === 'dpp')!;
  const dpwAccounts = PRESET_ACCOUNTS.filter(a => a.role === 'dpw');
  const guestAccount = PRESET_ACCOUNTS.find(a => a.role === 'guest')!;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      const match = PRESET_ACCOUNTS.find(a => a.email.toLowerCase() === email.trim().toLowerCase() && a.pass === password);
      
      if (match) {
        const session: UserSession = {
          uid: `user_${match.nik}`,
          name: match.name,
          email: match.email,
          nik: match.nik,
          role: match.role,
          dpwRegion: match.dpwRegion,
          position: match.position,
          loginAt: new Date().toISOString()
        };
        setActiveSession(session);
      } else {
        // Fallback for custom user input
        const session: UserSession = {
          uid: `user_custom_${Date.now()}`,
          name: email.split('@')[0] || 'Pengguna SKATA',
          email,
          role: 'dpp', // default to dpp for tested custom inputs
          position: 'Pengurus Terdaftar',
          loginAt: new Date().toISOString()
        };
        setActiveSession(session);
      }
    }, 500);
  };

  const loginAsPreset = (account: typeof PRESET_ACCOUNTS[0]) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const session: UserSession = {
        uid: `user_${account.nik}`,
        name: account.name,
        email: account.email,
        nik: account.nik,
        role: account.role,
        dpwRegion: account.dpwRegion,
        position: account.position,
        loginAt: new Date().toISOString()
      };
      setActiveSession(session);
    }, 300);
  };

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button
        className="back-link"
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--red, #ff2424)',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </button>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: '#ffebeb', color: '#e51b23', fontWeight: 700, fontSize: '12px', marginBottom: '12px' }}>
          <ShieldCheck size={14} /> Sistem Autentikasi Multilevel
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#111' }}>
          Portal Otorisasi & Hak Akses
        </h1>
        <p style={{ fontSize: '15px', color: '#666', marginTop: '6px', maxWidth: '720px' }}>
          SKATA Digital Portal menyediakan 4 tingkat otorisasi bertingkat (<strong>Guest, Pengurus DPW, Pengurus DPP, dan Super Admin</strong>) untuk keamanan dan kelancaran tata kelola organisasi.
        </p>
      </div>

      {/* Active Session Alert Banner if Logged In */}
      {isLoggedIn && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sesi Login Aktif</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{user.name} ({user.position})</div>
              <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Email: <strong>{user.email}</strong></span>
                <span>•</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', background: ROLE_LABELS[user.role].bg, color: ROLE_LABELS[user.role].color, fontWeight: 800 }}>
                  Peran: {ROLE_LABELS[user.role].label}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logoutUser()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid #fca5a5',
              background: '#fff',
              color: '#dc2626',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} /> Keluar & Jadi Guest
          </button>
        </div>
      )}

      {/* Grid: Role Selectors & Manual Login */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>

        {/* 1. Super Admin Card */}
        <div style={{ background: '#fff', border: '1.5px solid #e9d5ff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(107, 33, 168, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#f3e8ff', color: '#6b21a8', fontWeight: 800, fontSize: '12px' }}>
                <Shield size={14} /> LEVEL 1: SUPER ADMIN
              </span>
              <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700 }}>Akses Penuh</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Super Admin</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
              Master Administrator dengan hak akses penuh ke seluruh database, konfigurasi sistem, kelola akun pengurus, dan otorisasi portal.
            </p>
            <div style={{ fontSize: '12px', background: '#faf5ff', border: '1px solid #f3e8ff', padding: '10px 12px', borderRadius: '8px', color: '#581c87', marginBottom: '20px' }}>
              🔑 <strong>Kredensial:</strong> admin@skata-gsd.or.id / admin2026
            </div>
          </div>

          <button
            className="button primary w-full"
            onClick={() => loginAsPreset(superAdminAccount)}
            style={{ background: 'linear-gradient(135deg, #7e22ce, #6b21a8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Sparkles size={16} /> Masuk sebagai Super Admin
          </button>
        </div>

        {/* 2. Pengurus DPP Card */}
        <div style={{ background: '#fff', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(229, 27, 35, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', fontWeight: 800, fontSize: '12px' }}>
                <Building2 size={14} /> LEVEL 2: PENGURUS DPP
              </span>
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>Pusat</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Pengurus DPP (Pusat)</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
              Dewan Pengurus Pusat untuk pengelolaan nasional: rilis berita utama, approval data anggota nasional, pendaftaran e-KTA, & respon aspirasi.
            </p>
            <div style={{ fontSize: '12px', background: '#fff5f5', border: '1px solid #fee2e2', padding: '10px 12px', borderRadius: '8px', color: '#991b1b', marginBottom: '20px' }}>
              🔑 <strong>Kredensial:</strong> dpp@skata-gsd.or.id / dpp2026
            </div>
          </div>

          <button
            className="button primary w-full"
            onClick={() => loginAsPreset(dppAccount)}
            style={{ background: 'linear-gradient(135deg, #e51b23, #b91c1c)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Building2 size={16} /> Masuk sebagai Pengurus DPP
          </button>
        </div>

        {/* 3. Pengurus DPW Card */}
        <div style={{ background: '#fff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(29, 78, 216, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 800, fontSize: '12px' }}>
                <User size={14} /> LEVEL 3: PENGURUS DPW
              </span>
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>Wilayah 1 - 5</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Pengurus DPW (Wilayah)</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '12px' }}>
              Dewan Pengurus Wilayah untuk verifikasi data anggota regional & penulisan kabar daerah.
            </p>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Pilih Wilayah DPW:
            </label>
            <select
              value={selectedDpwIdx}
              onChange={(e) => setSelectedDpwIdx(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', marginBottom: '16px', background: '#f8fafc', fontWeight: 600 }}
            >
              {dpwAccounts.map((acc, idx) => (
                <option key={idx} value={idx}>{acc.dpwRegion} ({acc.name})</option>
              ))}
            </select>
          </div>

          <button
            className="button primary w-full"
            onClick={() => loginAsPreset(dpwAccounts[selectedDpwIdx])}
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ChevronRight size={16} /> Masuk sebagai Pengurus {dpwAccounts[selectedDpwIdx].dpwRegion?.split(' ')[0]} {dpwAccounts[selectedDpwIdx].dpwRegion?.split(' ')[1]}
          </button>
        </div>

        {/* 4. Guest / Tamu Card */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '12px' }}>
                <User size={14} /> LEVEL 4: GUEST / TAMU
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Publik</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Guest / Anggota Umum</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
              Akses bebas untuk seluruh karyawan & publik untuk membaca AD/ART, PKB V, e-KTA digital, Sahabat SKATA AI, dan mengisi formulir pendaftaran/aspirasi.
            </p>
            <div style={{ fontSize: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '8px', color: '#334155', marginBottom: '20px' }}>
              🌐 Mode default tanpa perlu login
            </div>
          </div>

          <button
            className="button outline w-full"
            onClick={() => loginAsPreset(guestAccount)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <User size={16} /> Masuk sebagai Guest / Tamu
          </button>
        </div>

      </div>

      {/* Manual Custom Login Form Section */}
      <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '32px', marginBottom: '40px', maxWidth: '640px', marginInline: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#ffebeb', color: '#e51b23', marginBottom: '12px' }}>
            <KeyRound size={24} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: 0 }}>Login dengan Email & Kata Sandi</h3>
          <p style={{ fontSize: '13.5px', color: '#666', marginTop: '4px' }}>Gunakan alamat email resmi terdaftar Anda untuk otorisasi otomatis.</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleManualLogin}>
          <div style={{ display: 'grid', gap: '16px' }} className="form-fields">
            <label>
              Alamat Email Terdaftar
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="admin@skata-gsd.or.id / dpp@skata-gsd.or.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}><Mail size={16} /></span>
              </div>
            </label>

            <label>
              Kata Sandi
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}><Lock size={16} /></span>
              </div>
            </label>
          </div>

          <button type="submit" className="button primary w-full" style={{ marginTop: '24px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Mengautentikasi Sesi...' : 'Masuk Portal Organisasi'}
          </button>
        </form>
      </div>

      {/* Role Authorization Matrix Table */}
      <div style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} style={{ color: '#e51b23' }} /> Matriks Hak Akses & Fitur Otorisasi
        </h3>
        <p style={{ fontSize: '13.5px', color: '#666', marginBottom: '20px' }}>
          Berikut pemetaan lengkap wewenang dan cakupan fitur untuk masing-masing peran di Portal SKATA:
        </p>

        <div className="table-responsive">
          <table className="premium-table" style={{ fontSize: '13px', width: '100%', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '12px' }}>Modul / Fitur Portal</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Guest / Tamu</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Pengurus DPW</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Pengurus DPP</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Super Admin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Membaca Berita, AD/ART & PKB V</strong></td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
              </tr>
              <tr>
                <td><strong>Konsultasi Sahabat SKATA AI</strong></td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Ya</td>
              </tr>
              <tr>
                <td><strong>Melihat Daftar Total Anggota Aktif</strong></td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Lihat Publik</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Filter Wilayah</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Nasional Full</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Nasional Full</td>
              </tr>
              <tr>
                <td><strong>Tambah & Edit Anggota Aktif / Import Excel</strong></td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>❌ Tidak</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Anggota Wilayah</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Semua Anggota</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Full Master</td>
              </tr>
              <tr>
                <td><strong>Menulis & Publikasi Berita Baru</strong></td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>❌ Tidak</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Berita Regional</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Berita Nasional</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Full Edit/Delete</td>
              </tr>
              <tr>
                <td><strong>Respon & Kelola Aspirasi Anggota</strong></td>
                <td style={{ textAlign: 'center', color: '#64748b' }}>📩 Kirim Saja</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Aspirasi Wilayah</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Semua Aspirasi</td>
                <td style={{ textAlign: 'center', color: '#16a34a' }}>✅ Full Master</td>
              </tr>
              <tr>
                <td><strong>Manajemen Akun Pengurus & Reset Database</strong></td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>❌ Tidak</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>❌ Tidak</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>❌ Tidak</td>
                <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>👑 KHUSUS SUPER ADMIN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
