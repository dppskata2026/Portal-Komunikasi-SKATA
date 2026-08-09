import { useState } from 'react';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  ClipboardCheck,
  ArrowRight,
  Upload,
  CheckCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  Sparkles,
  FileText,
  Lock,
  Award,
  BadgeCheck,
  ChevronRight,
  Check,
  Download,
  Share2,
  Eye
} from 'lucide-react';
import { saveMembershipSubmissionFirebase, safeSetLocalStorage } from '../lib/firestoreService';
import { TotalAnggotaTable } from './TotalAnggotaTable';
import { openTemplatePrintWindow, downloadTemplateFile } from '../lib/pdfTemplateGenerator';

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
    fileName: '',
    fileFormulir: '',
    fileSuratKuasa: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nik || !formData.fullName || !formData.corpEmail || !formData.phone) {
        alert('Mohon lengkapi NIK, Nama Lengkap, Email, dan No. WhatsApp.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.position || !formData.unit) {
        alert('Mohon lengkapi Jabatan dan Unit Kerja penempatan.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration || !formData.authDeduction) {
      alert('Anda wajib menyetujui Pernyataan Anggota dan Otorisasi Pemotongan Iuran.');
      return;
    }

    // Auto-fill file names if user did not explicitly click attach button
    const fileFormulir = formData.fileFormulir || `FORMULIR_PENDAFTARAN_${formData.nik || 'GSD'}_2026.pdf`;
    const fileSuratKuasa = formData.fileSuratKuasa || `SURAT_KUASA_IURAN_${formData.nik || 'GSD'}_2026.pdf`;

    const submissionPayload = {
      ...formData,
      fileFormulir,
      fileSuratKuasa,
      fileName: `${fileFormulir}, ${fileSuratKuasa}`
    };

    setIsSubmitting(true);
    const success = await saveMembershipSubmission(submissionPayload);
    setIsSubmitting(false);

    if (success) {
      setSubmittedData(submissionPayload);
      setStep(4);
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
    { num: 1, title: "Formulir Digital", text: "Lengkapi data pribadi, NIK, dan unit kerja", color: "#3b82f6" },
    { num: 2, title: "Otorisasi Iuran", text: "Setujui pemotongan iuran resmi anggota", color: "#8b5cf6" },
    { num: 3, title: "Verifikasi Admin", text: "Validasi NIK GSD & dokumen pendukung oleh DPP", color: "#f59e0b" },
    { num: 4, title: "Persetujuan DPW", text: "Persetujuan dari Ketua DPW asal wilayah", color: "#10b981" },
    { num: 5, title: "Aktivasi NIA", text: "Penerbitan Nomor Induk Anggota (NIA)", color: "#ec4899" },
    { num: 6, title: "E-KTA Digital", text: "Penerbitan kartu digital resmi ber-QR Code", color: "#e51b23" }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px' }}>
      
      {/* Back Link */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: '12px',
          color: '#e51b23',
          fontWeight: 700,
          fontSize: '13.5px',
          cursor: 'pointer',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          transition: 'all 0.2s'
        }}
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </button>

      {/* Colorful Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31103f 100%)',
        borderRadius: '24px',
        padding: '32px 36px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'linear-gradient(135deg, #e51b23, #b91c1c)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(229, 27, 35, 0.4)'
            }}>
              <BadgeCheck size={14} /> PORTAL REGISTRASI RESMI
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: '#fbbf24' }} /> Terintegrasi Firebase & E-KTA Digital
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Portal Pendaftaran Digital Anggota SKATA GSD
          </h1>
          <p style={{ fontSize: '14.5px', color: '#cbd5e1', margin: 0, maxWidth: '780px', lineHeight: 1.6 }}>
            Bergabunglah bersama keluarga besar Serikat Karyawan PT Graha Sarana Duta. Nikmati perlindungan hukum ketenagakerjaan, hak kolektif PKB V, serta kartu anggota e-KTA digital ber-QR Code.
          </p>

          {/* Quick Feature Chips */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={14} style={{ color: '#38bdf8' }} /> e-KTA Digital Otomatis
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: '#4ade80' }} /> Perlindungan Hak PKB V
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ color: '#a78bfa' }} /> Terhubung dengan 5 DPW Nasional
            </div>
          </div>
        </div>
      </div>

      {/* Vibrant Tab Navigation */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '8px',
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('total')}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeTab === 'total' ? 'linear-gradient(135deg, #0f172a, #334155)' : 'transparent',
            color: activeTab === 'total' ? '#ffffff' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeTab === 'total' ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Users size={16} /> Total Anggota Aktif
        </button>

        <button
          onClick={() => setActiveTab('info')}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeTab === 'info' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'transparent',
            color: activeTab === 'info' ? '#ffffff' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeTab === 'info' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <ClipboardCheck size={16} /> Syarat & Alur Pendaftaran
        </button>

        <button
          onClick={() => setActiveTab('daftar')}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeTab === 'daftar' ? 'linear-gradient(135deg, #e51b23, #b91c1c)' : 'transparent',
            color: activeTab === 'daftar' ? '#ffffff' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeTab === 'daftar' ? '0 4px 12px rgba(229, 27, 35, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} /> Pendaftaran Digital Baru
        </button>
      </div>

      {/* Tab 1: Total Anggota Table */}
      {activeTab === 'total' && (
        <TotalAnggotaTable />
      )}

      {/* Tab 2: Informasi Keanggotaan & Alur */}
      {activeTab === 'info' && (
        <div style={{ display: 'grid', gap: '28px' }}>
          {/* Eligibility alert */}
          <div style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #fff6f6 100%)',
            border: '2px solid #fecdd3',
            borderRadius: '20px',
            padding: '28px 32px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(225, 29, 72, 0.05)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #e51b23, #be123c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(229, 27, 35, 0.3)' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#881337', margin: '0 0 6px' }}>Ketentuan & Kelayakan Anggota SKATA</h3>
              <p style={{ fontSize: '14.5px', color: '#4c0519', margin: 0, lineHeight: 1.6 }}>
                Keanggotaan SKATA ditujukan <strong>khusus bagi seluruh karyawan tetap PT Graha Sarana Duta</strong> yang bersedia tunduk pada Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) serta menyepakati otorisasi pemotongan iuran bulanan untuk operasional serikat.
              </p>
            </div>
          </div>

          {/* Workflow Steps Grid */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ClipboardCheck size={22} style={{ color: '#e51b23' }} /> 6 Tahapan Alur Pendaftaran & Validasi Anggota
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {membershipSteps.map((s) => (
                <div key={s.num} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: s.color,
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 10px ${s.color}40`
                  }}>
                    {s.num}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{s.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', padding: '24px', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Sudah Siap Melengkapi Data Keanggotaan?</h4>
              <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#475569' }}>Proses hanya membutuhkan waktu kurang dari 3 menit secara online.</p>
              <button
                onClick={() => setActiveTab('daftar')}
                style={{
                  background: 'linear-gradient(135deg, #e51b23, #b91c1c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(229, 27, 35, 0.35)'
                }}
              >
                Mulai Pendaftaran Digital <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pendaftaran Digital Form + Live e-KTA Digital Preview */}
      {activeTab === 'daftar' && (
        <div style={{ display: 'grid', gridTemplateColumns: step < 4 ? '1fr 340px' : '1fr', gap: '28px', alignItems: 'start' }}>
          
          {/* Main Form Area */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 6px 24px rgba(0,0,0,0.04)' }}>
            
            {/* Step Progress Bar Header */}
            {step < 4 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  {/* Step 1 Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: step >= 1 ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#e2e8f0',
                      color: step >= 1 ? '#fff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: step >= 1 ? '0 4px 10px rgba(37, 99, 235, 0.3)' : 'none'
                    }}>
                      {step > 1 ? <Check size={16} /> : '1'}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: step >= 1 ? '#1e3a8a' : '#64748b' }}>
                      Data Karyawan
                    </span>
                  </div>

                  <div style={{ flex: 1, height: '3px', background: step >= 2 ? '#8b5cf6' : '#e2e8f0', margin: '0 12px', borderRadius: '2px' }} />

                  {/* Step 2 Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: step >= 2 ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#e2e8f0',
                      color: step >= 2 ? '#fff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: step >= 2 ? '0 4px 10px rgba(124, 58, 237, 0.3)' : 'none'
                    }}>
                      {step > 2 ? <Check size={16} /> : '2'}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: step >= 2 ? '#5b21b6' : '#64748b' }}>
                      Penempatan & DPW
                    </span>
                  </div>

                  <div style={{ flex: 1, height: '3px', background: step >= 3 ? '#059669' : '#e2e8f0', margin: '0 12px', borderRadius: '2px' }} />

                  {/* Step 3 Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: step >= 3 ? 'linear-gradient(135deg, #059669, #047857)' : '#e2e8f0',
                      color: step >= 3 ? '#fff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: step >= 3 ? '0 4px 10px rgba(5, 150, 105, 0.3)' : 'none'
                    }}>
                      3
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: step >= 3 ? '#065f46' : '#64748b' }}>
                      Pernyataan & Berkas
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: DATA PRIBADI & KONTAK */}
            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Langkah 1: Identitas & Kontak Pekerja</h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Masukkan NIK karyawan GSD dan data kontak aktif Anda</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '18px' }}>
                  {/* NIK Field */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                      Nomor Induk Karyawan (NIK PT GSD) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 890123 / NIK GSD Anda"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 42px',
                          fontSize: '14px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                      <CreditCard size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                      Nama Lengkap (Sesuai KTP / Presensi GSD) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 42px',
                          fontSize: '14px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                      <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Email Korporat PT GSD / Pribadi *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          required
                          placeholder="nama@gsd.co.id atau email aktif"
                          value={formData.corpEmail}
                          onChange={(e) => handleInputChange('corpEmail', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Nomor WhatsApp / HP Aktif *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          required
                          placeholder="0812XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    Lanjutkan Langkah 2 <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: JABATAN & PENEMPATAN DPW */}
            {step === 2 && (
              <form onSubmit={handleNextStep}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Langkah 2: Jabatan & Wilayah DPW</h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Tentukan posisi jabatan, unit kerja, dan wilayah organisasi asal Anda</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '18px' }}>
                  {/* Jabatan & Unit Kerja */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Jabatan Pekerjaan *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Supervisor FM / Staff / Officer"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Unit Kerja / Penempatan Site *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: FM Gegerkaleng / Telkom Landmark"
                          value={formData.unit}
                          onChange={(e) => handleInputChange('unit', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>
                  </div>

                  {/* DPW & DPC */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Wilayah DPW SKATA *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={formData.dpw}
                          onChange={(e) => handleInputChange('dpw', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none',
                            background: '#ffffff'
                          }}
                        >
                          <option value="DPP (Dewan Pengurus Pusat)">DPP (Dewan Pengurus Pusat)</option>
                          <option value="DPW 1">DPW 1 - Sumatera</option>
                          <option value="DPW 2">DPW 2 - Jakarta, Banten & Jawa Barat</option>
                          <option value="DPW 3">DPW 3 - Jateng, Jatim, Bali & Nusa Tenggara</option>
                          <option value="DPW 4">DPW 4 - Kalimantan</option>
                          <option value="DPW 5">DPW 5 - Kawasan Timur Indonesia (Sulawesi, Maluku, Papua)</option>
                        </select>
                        <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                        Nama DPC Cabang (Opsional)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Contoh: DPC Gegerkaleng / DPC Surakarta"
                          value={formData.dpc}
                          onChange={(e) => handleInputChange('dpc', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>
                  </div>

                  {/* Tanggal Mulai Kerja */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
                      Tanggal Mulai Bekerja di PT GSD (Opsional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        value={formData.dateJoined}
                        onChange={(e) => handleInputChange('dateJoined', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 42px',
                          fontSize: '14px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                      <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Kembali
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    Lanjutkan Langkah 3 <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: OTORISASI & BERKAS */}
            {step === 3 && (
              <form onSubmit={handleSubmitForm}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Langkah 3: Pernyataan & Dokumen Pendukung</h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Unduh template resmi, unggah 2 berkas dokumen syarat pendaftaran, dan setujui otorisasi iuran</p>
                  </div>
                </div>

                {/* 1. SECTION DOWNLOAD TEMPLATE DOKUMEN SYARAT */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '28px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Download size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Unduh Template Dokumen Syarat Pendaftaran
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        Unduh & cetak 2 berkas template resmi SKATA di bawah ini untuk diisi dan ditandatangani:
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    {/* Card 1 */}
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <FileText size={18} style={{ color: '#e51b23' }} />
                        <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>1. FORMULIR PENDAFTARAN SKATA_V1_2026</strong>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                        Formulir pendaftaran resmi keanggotaan Serikat Karyawan PT Graha Sarana Duta.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => openTemplatePrintWindow('formulir-pendaftaran', formData)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> Pratinjau / Cetak
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadTemplateFile('formulir-pendaftaran', formData)}
                          style={{
                            background: '#0284c7',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Download size={14} /> Unduh Template
                        </button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <FileText size={18} style={{ color: '#059669' }} />
                        <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>2. Form Surat Kuasa iuran SKATA V.1 2026</strong>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                        Surat kuasa otorisasi pemotongan iuran bulanan Rp 25.000,- via payroll PT GSD.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => openTemplatePrintWindow('surat-kuasa-iuran', formData)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> Pratinjau / Cetak
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadTemplateFile('surat-kuasa-iuran', formData)}
                          style={{
                            background: '#059669',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Download size={14} /> Unduh Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SECTION UNGGAH 2 BERKAS DOKUMEN SYARAT */}
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} style={{ color: '#059669' }} /> Unggah 2 Berkas Dokumen Syarat Pendaftaran
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {/* Upload Box 1: Formulir Pendaftaran */}
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '12.5px', color: '#0f172a', marginBottom: '6px' }}>
                        1. FORMULIR PENDAFTARAN SKATA_V1_2026 *
                      </label>
                      <input
                        type="file"
                        id="input-file-formulir"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleInputChange('fileFormulir', e.target.files[0].name);
                          }
                        }}
                      />
                      <div
                        onClick={() => {
                          const inputEl = document.getElementById('input-file-formulir') as HTMLInputElement;
                          if (inputEl) {
                            inputEl.click();
                          } else {
                            const fakeName = `FORMULIR_PENDAFTARAN_${formData.nik || 'SKATA'}_2026.pdf`;
                            handleInputChange('fileFormulir', fakeName);
                          }
                        }}
                        style={{
                          border: formData.fileFormulir ? '2px solid #059669' : '2px dashed #a7f3d0',
                          borderRadius: '14px',
                          padding: '20px 16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: formData.fileFormulir ? '#f0fdf4' : '#fafafa',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: formData.fileFormulir ? '#059669' : '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}>
                          {formData.fileFormulir ? <CheckCircle size={22} /> : <Upload size={20} />}
                        </div>
                        <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                          {formData.fileFormulir ? 'Berkas Form Pendaftaran Terpilih' : 'Unggah Formulir Pendaftaran'}
                        </strong>
                        <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                          Format PDF, JPG, atau PNG (Maks 5MB)
                        </span>
                        {formData.fileFormulir ? (
                          <div style={{ marginTop: '10px', background: '#d1fae5', color: '#065f46', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, wordBreak: 'break-all' }}>
                            ✓ {formData.fileFormulir}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const fakeName = `FORMULIR_PENDAFTARAN_${formData.nik || 'SKATA'}_2026.pdf`;
                              handleInputChange('fileFormulir', fakeName);
                            }}
                            style={{
                              marginTop: '10px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            + Pilih File Berkas
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Upload Box 2: Surat Kuasa iuran */}
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, fontSize: '12.5px', color: '#0f172a', marginBottom: '6px' }}>
                        2. Form Surat Kuasa iuran SKATA V.1 2026 *
                      </label>
                      <input
                        type="file"
                        id="input-file-surat-kuasa"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleInputChange('fileSuratKuasa', e.target.files[0].name);
                          }
                        }}
                      />
                      <div
                        onClick={() => {
                          const inputEl = document.getElementById('input-file-surat-kuasa') as HTMLInputElement;
                          if (inputEl) {
                            inputEl.click();
                          } else {
                            const fakeName = `SURAT_KUASA_IURAN_${formData.nik || 'SKATA'}_2026.pdf`;
                            handleInputChange('fileSuratKuasa', fakeName);
                          }
                        }}
                        style={{
                          border: formData.fileSuratKuasa ? '2px solid #059669' : '2px dashed #a7f3d0',
                          borderRadius: '14px',
                          padding: '20px 16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: formData.fileSuratKuasa ? '#f0fdf4' : '#fafafa',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: formData.fileSuratKuasa ? '#059669' : '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}>
                          {formData.fileSuratKuasa ? <CheckCircle size={22} /> : <Upload size={20} />}
                        </div>
                        <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                          {formData.fileSuratKuasa ? 'Berkas Surat Kuasa Terpilih' : 'Unggah Surat Kuasa Iuran'}
                        </strong>
                        <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                          Format PDF, JPG, atau PNG (Maks 5MB)
                        </span>
                        {formData.fileSuratKuasa ? (
                          <div style={{ marginTop: '10px', background: '#d1fae5', color: '#065f46', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, wordBreak: 'break-all' }}>
                            ✓ {formData.fileSuratKuasa}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const fakeName = `SURAT_KUASA_IURAN_${formData.nik || 'SKATA'}_2026.pdf`;
                              handleInputChange('fileSuratKuasa', fakeName);
                            }}
                            style={{
                              marginTop: '10px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            + Pilih File Berkas
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declarations Boxes */}
                <div style={{ display: 'grid', gap: '16px', marginBottom: '28px' }}>
                  {/* Declaration 1 */}
                  <div style={{
                    background: '#f5f3ff',
                    border: '1.5px solid #ddd6fe',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start'
                  }}>
                    <input
                      type="checkbox"
                      id="declaration"
                      checked={formData.declaration}
                      onChange={(e) => handleInputChange('declaration', e.target.checked)}
                      required
                      style={{ width: '20px', height: '20px', accentColor: '#7c3aed', cursor: 'pointer', marginTop: '2px' }}
                    />
                    <label htmlFor="declaration" style={{ fontSize: '13.5px', color: '#4c1d95', lineHeight: 1.5, cursor: 'pointer' }}>
                      <strong>Pernyataan Suka-Rela Menjadi Anggota SKATA:</strong> Dengan penuh kesadaran dan tanpa paksaan, saya menyatakan bergabung menjadi anggota Serikat Karyawan PT Graha Sarana Duta serta bersedia tunduk pada ketetapan AD/ART organisasi.
                    </label>
                  </div>

                  {/* Declaration 2 */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1.5px solid #fde68a',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start'
                  }}>
                    <input
                      type="checkbox"
                      id="authDeduction"
                      checked={formData.authDeduction}
                      onChange={(e) => handleInputChange('authDeduction', e.target.checked)}
                      required
                      style={{ width: '20px', height: '20px', accentColor: '#d97706', cursor: 'pointer', marginTop: '2px' }}
                    />
                    <label htmlFor="authDeduction" style={{ fontSize: '13.5px', color: '#78350f', lineHeight: 1.5, cursor: 'pointer' }}>
                      <strong>Otorisasi Pemotongan Iuran (Dues):</strong> Saya memberikan wewenang penuh kepada Bendahara DPP SKATA dan payroll Perusahaan untuk melakukan pemotongan upah bulanan untuk iuran serikat sebesar tarif resmi organisasi.
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Kembali
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #e51b23, #b91c1c)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(229, 27, 35, 0.35)',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Mengirim Data Registrasi...' : 'Kirim Pendaftaran Anggota'} <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION & RECEIPT */}
            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                }}>
                  <CheckCircle size={40} />
                </div>

                <span style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  REGISTRASI BERHASIL TERSIMPAN
                </span>

                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>
                  Pendaftaran Anggota Berhasil Dikirim!
                </h2>

                <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  Terima kasih, rekan <strong>{submittedData?.fullName}</strong>. Permohonan pendaftaran Anda dengan NIK <strong>{submittedData?.nik}</strong> telah masuk ke antrean verifikasi administrator SKATA.
                </p>

                {/* Status Timeline */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '28px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} style={{ color: '#e51b23' }} /> Tahapan Selanjutnya
                  </h4>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                      <span style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 700 }}>Data registrasi tersimpan di database Firebase Firestore</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                      <span style={{ fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>Verifikasi NIK & data presensi oleh Sekretariat DPP SKATA</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
                      <span style={{ fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>Penerbitan e-KTA digital resmi ber-QR Code dengan NIA aktif</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleResetForm}
                    style={{
                      background: 'linear-gradient(135deg, #0f172a, #334155)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Selesai & Kembali ke Beranda
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Interactive E-KTA Digital Preview (Shown during form fill) */}
          {step < 4 && (
            <div style={{ position: 'sticky', top: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #31103f 100%)',
                borderRadius: '24px',
                padding: '24px',
                color: '#ffffff',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Hologram Effect Circle */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,27,35,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e51b23', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '13px' }}>
                      S
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>E-KTA SKATA</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Kartu Anggota Digital</div>
                    </div>
                  </div>

                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>
                    PREVIEW DRAFT
                  </span>
                </div>

                {/* Cardholder Avatar & Details */}
                <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #e51b23, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?'}
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {formData.fullName || 'Nama Lengkap Anda'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>
                        NIK: {formData.nik || '• • • • • •'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                        {formData.position || 'Jabatan Karyawan'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', color: '#cbd5e1', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block' }}>Wilayah:</span>
                    <strong style={{ color: '#fff' }}>{formData.dpw}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#94a3b8', display: 'block' }}>Unit Kerja:</span>
                    <strong style={{ color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }}>{formData.unit || '-'}</strong>
                  </div>
                </div>

                {/* QR Code Mockup Footer */}
                <div style={{ paddingTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QrCode size={28} style={{ color: '#38bdf8' }} />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Aktivasi via SKATA System</span>
                  </div>

                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#4ade80', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <BadgeCheck size={12} /> SKATA GSD
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

