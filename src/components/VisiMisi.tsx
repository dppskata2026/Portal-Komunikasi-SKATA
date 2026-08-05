import { ArrowLeft, Landmark, Target, Award, ShieldAlert } from 'lucide-react';

interface VisiMisiProps {
  onBack: () => void;
}

export function VisiMisi({ onBack }: VisiMisiProps) {
  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pilar Dasar Perjuangan</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: 0 }}>Visi, Misi & Nilai SKATA</h1>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '10px', maxWidth: '600px', marginInline: 'auto' }}>
            Rancangan arah pergerakan dan nilai luhur organisasi Serikat Karyawan Graha Sarana Duta Periode 2026–2028.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Vision Block */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: '#fff5f5',
                color: 'var(--red, #ff2424)'
              }}><Target size={24} /></span>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>Visi SKATA</h2>
            </div>
            <p style={{
              fontSize: '18px',
              color: '#333',
              lineHeight: 1.6,
              fontWeight: 500,
              borderLeft: '4px solid var(--red, #ff2424)',
              paddingLeft: '16px'
            }}>
              "SKATA menjadi organisasi yang berjalan selaras dengan visi perusahaan untuk mewujudkan kesejahteraan dan pemberdayaan anggota sehingga menjadi <em>asset</em> berharga bagi Perusahaan."
            </p>
          </div>

          {/* Mission Block */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: '#fff5f5',
                color: 'var(--red, #ff2424)'
              }}><Landmark size={24} /></span>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>Misi SKATA</h2>
            </div>
            <ul style={{ display: 'grid', gap: '16px', paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '12px', fontSize: '15px', color: '#444', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--red, #ff2424)', fontWeight: 700 }}>1.</span>
                <div>
                  Menjadi organisasi mandiri yang dapat membawa keseimbangan hubungan kerja dan hubungan strategis dengan perusahaan secara positif dan bertanggung jawab.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '15px', color: '#444', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--red, #ff2424)', fontWeight: 700 }}>2.</span>
                <div>
                  Menambah nilai kesejahteraan dan soliditas pengurus, anggota dan keluarganya.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Block */}
        <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: 0 }}>Tiga Nilai Kehormatan (Tri-Nilai)</h2>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Nilai ideal yang harus tertanam dalam jiwa setiap kader pejuang SKATA</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: 'var(--red, #ff2424)' }}><Award size={20} /></span>
                <strong style={{ fontSize: '16px', color: '#111' }}>Profesional</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                Mengedepankan kompetensi kerja, etos perundingan ilmiah berbasis data, tata kelola yang rapi, dan respons cepat terhadap keluhan anggota di lapangan.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: 'var(--red, #ff2424)' }}><ShieldAlert size={20} /></span>
                <strong style={{ fontSize: '16px', color: '#111' }}>Transparan</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                Menjamin laporan keuangan, pendistribusian dana iuran DPP-DPW, kebijakan sengketa, dan agenda kepengurusan dapat diawasi secara terbuka oleh perwakilan anggota.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: 'var(--red, #ff2424)' }}><Award size={20} /></span>
                <strong style={{ fontSize: '16px', color: '#111' }}>Berintegritas</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                Tulus mengabdi pada kebenaran dan hak normatif anggota, menolak gratifikasi yang melanggar nilai perjuangan, serta amanah mengawal dana kontribusi anggota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
