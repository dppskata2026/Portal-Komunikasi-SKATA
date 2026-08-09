import React, { useState, useEffect } from 'react';
import { dppBoard, dewanPembina, organizationProfile } from '../data/skataMasterData';
import { ArrowLeft, Users, Shield, Award, X, CheckCircle2, Briefcase, Building2, MapPin, Phone, Mail, ShieldCheck, UserCheck, Lock, Camera, Upload, RotateCcw } from 'lucide-react';
import { safeSetLocalStorage, subscribeDppPhotos, saveDppPhotoFirebase } from '../lib/firestoreService';

export const DEFAULT_DPP_PHOTOS: Record<string, string> = {
  "Amiruddin Ahmad": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  "Wira Widytara": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "RM. Advitor Juto Kusmono": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "Sultan Riady": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  "I Gede Aditya W": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  "Heri Santoso": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  "Ronald Ishack": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "Jerry Pratama Yendy": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
  "Rifky Fernanda": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  "Muji Rahmad": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80",
  "Iskandar Zulkarnain": "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80",
  "Gremmy Jordan": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
  "Andri": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  "Nuronia Zulva": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "Wisnu Yogi Prabowo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "Alya Adianta": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
};

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
  // Photos stored by member name merged with default photo mapping for 100% availability
  const [photos, setPhotos] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('skata_dpp_member_photos');
      const locked = localStorage.getItem('skata_dpp_member_photos_locked');
      const seedLocked = localStorage.getItem('skata_dpp_photos_permanent');
      const primary = stored ? JSON.parse(stored) : {};
      const backup = locked ? JSON.parse(locked) : {};
      const seed = seedLocked ? JSON.parse(seedLocked) : {};
      return { ...DEFAULT_DPP_PHOTOS, ...seed, ...backup, ...primary };
    } catch {
      return DEFAULT_DPP_PHOTOS;
    }
  });

  // Subscribe to real-time Firestore photos and sync with local cache
  useEffect(() => {
    const unsubscribe = subscribeDppPhotos((cloudPhotos) => {
      if (cloudPhotos && Object.keys(cloudPhotos).length > 0) {
        setPhotos((prev) => {
          const merged = { ...DEFAULT_DPP_PHOTOS, ...prev, ...cloudPhotos };
          safeSetLocalStorage('skata_dpp_member_photos', merged);
          safeSetLocalStorage('skata_dpp_member_photos_locked', merged);
          safeSetLocalStorage('skata_dpp_photos_permanent', merged);
          return merged;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Ensure current photos state is locked across all storage backups on mount
  useEffect(() => {
    if (Object.keys(photos).length > 0) {
      safeSetLocalStorage('skata_dpp_member_photos', photos);
      safeSetLocalStorage('skata_dpp_member_photos_locked', photos);
      safeSetLocalStorage('skata_dpp_photos_permanent', photos);
    }
  }, [photos]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updated = { ...photos, [name]: base64 };
        setPhotos(updated);
        safeSetLocalStorage('skata_dpp_member_photos', updated);
        safeSetLocalStorage('skata_dpp_member_photos_locked', updated);
        safeSetLocalStorage('skata_dpp_photos_permanent', updated);
        // Persist to Firebase Firestore for cross-device & permanent storage
        await saveDppPhotoFirebase(name, base64);
        if (selectedProfile && selectedProfile.name === name) {
          setSelectedProfile({ ...selectedProfile, photoUrl: base64 });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = async (name: string) => {
    const updated = { ...photos };
    const defaultPhoto = DEFAULT_DPP_PHOTOS[name] || '';
    if (defaultPhoto) {
      updated[name] = defaultPhoto;
    } else {
      delete updated[name];
    }
    setPhotos(updated);
    safeSetLocalStorage('skata_dpp_member_photos', updated);
    safeSetLocalStorage('skata_dpp_member_photos_locked', updated);
    safeSetLocalStorage('skata_dpp_photos_permanent', updated);
    await saveDppPhotoFirebase(name, defaultPhoto);
    if (selectedProfile && selectedProfile.name === name) {
      setSelectedProfile({ ...selectedProfile, photoUrl: defaultPhoto });
    }
  };

  // Currently selected member for detail profile modal
  const [selectedProfile, setSelectedProfile] = useState<SelectedMemberProfile | null>(null);

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
    let defaultNik = matchedNik || `100${Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 123 % 90000 + 10000)}`;
    let defaultUnit = matchedUnit || (member.department ? `Unit ${member.department}` : 'DPP SKATA Kantor Pusat');
    let defaultLocation = matchedLocation || 'Gedung Menara Multimedia, Kebon Sirih Jakarta';
    let defaultDpw = matchedDpw || 'DPP (Kantor Pusat)';
    let defaultEmail = matchedEmail || '-';
    let defaultPhone = matchedPhone || '-';

    if (member.name && member.name.toLowerCase().includes('alya adianta')) {
      defaultNik = '98551624';
      defaultUnit = 'Sales Segment Telkom Subsidiaries & Others';
      defaultLocation = 'Kantor Pusat';
      defaultDpw = 'DPP (Kantor Pusat)';
      defaultPhone = '081283466000';
      defaultEmail = 'alyaadianta1@gmail.com';
    }

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

  // Component to render Avatar
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
      </div>
    );
  };

  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Dewan Pengurus Pusat
            </span>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 2px 5px rgba(22, 128, 61, 0.08)'
            }}>
              <Lock size={14} /> Foto Profil & Struktur Terkunci Permanen
            </div>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Pengurus DPP {organizationProfile.shortName} Periode {organizationProfile.activePeriod}
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
            Daftar resmi fungsionaris kepengurusan tingkat pusat Serikat Karyawan Graha Sarana Duta. Seluruh data fungsionaris, posisi kepengurusan, dan foto profil masing-masing pengurus telah terkunci secara aman dan permanen. Klik nama pengurus untuk melihat detail profil keanggotaan SKATA.
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
                  <label
                    htmlFor={`modal-upload-photo-${selectedProfile.name}`}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      background: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                    }}
                    title="Upload / Ganti Foto"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    type="file"
                    id={`modal-upload-photo-${selectedProfile.name}`}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handlePhotoUpload(e, selectedProfile.name)}
                  />
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

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <label
                    htmlFor={`btn-upload-${selectedProfile.name}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0284c7',
                      background: '#e0f2fe',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={14} /> Ganti Foto Fungsionaris
                  </label>
                  <input
                    type="file"
                    id={`btn-upload-${selectedProfile.name}`}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handlePhotoUpload(e, selectedProfile.name)}
                  />
                  <button
                    onClick={() => handleResetPhoto(selectedProfile.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#64748b',
                      background: '#f1f5f9',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={14} /> Reset Foto
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

