import { useState } from 'react';
import { ArrowLeft, Users, ShieldCheck, ClipboardCheck, ArrowRight, Upload, HelpCircle, CheckCircle } from 'lucide-react';
import { saveMembershipSubmissionFirebase, safeSetLocalStorage } from '../lib/firestoreService';
import { TotalAnggotaTable } from './TotalAnggotaTable';

interface KeanggotaanPageProps {
  onBack: () => void;
  showFormInitially?: boolean;
  defaultTab?: 'total' | 'info' | 'daftar';
}

// Service Architecture using Firebase Firestore
export async function saveMembershipSubmission(data: any): Promise<boolean> {
  try {
    // Save to Firebase Firestore
    const firebaseSuccess = await saveMembershipSubmissionFirebase(data);

    // Save to LocalStorage fallback
    let list: any[] = [];
    try {
      const existing = localStorage.getItem('skata_membership_submissions');
      list = existing ? JSON.parse(existing) : [];
    } catch {
      // ignore
    }
    
    const newSubmission = {
      ...data,
      id: `MEM-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Diverifikasi oleh Administrator'
    };
    
    list.push(newSubmission);
    safeSetLocalStorage('skata_membership_submissions', list);
    window.dispatchEvent(new Event('skata_members_updated'));
    
    return firebaseSuccess || true;
  } catch (error) {
    console.error('Error saving membership submission:', error);
    return false;
  }
}

export function KeanggotaanPage({ onBack, showFormInitially = false, defaultTab }: KeanggotaanPageProps) {
  const [activeTab, setActiveTab] = useState<'total' | 'info' | 'daftar'>(
    (defaultTab === 'excel' ? 'total' : defaultTab) || (showFormInitially ? 'daftar' : 'total')
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    corpEmail: '',
    phone: '',
    unit: '',
    position: '',
    workLocation: '',
    dpw: 'DPW 1',
    dpc: '',
    dateJoined: '',
    declaration: false,
    authDeduction: false,
    fileName: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nik || !formData.fullName || !formData.corpEmail || !formData.phone) {
        alert('Mohon lengkapi semua data pribadi wajib.');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration || !formData.authDeduction) {
      alert('Anda harus menyetujui pernyataan keanggotaan dan otorisasi pemotongan iuran.');
      return;
    }

    setIsSubmitting(true);
    const success = await saveMembershipSubmission(formData);
    setIsSubmitting(false);

    if (success) {
      setSubmittedData({ ...formData });
      setStep(3);
    } else {
      alert('Gagal mengirimkan pendaftaran. Silakan coba beberapa saat lagi.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      nik: '',
      fullName: '',
      corpEmail: '',
      phone: '',
      unit: '',
      position: '',
      workLocation: '',
      dpw: 'DPW 1',
      dpc: '',
      dateJoined: '',
      declaration: false,
      authDeduction: false,
      fileName: ''
    });
    setStep(1);
    setActiveTab('info');
  };

  const membershipSteps = [
    { num: 1, text: "Lengkapi formulir pendaftaran digital secara lengkap" },
    { num: 2, text: "Kirim otorisasi pemotongan iuran keanggotaan berkala" },
    { num: 3, text: "Verifikasi dokumen dan NIK oleh administrator SKATA" },
    { num: 4, text: "Persetujuan dan validasi oleh Ketua DPW wilayah asal" },
    { num: 5, text: "Aktivasi nomor keanggotaan resmi (NIA) dalam sistem" },
    { num: 6, text: "Penerbitan e-KTA digital ber-QR Code untuk akses layanan" }
  ];

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* Tabs */}
      <div className="tab-navigation" style={{ marginBottom: '32px' }}>
        <button className={activeTab === 'total' ? 'active' : ''} onClick={() => setActiveTab('total')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Users size={16} /> Total Anggota Aktif
        </button>
        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
          Informasi Keanggotaan
        </button>
        <button className={activeTab === 'daftar' ? 'active' : ''} onClick={() => setActiveTab('daftar')}>
          Pendaftaran Digital
        </button>
      </div>

      {activeTab === 'total' && (
        <TotalAnggotaTable />
      )}

      {activeTab === 'info' && (
        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Eligibility alert */}
          <div style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
            border: '1.5px solid var(--red, #ff2424)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--red, #ff2424)', flexShrink: 0 }}><ShieldCheck size={40} /></span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: '0 0 6px 0' }}>Ketentuan & Kelayakan Anggota</h3>
              <p style={{ fontSize: '15px', color: '#444', margin: 0, lineHeight: 1.5 }}>
                Keanggotaan SKATA ditujukan <strong>khusus bagi karyawan tetap PT Graha Sarana Duta</strong> yang bersedia tunduk pada AD/ART organisasi serta menyepakati ketentuan iuran bulanan untuk operasional serikat.
              </p>
            </div>
          </div>

          {/* Workflow */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--red, #ff2424)' }}><ClipboardCheck size={22} /></span> Alur Proses Pendaftaran Anggota
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {membershipSteps.map((s) => (
                <div key={s.num} style={{
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--red, #ff2424)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    flexShrink: 0
                  }}>{s.num}</span>
                  <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.5, fontWeight: 500 }}>{s.text}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button
                className="button primary"
                onClick={() => setActiveTab('daftar')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingInline: '28px' }}
              >
                Mulai Pendaftaran Digital <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'daftar' && (
        <div style={{ maxWidth: '640px', marginInline: 'auto' }}>
          {/* Steps Indicator */}
          {step < 3 && (
            <div className="form-steps-indicator" style={{ marginBottom: '32px' }}>
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}><span>1</span><p>Data Karyawan</p></div>
              <div className="step-line" />
              <div className={`step-dot ${step === 2 ? 'active' : ''}`}><span>2</span><p>Pernyataan & Berkas</p></div>
            </div>
          )}

          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '24px' }}>Langkah 1: Informasi Dasar Pekerja</h3>
                <div className="form-fields" style={{ display: 'grid', gap: '16px' }}>
                  <label>
                    Nomor Induk Karyawan (NIK)
                    <input
                      type="text"
                      required
                      placeholder="Masukkan NIK GSD Anda"
                      value={formData.nik}
                      onChange={(e) => handleInputChange('nik', e.target.value)}
                    />
                  </label>

                  <label>
                    Nama Lengkap (Sesuai KTP)
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </label>

                  <label>
                    Email Korporat PT GSD
                    <input
                      type="email"
                      required
                      placeholder="username@gsd.co.id"
                      value={formData.corpEmail}
                      onChange={(e) => handleInputChange('corpEmail', e.target.value)}
                    />
                  </label>

                  <label>
                    Nomor WhatsApp / Telepon
                    <input
                      type="tel"
                      required
                      placeholder="0812XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      Jabatan
                      <input
                        type="text"
                        placeholder="Contoh: Teknisi, Staff, Supervisor"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                      />
                    </label>
                    <label>
                      Unit Kerja / Penempatan
                      <input
                        type="text"
                        placeholder="Contoh: FM Gegerkaleng"
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      Wilayah DPP / DPW
                      <select
                        value={formData.dpw}
                        onChange={(e) => handleInputChange('dpw', e.target.value)}
                      >
                        <option>DPP (Dewan Pengurus Pusat)</option>
                        <option>DPW 1</option>
                        <option>DPW 2</option>
                        <option>DPW 3</option>
                        <option>DPW 4</option>
                        <option>DPW 5</option>
                      </select>
                    </label>
                    <label>
                      Nama DPC (Bila Ada)
                      <input
                        type="text"
                        placeholder="Contoh: DPC GSD Gegerkaleng"
                        value={formData.dpc}
                        onChange={(e) => handleInputChange('dpc', e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    Tanggal Mulai Bekerja di GSD
                    <input
                      type="date"
                      value={formData.dateJoined}
                      onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                    />
                  </label>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="button primary" style={{ paddingInline: '24px' }}>
                    Lanjutkan Langkah 2
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitForm}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '24px' }}>Langkah 2: Pernyataan & Dokumen Pelengkap</h3>

                {/* Upload Section */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '8px' }}>
                    Upload SK Karyawan Tetap / Identitas Pendukung
                  </label>
                  <div style={{
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fafafa'
                  }} onClick={() => {
                    const fakeFileName = `SK_KARYAWAN_${formData.nik || 'GSD'}.pdf`;
                    handleInputChange('fileName', fakeFileName);
                  }}>
                    <span style={{ color: 'var(--red, #ff2424)', marginBottom: '8px', display: 'block' }}><Upload size={28} style={{ marginInline: 'auto' }} /></span>
                    <strong style={{ fontSize: '14px', color: '#333' }}>Klik untuk memilih atau seret file PDF / Image</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>Ukuran maks 5MB (PDF, JPG, PNG)</p>
                    {formData.fileName && (
                      <div style={{ marginTop: '12px', color: 'green', fontSize: '13px', fontWeight: 600 }}>
                        ✓ Berkas terpilih: {formData.fileName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Declarations */}
                <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                  <div className="checkbox-block" style={{ alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      id="declaration"
                      checked={formData.declaration}
                      onChange={(e) => handleInputChange('declaration', e.target.checked)}
                      required
                    />
                    <label htmlFor="declaration" style={{ fontSize: '14px', color: '#444', lineHeight: 1.5 }}>
                      <strong>Pernyataan Menjadi Anggota SKATA:</strong> Dengan penuh kesadaran dan tanpa paksaan dari pihak mana pun, saya menyatakan diri bergabung menjadi anggota Serikat Karyawan Graha Sarana Duta serta bersedia tunduk pada AD/ART organisasi.
                    </label>
                  </div>

                  <div className="checkbox-block" style={{ alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      id="authDeduction"
                      checked={formData.authDeduction}
                      onChange={(e) => handleInputChange('authDeduction', e.target.checked)}
                      required
                    />
                    <label htmlFor="authDeduction" style={{ fontSize: '14px', color: '#444', lineHeight: 1.5 }}>
                      <strong>Otorisasi Pemotongan Iuran (Dues):</strong> Saya dengan ini memberikan kewenangan penuh kepada Bendahara DPP SKATA dan unit payroll Perusahaan untuk melakukan pemotongan upah bulanan saya secara otomatis sebesar tarif iuran resmi yang ditetapkan oleh ketetapan organisasi.
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <button type="button" className="button outline" onClick={() => setStep(1)}>
                    Kembali
                  </button>
                  <button type="submit" className="button primary" disabled={isSubmitting} style={{ paddingInline: '24px' }}>
                    {isSubmitting ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  marginBottom: '24px'
                }}>
                  <CheckCircle size={36} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#333', marginBottom: '12px' }}>Pendaftaran Berhasil Dikirim!</h2>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', marginInline: 'auto' }}>
                  Terima kasih, rekan <strong>{submittedData?.fullName}</strong>. Data registrasi keanggotaan Anda dengan NIK <strong>{submittedData?.nik}</strong> telah tersimpan di sistem antrean admin SKATA.
                </p>

                <div style={{
                  background: '#fcf8e3',
                  border: '1px solid #faf2cc',
                  color: '#8a6d3b',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  marginBottom: '32px',
                  textAlign: 'left'
                }}>
                  <strong>Status Antrean Anda:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                    <li>Verifikasi administrasi oleh DPP</li>
                    <li>Sistem akan menerbitkan kartu digital e-KTA setelah disetujui Ketua DPW terkait</li>
                    <li>Notifikasi berkala akan dikirim via email dan nomor WA Anda</li>
                  </ul>
                </div>

                <button className="button primary" onClick={handleResetForm}>
                  Selesai & Kembali ke Beranda
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
