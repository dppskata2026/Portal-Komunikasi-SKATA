import { useState } from 'react';
import { Lock, Mail, ShieldCheck, CheckCircle, LogOut, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { PRESET_ACCOUNTS, setActiveSession, logoutUser, UserSession } from '../lib/authService';

interface LoginPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { user, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanedEmail = email.trim().toLowerCase();
      const match = PRESET_ACCOUNTS.find(a => a.email.toLowerCase() === cleanedEmail && a.pass === password);
      
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
        if (onSuccess) onSuccess();
      } else {
        const emailMatch = PRESET_ACCOUNTS.find(a => a.email.toLowerCase() === cleanedEmail);
        if (emailMatch) {
          setErrorMsg('Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.');
        } else {
          setErrorMsg('Email tidak terdaftar atau kata sandi tidak cocok. Akses portal ini terbatas untuk dppskata@gmail.com.');
        }
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffebeb, #fee2e2)', color: '#e51b23', marginBottom: '16px' }}>
            <KeyRound size={28} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Masuk Portal SKATA
          </h1>
          <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
            Portal ini bersifat private. Silakan masukkan email & kata sandi resmi Anda untuk mengakses seluruh fitur organisasi.
          </p>
        </div>

        {/* Active Session Card */}
        {isLoggedIn && user ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <CheckCircle size={22} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sesi Login Aktif</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginTop: '4px' }}>{user.name}</div>
            <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>{user.email}</div>

            <button
              onClick={() => logoutUser()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #fca5a5',
                background: '#fff',
                color: '#dc2626',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <LogOut size={16} /> Keluar / Ganti Akun
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualLogin}>
            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', lineHeight: 1.4 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'grid', gap: '18px' }} className="form-fields">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Alamat Email
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '40px', width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex' }}><Mail size={18} /></span>
                </div>
              </label>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Kata Sandi
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input
                    type="password"
                    required
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '40px', width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px' }}
                  />
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex' }}><Lock size={18} /></span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="button primary w-full"
              style={{
                marginTop: '24px',
                height: '46px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #e51b23, #b91c1c)'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengautentikasi...' : 'Masuk Portal'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', textAlign: 'center', fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} style={{ color: '#16a34a' }} /> Protected Portal SKATA © 2026
        </div>
      </div>
    </div>
  );
}

