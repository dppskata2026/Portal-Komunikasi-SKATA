import { useState } from 'react';
import { ArrowLeft, Lock, Mail, Shield, User, CheckCircle, LogOut } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: string } | null>(null);

  const demoRoles = [
    { name: 'Amiruddin Ahmad', email: 'ketum@skata.org', role: 'Ketua Umum (Admin DPP)', pass: 'dpp2026' },
    { name: 'Ade Hermansyah', email: 'dpw1@skata.org', role: 'Ketua DPW 1 (Sumatera)', pass: 'dpw2026' },
    { name: 'Budi Santoso', email: 'budi@gsd.co.id', role: 'Anggota SKATA', pass: 'anggota2026' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      // Check if matches demo credentials or default to budi
      const match = demoRoles.find(r => r.email === email && password === r.pass);
      if (match) {
        setLoggedInUser({ name: match.name, role: match.role });
      } else {
        // Fallback for easy demo clicking
        setLoggedInUser({ name: 'User Demo', role: 'Anggota SKATA' });
      }
    }, 600);
  };

  const handleQuickLogin = (role: typeof demoRoles[0]) => {
    setEmail(role.email);
    setPassword(role.pass);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoggedInUser({ name: role.name, role: role.role });
    }, 400);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ maxWidth: '800px', marginInline: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Left Card: Form */}
        <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
          {loggedInUser ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#e8f5e9',
                color: '#2e7d32',
                marginBottom: '20px'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#333', marginBottom: '4px' }}>Sesi Aktif Terdeteksi</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Anda berhasil masuk ke Portal Pengurus SKATA.</p>
              
              <div style={{
                background: '#fafafa',
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '32px',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '13px', color: '#888' }}>PENGGUNA</div>
                <strong style={{ fontSize: '16px', color: '#111', display: 'block' }}>{loggedInUser.name}</strong>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>HAK AKSES / PERAN</div>
                <strong style={{ fontSize: '14px', color: 'var(--red, #ff2424)' }}>{loggedInUser.role}</strong>
              </div>

              <button className="button outline w-full" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogOut size={16} /> Keluar dari Sistem
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: 0 }}>Portal SKATA</h2>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Silakan login menggunakan akun organisasi terdaftar Anda.</p>
              </div>

              <div style={{ display: 'grid', gap: '16px' }} className="form-fields">
                <label>
                  Alamat Email
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="username@gsd.co.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '36px' }}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}><Mail size={15} /></span>
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
                      style={{ paddingLeft: '36px' }}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}><Lock size={15} /></span>
                  </div>
                </label>
              </div>

              <button type="submit" className="button primary w-full" style={{ marginTop: '24px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Mengautentikasi...' : 'Masuk Portal'}
              </button>
            </form>
          )}
        </div>

        {/* Right Card: Demo Roles Guide */}
        <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--red, #ff2424)' }}><Shield size={18} /></span> Akun Demo Pengujian
          </h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
            Pilih salah satu peran siap pakai di bawah ini untuk menguji hak akses portal SKATA secara instan.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {demoRoles.map((role, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickLogin(role)}
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--red, #ff2424)';
                  e.currentTarget.style.background = '#ffebeb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f5f5f5',
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#111', display: 'block' }}>{role.name}</strong>
                  <span style={{ fontSize: '12px', color: '#ff2424', fontWeight: 600 }}>{role.role}</span>
                  <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>
                    Email: {role.email} | Sandi: {role.pass}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
