import { ArrowLeft, ArrowDown, Shield, Users, Landmark, UsersRound, HelpCircle } from 'lucide-react';

interface StrukturOrganisasiProps {
  onBack: () => void;
  navigate: (path: string) => void;
}

export function StrukturOrganisasi({ onBack, navigate }: StrukturOrganisasiProps) {
  const hierarchy = [
    {
      id: 'dewan-pembina',
      title: 'Dewan Pembina',
      desc: 'Memberikan arahan, pengawasan, serta nasihat strategis kepada pengurus DPP.',
      icon: Shield,
      path: '/tentang/pengurus-dpp',
      badge: 'Tingkat Pusat'
    },
    {
      id: 'dpp',
      title: 'Dewan Pengurus Pusat (DPP)',
      desc: 'Lembaga eksekutif tertinggi pengambil keputusan operasional dan koordinasi ketenagakerjaan.',
      icon: Landmark,
      path: '/tentang/pengurus-dpp',
      badge: 'Kepengurusan Pusat'
    },
    {
      id: 'dpw',
      title: 'Dewan Pengurus Wilayah (DPW)',
      desc: 'Pengurus di tingkat wilayah koordinasi (5 Wilayah aktif). Mengawal operasional daerah.',
      icon: Users,
      path: '/tentang/dpw',
      badge: '5 Wilayah Aktif'
    },
    {
      id: 'dpc',
      title: 'Dewan Pengurus Cabang (DPC)',
      desc: 'Kepengurusan di tingkat area unit terkecil penempatan kerja karyawan PT GSD.',
      icon: UsersRound,
      path: '/tentang/dpw',
      badge: 'Koordinasi Wilayah'
    },
    {
      id: 'anggota',
      title: 'Anggota SKATA',
      desc: 'Seluruh karyawan tetap PT Graha Sarana Duta yang terdaftar aktif secara digital.',
      icon: UsersRound,
      path: '/layanan/keanggotaan',
      badge: 'Basis Organisasi'
    }
  ];

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ maxWidth: '800px', marginInline: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Alur Komando & Koordinasi</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: 0 }}>Struktur Organisasi SKATA</h1>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '10px' }}>
            Klik pada setiap tingkatan struktur di bawah ini untuk melihat detail pengurus, direktori, atau formulir pendaftaran.
          </p>
        </div>

        {/* Vertical visual chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {hierarchy.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: '#fff',
                    border: '1px solid #eaeaea',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--red, #ff2424)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 36, 36, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#eaeaea';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.01)';
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    background: '#fff5f5',
                    color: 'var(--red, #ff2424)',
                    flexShrink: 0
                  }}>
                    <Icon size={26} />
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0 }}>{item.title}</h3>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#fcf0f0',
                        color: 'var(--red, #ff2424)',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>{item.badge}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </button>

                {index < hierarchy.length - 1 && (
                  <div style={{ color: '#ccc', margin: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ArrowDown size={20} style={{ color: 'var(--red, #ff2424)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
