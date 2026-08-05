import { useState, useEffect } from 'react';
import { dpwList } from '../data/skataMasterData';
import { ArrowLeft, Users, Landmark, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { DotMapFull } from './DotMap';

interface DPWPageProps {
  onBack: () => void;
  selectedId?: string | null;
  navigate: (path: string) => void;
}

export function DPWPage({ onBack, selectedId, navigate }: DPWPageProps) {
  const [activeDpwId, setActiveDpwId] = useState<string | null>(null);

  useEffect(() => {
    // If selectedId is provided via router parameter
    if (selectedId) {
      setActiveDpwId(selectedId);
    }
  }, [selectedId]);

  const handleSelectDpw = (id: string) => {
    setActiveDpwId(id);
    navigate(`/tentang/dpw/${id}`);
  };

  const handleBackToDirectory = () => {
    setActiveDpwId(null);
    navigate('/tentang/dpw');
  };

  const currentDpw = dpwList.find(d => d.id === activeDpwId);

  if (currentDpw) {
    return (
      <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
        <button className="back-link" onClick={handleBackToDirectory} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Kembali ke Direktori DPW
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Detail Wilayah</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: 0 }}>
            {currentDpw.temporaryName}
          </h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '6px' }}>
            ID Wilayah: {currentDpw.id} | Status: <span style={{ color: 'green', fontWeight: 600 }}>{currentDpw.status}</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Board of Wilayah */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '24px', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px' }}>
              Fungsionaris DPW
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', display: 'block' }}>Ketua Wilayah</small>
                <strong style={{ fontSize: '16px', color: currentDpw.chairman ? '#111' : '#aaa' }}>
                  {currentDpw.chairman || 'Data belum tersedia'}
                </strong>
              </div>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', display: 'block' }}>Sekretaris Wilayah</small>
                <strong style={{ fontSize: '16px', color: currentDpw.secretary ? '#111' : '#aaa' }}>
                  {currentDpw.secretary || 'Data belum tersedia'}
                </strong>
              </div>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', display: 'block' }}>Bendahara Wilayah</small>
                <strong style={{ fontSize: '16px', color: currentDpw.treasurer ? '#111' : '#aaa' }}>
                  {currentDpw.treasurer || 'Data belum tersedia'}
                </strong>
              </div>
            </div>
          </div>

          {/* Stats and Verifications */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '24px', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px' }}>
              Data Statistik
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#555', fontSize: '15px' }}>Total Anggota Terdaftar:</span>
                <strong style={{ color: currentDpw.memberCount !== null ? '#111' : '#999' }}>
                  {currentDpw.memberCount !== null ? `${currentDpw.memberCount} Anggota` : 'Data belum tersedia'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#555', fontSize: '15px' }}>Total DPC Terdaftar:</span>
                <strong style={{ color: currentDpw.dpcCount !== null ? '#111' : '#999' }}>
                  {currentDpw.dpcCount !== null ? `${currentDpw.dpcCount} Unit` : 'Data belum tersedia'}
                </strong>
              </div>
              <div style={{ background: '#fafafa', borderRadius: '8px', padding: '16px', border: '1px dashed #ddd', marginTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                  <strong>Catatan Verifikasi:</strong> Data operasional, struktur pengurus lengkap, serta rincian DPC untuk {currentDpw.temporaryName} saat ini sedang divalidasi oleh dewan fungsionaris wilayah bersama DPP SKATA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Direktori Wilayah</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Dewan Pengurus Wilayah (DPW)
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px' }}>
            SKATA resmi dipimpin oleh <strong>5 Wilayah (DPW)</strong> fungsional di seluruh Indonesia. Klik tombol "Lihat Detail" untuk memeriksa data kepengurusan wilayah masing-masing.
          </p>
        </div>

        {/* FULL PROMINENT INDONESIA MAP WITH 5 DPW */}
        <DotMapFull />

        {/* DPW Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {dpwList.map((dpw) => (
            <div key={dpw.id} style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: 0 }}>
                    {dpw.temporaryName}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>{dpw.status}</span>
                </div>

                <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>Ketua Wilayah:</span>{' '}
                    <span style={{ color: dpw.chairman ? '#111' : '#aaa', fontWeight: dpw.chairman ? 600 : 400 }}>
                      {dpw.chairman || 'Data belum tersedia'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Sekretaris:</span>{' '}
                    <span style={{ color: dpw.secretary ? '#111' : '#aaa' }}>
                      {dpw.secretary || 'Data belum tersedia'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Bendahara:</span>{' '}
                    <span style={{ color: dpw.treasurer ? '#111' : '#aaa' }}>
                      {dpw.treasurer || 'Data belum tersedia'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', margin: '8px 0', paddingTop: '8px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total DPC:</span>
                    <strong style={{ color: '#444' }}>{dpw.dpcCount !== null ? `${dpw.dpcCount} Unit` : 'Data belum tersedia'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Anggota:</span>
                    <strong style={{ color: '#444' }}>{dpw.memberCount !== null ? `${dpw.memberCount} Anggota` : 'Data belum tersedia'}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectDpw(dpw.id)}
                className="button primary"
                style={{ width: '100%' }}
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
