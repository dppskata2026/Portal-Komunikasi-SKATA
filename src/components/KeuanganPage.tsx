import { ArrowLeft, Landmark, PieChart, TrendingUp, AlertTriangle, FileSpreadsheet, Calendar } from 'lucide-react';

interface KeuanganPageProps {
  onBack: () => void;
}

export function KeuanganPage({ onBack }: KeuanganPageProps) {
  const quarters2026 = [
    { q: 'Kuartal I 2026', period: 'Januari – Maret 2026', status: 'Data menunggu input bendahara', available: false },
    { q: 'Kuartal II 2026', period: 'April – Juni 2026', status: 'Data menunggu input bendahara', available: false },
    { q: 'Kuartal III 2026', period: 'Juli – September 2026', status: 'Data menunggu input bendahara', available: false },
    { q: 'Kuartal IV 2026', period: 'Oktober – Desember 2026', status: 'Data menunggu input bendahara', available: false }
  ];

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '32px' }}>
        {/* Header Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Transparansi & Akuntabilitas</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Transparansi Keuangan SKATA
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            Sesuai dengan komitmen keterbukaan tata kelola organisasi, seluruh laporan kontribusi iuran bulanan anggota, iuran DPP, serta alokasi DPW disajikan secara periodik demi akuntabilitas publik.
          </p>
        </div>

        {/* Financial Distribution Rule Callout */}
        <div style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--red, #ff2424)' }}><PieChart size={20} /></span> Skema Alokasi Iuran Anggota
            </h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, margin: 0 }}>
              Sesuai dengan Anggaran Rumah Tangga (ART) SKATA, proporsi kontribusi iuran keanggotaan didistribusikan secara berimbang:
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#fcf0f0', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #ffdede' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--red, #ff2424)' }}>75%</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#333', marginTop: '4px' }}>Alokasi DPP</strong>
              <small style={{ fontSize: '11px', color: '#666' }}>Urusan Nasional & Advokasi</small>
            </div>
            <div style={{ background: '#fff9e6', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #ffe8cc' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#ff9800' }}>25%</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#333', marginTop: '4px' }}>Alokasi DPW</strong>
              <small style={{ fontSize: '11px', color: '#666' }}>Berdasarkan Iuran Daerah</small>
            </div>
          </div>
        </div>

        {/* Dashboard Placeholder Amounts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Saldo Kas Terkonsolidasi</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#aaa', margin: '8px 0 4px 0' }}>Data dalam verifikasi</h2>
            <small style={{ color: '#856404', background: '#fff3cd', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Data menunggu input bendahara</small>
          </div>

          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Alokasi DPP (75%)</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#aaa', margin: '8px 0 4px 0' }}>Data dalam verifikasi</h2>
            <small style={{ color: '#856404', background: '#fff3cd', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Data menunggu input bendahara</small>
          </div>

          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Alokasi DPW (25%)</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#aaa', margin: '8px 0 4px 0' }}>Data dalam verifikasi</h2>
            <small style={{ color: '#856404', background: '#fff3cd', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Data menunggu input bendahara</small>
          </div>
        </div>

        {/* Quarterly Report Cards */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--red, #ff2424)' }}><Calendar size={22} /></span> Laporan Keuangan Berkala (Triwulan 2026)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {quarters2026.map((q, idx) => (
              <div key={idx} style={{
                background: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px'
              }}>
                <div>
                  <strong style={{ fontSize: '16px', color: '#333', display: 'block' }}>{q.q}</strong>
                  <span style={{ fontSize: '13px', color: '#666', display: 'block', marginTop: '4px' }}>{q.period}</span>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div style={{
                    background: '#fcf8e3',
                    border: '1px solid #faebcc',
                    color: '#8a6d3b',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {q.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
