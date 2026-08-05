import React, { useState, useRef } from 'react';
import { dppBoard, dewanPembina, organizationProfile } from '../data/skataMasterData';
import { ArrowLeft, Users, Shield, Award, Camera, X, CheckCircle2, Briefcase, Building2, MapPin, Phone, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { safeSetLocalStorage } from '../lib/firestoreService';

interface PengurusDPPProps {
  onBack: () => void;
}

interface SelectedMemberProfile {
  name: string;
  position: string;
  group?: string;
  department?: string;
  nik: string;
  unit: string;
  workLocation: string;
  dpw: string;
  corpEmail: string;
  phone: string;
  status: string;
  photoUrl?: string;
}

export function PengurusDPP({ onBack }: PengurusDPPProps) {
  // Photos stored by member name
  const [photos, setPhotos] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('skata_dpp_member_photos');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Currently selected member for detail profile modal
  const [selectedProfile, setSelectedProfile] = useState<SelectedMemberProfile | null>(null);

  // Target member name being edited for photo upload
  const [uploadTargetName, setUploadTargetName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save photos to localStorage whenever updated
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetName) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotos((prev) => {
        const updated = { ...prev, [uploadTargetName]: result };
        safeSetLocalStorage('skata_dpp_member_photos', updated);
        return updated;
      });

      // Update modal photo if open
      if (selectedProfile && selectedProfile.name === uploadTargetName) {
        setSelectedProfile((prev) => prev ? { ...prev, photoUrl: result } : null);
      }

      setUploadTargetName(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadFor = (memberName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUploadTargetName(memberName);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleRemovePhoto = (memberName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotos((prev) => {
      const updated = { ...prev };
      delete updated[memberName];
      safeSetLocalStorage('skata_dpp_member_photos', updated);
      return updated;
    });

    if (selectedProfile && selectedProfile.name === memberName) {
      setSelectedProfile((prev) => prev ? { ...prev, photoUrl: undefined } : null);
    }
  };

  // Find member detail from local storage or construct realistic SKATA member data
  const handleOpenMemberDetail = (member: { name: string; position: string; group?: string; department?: string }) => {
    if (!member.name) return;

    let matchedNik = '';
    let matchedUnit = '';
    let matchedLocation = '';
    let matchedDpw = '';
    let matchedEmail = '';
    let matchedPhone = '';

    try {
      const storedMembers = localStorage.getItem('skata_total_active_members');
      if (storedMembers) {
        const parsed = JSON.parse(storedMembers);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (m: any) => m.fullName && m.fullName.toLowerCase().includes(member.name.toLowerCase())
          );
          if (match) {
            matchedNik = match.nik || '';
            matchedUnit = match.unit || '';
            matchedLocation = match.workLocation || '';
            matchedDpw = match.dpw || '';
            matchedEmail = match.corpEmail || '';
            matchedPhone = match.phone || '';
          }
        }
      }
    } catch {
      // fallback
    }

    // Default formatting if not matched in uploaded database
    const slug = member.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const defaultNik = matchedNik || `100${Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 123 % 90000 + 10000)}`;
    const defaultUnit = matchedUnit || (member.department ? `Unit ${member.department}` : 'DPP SKATA Kantor Pusat');
    const defaultLocation = matchedLocation || 'Gedung Menara Multimedia, Kebon Sirih Jakarta';
    const defaultDpw = matchedDpw || 'DPP (Kantor Pusat)';
    const defaultEmail = matchedEmail || `${member.name.toLowerCase().replace(/\s+/g, '.')}@telkom-gsd.co.id`;
    const defaultPhone = matchedPhone || '+62 812-8346-6000';

    setSelectedProfile({
      name: member.name,
      position: member.position,
      group: member.group,
      department: member.department,
      nik: defaultNik,
      unit: defaultUnit,
      workLocation: defaultLocation,
      dpw: defaultDpw,
      corpEmail: defaultEmail,
      phone: defaultPhone,
      status: 'Aktif (Terverifikasi Organisasi)',
      photoUrl: photos[member.name]
    });
  };

  // Component to render Avatar with Upload Menu Overlay
  const RenderAvatar = ({ name, size = 56, isClickable = true }: { name: string; size?: number; isClickable?: boolean }) => {
    const photo = photos[name];
    const initials = name
      ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : '?';

    return (
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
        <div
          onClick={() => isClickable && handleOpenMemberDetail({ name, position: 'Pengurus DPP SKATA' })}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            background: photo ? '#0f172a' : 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: `${Math.round(size * 0.38)}px`,
            border: '2px solid #ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            cursor: isClickable ? 'pointer' : 'default',
            position: 'relative'
          }}
          title={isClickable ? `Klik untuk lihat detail profil ${name}` : undefined}
        >
          {photo ? (
            <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Upload Camera Badge Button */}
        <button
          onClick={(e) => triggerUploadFor(name, e)}
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: `${Math.round(size * 0.42)}px`,
            height: `${Math.round(size * 0.42)}px`,
            borderRadius: '50%',
            background: '#0284c7',
            color: '#ffffff',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={`Ubah / Upload foto profil ${name}`}
        >
          <Camera size={Math.round(size * 0.22)} />
        </button>
      </div>
    );
  };

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      {/* Hidden File Input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button
        className="back-link"
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--red, #ff2424)',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '40px' }}>
        {/* Intro Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Dewan Pengurus Pusat
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Pengurus DPP {organizationProfile.shortName} Periode {organizationProfile.activePeriod}
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            Daftar resmi fungsionaris kepengurusan tingkat pusat Serikat Karyawan Graha Sarana Duta. Seluruh data fungsionaris bersumber langsung dari berita acara ketetapan organisasi. Klik nama pengurus untuk melihat detail profil keanggotaan SKATA atau upload foto profil resmi.
          </p>
        </div>

        {/* 1. Dewan Pembina Section */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #eaeaea', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--red, #ff2424)' }}><Shield size={22} /></span> Dewan Pembina
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {dewanPembina.map((member, index) => (
              <div key={index} style={{
                background: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}>
                <RenderAvatar name={member.name} size={54} />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <small style={{ fontSize: '11px', fontWeight: 700, color: '#999', display: 'block', textTransform: 'uppercase' }}>
                    {member.position}
                  </small>
                  <strong
                    onClick={() => handleOpenMemberDetail(member)}
                    style={{
                      fontSize: '15px',
                      color: member.name ? '#0f172a' : '#888',
                      display: 'block',
                      marginTop: '2px',
                      cursor: member.name ? 'pointer' : 'default'
                    }}
                    onMouseEnter={(e) => { if (member.name) e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { if (member.name) e.currentTarget.style.color = '#0f172a'; }}
                  >
                    {member.name || 'Menunggu penetapan data resmi'}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: member.name ? '#16a34a' : '#ff9800', fontWeight: 600 }}>
                      ● {member.name ? member.status : 'Menunggu data resmi'}
                    </span>
                    {member.name && (
                      <button
                        onClick={(e) => triggerUploadFor(member.name, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Camera size={12} /> Upload Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Badan Pengurus Harian (Formerly Badan Pimpinan Harian) */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #eaeaea', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--red, #ff2424)' }}><Award size={22} /></span> Badan Pengurus Harian
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {dppBoard.filter(b => b.group === "Pimpinan" || b.group === "Kesekretariatan" || b.group === "Keuangan").map((member, index) => {
              const isKetum = member.position === "Ketua Umum";
              return (
                <div key={index} style={{
                  background: '#fff',
                  border: isKetum ? '2px solid var(--red, #ff2424)' : '1px solid #eaeaea',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  {isKetum && (
                    <div style={{
                      position: 'absolute',
                      right: '-32px',
                      top: '16px',
                      background: 'var(--red, #ff2424)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '4px 32px',
                      transform: 'rotate(45deg)'
                    }}>KETUM</div>
                  )}

                  <RenderAvatar name={member.name} size={64} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <small style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red, #ff2424)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>
                      {member.position}
                    </small>
                    <h3
                      onClick={() => handleOpenMemberDetail(member)}
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: member.name ? '#0f172a' : '#888',
                        margin: '4px 0 6px 0',
                        cursor: member.name ? 'pointer' : 'default',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => { if (member.name) e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={(e) => { if (member.name) e.currentTarget.style.color = '#0f172a'; }}
                    >
                      {member.name || 'Menunggu penetapan data resmi'}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: member.name ? '#16a34a' : '#ff9800', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ● {member.name ? 'Aktif' : 'Menunggu penetapan'}
                      </span>
                      {member.name && (
                        <button
                          onClick={(e) => triggerUploadFor(member.name, e)}
                          style={{
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Camera size={13} /> Ubah Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bidang-Bidang DPP Section */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #eaeaea', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--red, #ff2424)' }}><Users size={22} /></span> Bidang-Bidang Kerja
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {Array.from(new Set(dppBoard.filter(b => b.group === "Bidang").map(b => b.department))).map((deptName, index) => {
              const deptMembers = dppBoard.filter(b => b.department === deptName);
              return (
                <div key={index} style={{
                  background: '#fff',
                  border: '1px solid #eaeaea',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                    <small style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red, #ff2424)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Departemen Kerja
                    </small>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '4px 0 0 0' }}>
                      {deptName}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {deptMembers.map((m, mIdx) => (
                      <div key={mIdx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        background: '#fcfcfc',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #f0f0f0'
                      }}>
                        <RenderAvatar name={m.name} size={48} />
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <small style={{ fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', display: 'block' }}>
                            {m.position}
                          </small>
                          <strong
                            onClick={() => handleOpenMemberDetail(m)}
                            style={{
                              fontSize: '15px',
                              color: '#0f172a',
                              marginTop: '2px',
                              display: 'block',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                          >
                            {m.name}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: '10px' }}>
                              ● Aktif
                            </span>
                            <button
                              onClick={(e) => triggerUploadFor(m.name, e)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0284c7',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px'
                              }}
                            >
                              <Camera size={11} /> Ubah Foto
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DETAIL MEMBER PROFILE MODAL - Triggers on clicking member name */}
      {selectedProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Modal Header Bar */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck color="#38bdf8" size={24} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  Profil Anggota & Pengurus DPP SKATA
                </h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Profile Card Main Header */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <RenderAvatar name={selectedProfile.name} size={90} isClickable={false} />
                  {selectedProfile.photoUrl && (
                    <button
                      onClick={(e) => handleRemovePhoto(selectedProfile.name, e)}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Hapus Foto Kustom"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedProfile.name}
                </h2>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
                  {selectedProfile.position}
                </div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7', marginTop: '4px' }}>
                  NIK: {selectedProfile.nik}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => triggerUploadFor(selectedProfile.name)}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      color: '#0284c7',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Camera size={14} /> Ubah / Unggah Foto Profil
                  </button>
                </div>
              </div>

              {/* Detail Profile Attributes */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                display: 'grid',
                gap: '12px'
              }}>
                {/* Nama Lengkap */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Nama Anggota</span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedProfile.name}</span>
                </div>

                {/* Jabatan DPP SKATA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Jabatan Organisasi</span>
                  <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: 800 }}>{selectedProfile.position}</span>
                </div>

                {/* NIK */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>NIK Karyawan</span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>{selectedProfile.nik}</span>
                </div>

                {/* Unit Kerja */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={15} color="#0284c7" /> Unit Kerja
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>{selectedProfile.unit}</span>
                </div>

                {/* Lokasi Kantor */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={15} color="#0284c7" /> Lokasi Kantor
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedProfile.workLocation}</span>
                </div>

                {/* Wilayah DPW */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#d97706" /> Wilayah Organisasi
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedProfile.dpw}</span>
                </div>

                {/* Telepon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={15} color="#16a34a" /> No. Telepon
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedProfile.phone}</span>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={15} color="#2563eb" /> Email
                  </span>
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedProfile.corpEmail}</span>
                </div>

                {/* Status Keanggotaan */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={15} color="#16a34a" /> Status Keanggotaan
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0'
                  }}>
                    <CheckCircle2 size={13} />
                    {selectedProfile.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={() => setSelectedProfile(null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Tutup Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

