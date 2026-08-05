import { useState } from 'react';
import { ArrowLeft, Briefcase, Calendar, ShieldCheck, HelpCircle, Activity } from 'lucide-react';

interface ProgramKerjaProps {
  onBack: () => void;
}

interface WorkProgram {
  title: string;
  category: 'Advokasi' | 'Konsolidasi' | 'Kesejahteraan' | 'Komunikasi';
  description: string;
  timeline: string;
  status: 'Perencanaan' | 'Sedang Berjalan' | 'Selesai';
  pic: string;
}

const programsData: WorkProgram[] = [
  // Advokasi
  {
    title: "Perundingan dan Penandatanganan PKB Periode 2026–2028",
    category: "Advokasi",
    description: "Melakukan kajian berkala, menyusun draf usulan poin kesejahteraan baru, serta melaksanakan perundingan resmi PKB bersama perwakilan manajemen PT Graha Sarana Duta.",
    timeline: "Kuartal I – Kuartal II 2026",
    status: "Sedang Berjalan",
    pic: "Bidang Advokasi & Ketua Umum"
  },
  {
    title: "Pendampingan Kasus Ketenagakerjaan Lapangan",
    category: "Advokasi",
    description: "Menyediakan layanan advokasi, konsultasi hukum, dan mediasi langsung bagi seluruh anggota yang menghadapi sengketa kerja, pemutusan kontrak sepihak, atau permasalahan K3.",
    timeline: "Berkelanjutan (On-going)",
    status: "Sedang Berjalan",
    pic: "Bidang Advokasi DPP & DPW"
  },
  {
    title: "Edukasi Regulasi Hukum Ketenagakerjaan Anggota",
    category: "Advokasi",
    description: "Menyelenggarakan seminar hukum dan bedah AD/ART & PKB berkala guna meningkatkan pemahaman hukum ketenagakerjaan bagi seluruh kader wilayah dan cabang.",
    timeline: "Setiap Semester",
    status: "Perencanaan",
    pic: "Bidang Organisasi & Advokasi"
  },

  // Konsolidasi
  {
    title: "Sensus Keanggotaan Digital Terpadu (Sensus SKATA)",
    category: "Konsolidasi",
    description: "Melakukan pemutakhiran menyeluruh basis data keanggotaan SKATA di 5 DPW secara digital guna memastikan hak iuran, distribusi suara munas, dan database e-KTA terintegrasi.",
    timeline: "Kuartal I – Kuartal III 2026",
    status: "Sedang Berjalan",
    pic: "Bidang Organisasi & Keanggotaan"
  },
  {
    title: "Musyawarah Kerja Nasional (MUKERNAS) Tahunan",
    category: "Konsolidasi",
    description: "Pertemuan koordinasi tahunan pengurus DPP, DPW, dan DPC seluruh Indonesia guna merumuskan program tahunan, mengevaluasi keuangan, dan menyelaraskan komando perjuangan.",
    timeline: "Tahunan (Oktober)",
    status: "Perencanaan",
    pic: "Sekretariat Jenderal DPP"
  },

  // Kesejahteraan
  {
    title: "Kemitraan Koperasi Karyawan Terintegrasi",
    category: "Kesejahteraan",
    description: "Menjalin kerja sama taktis dengan koperasi karyawan guna penyediaan bantuan pinjaman darurat, cicilan peranti kerja, dan paket sembako murah berkala.",
    timeline: "Kuartal IV 2026",
    status: "Perencanaan",
    pic: "Bidang Usaha & Koperasi"
  },
  {
    title: "Santunan Kematian & Musibah Cepat Tanggap",
    category: "Kesejahteraan",
    description: "Mengoptimalkan penyaluran dana sosial duka cita, dana bantuan darurat bencana, dan santunan kecelakaan kerja bagi anggota terdaftar secara kilat.",
    timeline: "Instan (Saat Dibutuhkan)",
    status: "Sedang Berjalan",
    pic: "Bendahara Umum DPP"
  },

  // Komunikasi
  {
    title: "Peluncuran Portal Informasi & Suara SKATA Digital",
    category: "Komunikasi",
    description: "Membangun sistem informasi dan aduan berbasis web terpadu (Hub Aspirasi Digital, Direktori DPW/DPC, Transparansi Keuangan, Library AD-ART) untuk kemudahan akses anggota.",
    timeline: "Kuartal I 2026",
    status: "Selesai",
    pic: "Bidang Komunikasi & Informasi"
  },
  {
    title: "Buletin Berita Karyawan & Publikasi Sosial Terstruktur",
    category: "Komunikasi",
    description: "Menerbitkan informasi rilis berkala seputar pencapaian serikat, update perundingan PKB, kabar duka, dan rilis pers resmi melalui media sosial dan saluran email karyawan.",
    timeline: "Bulanan",
    status: "Sedang Berjalan",
    pic: "Bidang Komunikasi & Informasi"
  }
];

export function ProgramKerja({ onBack }: ProgramKerjaProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Advokasi' | 'Konsolidasi' | 'Kesejahteraan' | 'Komunikasi'>('Semua');

  const filteredPrograms = programsData.filter(p => selectedCategory === 'Semua' || p.category === selectedCategory);

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
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Rencana Aksi Strategis</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Program Kerja SKATA 2026–2028
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            Peta jalan perjuangan Serikat Karyawan Graha Sarana Duta. Rencana aksi taktis dikelompokkan ke dalam empat bidang fokus kerja demi akurasi eksekusi dan pencapaian target kesejahteraan bersama.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="tab-navigation" style={{ marginBottom: '8px' }}>
          {(['Semua', 'Advokasi', 'Konsolidasi', 'Kesejahteraan', 'Komunikasi'] as const).map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'Semua' ? 'Semua Program' : cat}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredPrograms.map((p, idx) => (
            <div key={idx} style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              minHeight: '260px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#fcf0f0',
                    color: 'var(--red, #ff2424)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>{p.category}</span>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: p.status === 'Selesai' ? '#e8f5e9' : p.status === 'Sedang Berjalan' ? '#e3f2fd' : '#fff3e0',
                    color: p.status === 'Selesai' ? '#2e7d32' : p.status === 'Sedang Berjalan' ? '#1565c0' : '#e65100',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>● {p.status}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: '0 0 10px 0', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, margin: '0 0 20px 0' }}>{p.description}</p>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'grid', gap: '6px', fontSize: '12px', color: '#777' }}>
                <div><strong>Timeline:</strong> {p.timeline}</div>
                <div><strong>Penanggung Jawab:</strong> {p.pic}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
