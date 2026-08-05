import { useState } from 'react';
import { ArrowLeft, Search, Filter, AlertCircle } from 'lucide-react';

interface DPCPageProps {
  onBack: () => void;
}

export function DPCPage({ onBack }: DPCPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dpwFilter, setDpwFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '32px' }}>
        {/* Header Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Direktori Cabang</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Dewan Pengurus Cabang (DPC)
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            DPC merupakan tingkat kepengurusan unit terkecil penempatan kerja karyawan PT GSD di daerah. Gunakan fitur pencarian dan filter di bawah untuk memantau data verifikasi DPC di setiap DPW.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Cari DPC</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="search-input-field"
                style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                placeholder="Cari nama cabang atau area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
                <Search size={16} />
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Filter DPW</label>
            <select
              style={{ width: '100%', height: '40px', borderRadius: '6px', border: '1px solid #ddd', padding: '0 12px', fontSize: '14px', background: '#fff' }}
              value={dpwFilter}
              onChange={(e) => setDpwFilter(e.target.value)}
            >
              <option>Semua</option>
              <option>DPW 1</option>
              <option>DPW 2</option>
              <option>DPW 3</option>
              <option>DPW 4</option>
              <option>DPW 5</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '6px' }}>Filter Status</label>
            <select
              style={{ width: '100%', height: '40px', borderRadius: '6px', border: '1px solid #ddd', padding: '0 12px', fontSize: '14px', background: '#fff' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Semua</option>
              <option>Aktif</option>
              <option>Dalam Proses Verifikasi</option>
            </select>
          </div>
        </div>

        {/* Elegant Empty State */}
        <div style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '64px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#fff3cd',
            color: '#856404',
            marginBottom: '20px'
          }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#333', marginBottom: '8px' }}>Data DPC sedang dalam proses verifikasi dan pemutakhiran.</h3>
          <p style={{ fontSize: '15px', color: '#666', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.5 }}>
            Sehubungan dengan penyesuaian masa bakti pengurus 2026–2028, daftar definitif DPC tingkat cabang beserta data kepengurusan wilayah saat ini sedang divalidasi oleh dewan pimpinan nasional SKATA.
          </p>
        </div>
      </div>
    </div>
  );
}
