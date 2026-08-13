import { useState } from 'react';
import { Lock, Mail, ShieldCheck, CheckCircle, LogOut, KeyRound, ArrowRight, Eye, EyeOff, Megaphone, Sparkles, Building2, Shield, Users, Award, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { PRESET_ACCOUNTS, setActiveSession, logoutUser, UserSession, getCustomPassword } from '../lib/authService';
import { SKATA_LOGO_BASE64 } from '../assets/logoBase64';
import { SkataWordmark } from './SkataWordmark';

interface LoginPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function LoginPage({ onBack, onSuccess }: LoginPageProps) {
  const { user, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [logoSrc, setLogoSrc] = useState(SKATA_LOGO_BASE64);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanedEmail = email.trim().toLowerCase();
      const customPass = getCustomPassword();
      const match = PRESET_ACCOUNTS.find(a => 
        a.email.toLowerCase() === cleanedEmail && 
        (customPass ? password === customPass || password === a.pass : password === a.pass)
      );
      
      if (match) {
        const session: UserSession = {
          uid: `user_${match.nik}`,
          name: match.name,
          email: match.email,
          nik: match.nik,
          role: match.role,
          dpwRegion: match.dpwRegion || 'DPP SKATA Pusat - Jakarta',
          position: match.position || 'Super Administrator & Pengurus Pusat',
          unitName: match.unitName || 'Sekretariat DPP SKATA GSD',
          office: match.office || 'Gedung Graha Sarana Duta Pusat (Telkom Property)',
          phone: match.phone || '0811-9922-3847',
          membershipStatus: match.membershipStatus || 'Anggota Aktif Terverifikasi (Pengurus DPP)',
          loginAt: new Date().toISOString()
        };
        setActiveSession(session);
        if (onSuccess) onSuccess();
        else if (onBack) onBack();
      } else {
        const emailMatch = PRESET_ACCOUNTS.find(a => a.email.toLowerCase() === cleanedEmail);
        if (emailMatch) {
          setErrorMsg('Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.');
        } else {
          setErrorMsg('Email tidak terdaftar atau kata sandi tidak cocok. Silakan periksa kembali email dan kata sandi Anda.');
        }
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #31102f 65%, #180816 100%)', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229, 27, 35, 0.25) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* TOP RUNNING TEXT BANNER */}
      <div className="skata-running-text-bar">
        <div className="skata-running-text-label">
          <Megaphone size={14} /> Pengumuman Portal
        </div>
        <div className="skata-running-text-overflow">
          <div className="skata-running-text-track">
            <span>
              📢 <strong>Selamat datang di Portal Komunikasi SKATA</strong> — Wadah pemersatu seluruh karyawan GSD untuk memperjuangkan hak, meningkatkan kesejahteraan, dan membangun hubungan industrial yang harmonis. ✊ <em>Bersatu, Berkarya, Sejahtera!</em> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span>
              📢 <strong>Selamat datang di Portal Komunikasi SKATA</strong> — Wadah pemersatu seluruh karyawan GSD untuk memperjuangkan hak, meningkatkan kesejahteraan, dan membangun hubungan industrial yang harmonis. ✊ <em>Bersatu, Berkarya, Sejahtera!</em> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span>
              📢 <strong>Selamat datang di Portal Komunikasi SKATA</strong> — Wadah pemersatu seluruh karyawan GSD untuk memperjuangkan hak, meningkatkan kesejahteraan, dan membangun hubungan industrial yang harmonis. ✊ <em>Bersatu, Berkarya, Sejahtera!</em> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* TOP BAR / NAVIGATION */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 5 }}>
        {onBack ? (
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
        ) : (
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); if (onBack) onBack(); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <img
              src={logoSrc}
              alt="SKATA"
              style={{ height: '40px', width: 'auto', maxWidth: '36px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }}
              onError={() => {
                if (logoSrc === SKATA_LOGO_BASE64) setLogoSrc('/skata-logo-official.png');
              }}
            />
            <SkataWordmark size="sm" className="login-skata-wordmark" />
          </a>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 800, color: '#fecdd3', background: 'rgba(229, 27, 35, 0.15)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(229, 27, 35, 0.3)' }}>
          <Sparkles size={14} style={{ color: '#fbbf24' }} /> PORTAL RESMI SKATA 2026
        </div>
      </div>

      {/* MAIN CONTAINER / DUAL PANEL CARD */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px 60px', zIndex: 5 }}>
        <div
          style={{
            width: '100%',
            maxWidth: '1040px',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* LEFT PANEL: HERO & BRANDING */}
          <div
            style={{
              padding: '44px 36px',
              background: 'linear-gradient(145deg, #e51b23 0%, #b91c1c 45%, #831843 80%, #450a0a 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient pattern overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.18)', padding: '10px 20px', borderRadius: '50px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
                <img
                  src={logoSrc}
                  alt="Logo resmi SKATA — Serikat Karyawan GSD"
                  style={{ height: '46px', width: 'auto', maxWidth: '42px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}
                  onError={() => {
                    if (logoSrc === SKATA_LOGO_BASE64) setLogoSrc('/skata-logo-official.png');
                    else if (logoSrc === '/skata-logo-official.png') setLogoSrc('/assets/skata-logo-official.png');
                  }}
                />
                <SkataWordmark size="md" className="login-skata-wordmark" />
              </div>

              <h1 style={{ fontSize: '30px', fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                Portal Komunikasi Digital SKATA
              </h1>
              
              <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, margin: '0 0 28px', fontWeight: 500 }}>
                Sistem layanan terpadu untuk anggota Serikat Karyawan PT Graha Sarana Duta (Telkom Property) di seluruh Indonesia.
              </p>

              {/* WELCOME / RUNNING TEXT HIGHLIGHT BOX */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '18px', padding: '18px 20px', backdropFilter: 'blur(8px)', marginBottom: '28px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '12px', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  <Megaphone size={15} /> Pesan Utama SKATA
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: '#fef3c7', fontWeight: 600, italic: 'italic' }}>
                  "Selamat datang di Portal Komunikasi SKATA — Wadah pemersatu seluruh karyawan GSD untuk memperjuangkan hak, meningkatkan kesejahteraan, dan membangun hubungan industrial yang harmonis."
                </p>
              </div>

              {/* FEATURE BADGES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>PKB V & AD/ART</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={18} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Kartu e-KTA</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Advokasi Anggota</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Sahabat SKATA AI</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
              <span style={{ fontSize: '12px', opacity: 0.9, fontWeight: 700 }}>DPP SKATA PERIODE 2026–2028</span>
              <span style={{ fontSize: '12px', fontWeight: 850, color: '#fef08a', letterSpacing: '0.04em' }}>✊ BERSATU, BERKARYA, SEJAHTERA!</span>
            </div>
          </div>

          {/* RIGHT PANEL: FORM & AUTHENTICATION */}
          <div style={{ padding: '44px 36px', background: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #fee2e2, #fef2f2)', color: '#dc2626', marginBottom: '16px', border: '1px solid #fecaca' }}>
                <KeyRound size={26} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Masuk Portal SKATA
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Akses khusus anggota terverifikasi dan pengurus SKATA.
              </p>
            </div>

            {/* ACTIVE SESSION CARD */}
            {isLoggedIn && user ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '18px', padding: '24px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid #86efac' }}>
                  <CheckCircle size={26} />
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 850, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sesi Login Aktif</div>
                <div style={{ fontSize: '18px', fontWeight: 850, color: '#0f172a', marginTop: '6px' }}>{user.name}</div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px', fontWeight: 600 }}>{user.email} • NIK: {user.nik}</div>
                <div style={{ display: 'inline-block', background: '#e2e8f0', color: '#334155', fontSize: '11.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', marginTop: '8px' }}>
                  {user.role} — {user.dpwRegion}
                </div>

                <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => { if (onSuccess) onSuccess(); else if (onBack) onBack(); }}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    Lanjutkan ke Beranda Portal <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => logoutUser()}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: '1px solid #fca5a5',
                      background: '#ffffff',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={16} /> Keluar / Ganti Akun
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualLogin}>
                {errorMsg && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', lineHeight: 1.4, fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Alamat Email Terdaftar
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="Masukkan email resmi Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          paddingLeft: '42px',
                          paddingRight: '14px',
                          width: '100%',
                          height: '46px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <Mail size={18} />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Kata Sandi
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Masukkan kata sandi Anda"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          paddingLeft: '42px',
                          paddingRight: '44px',
                          width: '100%',
                          height: '46px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <Lock size={18} />
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '26px',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #e51b23 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 18px rgba(229, 27, 35, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSubmitting ? 'Mengautentikasi...' : 'Masuk Portal SKATA'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>
            )}

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: '#16a34a' }} /> Protected Portal SKATA © 2026 • Hak Cipta Dilindungi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


