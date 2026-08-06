import { useState, useEffect, useMemo } from 'react';
import { dpwList } from '../data/skataMasterData';
import { ArrowLeft, Users, Landmark, Search, ExternalLink, ShieldCheck, UserCheck, Database, Building2, UserX } from 'lucide-react';
import { DotMapFull } from './DotMap';
import { subscribeMemberships } from '../lib/firestoreService';
import { MemberRecord, deduplicateMembers } from './TotalAnggotaTable';

interface DPWPageProps {
  onBack: () => void;
  selectedId?: string | null;
  navigate: (path: string) => void;
}

export function categorizeMemberDpw(m: { dpw?: string; workLocation?: string; unit?: string }): string {
  const dpwStr = (m.dpw || '').toUpperCase();
  const locStr = (m.workLocation || '').toUpperCase();
  const unitStr = (m.unit || '').toUpperCase();
  const combined = `${dpwStr} ${locStr} ${unitStr}`;

  if (combined.includes('DPW 1') || combined.includes('DPW-01') || combined.includes('SUMATERA') || combined.includes('SUMATRA') || combined.includes('MEDAN') || combined.includes('PALEMBANG') || combined.includes('PADANG') || combined.includes('PEKANBARU') || combined.includes('ACEH') || combined.includes('LAMPUNG') || combined.includes('BENGKULU') || combined.includes('JAMBI')) {
    return 'DPW-01';
  }
  if (combined.includes('DPW 2') || combined.includes('DPW-02') || combined.includes('JAKARTA') || combined.includes('BANTEN') || combined.includes('JAWA BARAT') || combined.includes('JABAR') || combined.includes('BANDUNG') || combined.includes('JABODETABEK') || combined.includes('BEKASI') || combined.includes('BOGOR') || combined.includes('TANGERANG') || combined.includes('DEPOK')) {
    return 'DPW-02';
  }
  if (combined.includes('DPW 3') || combined.includes('DPW-03') || combined.includes('JATENG') || combined.includes('JATIM') || combined.includes('JAWA TENGAH') || combined.includes('JAWA TIMUR') || combined.includes('BALI') || combined.includes('SURABAYA') || combined.includes('SEMARANG') || combined.includes('YOGYAKARTA') || combined.includes('JOGJA') || combined.includes('NTB') || combined.includes('NTT') || combined.includes('MATARAM') || combined.includes('KUPANG')) {
    return 'DPW-03';
  }
  if (combined.includes('DPW 4') || combined.includes('DPW-04') || combined.includes('KALIMANTAN') || combined.includes('BALIKPAPAN') || combined.includes('SAMARINDA') || combined.includes('BANJARMASIN') || combined.includes('PONTIANAK') || combined.includes('IKN') || combined.includes('PALANGKARAYA') || combined.includes('TARAKAN')) {
    return 'DPW-04';
  }
  if (combined.includes('DPW 5') || combined.includes('DPW-05') || combined.includes('TIMUR') || combined.includes('SULAWESI') || combined.includes('MAKASSAR') || combined.includes('MANADO') || combined.includes('PAPUA') || combined.includes('MALUKU') || combined.includes('AMBON') || combined.includes('JAYAPURA') || combined.includes('PALU') || combined.includes('KENDARI') || combined.includes('GORONTALO')) {
    return 'DPW-05';
  }

  if (m.dpw && m.dpw !== '-') {
    const dNum = m.dpw.match(/\d+/);
    if (dNum) {
      if (dNum[0] === '1') return 'DPW-01';
      if (dNum[0] === '2') return 'DPW-02';
      if (dNum[0] === '3') return 'DPW-03';
      if (dNum[0] === '4') return 'DPW-04';
      if (dNum[0] === '5') return 'DPW-05';
    }
  }

  return 'DPP';
}

export function DPWPage({ onBack, selectedId, navigate }: DPWPageProps) {
  const [activeDpwId, setActiveDpwId] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    try {
      const stored = localStorage.getItem('skata_total_active_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return deduplicateMembers(parsed);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (selectedId) {
      setActiveDpwId(selectedId);
    }
  }, [selectedId]);

  // Subscribe to live memberships from Firestore
  useEffect(() => {
    const unsubscribe = subscribeMemberships((firestoreItems) => {
      const isCleared = localStorage.getItem('skata_members_is_cleared') === 'true';
      if (isCleared) return;

      if (firestoreItems && firestoreItems.length > 0) {
        const mappedFirestore: MemberRecord[] = firestoreItems.map((f, index) => ({
          id: f.id || `FS-${index}`,
          nik: f.nik || `100020${26 + index}`,
          fullName: f.fullName || f.name || f.nama || f.namaLengkap || 'Anggota SKATA',
          unit: f.unit || 'Unit Kerja Umum',
          workLocation: f.workLocation || f.dpc || f.dpw || 'Kantor Pusat / FM',
          status: f.status || 'Anggota Aktif',
          dpw: f.dpw || (f.workLocation?.toUpperCase().includes('PUSAT') ? 'DPP' : 'DPW 1'),
          position: f.position || 'Karyawan',
          corpEmail: f.corpEmail || '',
          phone: f.phone || ''
        }));

        setMembers((prev) => {
          let currentLocal = prev;
          if (currentLocal.length === 0) {
            try {
              const stored = localStorage.getItem('skata_total_active_members');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  currentLocal = parsed;
                }
              }
            } catch {
              // ignore
            }
          }

          const combined = [...mappedFirestore, ...currentLocal];
          return deduplicateMembers(combined);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Compute dynamic stats per DPW based on actual member data
  const dynamicDpwStats = useMemo(() => {
    const stats: Record<string, { memberCount: number; dpcCount: number; members: MemberRecord[] }> = {};

    dpwList.forEach((dpw) => {
      stats[dpw.id] = { memberCount: 0, dpcCount: 0, members: [] };
    });

    members.forEach((m) => {
      const code = categorizeMemberDpw(m);
      if (stats[code]) {
        stats[code].members.push(m);
      }
    });

    dpwList.forEach((dpw) => {
      const dpwMembers = stats[dpw.id]?.members || [];
      const count = dpwMembers.length;
      const dpcLocations = new Set(dpwMembers.map(m => m.workLocation || m.unit).filter(Boolean));
      stats[dpw.id] = {
        memberCount: count,
        dpcCount: dpcLocations.size,
        members: dpwMembers
      };
    });

    return stats;
  }, [members]);

  const handleSelectDpw = (id: string) => {
    setActiveDpwId(id);
    setMemberSearch('');
    navigate(`/tentang/dpw/${id}`);
  };

  const handleBackToDirectory = () => {
    setActiveDpwId(null);
    setMemberSearch('');
    navigate('/tentang/dpw');
  };

  const currentDpw = dpwList.find(d => d.id === activeDpwId);

  // If a DPW is selected, render the Detail View + Member List
  if (currentDpw) {
    const currentStats = dynamicDpwStats[currentDpw.id] || { memberCount: 0, dpcCount: 0, members: [] };
    const dpwMembers = currentStats.members;

    const filteredDpwMembers = dpwMembers.filter((m) => {
      if (!memberSearch.trim()) return true;
      const q = memberSearch.toLowerCase();
      return (
        m.nik.toLowerCase().includes(q) ||
        m.fullName.toLowerCase().includes(q) ||
        (m.unit && m.unit.toLowerCase().includes(q)) ||
        (m.workLocation && m.workLocation.toLowerCase().includes(q)) ||
        (m.position && m.position.toLowerCase().includes(q))
      );
    });

    return (
      <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
        <button
          className="back-link"
          onClick={handleBackToDirectory}
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
          <ArrowLeft size={16} /> Kembali ke Direktori DPW
        </button>

        {/* DPW Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(255, 36, 36, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Dewan Pengurus Wilayah ({currentDpw.code})
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', margin: 0 }}>
                {currentDpw.temporaryName}
              </h1>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>Kode: <strong>{currentDpw.id}</strong></span>
                <span>•</span>
                <span>Sekretariat: <strong>{currentDpw.city}</strong></span>
                <span>•</span>
                <span style={{ color: '#2e7d32', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={15} /> {currentDpw.status}
                </span>
              </p>
            </div>
            
            <button
              onClick={() => navigate('/layanan/total-anggota')}
              className="button primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 18px' }}
            >
              <Users size={16} /> Kelola Anggota di Menu Keanggotaan <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Board & Dynamic Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {/* Fungsionaris DPW */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '20px', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={18} color="var(--red, #ff2424)" /> Fungsionaris DPW
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Ketua Wilayah</small>
                <strong style={{ fontSize: '15px', color: currentDpw.chairman ? '#111' : '#aaa' }}>
                  {currentDpw.chairman || 'Data belum tersedia'}
                </strong>
              </div>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Sekretaris Wilayah</small>
                <strong style={{ fontSize: '15px', color: currentDpw.secretary ? '#111' : '#aaa' }}>
                  {currentDpw.secretary || 'Data belum tersedia'}
                </strong>
              </div>
              <div>
                <small style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Bendahara Wilayah</small>
                <strong style={{ fontSize: '15px', color: currentDpw.treasurer ? '#111' : '#aaa' }}>
                  {currentDpw.treasurer || 'Data belum tersedia'}
                </strong>
              </div>
            </div>
          </div>

          {/* Realtime Synced Regional Statistics */}
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '20px', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--red, #ff2424)" /> Statistik Realtime Database
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <span style={{ color: '#555', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="#666" /> Total Anggota Terdaftar:
                </span>
                <strong style={{ fontSize: '18px', color: 'var(--red, #ff2424)', fontWeight: 800 }}>
                  {currentStats.memberCount} Anggota
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <span style={{ color: '#555', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="#666" /> Total DPC / Unit Kerja:
                </span>
                <strong style={{ fontSize: '18px', color: '#111', fontWeight: 800 }}>
                  {currentStats.dpcCount} Unit
                </strong>
              </div>

              <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '12px 16px', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck size={18} color="#2e7d32" />
                <p style={{ margin: 0, fontSize: '12px', color: '#1b5e20', lineHeight: 1.4, fontWeight: 500 }}>
                  Data anggota di wilayah ini tersinkronisasi otomatis dari database keanggotaan SKATA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MEMBER LIST SECTION FOR THIS DPW */}
        <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--red, #ff2424)" /> Daftar Anggota {currentDpw.temporaryName}
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px', margin: 0 }}>
                Menampilkan <strong>{filteredDpwMembers.length}</strong> dari <strong>{currentStats.memberCount}</strong> anggota terdaftar di {currentDpw.temporaryName}
              </p>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Cari NIK, Nama, atau Unit..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Members Table */}
          {filteredDpwMembers.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '2px solid #eaeaea' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#444' }}>NIK</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#444' }}>Nama Lengkap</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#444' }}>Unit Kerja / Jabatan</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#444' }}>Lokasi / DPC</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#444', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDpwMembers.map((m, idx) => (
                    <tr key={`dpw-m-${m.id || 'm'}-${m.nik || 'nik'}-${idx}`} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#333' }}>
                        {m.nik}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111' }}>
                        {m.fullName}
                        {m.corpEmail && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#777', fontWeight: 400 }}>
                            {m.corpEmail}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#444' }}>
                        {m.unit || '-'}
                        {m.position && m.position !== 'Karyawan' && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#666' }}>
                            {m.position}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>
                        {m.workLocation || '-'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: m.status?.includes('Aktif') ? '#e8f5e9' : '#fff3e0',
                          color: m.status?.includes('Aktif') ? '#2e7d32' : '#e65100',
                          display: 'inline-block'
                        }}>
                          {m.status || 'Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#fcfcfc',
              borderRadius: '12px',
              border: '1px dashed #e0e0e0',
              marginTop: '16px'
            }}>
              <UserX size={40} color="#ccc" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#333', margin: '0 0 6px 0' }}>
                {memberSearch ? 'Tidak ada anggota yang cocok' : `Belum ada anggota terdaftar untuk ${currentDpw.temporaryName}`}
              </h4>
              <p style={{ fontSize: '13px', color: '#777', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                {memberSearch
                  ? `Kata kunci "${memberSearch}" tidak ditemukan di database anggota ${currentDpw.temporaryName}.`
                  : `Database keanggotaan untuk wilayah ${currentDpw.temporaryName} belum diisi. Anda dapat mengunggah atau menambahkan data anggota di menu Keanggotaan.`
                }
              </p>
              <button
                onClick={() => navigate('/layanan/total-anggota')}
                className="button primary"
                style={{ fontSize: '13px', padding: '10px 20px' }}
              >
                Buka Pengelolaan Keanggotaan Full
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DIRECTORY VIEW (ALL 5 DPW CARDS WITH DYNAMIC COUNTS)
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

      <div style={{ display: 'grid', gap: '32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Direktori Wilayah</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
            Dewan Pengurus Wilayah (DPW)
          </h1>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '8px' }}>
            SKATA resmi dipimpin oleh <strong>5 Wilayah (DPW)</strong> fungsional di seluruh Indonesia. Rincian statistik jumlah anggota dan DPC di setiap wilayah terhubung secara realtime dengan database keanggotaan.
          </p>
        </div>

        {/* FULL PROMINENT INDONESIA MAP WITH 5 DPW */}
        <DotMapFull />

        {/* DPW Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {dpwList.map((dpw) => {
            const stats = dynamicDpwStats[dpw.id] || { memberCount: 0, dpcCount: 0, members: [] };

            return (
              <div key={dpw.id} style={{
                background: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#111', margin: 0 }}>
                      {dpw.temporaryName}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={13} /> {dpw.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>Ketua Wilayah:</span>{' '}
                      <span style={{ color: dpw.chairman ? '#111' : '#aaa', fontWeight: dpw.chairman ? 600 : 400 }}>
                        {dpw.chairman || 'Data belum tersedia'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 500 }}>Sekretaris:</span>{' '}
                      <span style={{ color: dpw.secretary ? '#111' : '#aaa' }}>
                        {dpw.secretary || 'Data belum tersedia'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 500 }}>Bendahara:</span>{' '}
                      <span style={{ color: dpw.treasurer ? '#111' : '#aaa' }}>
                        {dpw.treasurer || 'Data belum tersedia'}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', margin: '8px 0', paddingTop: '10px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#555' }}>Total Anggota Aktif:</span>
                      <strong style={{ color: 'var(--red, #ff2424)', fontSize: '14px', fontWeight: 700 }}>
                        {stats.memberCount} Anggota
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#555' }}>Total DPC Terdaftar:</span>
                      <strong style={{ color: '#333', fontSize: '14px', fontWeight: 700 }}>
                        {stats.dpcCount} Unit
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectDpw(dpw.id)}
                  className="button primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <Users size={15} /> Lihat Detail & Daftar Anggota
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
