import { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle, Search, HelpCircle, FileText, AlertCircle, ShieldAlert } from 'lucide-react';
import { subscribeAspirations, createAspirationFirebase, safeSetLocalStorage } from '../lib/firestoreService';

interface AspirasiPageProps {
  onBack: () => void;
  subpath?: string | null;
  navigate: (path: string) => void;
}

interface AspirasiRecord {
  ticketNumber: string;
  category: string;
  title: string;
  description: string;
  urgency: string;
  confidentiality: string;
  dpw: string;
  contactPreference: string;
  status: string;
  createdAt: string;
}

const defaultAspirations: AspirasiRecord[] = [
  {
    ticketNumber: 'ASP-2026-10243',
    category: 'Kesejahteraan Pekerja',
    title: 'Penyesuaian Skema Uang Makan Lembur Wilayah Jawa Barat',
    description: 'Kami dari rekan-rekan teknisi lapangan memohon penyesuaian skema penggantian uang makan ketika lembur shift malam agar disamakan dengan wilayah regional lain.',
    urgency: 'Tinggi',
    confidentiality: 'Terbuka',
    dpw: 'DPW 2',
    contactPreference: 'WhatsApp',
    status: 'Dalam Tindak Lanjut',
    createdAt: '2026-07-28T09:00:00.000Z'
  },
  {
    ticketNumber: 'ASP-2026-10842',
    category: 'K3 & Alat Kerja',
    title: 'Kebutuhan Sepatu Safety Baru untuk Regional V',
    description: 'Banyak sepatu safety rekan-rekan di lapangan regional V yang sudah aus dan licin, mohon pengadaan sepatu safety standar K3 baru.',
    urgency: 'Medium',
    confidentiality: 'Rahasia',
    dpw: 'DPW 5',
    contactPreference: 'Email',
    status: 'Diverifikasi',
    createdAt: '2026-07-31T14:30:00.000Z'
  }
];

export function AspirasiPage({ onBack, subpath, navigate }: AspirasiPageProps) {
  const [activeSub, setActiveSub] = useState<'main' | 'baru' | 'lacak' | 'faq'>('main');
  const [ticketSearch, setTicketSearch] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<AspirasiRecord | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    category: 'Hubungan Industrial',
    title: '',
    description: '',
    urgency: 'Medium',
    confidentiality: 'Terbuka',
    dpw: 'DPW 1',
    attachmentName: '',
    contactPreference: 'WhatsApp'
  });

  useEffect(() => {
    if (subpath === 'baru') setActiveSub('baru');
    else if (subpath === 'lacak') setActiveSub('lacak');
    else if (subpath === 'faq') setActiveSub('faq');
    else setActiveSub('main');
  }, [subpath]);

  const [aspirations, setAspirations] = useState<AspirasiRecord[]>(() => {
    try {
      const stored = localStorage.getItem('skata_aspirasi_records');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return defaultAspirations;
  });

  useEffect(() => {
    const unsubscribe = subscribeAspirations((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        setAspirations(firestoreItems);
        safeSetLocalStorage('skata_aspirasi_records', firestoreItems);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load aspirations helper
  const getStoredAspirations = (): AspirasiRecord[] => {
    return aspirations.length > 0 ? aspirations : defaultAspirations;
  };

  const handleCreateAspirasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Harap isi judul dan deskripsi aspirasi Anda.');
      return;
    }

    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `ASP-${currentYear}-${randomNum}`;

    const newRecord: AspirasiRecord = {
      ticketNumber,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      urgency: formData.urgency,
      confidentiality: formData.confidentiality,
      dpw: formData.dpw,
      contactPreference: formData.contactPreference,
      status: 'Diterima', // Initial status
      createdAt: new Date().toISOString()
    };

    try {
      await createAspirationFirebase(newRecord);
    } catch {
      // Fallback
    }

    const existing = [...aspirations, newRecord];
    setAspirations(existing);
    safeSetLocalStorage('skata_aspirasi_records', existing);

    setSuccessTicket(ticketNumber);
    // Reset form fields
    setFormData({
      category: 'Hubungan Industrial',
      title: '',
      description: '',
      urgency: 'Medium',
      confidentiality: 'Terbuka',
      dpw: 'DPW 1',
      attachmentName: '',
      contactPreference: 'WhatsApp'
    });
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;

    const list = getStoredAspirations();
    const match = list.find(a => a.ticketNumber.toUpperCase() === ticketSearch.trim().toUpperCase());
    
    setSearchedTicket(match || null);
    setSearchAttempted(true);
  };

  const handleSubNavigate = (path: 'main' | 'baru' | 'lacak' | 'faq') => {
    setActiveSub(path);
    if (path === 'main') navigate('/aspirasi');
    else navigate(`/aspirasi/${path}`);
  };

  const allAspirations = getStoredAspirations();

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* Local Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '32px' }}>
        <button className={activeSub === 'main' ? 'active' : ''} onClick={() => handleSubNavigate('main')}>
          Hub Aspirasi
        </button>
        <button className={activeSub === 'baru' ? 'active' : ''} onClick={() => handleSubNavigate('baru')}>
          Ajukan Aspirasi
        </button>
        <button className={activeSub === 'lacak' ? 'active' : ''} onClick={() => handleSubNavigate('lacak')}>
          Lacak Tiket
        </button>
        <button className={activeSub === 'faq' ? 'active' : ''} onClick={() => handleSubNavigate('faq')}>
          FAQ Aspirasi
        </button>
      </div>

      {activeSub === 'main' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
            border: '1px solid #ffe3e3',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Saluran Suara Anggota</span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>Hub Aspirasi Digital SKATA</h1>
              <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
                Kami percaya setiap suara berharga. Sampaikan saran, kritik, aduan industrial, atau usulan inovasi secara bertanggung jawab. Kami menjamin kerahasiaan identitas Anda sesuai pilihan kebijakan privasi Anda.
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => handleSubNavigate('baru')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}
            >
              <Send size={16} /> Kirim Aspirasi Baru
            </button>
          </div>

          {/* Quick Stats & Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Lacak Status Penanganan</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                Setiap laporan yang masuk akan mendapatkan nomor tiket pelacak unik (misal: ASP-2026-12345) untuk memantau kemajuan tindak lanjut pengurus.
              </p>
              <button className="button outline w-full" onClick={() => handleSubNavigate('lacak')}>Lacak Tiket Anda</button>
            </div>

            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Opsi Kerahasiaan (Privacy)</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                Anda dapat memilih untuk mempublikasikan aspirasi Anda secara "Terbuka" (diketahui umum) atau "Rahasia" (hanya diproses internal oleh pengurus).
              </p>
              <button className="button outline w-full" onClick={() => handleSubNavigate('faq')}>Pelajari Privasi & Aturan</button>
            </div>
          </div>

          {/* Live Recent Feed (Only Open Category) */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '20px' }}>Aspirasi Terbuka Terkini</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {allAspirations.filter(a => a.confidentiality === 'Terbuka').map((a) => (
                <div key={a.ticketNumber} style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, background: '#fff', border: '1px solid #ddd', padding: '2px 8px', borderRadius: '12px', color: '#444' }}>{a.category}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>Tiket: {a.ticketNumber}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 6px 0' }}>{a.title}</h4>
                  <p style={{ fontSize: '14px', color: '#555', margin: '0 0 12px 0', lineHeight: 1.5 }}>{a.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                    <span>Asal Wilayah: {a.dpw}</span>
                    <span style={{ color: 'var(--red, #ff2424)', fontWeight: 600 }}>Status: {a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSub === 'baru' && (
        <div style={{ maxWidth: '640px', marginInline: 'auto' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            {successTicket ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  marginBottom: '20px'
                }}>
                  <CheckCircle size={36} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#333', marginBottom: '8px' }}>Aspirasi Berhasil Dikirim!</h2>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>
                  Aspirasi Anda berhasil dicatat secara resmi di dalam sistem nasional SKATA.
                </p>

                <div style={{
                  background: '#f4f4f4',
                  borderRadius: '8px',
                  padding: '20px',
                  marginInline: 'auto',
                  maxWidth: '380px',
                  marginBottom: '32px',
                  border: '1px solid #ddd'
                }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 700, display: 'block' }}>Nomor Tiket Pelacak</span>
                  <strong style={{ fontSize: '24px', color: 'var(--red, #ff2424)', letterSpacing: '1px', display: 'block', marginTop: '4px' }}>{successTicket}</strong>
                </div>

                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, marginBottom: '24px' }}>
                  *Simpan nomor tiket di atas dengan baik. Anda dapat melacak progres, tanggapan, serta dispensasi atau disposisi penanganan pengurus sewaktu-waktu melalui menu "Lacak Tiket".*
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button className="button outline" onClick={() => setSuccessTicket(null)}>Ajukan Aspirasi Lain</button>
                  <button className="button primary" onClick={() => handleSubNavigate('lacak')}>Lacak Progres</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAspirasi}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '24px' }}>Formulir Pengajuan Aspirasi</h2>
                
                <div style={{ display: 'grid', gap: '16px' }} className="form-fields">
                  <label>
                    Kategori Aspirasi
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Hubungan Industrial</option>
                      <option>Kesejahteraan Pekerja</option>
                      <option>K3 & Alat Kerja</option>
                      <option>Organisasi / Kemandirian</option>
                      <option>Inovasi Layanan</option>
                    </select>
                  </label>

                  <label>
                    Judul Singkat Aspirasi
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ketersediaan Fasilitas K3 Lapangan FM"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </label>

                  <label>
                    Deskripsi Lengkap / Kronologis
                    <textarea
                      required
                      rows={5}
                      placeholder="Ceritakan detail gagasan, aduan, atau masukan Anda dengan rinci..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      Tingkat Urgensi
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      >
                        <option>Rendah</option>
                        <option>Medium</option>
                        <option>Tinggi</option>
                      </select>
                    </label>

                    <label>
                      Kerahasiaan Identitas
                      <select
                        value={formData.confidentiality}
                        onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value })}
                      >
                        <option>Terbuka</option>
                        <option>Rahasia</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      Wilayah Asal (DPP / DPW)
                      <select
                        value={formData.dpw}
                        onChange={(e) => setFormData({ ...formData, dpw: e.target.value })}
                      >
                        <option value="DPP (Dewan Pengurus Pusat)">DPP (Dewan Pengurus Pusat)</option>
                        <option value="DPW 1">DPW 1 - Sumatera</option>
                        <option value="DPW 2">DPW 2 - Jakarta, Banten & Jawa Barat</option>
                        <option value="DPW 3">DPW 3 - Jateng, Jatim, Bali & Nusa Tenggara</option>
                        <option value="DPW 4">DPW 4 - Kalimantan</option>
                        <option value="DPW 5">DPW 5 - Kawasan Timur Indonesia (Sulawesi, Maluku, Papua)</option>
                      </select>
                    </label>

                    <label>
                      Metode Kontak Prioritas
                      <select
                        value={formData.contactPreference}
                        onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                      >
                        <option>WhatsApp</option>
                        <option>Email</option>
                        <option>Telfon Langsung</option>
                      </select>
                    </label>
                  </div>

                  {/* Attachment */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '8px' }}>Dokumen / Foto Lampiran (Opsional)</label>
                    <div style={{
                      border: '1.5px dashed #ccc',
                      borderRadius: '6px',
                      padding: '16px',
                      textAlign: 'center',
                      background: '#fafafa',
                      cursor: 'pointer'
                    }} onClick={() => setFormData({ ...formData, attachmentName: 'Bukti_Lampiran_Aspirasi.jpg' })}>
                      <span style={{ color: 'var(--red, #ff2424)', fontSize: '13px', fontWeight: 600 }}>
                        {formData.attachmentName ? `✓ Terpilih: ${formData.attachmentName}` : 'Klik untuk mengunggah berkas pendukung'}
                      </span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="button primary w-full" style={{ marginTop: '24px' }}>
                  Kirim Pengajuan Aspirasi
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeSub === 'lacak' && (
        <div style={{ maxWidth: '640px', marginInline: 'auto' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Lacak Status Aspirasi</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Masukkan nomor tiket ASP-YYYY-XXXXX untuk melacak tahapan disposisi dan resolusi dari pengurus DPP SKATA.
            </p>

            <form onSubmit={handleTrackTicket} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <input
                type="text"
                className="search-input-field"
                style={{ flex: 1 }}
                required
                placeholder="Contoh: ASP-2026-10243"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
              <button type="submit" className="button primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Search size={16} /> Cari
              </button>
            </form>

            {searchAttempted && searchedTicket && (
              <div style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <strong>{searchedTicket.ticketNumber}</strong>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    background: '#fff5f5',
                    color: 'var(--red, #ff2424)',
                    padding: '2px 10px',
                    borderRadius: '12px'
                  }}>{searchedTicket.status}</span>
                </div>

                <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '12px' }}>KATEGORI</span>
                    <strong>{searchedTicket.category}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '12px' }}>JUDUL</span>
                    <strong>{searchedTicket.title}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '12px' }}>DESKRIPSI</span>
                    <p style={{ margin: '4px 0 0 0', color: '#555', lineHeight: 1.5 }}>{searchedTicket.description}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '8px' }}>
                    <div>
                      <span style={{ color: '#888', fontSize: '12px', display: 'block' }}>URGENSI</span>
                      <strong>{searchedTicket.urgency}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#888', fontSize: '12px', display: 'block' }}>HARI PENGAJUAN</span>
                      <strong>{new Date(searchedTicket.createdAt).toLocaleDateString('id-ID')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchAttempted && !searchedTicket && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #ffe3e3',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                color: 'var(--red, #ff2424)'
              }}>
                <AlertCircle size={28} style={{ marginInline: 'auto', marginBottom: '8px' }} />
                <strong>Tiket Tidak Ditemukan</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  Mohon pastikan format nomor tiket pelacak Anda sudah benar (contoh: ASP-2026-10243).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSub === 'faq' && (
        <div style={{ maxWidth: '800px', marginInline: 'auto' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '24px' }}>FAQ Seputar Aspirasi SKATA</h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#111', display: 'block', marginBottom: '6px' }}>Q: Siapa saja yang boleh mengirimkan aspirasi?</strong>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                  A: Seluruh karyawan PT Graha Sarana Duta, baik yang sudah teregistrasi resmi sebagai anggota SKATA maupun yang sedang dalam proses keanggotaan.
                </p>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }} />
              <div>
                <strong style={{ fontSize: '16px', color: '#111', display: 'block', marginBottom: '6px' }}>Q: Apakah identitas saya aman jika memilih kategori Rahasia?</strong>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                  A: Sangat aman. Opsi "Rahasia" membatasi akses baca laporan hanya kepada fungsionaris khusus DPP bidang Advokasi dan Ketua Umum, tanpa dipublikasikan ke feed terbuka.
                </p>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }} />
              <div>
                <strong style={{ fontSize: '16px', color: '#111', display: 'block', marginBottom: '6px' }}>Q: Berapa lama aspirasi ditindaklanjuti?</strong>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                  A: Maksimal dalam waktu 2x24 jam kerja untuk proses verifikasi. Tindak lanjut ke dewan direksi / manajemen bergantung pada urgensi kasus.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
