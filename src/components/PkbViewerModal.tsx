import { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Search, BookOpen, ShieldCheck, Printer, ZoomIn, ZoomOut } from 'lucide-react';

interface PkbViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

export function PkbViewerModal({ isOpen, onClose, pdfUrl = '/assets/PERJANJIAN_KERJA_BERSAMA_V_SKATA_GSD.pdf' }: PkbViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'chapters' | 'kemenaker'>('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  const chaptersData = [
    { bab: 'MUKADIMAH', title: 'Landasan & Pokok Pikiran SKATA - GSD', detail: 'Perjanjian Kerja Bersama antara Karyawan PT Graha Sarana Duta (SKATA) dengan Manajemen PT Graha Sarana Duta (GSD) dalam rangka menciptakan Hubungan Industrial yang serasi, aman, mantap dan dinamis.' },
    { bab: 'BAB I', title: 'KETENTUAN UMUM', pasals: 'Pasal 1 s.d. Pasal 2', detail: 'Pengertian Istilah Ketenagakerjaan (Ahli Waris, Anak Dalam Tanggungan, APS, Bonus, Diskreksi, Hari Kerja, THP, TKWT, Demosi, Promosi, dll) serta Ruang Lingkup Berlakunya PKB V.' },
    { bab: 'BAB II', title: 'KEWAJIBAN DAN HAK', pasals: 'Pasal 3 s.d. Pasal 5', detail: 'Kewajiban bersama SKATA & GSD, Hak SKATA mengajukan keberatan, Larangan tekanan/provokasi/diskriminasi.' },
    { bab: 'BAB III', title: 'BATASAN KEPENGURUSAN DAN DUKUNGAN UNTUK SKATA', pasals: 'Pasal 6 s.d. Pasal 10', detail: 'Pengakuan resmi SKATA sebagai serikat tunggal karyawan, Dispensasi 6 hari kerja/tahun untuk kegiatan serikat, pemotongan iuran via payroll, bantuan fasilitas.' },
    { bab: 'BAB IV', title: 'HUBUNGAN KERJA', pasals: 'Pasal 11 s.d. Pasal 13', detail: 'Prinsip rekrutasi transparan, larangan karyawan memiliki hubungan keluarga satu unit/kantor, kerahasiaan & verifikasi data pribadi.' },
    { bab: 'BAB V', title: 'WAKTU KERJA, LEMBUR DAN HARI LIBUR RESMI', pasals: 'Pasal 14 s.d. Pasal 16', detail: 'Waktu kerja 8 jam/hari (40 jam/minggu), kompensasi jam lembur kerja, hak libur resmi pemerintah.' },
    { bab: 'BAB VI', title: 'CUTI, ISTIRAHAT MELAHIRKAN DAN ISTIRAHAT PANJANG', pasals: 'Pasal 17 s.d. Pasal 27', detail: 'Cuti Tahunan (12 hari), Cuti Alasan Penting (CAP 1-3 hari), Cuti Haid & Sakit, Istirahat Melahirkan (3 bulan), Cuti Haji (maks 5 hari), Cuti Umroh/Ziarah (7 hari), Istirahat Panjang (30 hari setelah 6 thn), CLTP, Cuti Moments That Matter (MTM).' },
    { bab: 'BAB VII', title: 'COMPENSATION AND BENEFIT', pasals: 'Pasal 28 s.d. Pasal 42', detail: 'Mekanisme Kenaikan Gaji/Upah, THR (2x Basic/Position allowance untuk Karyawan Tetap, 1x untuk TKWT), BPFKJ (Fasilitas Kendaraan Jabatan), BFP (Perumahan), Bonus RUPS, Fasilitas Kesehatan Tambahan, Bantuan Perkawinan Pertama, Bantuan Duka/Pemakaman, Manfaat Purna Tugas (UP & UPMK), Uang Penggantian Hak (UPH), Uang Pisah (20%-50%).' },
    { bab: 'BAB VIII', title: 'PENGEMBANGAN DAN PEMBINAAN KARYAWAN', pasals: 'Pasal 43 s.d. Pasal 53', detail: 'Sistem Penilaian Kinerja (Merit System), Reward, STT (Surat Teguran), Job Rotation, Promosi, Demosi, Formasi Non Posisi, Penempatan Talent Mobility, Training, dan Pembinaan IBO (Iman, Budaya & Olahraga).' },
    { bab: 'BAB IX', title: 'PERJALANAN DINAS', pasals: 'Pasal 54', detail: 'Ketentuan Perjalanan Dinas Dalam & Luar Negeri, biaya ditanggung penuh oleh GSD.' },
    { bab: 'BAB X', title: 'KESELAMATAN KERJA DAN KESEHATAN KERJA', pasals: 'Pasal 55', detail: 'Penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3).' },
    { bab: 'BAB XI', title: 'DISIPLIN KARYAWAN', pasals: 'Pasal 56 s.d. Pasal 62', detail: 'Tingkatan Pelanggaran Karyawan: Peringatan Pertama (SP-1), Peringatan Terakhir (SP-3), dan Pelanggaran Mendesak (Sanksi PHK).' },
    { bab: 'BAB XII', title: 'PEMUTUSAN HUBUNGAN KERJA (PHK)', pasals: 'Pasal 63 s.d. Pasal 71', detail: 'Alasan PHK, Pesangon, Penanganan Dugaan Tindak Pidana, Mangkir (5 hari kerja berturut-turut), Sakit Berkepanjangan (>12 bulan), Meninggal Dunia, Hilang, Usia Pensiun Karyawan (56 Tahun).' },
    { bab: 'BAB XIII', title: 'PERSELISIHAN HUBUNGAN INDUSTRIAL', pasals: 'Pasal 72 s.d. Pasal 73', detail: 'Skorsing & Penyelesaian Perselisihan melalui Musyawarah Mufakat.' },
    { bab: 'BAB XIV', title: 'KETENTUAN PENUTUP', pasals: 'Pasal 74 s.d. Pasal 75', detail: 'Aturan Peralihan Peraturan Internal & Penutup. Ditandatangani di Jakarta pada 12 November 2025.' }
  ];

  const filteredChapters = chaptersData.filter(c => 
    c.bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'PERJANJIAN_KERJA_BERSAMA_V_SKATA_GSD.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1100px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#b91c1c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>Dokumen Resmi Tersertifikasi</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>SK Kemenaker No. KEP. 4/HI.00.01/00.0000.251120020/P-1/I/2026</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0 0 0', color: '#f8fafc' }}>
                PERJANJIAN KERJA BERSAMA V (PKB V) SKATA DENGAN PT GSD
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleDownload}
              style={{
                background: '#b91c1c',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(185, 28, 28, 0.4)'
              }}
            >
              <Download size={16} /> Unduh PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'preview' ? '#0f172a' : 'transparent',
                color: activeTab === 'preview' ? '#ffffff' : '#64748b'
              }}
            >
              📖 Pratinjau Berkas PDF
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'chapters' ? '#0f172a' : 'transparent',
                color: activeTab === 'chapters' ? '#ffffff' : '#64748b'
              }}
            >
              📋 Ringkasan Bab & Pasal (54 Hal)
            </button>
            <button
              onClick={() => setActiveTab('kemenaker')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'kemenaker' ? '#0f172a' : 'transparent',
                color: activeTab === 'kemenaker' ? '#ffffff' : '#64748b'
              }}
            >
              🏛️ Legalisasi Kemenaker RI
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Perkecil Ukuran Tampilan"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '40px', textAlign: 'center' }}>{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Perbesar Ukuran Tampilan"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handlePrint}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: '#334155' }}
            >
              <Printer size={14} /> Cetak / Tab Baru
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f1f5f9' }}>
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&zoom=${zoomLevel}`}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '520px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  background: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                title="Viewer PDF Perjanjian Kerja Bersama V SKATA - GSD"
              />
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span>Jika pratinjau PDF tidak muncul di browser Anda, klik <strong style={{ color: '#b91c1c', cursor: 'pointer' }} onClick={handleDownload}>Unduh PDF</strong> untuk langsung menyimpan naskah lengkap 54 halaman.</span>
              </div>
            </div>
          )}

          {activeTab === 'chapters' && (
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Struktur Lengkap Naskah PKB V Periode 2025–2027
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Terdiri dari 14 BAB dan 75 Pasal Regulasi Ketenagakerjaan SKATA - PT Graha Sarana Duta.
                  </p>
                </div>

                <div style={{ position: 'relative', width: '260px' }}>
                  <input
                    type="text"
                    placeholder="Cari pasal atau materi PKB..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredChapters.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, background: '#b91c1c', color: '#fff', padding: '3px 10px', borderRadius: '6px' }}>
                          {item.bab}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {item.title}
                        </h4>
                      </div>
                      {item.pasals && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '10px' }}>
                          {item.pasals}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kemenaker' && (
            <div style={{ maxWidth: '850px', margin: '0 auto', background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '20px', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#b91c1c', letterSpacing: '1.5px', textTransform: 'uppercase' }}>KEMENTERIAN KETENAGAKERJAAN REPUBLIK INDONESIA</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  SURAT KEPUTUSAN DIREKTUR JENDERAL PHI DAN JAMSOS TENAGA KERJA
                </h3>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#b91c1c' }}>
                  NOMOR KEP. 4/HI.00.01/00.0000.251120020/P-1/I/2026
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TANGGAL PENETAPAN SK</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>02 Januari 2026</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>NO. BUKTI PENDAFTARAN</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>251120020</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PERIODE MASAKELAKU</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>12 Nov 2025 – 12 Nov 2027</div>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#991b1b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Pihak Penandatangan Resmi Perjanjian
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Pihak SKATA:</strong>
                    <div>Fazriwansyah (Ketua Umum DPP SKATA)</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>No. SKATA: 001/HK.810/SKT-000/2025</div>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Pihak PT Graha Sarana Duta (GSD):</strong>
                    <div>Didit Sulistyo (Plt President Director GSD)</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>No. GSD: 1126/HK.810/GSD-000/2025</div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={handleDownload}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={16} /> Unduh Berkas Salinan Resmi (PDF 54 Halaman)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
