import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  path: string;
  navigate: (path: string) => void;
}

export function Breadcrumbs({ path, navigate }: BreadcrumbsProps) {
  const cleanPath = path.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const getLabel = (segment: string) => {
    const mapping: Record<string, string> = {
      tentang: 'Tentang SKATA',
      profil: 'Profil SKATA',
      'visi-misi': 'Visi, Misi dan Nilai',
      struktur: 'Struktur Organisasi',
      'pengurus-dpp': 'Pengurus DPP',
      dpw: 'Dewan Pengurus Wilayah',
      dpc: 'Dewan Pengurus Cabang',
      'program-kerja': 'Program Kerja 2026–2028',
      dokumen: 'AD, ART dan PKB',
      layanan: 'Layanan Anggota',
      keanggotaan: 'Keanggotaan',
      pendaftaran: 'Pendaftaran Anggota',
      'e-kta': 'e-KTA',
      advokasi: 'Advokasi dan Bantuan Hukum',
      kesejahteraan: 'Kesejahteraan',
      pelatihan: 'Pelatihan',
      keuangan: 'Keuangan dan Iuran',
      download: 'Download Dokumen',
      survey: 'Survey dan Polling',
      aspirasi: 'Aspirasi',
      baru: 'Ajukan Aspirasi',
      lacak: 'Lacak Aspirasi',
      faq: 'FAQ Aspirasi',
      berita: 'Berita SKATA',
      agenda: 'Agenda',
      pengumuman: 'Pengumuman',
      galeri: 'Galeri',
      kontak: 'Kontak',
      login: 'Login Anggota',
      search: 'Pencarian',
      notifikasi: 'Notifikasi',
    };
    return mapping[segment.toLowerCase()] || segment;
  };

  return (
    <nav className="breadcrumbs-container container" aria-label="Breadcrumb" style={{ paddingBlock: '12px', fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red, #ff2424)', fontWeight: 500 }}
      >
        <Home size={14} />
        Beranda
      </button>
      {segments.map((segment, index) => {
        const routePath = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = getLabel(segment);

        return (
          <div key={routePath} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChevronRight size={14} style={{ color: '#aaa' }} />
            {isLast ? (
              <span style={{ color: '#111', fontWeight: 600 }}>{label}</span>
            ) : (
              <button
                onClick={() => navigate(routePath)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontWeight: 500 }}
              >
                {label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
