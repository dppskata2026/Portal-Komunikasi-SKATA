import { useState, useMemo, useEffect } from 'react';
import { subscribeNewsArticles, addNewsArticleFirebase, deleteNewsArticleFirebase, safeSetLocalStorage } from '../lib/firestoreService';
import { SkataWordmark } from './SkataWordmark';
import {
  BookOpenText,
  UsersRound,
  WalletCards,
  Landmark,
  Scale,
  GraduationCap,
  HandHeart,
  Send,
  Download,
  ShoppingBag,
  TrendingUp,
  CircleHelp,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Coins,
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* Reusable Container for Premium Subpages */
function SubPageLayout({
  title,
  description,
  icon: Icon,
  children,
  onBack,
}: {
  title: string;
  description: string;
  icon: any;
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '42px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Kembali ke Beranda
      </button>
      <div className="subpage-header">
        <span className="subpage-icon-badge">
          <Icon size={32} />
        </span>
        <div>
          <h1 className="subpage-title">{title}</h1>
          <p className="subpage-description">{description}</p>
        </div>
      </div>
      <div className="subpage-divider" />
      <div className="subpage-content">{children}</div>
    </div>
  );
}

/* 1. TENTANG SKATA PAGE */
export function TentangPage({ onBack, navigateTo }: { onBack: () => void; navigateTo: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<'sejarah' | 'visi-misi' | 'struktur'>('sejarah');

  useEffect(() => {
    // If URL has search query section=struktur-organisasi, activeTab goes directly to 'struktur'
    const params = new URLSearchParams(window.location.search);
    if (params.get('section') === 'struktur-organisasi' || window.location.pathname.includes('struktur-organisasi')) {
      setActiveTab('struktur');
    }
  }, []);

  return (
    <SubPageLayout
      title="Tentang SKATA"
      description="Mengenal Serikat Karyawan GSD, sejarah perjuangan, visi misi, dan jajaran dewan pengurus pusat."
      icon={BookOpenText}
      onBack={onBack}
    >
      <div className="tab-navigation">
        <button className={activeTab === 'sejarah' ? 'active' : ''} onClick={() => setActiveTab('sejarah')}>
          Sejarah SKATA
        </button>
        <button className={activeTab === 'visi-misi' ? 'active' : ''} onClick={() => setActiveTab('visi-misi')}>
          Visi & Misi
        </button>
        <button className={activeTab === 'struktur' ? 'active' : ''} onClick={() => setActiveTab('struktur')}>
          Struktur DPP SKATA
        </button>
      </div>

      {activeTab === 'sejarah' && (
        <div className="editorial-content">
          <h2>Sejarah Singkat & Komitmen</h2>
          <p>
            Serikat Karyawan GSD (SKATA) didirikan sebagai respon atas pentingnya wadah komunikasi
            berintegritas, mandiri, dan profesional yang menjembatani hubungan antara seluruh karyawan GSD
            dengan jajaran manajemen perusahaan. SKATA berkomitmen untuk terus meningkatkan nilai tambah,
            kesejahteraan, serta perlindungan bagi seluruh anggotanya di Indonesia.
          </p>
          <p>
            Sejak pembentukannya, SKATA telah memainkan peran krusial dalam perundingan Perjanjian Kerja
            Bersama (PKB), advokasi ketenagakerjaan, serta penyaluran aspirasi anggota demi terciptanya iklim
            kerja yang produktif, harmonis, dan bermartabat.
          </p>
          <div className="fact-grid">
            <div className="fact-card">
              <h3>2015</h3>
              <p>Tahun Berdiri SKATA GSD</p>
            </div>
            <div className="fact-card">
              <h3>1.933+</h3>
              <p>Anggota Terdaftar Aktif</p>
            </div>
            <div className="fact-card">
              <h3>9 DPW</h3>
              <p>Dewan Pengurus Wilayah</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visi-misi' && (
        <div className="editorial-content">
          <div className="vision-mision-panel">
            <div className="vision-block">
              <h2 className="accent-label">Visi SKATA</h2>
              <p className="large-quote">
                “SKATA menjadi organisasi yang berjalan selaras dengan visi perusahaan untuk mewujudkan kesejahteraan dan pemberdayaan anggota sehingga menjadi <em>asset</em> berharga bagi Perusahaan.”
              </p>
            </div>
            <div className="mision-block">
              <h2>Misi SKATA</h2>
              <ul>
                <li>
                  <strong>1.</strong> Menjadi organisasi mandiri yang dapat membawa keseimbangan hubungan kerja dan hubungan strategis dengan perusahaan secara positif dan bertanggung jawab.
                </li>
                <li>
                  <strong>2.</strong> Menambah nilai kesejahteraan dan soliditas pengurus, anggota dan keluarganya.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'struktur' && (
        <div className="editorial-content">
          <h2>Struktur Dewan Pengurus Pusat (DPP) SKATA</h2>
          <p className="sub-header-text">Periode Kepengurusan DPP SKATA Masa Bakti 2026–2028</p>
          
          <div className="org-tree">
            {/* Dewan Pembina */}
            <div className="org-card plain" style={{ marginBottom: '20px', background: '#fff9f9', border: '1px solid #ffe3e3' }}>
              <span className="badge-gold" style={{ background: '#b80007', color: '#fff' }}>Dewan Pembina</span>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Ketua:</strong> Wira Widytara</div>
                <div><strong>Anggota:</strong> RM. Advitor Juto Kusmono, Sultan Riady</div>
              </div>
            </div>

            {/* Top Leader */}
            <div className="org-leader-card">
              <span className="badge-gold">Ketua Umum</span>
              <h3>Amiruddin Ahmad</h3>
              <p>Dewan Pengurus Pusat SKATA</p>
            </div>

            {/* Vice Chairmen */}
            <div className="org-grid-two" style={{ marginBottom: '16px' }}>
              <div className="org-card">
                <span className="badge-red">Wakil Ketua I</span>
                <h3>I Gede Aditya W</h3>
              </div>
              <div className="org-card">
                <span className="badge-red">Wakil Ketua II</span>
                <h3>Heri Santoso</h3>
              </div>
            </div>
            
            {/* Secretary & Treasurer Row */}
            <div className="org-grid-two">
              <div className="org-card">
                <span className="badge-red">Sekretaris Umum</span>
                <h3>Ronald Ishack</h3>
                <p>Urusan Kesekretariatan & Administrasi</p>
              </div>
              <div className="org-card">
                <span className="badge-red">Bendahara Umum & Anggota</span>
                <h3>Jerry Pratama Yendy</h3>
                <p>Anggota: Rifky Fernanda</p>
              </div>
            </div>

            {/* Departments */}
            <h3 style={{ marginTop: '24px' }}>Bidang-Bidang Kerja</h3>
            <div className="org-grid-two">
              <div className="org-card plain">
                <h4>Bidang Organisasi & Keanggotaan</h4>
                <div><strong>Ketua:</strong> Muji Rahmad</div>
              </div>
              <div className="org-card plain">
                <h4>Bidang Advokasi</h4>
                <div><strong>Ketua:</strong> Iskandar Zulkarnain</div>
                <div><strong>Anggota:</strong> Gremmy Jordan</div>
              </div>
              <div className="org-card plain">
                <h4>Bidang Usaha</h4>
                <div><strong>Ketua:</strong> Andri</div>
                <div><strong>Anggota:</strong> Nuronia Zulva</div>
              </div>
              <div className="org-card plain">
                <h4>Bidang Komunikasi & Informasi</h4>
                <div><strong>Ketua:</strong> Wisnu Yogi Prabowo</div>
                <div><strong>Anggota:</strong> Alya Adianta</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SubPageLayout>
  );
}

/* 2. KEANGGOTAAN PAGE */
export function KeanggotaanPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    email: '',
    telepon: '',
    dpw: 'DPW I - DKI Jakarta',
    unit: '',
    persetujuan: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nama || !formData.nik || !formData.email) {
        alert('Harap isi nama, NIK, dan email Anda.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.unit || !formData.persetujuan) {
        alert('Harap isi unit kerja dan setujui pernyataan.');
        return;
      }
      setStep(3);
    }
  };

  return (
    <SubPageLayout
      title="Pendaftaran Anggota"
      description="Lengkapi formulir pendaftaran digital untuk mendapatkan Nomor Induk Anggota (NIA) SKATA GSD."
      icon={UsersRound}
      onBack={onBack}
    >
      <div className="form-steps-indicator">
        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}><span>1</span><p>Data Pribadi</p></div>
        <div className="step-line" />
        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}><span>2</span><p>Penempatan Kerja</p></div>
        <div className="step-line" />
        <div className={`step-dot ${step === 3 ? 'active' : ''}`}><span>3</span><p>Selesai</p></div>
      </div>

      <div className="form-card-wrapper">
        {step < 3 ? (
          <form onSubmit={handleSubmit} className="premium-form">
            {step === 1 && (
              <div className="form-fields">
                <label>
                  Nama Lengkap Sesuai KTP
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                </label>
                <label>
                  Nomor Induk Karyawan (NIK GSD)
                  <input
                    type="text"
                    required
                    placeholder="Masukkan NIK Karyawan Anda"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  />
                </label>
                <label>
                  Alamat Email Aktif
                  <input
                    type="email"
                    required
                    placeholder="nama.anda@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </label>
                <label>
                  Nomor WhatsApp Aktif
                  <input
                    type="tel"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="form-fields">
                <label>
                  Wilayah Kepengurusan (DPW)
                  <select
                    value={formData.dpw}
                    onChange={(e) => setFormData({ ...formData, dpw: e.target.value })}
                  >
                    <option>DPW I - Sumatera</option>
                    <option>DPW II - DKI & Banten</option>
                    <option>DPW III - Jawa Timur & Bali</option>
                    <option>DPW IV - Kalimantan</option>
                    <option>DPW V - Sulawesi & Timur</option>
                  </select>
                </label>
                <label>
                  Unit Kerja / Lokasi Penempatan
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Area Network Bandung, Telkom Landmark Tower"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </label>
                <div className="checkbox-block">
                  <input
                    type="checkbox"
                    id="persetujuan"
                    required
                    checked={formData.persetujuan}
                    onChange={(e) => setFormData({ ...formData, persetujuan: e.target.checked })}
                  />
                  <label htmlFor="persetujuan">
                    Saya menyatakan bersedia bergabung menjadi anggota SKATA GSD secara sadar, tunduk pada
                    AD/ART organisasi, serta bersedia menyalurkan iuran keanggotaan berkala.
                  </label>
                </div>
              </div>
            )}

            <div className="form-actions-row">
              {step === 2 && (
                <button type="button" className="button outline" onClick={() => setStep(1)}>
                  Kembali
                </button>
              )}
              <button type="submit" className="button primary">
                {step === 1 ? 'Lanjutkan' : 'Kirim Pendaftaran'}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-form-panel">
            <span className="success-glow"><CheckCircle size={58} /></span>
            <h2>Pendaftaran Berhasil Terkirim!</h2>
            <p>
              Terima kasih, rekan <strong>{formData.nama}</strong>. Pendaftaran Anda dengan NIK{' '}
              <strong>{formData.nik}</strong> telah masuk ke database registrasi DPP SKATA GSD.
            </p>
            <p className="note-text">
              Tim bidang keanggotaan akan segera memverifikasi data Anda dalam waktu 1x24 jam kerja. Kartu Anggota
              Digital (e-KTA) Anda akan diterbitkan secara otomatis setelah verifikasi selesai.
            </p>
            <button className="button primary" onClick={() => setStep(1)}>
              Daftarkan Anggota Baru
            </button>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}

/* 3. E-KTA PAGE (DASHBOARD-GRADE LIVE CARD GENERATOR) */
export function EKtaPage({ onBack }: { onBack: () => void }) {
  const [nama, setNama] = useState('NAMA ANGGOTA LENGKAP');
  const [nik, setNik] = useState('24080193');
  const [dpw, setDpw] = useState('DPW II - JAWA BARAT');
  const [showDemo, setShowDemo] = useState(false);

  return (
    <SubPageLayout
      title="e-KTA Digital"
      description="Sistem penerbitan Kartu Tanda Anggota Elektronik. Masukkan data Anda di bawah ini untuk melihat pratinjau kartu anggota Anda secara instan."
      icon={WalletCards}
      onBack={onBack}
    >
      <div className="ekta-grid">
        {/* Generator Controls */}
        <div className="ekta-controls">
          <h3>Pratinjau e-KTA Interaktif</h3>
          <p>Ubah input di bawah ini untuk mensimulasikan cetak e-KTA digital Anda secara real-time:</p>
          <div className="premium-form no-margin">
            <label>
              Nama Pemilik Kartu
              <input type="text" value={nama} onChange={(e) => setNama(e.target.value.toUpperCase())} maxLength={32} />
            </label>
            <label>
              Nomor Induk Anggota (NIA)
              <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} maxLength={12} />
            </label>
            <label>
              Wilayah DPW
              <select value={dpw} onChange={(e) => setDpw(e.target.value)}>
                <option>DPW I - SUMATERA</option>
                <option>DPW II - DKI & BANTEN</option>
                <option>DPW III - JAWA TIMUR & BALI</option>
                <option>DPW IV - KALIMANTAN</option>
                <option>DPW V - SULAWESI & TIMUR</option>
              </select>
            </label>
            <button className="button primary w-full" onClick={() => setShowDemo(true)}>
              Cetak Kartu PDF
            </button>
            {showDemo && (
              <p className="success-inline-message" style={{ color: 'green', fontSize: '12px', marginTop: '8px' }}>
                ✓ File PDF berhasil diproses! Mulai download secara berkala...
              </p>
            )}
          </div>
        </div>

        {/* Live ID Card Visualization */}
        <div className="ekta-card-container">
          <div className="ekta-card">
            <div className="ekta-card-bg-glow" />
            <div className="ekta-card-header">
              <img src="/assets/skata-logo-official.png" className="ekta-card-logo" alt="SKATA" />
              <SkataWordmark size="sm" />
              <span className="ekta-badge-type">MEMBER</span>
            </div>
            
            <div className="ekta-card-body">
              {/* Profile Image Simulation */}
              <div className="ekta-avatar">
                <User size={45} className="avatar-icon" />
                <div className="avatar-overlay" />
              </div>

              <div className="ekta-user-details">
                <small>NAMA ANGGOTA</small>
                <strong>{nama || 'NAMA LENGKAP ANGGOTA'}</strong>
                
                <small>NOMOR INDUK ANGGOTA (NIA)</small>
                <strong>SKATA.{nik || 'XXXXXXXX'}</strong>

                <small>DEWAN PENGURUS WILAYAH</small>
                <strong>{dpw}</strong>
              </div>
            </div>

            <div className="ekta-card-footer">
              <div className="ekta-stamp">
                <span className="stamp-circle" />
                <p>APPROVED</p>
              </div>
              <div className="ekta-qr">
                {/* Simulated QR Code via CSS grid */}
                <div className="qr-box">
                  <span /><span /><span /><span />
                  <span /><span /><span /><span />
                  <span /><span /><span /><span />
                </div>
                <small>SKATA ID VERIFIED</small>
              </div>
            </div>
          </div>
          <p className="hint-card-text">Kartu KTA ini dilengkapi QR Code dan enkripsi database internal SKATA GSD.</p>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 4. KEUANGAN & IURAN PAGE */
export function KeuanganPage({ onBack }: { onBack: () => void }) {
  const [filterMonth, setFilterMonth] = useState('Semua');

  const transactions = [
    { desc: 'Penerimaan Iuran Anggota DPW I', type: 'in', date: '01 Agustus 2026', amt: 'Rp 14.500.000' },
    { desc: 'Penyaluran Santunan Kesehatan Anggota DPC GSD Bandung', type: 'out', date: '29 Juli 2026', amt: 'Rp 2.000.000' },
    { desc: 'Biaya Konsolidasi Hukum & Advokasi Hubungan Industrial', type: 'out', date: '25 Juli 2026', amt: 'Rp 4.500.000' },
    { desc: 'Penerimaan Iuran Anggota DPW II', type: 'in', date: '20 Juli 2026', amt: 'Rp 12.200.000' },
    { desc: 'Penerimaan Dana Sponsor Agenda RAT SKATA 2026', type: 'in', date: '15 Juli 2026', amt: 'Rp 8.000.000' },
    { desc: 'Pencetakan Atribut & Bendera Organisasi DPW VIII', type: 'out', date: '10 Juli 2026', amt: 'Rp 1.800.000' },
  ];

  return (
    <SubPageLayout
      title="Transparansi Keuangan"
      description="Menyajikan laporan keuangan secara terbuka, transparan, dan akuntabel kepada seluruh anggota SKATA."
      icon={Landmark}
      onBack={onBack}
    >
      <div className="keuangan-dashboard">
        <div className="budget-row">
          <div className="budget-stat-card in">
            <small>Total Penerimaan Kas DPP</small>
            <h2>Rp 184.250.000</h2>
            <span className="trend-lbl">Meningkat dibanding bulan lalu</span>
          </div>
          <div className="budget-stat-card out">
            <small>Total Pengeluaran Kas DPP</small>
            <h2>Rp 52.800.000</h2>
            <span className="trend-lbl">Pengeluaran terkelola & tersertifikasi</span>
          </div>
          <div className="budget-stat-card balance">
            <small>Saldo Kas Terkonsolidasi</small>
            <h2>Rp 131.450.000</h2>
            <span className="trend-lbl">Dana cadangan darurat tersedia</span>
          </div>
        </div>

        <h3>Buku Kas Umum Terbaru (Juli–Agustus 2026)</h3>
        <div className="table-filter-row">
          <label>
            Filter Laporan Bulanan:
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option>Semua</option>
              <option>Agustus 2026</option>
              <option>Juli 2026</option>
            </select>
          </label>
        </div>

        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Tanggal Pengesahan</th>
                <th>Keterangan Alokasi Dana</th>
                <th>Jenis Alur</th>
                <th>Jumlah (IDR)</th>
                <th>Status Audit</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => filterMonth === 'Semua' || t.date.includes(filterMonth.split(' ')[0]))
                .map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.date}</td>
                    <td><strong>{t.desc}</strong></td>
                    <td>
                      <span className={`transaction-badge ${t.type}`}>
                        {t.type === 'in' ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
                      </span>
                    </td>
                    <td className={`amount-txt ${t.type}`}>{t.amt}</td>
                    <td><span className="verified-audit-badge">Audited ✓</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 5. ADVOKASI & HUKUM PAGE */
export function AdvokasiPage({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 'TKT-24021', type: 'Masalah Kontrak Kerja', date: '28 Juli 2026', status: 'Selesai' },
    { id: 'TKT-24039', type: 'Perselisihan Upah Lembur', date: '01 Agustus 2026', status: 'Diproses' },
  ]);
  const [form, setForm] = useState({ jenis: 'Masalah Kontrak Kerja', deskripsi: '', kontak: '' });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deskripsi || !form.kontak) {
      alert('Harap isi semua kolom deskripsi dan kontak.');
      return;
    }
    const newTicket = {
      id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      type: form.jenis,
      date: '02 Agustus 2026',
      status: 'Menunggu Review',
    };
    setTickets([newTicket, ...tickets]);
    setSubmitted(true);
    setForm({ jenis: 'Masalah Kontrak Kerja', deskripsi: '', kontak: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <SubPageLayout
      title="Advokasi & Bantuan Hukum"
      description="Layanan pendampingan, penyelesaian sengketa industrial, dan konsultasi hukum ketenagakerjaan bagi seluruh anggota SKATA."
      icon={Scale}
      onBack={onBack}
    >
      <div className="advokasi-dashboard">
        <div className="advokasi-alert">
          <h4>PENTING — Kerahasiaan Terjamin</h4>
          <p>
            Semua data aduan dan laporan masalah ketenagakerjaan yang masuk melalui sistem SKATA dijamin 100%
            rahasia dan dilindungi oleh dewan pengurus pusat bidang hukum.
          </p>
        </div>

        <div className="ekta-grid">
          {/* Form Aduan */}
          <div className="ekta-controls">
            <h3>Buat Laporan / Request Konsultasi</h3>
            <form onSubmit={handleCreateTicket} className="premium-form no-margin">
              <label>
                Kategori Masalah
                <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })}>
                  <option>Masalah Kontrak Kerja</option>
                  <option>Perselisihan Upah Lembur</option>
                  <option>Kondisi Lingkungan Kerja / K3</option>
                  <option>Perselisihan Hubungan Industrial</option>
                  <option>Konsultasi Hukum Umum</option>
                </select>
              </label>
              <label>
                Deskripsi Kasus Secara Singkat & Padat
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan kronologis singkat permasalahan Anda..."
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                />
              </label>
              <label>
                No. Telepon / WhatsApp Darurat
                <input
                  type="text"
                  required
                  placeholder="Masukkan nomor kontak Anda yang dapat dihubungi"
                  value={form.kontak}
                  onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                />
              </label>
              <button type="submit" className="button primary w-full">
                Kirim Aduan Hukum
              </button>
              {submitted && (
                <p className="success-inline-message" style={{ color: 'green', fontSize: '13px', marginTop: '10px' }}>
                  ✓ Tiket aduan berhasil dibuat! Tim Hukum SKATA akan segera menghubungi Anda.
                </p>
              )}
            </form>
          </div>

          {/* Active Tickets List */}
          <div className="ekta-card-container">
            <h3>Daftar Tiket Advokasi Aktif Anda</h3>
            <p>Melacak status pengajuan bantuan hukum Anda secara transparan:</p>
            <div className="ticket-list">
              {tickets.map((t) => (
                <div className="ticket-item" key={t.id}>
                  <div className="ticket-header">
                    <strong>ID: {t.id}</strong>
                    <span className={`status-badge ${t.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="ticket-type">{t.type}</p>
                  <small className="ticket-date">Tanggal Terdaftar: {t.date}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 6. PELATIHAN PAGE */
export function PelatihanPage({ onBack }: { onBack: () => void }) {
  const [registeredList, setRegisteredList] = useState<string[]>([]);

  const courses = [
    { id: 'TRN-01', title: 'Pemahaman Hukum Ketenagakerjaan & UU Cipta Kerja', schedule: '18 Agustus 2026', duration: '4 Sesi Virtual', instructor: 'Hendra Wijaya, S.H.' },
    { id: 'TRN-02', title: 'Sertifikasi K3 Umum (Keselamatan dan Kesehatan Kerja)', schedule: '25 Agustus 2026', duration: 'Full Day Workshop', instructor: 'Tim Disnakertrans Bandung' },
    { id: 'TRN-03', title: 'Teknik Negosiasi Efektif dalam Hubungan Industrial', schedule: '10 September 2026', duration: '2 Sesi Virtual', instructor: 'Budi Santoso, S.T.' },
  ];

  const handleRegisterCourse = (id: string) => {
    if (registeredList.includes(id)) return;
    setRegisteredList([...registeredList, id]);
  };

  return (
    <SubPageLayout
      title="Pelatihan & Diklat Anggota"
      description="Kembangkan kompetensi, soft skills, dan keahlian sertifikasi ketenagakerjaan melalui program pendidikan internal SKATA."
      icon={GraduationCap}
      onBack={onBack}
    >
      <div className="courses-wrapper">
        <div className="org-grid-three">
          {courses.map((c) => {
            const isReg = registeredList.includes(c.id);
            return (
              <div className="course-card" key={c.id}>
                <span className="course-badge">Diklat Resmi</span>
                <h3>{c.title}</h3>
                <div className="course-details">
                  <p>📅 <strong>Jadwal:</strong> {c.schedule}</p>
                  <p>⏱ <strong>Durasi:</strong> {c.duration}</p>
                  <p>👤 <strong>Instruktur:</strong> {c.instructor}</p>
                </div>
                <button
                  className={`button w-full ${isReg ? 'soft' : 'primary'}`}
                  disabled={isReg}
                  onClick={() => handleRegisterCourse(c.id)}
                >
                  {isReg ? '✓ Sudah Terdaftar' : 'Daftar Pelatihan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 7. KESEJAHTERAAN PAGE */
export function KesejahteraanPage({ onBack }: { onBack: () => void }) {
  const [claimType, setClaimType] = useState('Bantuan Rawat Inap Rumah Sakit');
  const [amount, setAmount] = useState(1500000);

  useEffect(() => {
    if (claimType === 'Bantuan Rawat Inap Rumah Sakit') setAmount(1500000);
    if (claimType === 'Dana Santunan Pernikahan Pertama') setAmount(1000000);
    if (claimType === 'Santunan Duka Cita Keluarga Inti') setAmount(2000000);
    if (claimType === 'Tunjangan Kelahiran Anak Pertama') setAmount(1200000);
  }, [claimType]);

  return (
    <SubPageLayout
      title="Program Kesejahteraan & Manfaat"
      description="Pemberian subsidi sosial, dana bantuan kesehatan, pernikahan, kelahiran, dan duka cita bagi seluruh anggota aktif."
      icon={HandHeart}
      onBack={onBack}
    >
      <div className="kesejahteraan-dashboard">
        <div className="ekta-grid">
          <div className="ekta-controls">
            <h3>Kalkulator Simulasi Santunan</h3>
            <p>Pilih jenis klaim sosial di bawah ini untuk melihat nominal subsidi dana kesejahteraan yang berhak Anda terima:</p>
            <div className="premium-form no-margin">
              <label>
                Jenis Program Sosial SKATA
                <select value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                  <option>Bantuan Rawat Inap Rumah Sakit</option>
                  <option>Dana Santunan Pernikahan Pertama</option>
                  <option>Santunan Duka Cita Keluarga Inti</option>
                  <option>Tunjangan Kelahiran Anak Pertama</option>
                </select>
              </label>
              
              <div className="calc-result-box">
                <small>Estimasi Total Dana Hibah</small>
                <h2>Rp {amount.toLocaleString('id-ID')}</h2>
                <p>Bersumber langsung dari alokasi Kas Kesejahteraan Anggota DPP SKATA GSD.</p>
              </div>

              <button className="button primary w-full" onClick={() => alert('Formulir pengajuan kesejahteraan digital berhasil diproses. Silakan hubungi admin DPW wilayah Anda untuk penyerahan kwitansi/bukti fisik.')}>
                Ajukan Klaim Sekarang
              </button>
            </div>
          </div>

          <div className="ekta-card-container">
            <h3>Syarat Pengajuan Klaim Kesejahteraan</h3>
            <ol className="premium-ordered-list">
              <li>Tercatat aktif sebagai anggota SKATA GSD sekurang-kurangnya 3 bulan berturut-turut.</li>
              <li>Telah rutin menyelesaikan iuran bulanan tanpa tunggakan.</li>
              <li>Melampirkan dokumen pendukung asli berupa:
                <ul>
                  <li>Surat keterangan sakit/rawat inap dari rumah sakit (untuk Bantuan rawat inap)</li>
                  <li>Surat akta nikah dari KUA/Catatan Sipil (untuk Santunan pernikahan)</li>
                  <li>Akte kelahiran anak (untuk Tunjangan kelahiran)</li>
                  <li>Surat kematian dari RT/RW (untuk Santunan duka cita)</li>
                </ul>
              </li>
              <li>Pengajuan diserahkan selambat-lambatnya 14 hari kalender setelah tanggal kejadian.</li>
            </ol>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 8. DOWNLOAD PAGE */
export function DownloadPage({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDlId, setActiveDlId] = useState<string | null>(null);

  const docs = [
    { id: 'DOC-01', name: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) SKATA GSD', type: 'PDF Regulasi', size: '2.4 MB' },
    { id: 'DOC-02', name: 'Buku Saku Perjanjian Kerja Bersama (PKB) GSD Terbaru 2026', type: 'PDF PKB', size: '5.1 MB' },
    { id: 'DOC-03', name: 'Formulir Pengajuan Dana Kesejahteraan Anggota DPP', type: 'Dokumen Formulir', size: '480 KB' },
    { id: 'DOC-04', name: 'Formulir Permohonan Advokasi Bantuan Hukum Fisik', type: 'Dokumen Formulir', size: '512 KB' },
    { id: 'DOC-05', name: 'Panduan Registrasi Aplikasi Portal Anggota SKATA', type: 'PDF Panduan', size: '1.2 MB' },
  ];

  const filteredDocs = docs.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDownload = (id: string) => {
    setActiveDlId(id);
    setTimeout(() => {
      setActiveDlId(null);
      alert('File berhasil diunduh dan disimpan ke folder Download Anda!');
    }, 1200);
  };

  return (
    <SubPageLayout
      title="Download Dokumen"
      description="Akses pustaka digital dan unduh regulasi AD/ART, PKB, formulir klaim iuran, serta berbagai materi organisasi."
      icon={Download}
      onBack={onBack}
    >
      <div className="download-stage-panel">
        <div className="table-filter-row">
          <input
            type="text"
            className="search-input-field"
            placeholder="🔍 Cari nama dokumen atau regulasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID Dokumen</th>
                <th>Nama Berkas</th>
                <th>Tipe File</th>
                <th>Ukuran Berkas</th>
                <th>Aksi Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td><strong>{d.name}</strong></td>
                  <td><span className="doc-badge-type">{d.type}</span></td>
                  <td>{d.size}</td>
                  <td>
                    <button
                      className="button primary inline-dl-btn"
                      onClick={() => handleDownload(d.id)}
                      disabled={activeDlId === d.id}
                    >
                      {activeDlId === d.id ? 'Mengunduh...' : '📥 Unduh Berkas'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: '#666' }}>
                    Dokumen tidak ditemukan. Harap masukkan kata kunci pencarian lainnya.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 9. KOPERASI PAGE (LOAN & SAVINGS SIMULATOR) */
export function KoperasiPage({ onBack }: { onBack: () => void }) {
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [tenor, setTenor] = useState(12);

  // Interest rate 1% flat per month
  const monthlyInterest = useMemo(() => loanAmt * 0.01, [loanAmt]);
  const monthlyPrincipal = useMemo(() => loanAmt / tenor, [loanAmt, tenor]);
  const totalMonthlyInstallment = useMemo(() => monthlyPrincipal + monthlyInterest, [monthlyPrincipal, monthlyInterest]);

  return (
    <SubPageLayout
      title="Koperasi Karyawan SKATA"
      description="Unit usaha koperasi berazaskan kekeluargaan untuk memberikan layanan simpan pinjam produktif bagi seluruh anggota."
      icon={ShoppingBag}
      onBack={onBack}
    >
      <div className="koperasi-dashboard">
        <div className="ekta-grid">
          {/* Simulation Calculator */}
          <div className="ekta-controls">
            <h3>Simulasi Kredit Mandiri Koperasi</h3>
            <p>Atur jumlah pinjaman dan tenor di bawah ini untuk melihat simulasi angsuran bulanan Anda:</p>
            <div className="premium-form no-margin">
              <label>
                Jumlah Pinjaman (IDR)
                <span className="slider-val-lbl">Rp {loanAmt.toLocaleString('id-ID')}</span>
                <input
                  type="range"
                  min="1000000"
                  max="25000000"
                  step="500000"
                  value={loanAmt}
                  onChange={(e) => setLoanAmt(Number(e.target.value))}
                />
              </label>

              <label>
                Tenor / Jangka Waktu Angsuran
                <span className="slider-val-lbl">{tenor} Bulan</span>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  value={tenor}
                  onChange={(e) => setTenor(Number(e.target.value))}
                />
              </label>

              <div className="calc-result-box gold">
                <small>Suku Bunga flat 1% per Bulan</small>
                <div className="calc-row">
                  <span>Pokok Angsuran:</span>
                  <strong>Rp {Math.round(monthlyPrincipal).toLocaleString('id-ID')}</strong>
                </div>
                <div className="calc-row">
                  <span>Bunga Koperasi:</span>
                  <strong>Rp {Math.round(monthlyInterest).toLocaleString('id-ID')}</strong>
                </div>
                <div className="subpage-divider" style={{ margin: '8px 0' }} />
                <small>Total Tagihan / Bulan</small>
                <h2>Rp {Math.round(totalMonthlyInstallment).toLocaleString('id-ID')}</h2>
              </div>

              <button className="button primary w-full" onClick={() => alert('Simulasi pinjaman berhasil dikunci! Silakan hubungi admin pengurus Koperasi SKATA untuk mencetak formulir akad kredit fisik.')}>
                Ajukan Pinjaman Koperasi
              </button>
            </div>
          </div>

          <div className="ekta-card-container">
            <h3>Keunggulan Koperasi Karyawan SKATA</h3>
            <ul className="premium-list">
              <li><strong>Bunga Sangat Rendah:</strong> Hanya 1% flat per bulan, jauh di bawah standar pinjaman komersial / online.</li>
              <li><strong>Proses Cepat:</strong> Pencairan dalam waktu 2x24 jam kerja setelah disetujui dewan pengawas koperasi.</li>
              <li><strong>Sistem Potong Gaji:</strong> Pembayaran angsuran terintegrasi dengan pemotongan slip gaji bulanan sehingga praktis.</li>
              <li><strong>Sisa Hasil Usaha (SHU):</strong> Setiap partisipasi simpan pinjam berkontribusi langsung pada dividen SHU tahunan Anda.</li>
            </ul>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 10. SURVEY & POLLING PAGE (REAL VOTING MODULE) */
export function SurveyPage({ onBack }: { onBack: () => void }) {
  const [votedPoll1, setVotedPoll1] = useState<string | null>(null);
  const [votes1, setVotes1] = useState({ setuju: 148, ragu: 32, tidak: 12 });

  const [votedPoll2, setVotedPoll2] = useState<string | null>(null);
  const [votes2, setVotes2] = useState({ industrial: 84, k3: 65, keuangan: 43 });

  const totalVotes1 = useMemo(() => votes1.setuju + votes1.ragu + votes1.tidak, [votes1]);
  const totalVotes2 = useMemo(() => votes2.industrial + votes2.k3 + votes2.keuangan, [votes2]);

  const handleVote1 = (opt: 'setuju' | 'ragu' | 'tidak') => {
    if (votedPoll1) return;
    setVotes1({ ...votes1, [opt]: votes1[opt] + 1 });
    setVotedPoll1(opt);
  };

  const handleVote2 = (opt: 'industrial' | 'k3' | 'keuangan') => {
    if (votedPoll2) return;
    setVotes2({ ...votes2, [opt]: votes2[opt] + 1 });
    setVotedPoll2(opt);
  };

  return (
    <SubPageLayout
      title="Survey & Polling Anggota"
      description="Salurkan suara Anda pada survey dan pengambilan keputusan strategis organisasi SKATA secara demokratis."
      icon={TrendingUp}
      onBack={onBack}
    >
      <div className="surveys-container">
        <div className="ekta-grid">
          {/* Poll 1 */}
          <div className="poll-card">
            <h3>1. Pengesahan Perjanjian Kerja Bersama (PKB) GSD Periode 2026–2028</h3>
            <p className="poll-author">Dibuat oleh: DPP SKATA Bidang Hukum</p>
            <p className="poll-question">Apakah Anda setuju dengan draft rancangan kesejahteraan dan perlindungan karyawan pada draf PKB terbaru?</p>

            <div className="poll-options">
              {!votedPoll1 ? (
                <>
                  <button className="button outline" onClick={() => handleVote1('setuju')}>Setuju</button>
                  <button className="button outline" onClick={() => handleVote1('ragu')}>Ragu-ragu / Abstain</button>
                  <button className="button outline" onClick={() => handleVote1('tidak')}>Tidak Setuju</button>
                </>
              ) : (
                <div className="poll-results">
                  <p className="notif-vote">✓ Terima kasih! Hak suara Anda berhasil terverifikasi.</p>
                  
                  <div className="result-bar-item">
                    <span>Setuju ({votes1.setuju} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill red" style={{ width: `${(votes1.setuju / totalVotes1) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes1.setuju / totalVotes1) * 100)}%</small>
                  </div>

                  <div className="result-bar-item">
                    <span>Ragu-ragu ({votes1.ragu} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill" style={{ width: `${(votes1.ragu / totalVotes1) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes1.ragu / totalVotes1) * 100)}%</small>
                  </div>

                  <div className="result-bar-item">
                    <span>Tidak Setuju ({votes1.tidak} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill" style={{ width: `${(votes1.tidak / totalVotes1) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes1.tidak / totalVotes1) * 100)}%</small>
                  </div>
                  <small className="total-votes">Total Partisipan: {totalVotes1} Anggota</small>
                </div>
              )}
            </div>
          </div>

          {/* Poll 2 */}
          <div className="poll-card">
            <h3>2. Prioritas Program Pelatihan Hubungan Industrial & Sertifikasi</h3>
            <p className="poll-author">Dibuat oleh: DPP SKATA Bidang Diklat</p>
            <p className="poll-question">Jenis pelatihan atau diklat apa yang paling Anda butuhkan pada Triwulan III kepengurusan?</p>

            <div className="poll-options">
              {!votedPoll2 ? (
                <>
                  <button className="button outline" onClick={() => handleVote2('industrial')}>Negosiasi Hubungan Industrial</button>
                  <button className="button outline" onClick={() => handleVote2('k3')}>Sertifikasi K3 Umum Disnaker</button>
                  <button className="button outline" onClick={() => handleVote2('keuangan')}>Pengelolaan Finansial Mandiri</button>
                </>
              ) : (
                <div className="poll-results">
                  <p className="notif-vote">✓ Terima kasih! Hak suara Anda berhasil terverifikasi.</p>

                  <div className="result-bar-item">
                    <span>Negosiasi Hubungan Industrial ({votes2.industrial} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill gold" style={{ width: `${(votes2.industrial / totalVotes2) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes2.industrial / totalVotes2) * 100)}%</small>
                  </div>

                  <div className="result-bar-item">
                    <span>Sertifikasi K3 Umum Disnaker ({votes2.k3} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill" style={{ width: `${(votes2.k3 / totalVotes2) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes2.k3 / totalVotes2) * 100)}%</small>
                  </div>

                  <div className="result-bar-item">
                    <span>Pengelolaan Finansial Mandiri ({votes2.keuangan} suara)</span>
                    <div className="progress-bar-shell">
                      <div className="progress-bar-fill" style={{ width: `${(votes2.keuangan / totalVotes2) * 100}%` }} />
                    </div>
                    <small>{Math.round((votes2.keuangan / totalVotes2) * 100)}%</small>
                  </div>
                  <small className="total-votes">Total Partisipan: {totalVotes2} Anggota</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 11. ASPIRASI PAGE (REAL LIVE FEEDS TIMELINE) */
export function AspirasiPage({ onBack }: { onBack: () => void }) {
  const [aspirations, setAspirations] = useState([
    { nama: 'Diki Pradana', dpw: 'DPW II - Jawa Barat', text: 'Mohon peninjauan ulang terkait skema insentif kerja shift malam di area Bandung.', date: '30 Juli 2026', likes: 18 },
    { nama: 'Setyawan (Anonim)', dpw: 'DPW I - DKI Jakarta', text: 'Perlu diperbanyak pelatihan K3 bersertifikasi khusus untuk rekan-rekan teknisi lapangan.', date: '25 Juli 2026', likes: 24 },
  ]);

  const [form, setForm] = useState({ nama: '', dpw: 'DPW II - Jawa Barat', teks: '', anonim: false });
  const [submitted, setSubmitted] = useState(false);

  const handlePostAspiration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teks) return;

    const newAsp = {
      nama: form.anonim ? 'Anggota (Anonim)' : (form.nama || 'Anggota Umum'),
      dpw: form.dpw,
      text: form.teks,
      date: 'Hari ini',
      likes: 0,
    };

    setAspirations([newAsp, ...aspirations]);
    setSubmitted(true);
    setForm({ nama: '', dpw: 'DPW II - Jawa Barat', teks: '', anonim: false });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (idx: number) => {
    const nextList = [...aspirations];
    nextList[idx].likes += 1;
    setAspirations(nextList);
  };

  return (
    <SubPageLayout
      title="Hub Aspirasi Anggota"
      description="Sampaikan aspirasi, aduan, saran, dan gagasan konstruktif Anda secara bebas demi kemajuan Serikat Karyawan GSD."
      icon={Send}
      onBack={onBack}
    >
      <div className="advokasi-dashboard">
        <div className="ekta-grid">
          {/* Submission Form */}
          <div className="ekta-controls">
            <h3>Sampaikan Aspirasi Anda</h3>
            <form onSubmit={handlePostAspiration} className="premium-form no-margin">
              <label>
                Nama Penyampai Aspirasi
                <input
                  type="text"
                  placeholder="Masukkan nama Anda (atau centang anonim)"
                  value={form.nama}
                  disabled={form.anonim}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </label>
              <div className="checkbox-block" style={{ marginBottom: '14px' }}>
                <input
                  type="checkbox"
                  id="anonim"
                  checked={form.anonim}
                  onChange={(e) => setForm({ ...form, anonim: e.target.checked })}
                />
                <label htmlFor="anonim">Kirimkan sebagai Anonim (Sembunyikan Nama)</label>
              </div>
              <label>
                Wilayah Pengurus (DPW Anda)
                <select value={form.dpw} onChange={(e) => setForm({ ...form, dpw: e.target.value })}>
                  <option>DPW I - Sumatera</option>
                  <option>DPW II - DKI & Banten</option>
                  <option>DPW III - Jawa Timur & Bali</option>
                  <option>DPW IV - Kalimantan</option>
                  <option>DPW V - Sulawesi & Timur</option>
                </select>
              </label>
              <label>
                Isi Lengkap Aspirasi / Saran
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan ide, kritik, atau saran Anda dengan sopan dan membangun..."
                  value={form.teks}
                  onChange={(e) => setForm({ ...form, teks: e.target.value })}
                />
              </label>
              <button type="submit" className="button primary w-full">
                Kirim Aspirasi ke DPP
              </button>
              {submitted && (
                <p className="success-inline-message" style={{ color: 'green', fontSize: '12px', marginTop: '8px' }}>
                  ✓ Aspirasi berhasil diposting! Aspirasi Anda akan ditinjau langsung oleh Dewan Pengurus.
                </p>
              )}
            </form>
          </div>

          {/* Aspirasi Timeline */}
          <div className="ekta-card-container">
            <h3>Timeline Aspirasi Masuk Terbaru</h3>
            <p>Daftar aspirasi terkini dari berbagai wilayah kepengurusan:</p>
            <div className="timeline-list">
              {aspirations.map((a, idx) => (
                <div className="timeline-item-card" key={idx}>
                  <div className="timeline-meta">
                    <strong>{a.nama}</strong>
                    <span>{a.dpw}</span>
                  </div>
                  <p className="timeline-body">{a.text}</p>
                  <div className="timeline-footer">
                    <small>Dibuat: {a.date}</small>
                    <button className="like-btn" onClick={() => handleLike(idx)}>
                      ❤️ Dukung ({a.likes})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 12. BERITA PAGE (NEWS DIRECTORY WITH FULL MODAL VIEW & TULIS BERITA FORM) */
export function BeritaPage({ onBack }: { onBack: () => void }) {
  const [activeCat, setActiveCat] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [readingArticle, setReadingArticle] = useState<any | null>(null);

  // Form states for writing new news
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Berita Utama');
  const [newBody, setNewBody] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoPreview, setNewPhotoPreview] = useState('/assets/skata-hero-visual.png');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const REMOVED_TITLES = [
    'SKATA Memperkuat Kolaborasi dan Hubungan Industrial yang Harmonis',
    'Rapat Anggota Tahunan SKATA 2026',
    'Pembaruan Data dan Verifikasi Anggota',
    'Program Pelatihan Hubungan Industrial',
  ];

  const [articles, setArticles] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('skata_news_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item: any) => !REMOVED_TITLES.includes(item.title));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Real-time listener for Firestore news
  useEffect(() => {
    const unsubscribe = subscribeNewsArticles((firestoreArticles) => {
      const filtered = firestoreArticles.filter((item) => !REMOVED_TITLES.includes(item.title));
      setArticles(filtered);
      safeSetLocalStorage('skata_news_articles', filtered);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Read query parameter if any
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat === 'agenda') {
      setActiveCat('Agenda');
    }
    const articleId = params.get('id');
    if (articleId && articles.length > 0) {
      const found = articles.find((a) => a.id === articleId);
      if (found) setReadingArticle(found);
    }
  }, [articles]);

  const handleDeleteNews = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    // Delete from Firestore
    try {
      await deleteNewsArticleFirebase(id);
    } catch {
      // Fallback local update
    }

    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    safeSetLocalStorage('skata_news_articles', updated);
    if (readingArticle && readingArticle.id === id) {
      setReadingArticle(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setNewPhotoPreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const now = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const excerptText = newBody.trim().length > 150 ? newBody.trim().substring(0, 147) + '...' : newBody.trim();

    const newArticleData = {
      category: newCategory,
      title: newTitle.trim(),
      excerpt: excerptText,
      body: newBody.trim(),
      date: formattedDate,
      image: newPhotoPreview || '/assets/skata-hero-visual.png',
      createdAt: new Date().toISOString()
    };

    try {
      const docId = await addNewsArticleFirebase(newArticleData);
      const newArticle = { id: docId, ...newArticleData };
      const updatedArticles = [newArticle, ...articles.filter(a => a.id !== docId)];
      setArticles(updatedArticles);
      safeSetLocalStorage('skata_news_articles', updatedArticles);
    } catch (err) {
      // Fallback
      const fallbackArticle = { id: `ART-${Date.now()}`, ...newArticleData };
      const updatedArticles = [fallbackArticle, ...articles];
      setArticles(updatedArticles);
      safeSetLocalStorage('skata_news_articles', updatedArticles);
    }

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsWriting(false);
      // Reset form
      setNewTitle('');
      setNewBody('');
      setNewCategory('Berita Utama');
      setNewPhotoUrl('');
      setNewPhotoPreview('/assets/skata-hero-visual.png');
    }, 1200);
  };

  const filtered = articles.filter(
    (a) =>
      (activeCat === 'Semua' || a.category === activeCat) &&
      (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <SubPageLayout
      title="Portal Berita & Agenda"
      description="Dapatkan berita utama, kalender agenda organisasi, diklat pengumuman resmi dari dewan pengurus pusat SKATA GSD."
      icon={CalendarDays}
      onBack={onBack}
    >
      <div className="news-page-container">
        {/* Top Control Bar: Search, Category Filters, and Write News Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Daftar Berita & Pengumuman</h3>
            <button
              className="button primary"
              onClick={() => setIsWriting(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              ✍️ Tulis Berita Baru
            </button>
          </div>

          <div className="table-filter-row" style={{ gap: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              className="search-input-field"
              style={{ flex: 1, minWidth: '240px' }}
              placeholder="🔍 Cari berita, agenda, atau program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="category-pill-row">
              {['Semua', 'Berita Utama', 'Agenda', 'Pengumuman', 'Pendidikan'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="org-grid-two" style={{ marginTop: '16px' }}>
          {filtered.map((a) => (
            <div className="news-grid-card" key={a.id}>
              <div className="news-card-img-shell">
                <img src={a.image} alt={a.title} onError={(e) => { (e.target as HTMLImageElement).src = '/assets/skata-hero-visual.png'; }} />
                <span className="news-card-cat-badge">{a.category}</span>
              </div>
              <div className="news-card-body">
                <small className="news-card-date">📅 {a.date}</small>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button className="button outline" style={{ flex: 1 }} onClick={() => setReadingArticle(a)}>
                    Baca Selengkapnya
                  </button>
                  <button
                    className="button outline"
                    style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '6px 12px' }}
                    onClick={(e) => handleDeleteNews(a.id, e)}
                    title="Hapus Berita Ini"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', gridColumn: 'span 2', padding: '48px 20px', background: '#f8f9fa', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                {articles.length === 0
                  ? 'Belum ada berita yang diterbitkan.'
                  : 'Tidak ada berita yang cocok dengan pencarian Anda.'}
              </p>
              <button
                className="button primary"
                onClick={() => setIsWriting(true)}
                style={{ fontSize: '13px' }}
              >
                ✍️ Tulis Berita Pertama
              </button>
            </div>
          )}
        </div>

        {/* Modal Tulis Berita Baru */}
        {isWriting && (
          <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsWriting(false)}>
            <div
              className="login-modal"
              style={{ width: 'min(740px, 95%)', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}
              role="dialog"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsWriting(false)}>
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(223, 18, 26, 0.1)', color: 'var(--red)', width: '44px', height: '44px', borderRadius: '12px', display: 'grid', placeItems: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                  ✍️
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 800 }}>Tulis & Terbitkan Berita Baru</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                    Publikasikan kabar terbaru, pengumuman resmi, atau agenda organisasi SKATA
                  </p>
                </div>
              </div>

              <form onSubmit={handlePublishNews} className="premium-form no-margin">
                {/* 1. Foto Berita */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                    📷 Foto Berita (Gambar Sampul)
                  </label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '140px',
                        height: '90px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.12)',
                        background: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={newPhotoPreview}
                        alt="Preview Foto Berita"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/skata-hero-visual.png'; }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          id="news-photo-upload"
                          style={{ display: 'none' }}
                          onChange={handlePhotoUpload}
                        />
                        <label
                          htmlFor="news-photo-upload"
                          className="button outline"
                          style={{ cursor: 'pointer', display: 'inline-flex', fontSize: '13px', padding: '6px 14px' }}
                        >
                          📁 Unggah Foto Berita
                        </label>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <small style={{ color: '#666', fontSize: '12px' }}>atau tempelkan URL Gambar Foto Berita:</small>
                        <input
                          type="url"
                          placeholder="https://domain.com/foto-berita.jpg"
                          value={newPhotoUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewPhotoUrl(val);
                            if (val.trim()) {
                              setNewPhotoPreview(val.trim());
                            } else {
                              setNewPhotoPreview('/assets/skata-hero-visual.png');
                            }
                          }}
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Judul Berita */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                    📝 Judul Berita
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul berita atau artikel..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)' }}
                  />
                </div>

                {/* 3. Kategori */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                    🏷️ Kategori Berita
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', background: '#fff' }}
                  >
                    <option value="Berita Utama">Berita Utama</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Pendidikan">Pendidikan</option>
                  </select>
                </div>

                {/* 4. Isi Berita */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13.5px', marginBottom: '6px' }}>
                    📰 Isi Berita
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tuliskan isi berita secara lengkap, rinci, dan informatif..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', lineHeight: '1.5' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button type="button" className="button outline" onClick={() => setIsWriting(false)}>
                    Batal
                  </button>
                  <button type="submit" className="button primary">
                    🚀 Terbitkan Berita
                  </button>
                </div>

                {publishSuccess && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '10px 16px',
                      background: '#dcfce7',
                      color: '#15803d',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    ✓ Berita berhasil diterbitkan!
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Modal Reading View */}
        {readingArticle && (
          <div className="modal-backdrop" role="presentation" onMouseDown={() => setReadingArticle(null)}>
            <div
              className="login-modal"
              style={{ width: 'min(720px, 95%)', textAlign: 'left' }}
              role="dialog"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setReadingArticle(null)}>
                ✕
              </button>
              <span className="news-card-cat-badge" style={{ display: 'inline-block', marginBottom: '12px' }}>
                {readingArticle.category}
              </span>
              <h2 style={{ fontSize: '24px', lineHeight: '1.2', margin: '0 0 10px' }}>{readingArticle.title}</h2>
              <p style={{ color: 'var(--red)', fontWeight: '800', fontSize: '13px', marginBottom: '20px' }}>
                📅 {readingArticle.date} — Diterbitkan DPP SKATA GSD
              </p>
              
              <div style={{ maxHeight: '350px', overflowY: 'auto', fontSize: '15px', lineHeight: '1.6', color: '#444' }}>
                <p style={{ fontWeight: '700', marginBottom: '16px' }}>{readingArticle.excerpt}</p>
                <p style={{ whitespace: 'pre-line' }}>{readingArticle.body}</p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  className="button outline"
                  style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '13px' }}
                  onClick={() => handleDeleteNews(readingArticle.id)}
                >
                  🗑️ Hapus Berita Ini
                </button>
                <button className="button primary" style={{ fontSize: '13px' }} onClick={() => setReadingArticle(null)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}

/* 13. KONTAK PAGE */
export function KontakPage({ onBack }: { onBack: () => void }) {
  const [msgSent, setMsgSent] = useState(false);

  return (
    <SubPageLayout
      title="Hubungi SKATA GSD"
      description="Punya pertanyaan, usulan, atau membutuhkan pendampingan kerja lapangan? Hubungi layanan sekretariat SKATA DPP dan DPW."
      icon={Phone}
      onBack={onBack}
    >
      <div className="ekta-grid">
        <div className="ekta-controls">
          <h3>Kirim Pesan Langsung ke DPP</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMsgSent(true);
              setTimeout(() => setMsgSent(false), 4000);
            }}
            className="premium-form no-margin"
          >
            <label>
              Nama Anda
              <input type="text" required placeholder="Masukkan nama lengkap Anda" />
            </label>
            <label>
              Nomor WhatsApp / Kontak
              <input type="text" required placeholder="Masukkan nomor WhatsApp aktif" />
            </label>
            <label>
              Detail Pertanyaan / Usulan
              <textarea required rows={4} placeholder="Tuliskan pesan Anda kepada sekretariat..." />
            </label>
            <button type="submit" className="button primary w-full">
              Kirim Pesan ✓
            </button>
            {msgSent && (
              <p className="success-inline-message" style={{ color: 'green', fontSize: '12px', marginTop: '8px' }}>
                ✓ Pesan berhasil dikirim ke dewan pengurus! Kami akan merespon dalam waktu dekat.
              </p>
            )}
          </form>
        </div>

        <div className="ekta-card-container">
          <h3>Direktori Sekretariat SKATA</h3>
          <div className="footer-contact" style={{ display: 'grid', gap: '16px', color: 'inherit' }}>
            <div>
              <strong>Sekretariat DPP SKATA</strong>
              <p style={{ marginTop: '4px', lineHeight: '1.5' }}>
                Ruang Merapi Gedung Menara Multimedia Jl. Kebon Sirih No.10 11, RT.11/RW.2, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110
              </p>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', color: 'inherit' }}>
                <span>✉️ <strong>Email:</strong> dppskata@gmail.com</span>
                <span>📞 <strong>Telepon:</strong> +62 853-3284-4752 (Wisnu) | +62 812-8346-6000 (Alya)</span>
              </div>
            </div>
            <div className="subpage-divider" style={{ margin: '4px 0' }} />
            <div>
              <strong>Hubungi Pengurus Wilayah (DPW):</strong>
              <ul className="premium-list" style={{ marginTop: '8px', fontSize: '13px' }}>
                <li><strong>DPW I Sumatera:</strong> Ade Hermansyah (dpw1@skata-gsd.or.id)</li>
                <li><strong>DPW II DKI & Banten:</strong> Asep Saipul Bahry (dpw2@skata-gsd.or.id)</li>
                <li><strong>DPW III Jawa Timur & Bali:</strong> Angga Eka Saputra (dpw3@skata-gsd.or.id)</li>
                <li><strong>DPW IV Kalimantan:</strong> Moh. Abdulloh Hadi (dpw4@skata-gsd.or.id)</li>
                <li><strong>DPW V Sulawesi & Timur:</strong> Muhammad Afdhal Syahrullah (dpw5@skata-gsd.or.id)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/* 14. LOGIN PAGE */
export function LoginPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      alert('Harap masukkan email/NIK dan kata sandi Anda.');
      return;
    }
    setLoggedIn(true);
  };

  return (
    <SubPageLayout
      title="Login Anggota SKATA"
      description="Gunakan hak akses keanggotaan terverifikasi Anda untuk mengelola e-KTA, mengajukan iuran, aduan hukum, dan klaim kesejahteraan."
      icon={Lock}
      onBack={onBack}
    >
      <div className="form-card-wrapper" style={{ maxWidth: '480px', marginInline: 'auto' }}>
        {!loggedIn ? (
          <form onSubmit={handleLoginSubmit} className="premium-form">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img src="/assets/skata-logo-official.png" style={{ width: '80px', height: 'auto', marginBottom: '12px' }} alt="SKATA" />
              <h2>Sistem Layanan Anggota</h2>
              <p style={{ fontSize: '13px', color: '#666' }}>Silakan login menggunakan NIK atau email terdaftar Anda.</p>
            </div>

            <label>
              Alamat Email / NIK Karyawan
              <input
                type="text"
                required
                placeholder="Masukkan email atau NIK Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Kata Sandi Anda
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi Anda"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </label>

            <button type="submit" className="button primary w-full" style={{ marginTop: '12px' }}>
              Masuk Layanan Anggota
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '14px', color: 'var(--red)' }}>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Modul reset sandi sedang dikembangkan.'); }}>Lupa kata sandi?</a>
              <a href="/layanan/keanggotaan">Daftar Anggota Baru</a>
            </div>
            <small style={{ display: 'block', textAlign: 'center', marginTop: '24px', color: '#888' }}>
              Sistem Otentikasi Terenkripsi © DPP SKATA GSD
            </small>
          </form>
        ) : (
          <div className="success-form-panel" style={{ textAlign: 'center' }}>
            <span className="success-glow">✓</span>
            <h2>Selamat Datang Kembali!</h2>
            <p>Sesi login untuk <strong>{email}</strong> berhasil dibuat.</p>
            <p className="note-text" style={{ fontSize: '13px' }}>
              Anda sekarang memiliki akses penuh ke portal iuran koperasi, verifikasi e-KTA, dan helpdesk hukum SKATA.
            </p>
            <button className="button primary w-full" onClick={() => setLoggedIn(false)}>
              Keluar Sesi / Logout
            </button>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}
