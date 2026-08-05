import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface Branded404Props {
  onBack: () => void;
}

export function Branded404({ onBack }: Branded404Props) {
  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '80px', paddingBottom: '120px', textAlign: 'center' }}>
      <div style={{
        maxWidth: '500px',
        marginInline: 'auto',
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '16px',
        padding: '64px 32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#fff5f5',
          color: 'var(--red, #ff2424)',
          marginBottom: '28px'
        }}>
          <AlertTriangle size={36} />
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: 900, color: 'var(--red, #ff2424)', margin: '0 0 8px 0', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: '0 0 12px 0' }}>Halaman Tidak Ditemukan</h2>
        
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
          Maaf, halaman yang Anda tuju tidak ditemukan atau sedang dipindahkan oleh sistem administrator SKATA.
        </p>

        <button
          onClick={onBack}
          className="button primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingInline: '28px' }}
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
