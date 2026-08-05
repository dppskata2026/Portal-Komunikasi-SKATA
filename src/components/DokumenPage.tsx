import { useState } from 'react';
import { ArrowLeft, FileText, Search, Download, ShieldAlert } from 'lucide-react';

interface DokumenPageProps {
  onBack: () => void;
}

interface DocumentItem {
  title: string;
  category: string;
  docNumber: string | null;
  effectiveDate: string | null;
  period: string | null;
  accessLevel: 'Publik' | 'Anggota Terverifikasi' | 'Pengurus DPP';
  file: string | null;
  version: string;
  uploadDate: string | null;
}

const documentsData: DocumentItem[] = [
  {
    title: "Anggaran Dasar (AD) SKATA GSD",
    category: "Anggaran Dasar",
    docNumber: "SK-01/MUNAS/SKATA/2026",
    effectiveDate: "2026-02-15",
    period: "2026–2028",
    accessLevel: "Anggota Terverifikasi",
    file: null, // No file uploaded yet
    version: "v2.0",
    uploadDate: null
  },
  {
    title: "Anggaran Rumah Tangga (ART) SKATA GSD",
    category: "Anggaran Rumah Tangga",
    docNumber: "SK-02/MUNAS/SKATA/2026",
    effectiveDate: "2026-02-15",
    period: "2026–2028",
    accessLevel: "Anggota Terverifikasi",
    file: null,
    version: "v2.0",
    uploadDate: null
  },
  {
    title: "Draf Perjanjian Kerja Bersama (PKB) GSD",
    category: "Perjanjian Kerja Bersama",
    docNumber: "PKB/GSD-SKATA/2026-2028",
    effectiveDate: null,
    period: "2026–2028",
    accessLevel: "Anggota Terverifikasi",
    file: null,
    version: "Draft v1.2",
    uploadDate: null
  },
  {
    title: "Formulir Pendaftaran Manual Anggota",
    category: "Formulir",
    docNumber: "FORM-REG-01/2026",
    effectiveDate: "2026-01-01",
    period: "2026",
    accessLevel: "Publik",
    file: "Formulir_Pendaftaran_SKATA.pdf",
    version: "v1.0",
    uploadDate: "2026-01-10"
  },
  {
    title: "Panduan Klaim Kesejahteraan & Santunan Duka",
    category: "Peraturan Organisasi",
    docNumber: "PO-03/DPP/SKATA/2026",
    effectiveDate: "2026-03-01",
    period: "2026–2028",
    accessLevel: "Anggota Terverifikasi",
    file: "Panduan_Klaim_Kesejahteraan_v2.pdf",
    version: "v2.1",
    uploadDate: "2026-03-05"
  }
];

export function DokumenPage({ onBack }: DokumenPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = [
    'Semua',
    'Anggaran Dasar',
    'Anggaran Rumah Tangga',
    'Perjanjian Kerja Bersama',
    'Surat Keputusan',
    'Peraturan Organisasi',
    'Formulir',
    'Laporan'
  ];

  const filteredDocs = documentsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.docNumber && doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pustaka Dokumen Resmi</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            AD, ART, PKB & Dokumen Organisasi
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            Pusat arsip digital SKATA. Temukan dokumen regulasi Anggaran Dasar, Anggaran Rumah Tangga, keputusan munas, draf perundingan Perjanjian Kerja Bersama, surat keputusan DPP, hingga formulir klaim manfaat anggota di sini.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="search-input-field"
              style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
              placeholder="Cari judul dokumen atau nomor SK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
              <Search size={16} />
            </span>
          </div>

          <div>
            <select
              style={{ width: '100%', height: '40px', borderRadius: '6px', border: '1px solid #ddd', padding: '0 12px', fontSize: '14px', background: '#fff' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents list */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredDocs.map((doc, idx) => (
            <div key={idx} style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: doc.file ? '#e8f5e9' : '#fff5f5',
                  color: doc.file ? '#2e7d32' : 'var(--red, #ff2424)',
                  flexShrink: 0
                }}><FileText size={22} /></span>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: 0 }}>{doc.title}</h3>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#f5f5f5',
                      color: '#666',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>{doc.category}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#777', marginTop: '6px' }}>
                    <div><strong>No. Dokumen:</strong> {doc.docNumber || 'Menunggu data resmi'}</div>
                    <div><strong>Tgl Berlaku:</strong> {doc.effectiveDate ? new Date(doc.effectiveDate).toLocaleDateString('id-ID') : 'Menunggu data resmi'}</div>
                    <div><strong>Periode:</strong> {doc.period || 'Menunggu data resmi'}</div>
                    <div><strong>Versi:</strong> {doc.version}</div>
                    <div><strong>Hak Akses:</strong> <span style={{ color: doc.accessLevel === 'Publik' ? 'green' : 'var(--red, #ff2424)', fontWeight: 600 }}>{doc.accessLevel}</span></div>
                  </div>
                </div>
              </div>

              <div>
                {doc.file ? (
                  <button
                    onClick={() => alert(`Mengunduh berkas: ${doc.file}`)}
                    className="button primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={15} /> Unduh Berkas
                  </button>
                ) : (
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#8a6d3b',
                    background: '#fcf8e3',
                    border: '1px solid #faebcc',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <ShieldAlert size={14} /> Dokumen belum diunggah
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              color: '#666'
            }}>
              Arsip dokumen tidak ditemukan untuk kata kunci ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
