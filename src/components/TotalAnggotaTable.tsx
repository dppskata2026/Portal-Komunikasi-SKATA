import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Users, Search, Download, ShieldCheck, Building2, MapPin, Filter, CheckCircle2, RefreshCw, UserCheck, Upload, X, FileSpreadsheet, ChevronRight, Briefcase, Phone, Mail, LayoutGrid, List, BarChart2, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { subscribeMemberships, safeSetLocalStorage } from '../lib/firestoreService';
import { OFFICIAL_ACTIVE_MEMBERS } from '../data/activeMembersData';

export interface MemberRecord {
  id: string;
  nik: string;
  fullName: string;
  unit: string;
  workLocation: string;
  status: string;
  dpw?: string;
  position?: string;
  corpEmail?: string;
  phone?: string;
  dateJoined?: string;
}

// Anonymous profile avatar component matching screenshot
const AnonymousAvatar: React.FC<{ size?: number; borderRadius?: string }> = ({ size = 56, borderRadius = '16px' }) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: borderRadius,
      background: '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#94a3b8" />
        <path d="M12 14C7.58172 14 4 16.6863 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 16.6863 16.4183 14 12 14Z" fill="#94a3b8" />
      </svg>
    </div>
  );
};

export const TotalAnggotaTable: React.FC = () => {
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    try {
      const stored = localStorage.getItem('skata_total_active_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('ALL');
  const [selectedDPW, setSelectedDPW] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<MemberRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time members from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeMemberships((firestoreItems) => {
      setIsLoading(false);
      
      const isCleared = localStorage.getItem('skata_members_is_cleared') === 'true';
      if (isCleared) {
        // User explicitly cleared the data, prevent automatic re-seeding
        return;
      }

      if (firestoreItems && firestoreItems.length > 0) {
        // Map firestore submissions into MemberRecords
        const mappedFirestore: MemberRecord[] = firestoreItems.map((f, index) => {
          return {
            id: f.id || `FS-${index}`,
            nik: f.nik || `100${29400 + index}`,
            fullName: f.fullName || 'Nama Tidak Tersedia',
            unit: f.unit || 'Unit Kerja Umum',
            workLocation: f.workLocation || f.dpc || f.dpw || 'Kantor Pusat / FM',
            status: f.status || 'Anggota Aktif',
            dpw: f.dpw || 'DPW 1',
            position: f.position || 'Karyawan',
            corpEmail: f.corpEmail || '',
            phone: f.phone || ''
          };
        });

        setMembers((prev) => {
          if (prev.length === 0) {
            safeSetLocalStorage('skata_total_active_members', mappedFirestore);
            return mappedFirestore;
          }
          // Preserve existing user/uploaded members position first!
          const existingNIKs = new Set(prev.map(m => m.nik));
          const newFromFirestore = mappedFirestore.filter(d => !existingNIKs.has(d.nik));
          if (newFromFirestore.length === 0) return prev;

          const merged = [...prev, ...newFromFirestore];
          safeSetLocalStorage('skata_total_active_members', merged);
          return merged;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Filtered list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchQuery =
        !search.trim() ||
        m.nik.toLowerCase().includes(search.toLowerCase()) ||
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.unit.toLowerCase().includes(search.toLowerCase()) ||
        m.workLocation.toLowerCase().includes(search.toLowerCase()) ||
        (m.dpw && m.dpw.toLowerCase().includes(search.toLowerCase()));

      const matchUnit = selectedUnit === 'ALL' || m.unit.toLowerCase().includes(selectedUnit.toLowerCase());
      const matchLocation = selectedWorkLocation === 'ALL' || m.workLocation.toLowerCase().includes(selectedWorkLocation.toLowerCase());
      const matchDPW = selectedDPW === 'ALL' || (m.dpw && m.dpw.toLowerCase().includes(selectedDPW.toLowerCase()));
      const matchStatus = selectedStatus === 'ALL' || m.status.toLowerCase().includes(selectedStatus.toLowerCase());

      return matchQuery && matchUnit && matchLocation && matchDPW && matchStatus;
    });
  }, [members, search, selectedUnit, selectedWorkLocation, selectedDPW, selectedStatus]);

  // Extract unique units, work locations (Kantor), and DPW (Wilayah) for filtering
  const uniqueUnits = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.unit) set.add(m.unit);
    });
    return Array.from(set).sort();
  }, [members]);

  const uniqueWorkLocations = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.workLocation) set.add(m.workLocation);
    });
    return Array.from(set).sort();
  }, [members]);

  const uniqueDPWs = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.dpw) set.add(m.dpw);
    });
    return Array.from(set).sort();
  }, [members]);

  // Regional distribution stats (DPP & DPW 1 - DPW 5)
  const regionStats = useMemo(() => {
    const counts: Record<string, number> = {
      'DPP': 0,
      'DPW 1': 0,
      'DPW 2': 0,
      'DPW 3': 0,
      'DPW 4': 0,
      'DPW 5': 0,
    };

    members.forEach((m) => {
      const dpwStr = (m.dpw || '').toUpperCase();
      const locStr = (m.workLocation || '').toUpperCase();
      const unitStr = (m.unit || '').toUpperCase();
      const combined = `${dpwStr} ${locStr} ${unitStr}`;

      if (combined.includes('DPP') || combined.includes('PUSAT') || combined.includes('HEAD OFFICE')) {
        counts['DPP']++;
      } else if (combined.includes('DPW 1') || combined.includes('DPW I') || combined.includes('SUMATERA') || combined.includes('MEDAN')) {
        counts['DPW 1']++;
      } else if (combined.includes('DPW 2') || combined.includes('DPW II') || combined.includes('JAKARTA') || combined.includes('BANTEN') || combined.includes('JAWA BARAT') || combined.includes('JABAR')) {
        counts['DPW 2']++;
      } else if (combined.includes('DPW 3') || combined.includes('DPW III') || combined.includes('JATENG') || combined.includes('JATIM') || combined.includes('JAWA TIMUR') || combined.includes('JAWA TENGAH') || combined.includes('BALI') || combined.includes('SURABAYA') || combined.includes('NTB') || combined.includes('NTT')) {
        counts['DPW 3']++;
      } else if (combined.includes('DPW 4') || combined.includes('DPW IV') || combined.includes('KALIMANTAN') || combined.includes('BALIKPAPAN') || combined.includes('IKN')) {
        counts['DPW 4']++;
      } else if (combined.includes('DPW 5') || combined.includes('DPW V') || combined.includes('TIMUR') || combined.includes('SULAWESI') || combined.includes('MAKASSAR') || combined.includes('PAPUA') || combined.includes('MALUKU')) {
        counts['DPW 5']++;
      } else {
        counts['DPW 1']++;
      }
    });

    const total = Math.max(members.length, 1);
    const maxVal = Math.max(...Object.values(counts), 1);

    return [
      { id: 'DPP', code: 'DPP', name: 'DPP Kantor Pusat', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', count: counts['DPP'], percent: Math.round((counts['DPP'] / total) * 100), barWidth: Math.max(Math.round((counts['DPP'] / maxVal) * 100), counts['DPP'] > 0 ? 8 : 2) },
      { id: 'DPW 1', code: 'DPW 1', name: 'DPW I - Sumatera', color: '#d97706', bg: '#fffbeb', border: '#fde68a', count: counts['DPW 1'], percent: Math.round((counts['DPW 1'] / total) * 100), barWidth: Math.max(Math.round((counts['DPW 1'] / maxVal) * 100), counts['DPW 1'] > 0 ? 8 : 2) },
      { id: 'DPW 2', code: 'DPW 2', name: 'DPW II - Jakarta, Banten, Jabar', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', count: counts['DPW 2'], percent: Math.round((counts['DPW 2'] / total) * 100), barWidth: Math.max(Math.round((counts['DPW 2'] / maxVal) * 100), counts['DPW 2'] > 0 ? 8 : 2) },
      { id: 'DPW 3', code: 'DPW 3', name: 'DPW III - Jateng, Jatim, Bali-Nusra', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', count: counts['DPW 3'], percent: Math.round((counts['DPW 3'] / total) * 100), barWidth: Math.max(Math.round((counts['DPW 3'] / maxVal) * 100), counts['DPW 3'] > 0 ? 8 : 2) },
      { id: 'DPW 4', code: 'DPW 4', name: 'DPW IV - Kalimantan', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff', count: counts['DPW 4'], percent: Math.round((counts['DPW 4'] / total) * 100), barWidth: Math.max(Math.round((counts['DPW 4'] / maxVal) * 100), counts['DPW 4'] > 0 ? 8 : 2) },
      { id: 'DPW 5', code: 'DPW 5', name: 'DPW V - Kawasan Timur Indonesia', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', count: counts['DPW 5'], percent: Math.round((counts['DPW 5'] / total) * 100), barWidth: Math.max(Math.round((counts['DPW 5'] / maxVal) * 100), counts['DPW 5'] > 0 ? 8 : 2) },
    ];
  }, [members]);

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredMembers.map((m, idx) => ({
      'Nomor': idx + 1,
      'NIK': m.nik,
      'Nama Karyawan': m.fullName,
      'Nama Unit': m.unit,
      'Kantor': m.workLocation,
      'Wilayah': m.dpw || '-',
      'Status Keanggotaan': m.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Anggota Aktif SKATA');
    XLSX.writeFile(wb, `Data_Total_Anggota_Aktif_SKATA_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nomor': 1,
        'NIK': '995188',
        'Nama Karyawan': 'ABDILLAH HAMMAM NUR FAHMI',
        'Nama Unit': 'BUSINESS CONTROL & PERFORMANCE',
        'Kantor': 'FRM',
        'Wilayah': 'DPP KANTOR PUSAT',
        'Status Keanggotaan': 'Aktif'
      },
      {
        'Nomor': 2,
        'NIK': '995186',
        'Nama Karyawan': 'IRFAN RAFI FIRMANSYAH',
        'Nama Unit': 'FINANCIAL PLANNING & EVALUATION',
        'Kantor': 'FRM',
        'Wilayah': 'DPP KANTOR PUSAT',
        'Status Keanggotaan': 'Aktif'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Anggota SKATA');
    XLSX.writeFile(wb, 'Template_Upload_Anggota_SKATA.xlsx');
  };

  // Upload and parse Excel / CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });

        if (!rawData || rawData.length === 0) {
          alert('File Excel/CSV kosong atau tidak memiliki data.');
          return;
        }

        const importedMembers: MemberRecord[] = rawData.map((row, idx) => {
          const getVal = (...keys: string[]) => {
            for (const k of keys) {
              for (const keyInRow of Object.keys(row)) {
                if (keyInRow.trim().toLowerCase() === k.trim().toLowerCase()) {
                  return String(row[keyInRow]).trim();
                }
              }
            }
            return '';
          };

          const nik = getVal('NIK', 'NIK Karyawan', 'No. NIK', 'nik') || `99${idx + 1000}`;
          const fullName = getVal('Nama Karyawan', 'Nama', 'Nama Lengkap', 'fullName') || `Anggota ${idx + 1}`;
          const unit = getVal('Nama Unit', 'Unit', 'Unit Kerja', 'unit') || '-';
          const workLocation = getVal('Kantor', 'Lokasi Kerja', 'Kantor / Lokasi Kerja', 'workLocation') || '-';
          const dpw = getVal('Wilayah', 'Wilayah DPW', 'DPW', 'dpw') || '-';
          const phone = getVal('Nomor HP', 'No HP', 'No. HP', 'HP', 'Phone', 'Telepon', 'phone') || '';
          const corpEmail = getVal('Email', 'Corp Email', 'Email Korporat', 'Email Perusahaan', 'corpEmail') || '';
          const rawStatus = getVal('Status Keanggotaan', 'Status', 'status') || 'Aktif';

          return {
            id: `EXCEL-${Date.now()}-${idx}`,
            nik,
            fullName,
            unit,
            workLocation,
            dpw,
            phone,
            corpEmail,
            status: rawStatus.toLowerCase().includes('anggota') ? rawStatus : `Anggota ${rawStatus}`
          };
        });

        setMembers(importedMembers);
        safeSetLocalStorage('skata_total_active_members', importedMembers);
        localStorage.setItem('skata_members_is_cleared', 'false');
        window.dispatchEvent(new Event('skata_members_updated'));
        setShowUploadModal(false);
        setSuccessMsg(`Berhasil mengunggah ${importedMembers.length} data anggota dari file Excel!`);
        setTimeout(() => setSuccessMsg(null), 6000);
      } catch (err) {
        console.error('Error reading file:', err);
        alert('Gagal membaca file Excel. Pastikan format file .xlsx atau .csv sudah sesuai.');
      }
    };
    reader.readAsBinaryString(file);
    if (e.target) e.target.value = '';
  };

  // Reset / Kosongkan Data Anggota
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus / mengosongkan semua data anggota?')) {
      setMembers([]);
      safeSetLocalStorage('skata_total_active_members', []);
      localStorage.setItem('skata_members_is_cleared', 'true');
      window.dispatchEvent(new Event('skata_members_updated'));
      setSuccessMsg('Semua data anggota telah berhasil dikosongkan (belum diupdate).');
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Top Banner Alert if any success message */}
      {successMsg && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', color: '#15803d', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Stat Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={26} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '13px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Total Anggota Aktif
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>
              {members.length} <span style={{ fontSize: '15px', fontWeight: 500 }}>Jiwa</span>
            </div>
            <div style={{ fontSize: '11px', marginTop: '6px', fontWeight: 600, background: 'rgba(255,255,255,0.22)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
              📅 Cut Off Periode Juni 2026
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
              Unit Kerja Terdaftar
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
              {uniqueUnits.length} <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 400 }}>Unit</span>
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={26} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
              Cakupan Wilayah DPW
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
              5 <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 400 }}>Wilayah</span>
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={26} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
              Status Verifikasi
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
              100% <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 400 }}>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Member Distribution Chart Section */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart2 size={22} color="#0284c7" /> Grafik Sebaran Jumlah Anggota Berdasarkan Wilayah
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Distribusi keanggotaan aktif mencakup Sekretariat DPP Kantor Pusat & 5 Dewan Pengurus Wilayah (DPW 1 s/d DPW 5)
            </p>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ecfdf5',
            color: '#047857',
            border: '1px solid #a7f3d0',
            padding: '6px 14px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 800
          }}>
            <Calendar size={14} /> Total Anggota Cut Off Periode Juni 2026
          </div>
        </div>

        {/* Visual Bar Distribution Chart Grid */}
        <div style={{ display: 'grid', gap: '14px' }}>
          {regionStats.map((item) => {
            const isSelected = selectedDPW.toLowerCase() === item.code.toLowerCase();
            return (
              <div
                key={item.id}
                onClick={() => setSelectedDPW(selectedDPW === item.code ? 'ALL' : item.code)}
                style={{
                  background: isSelected ? item.bg : '#f8fafc',
                  border: `1px solid ${isSelected ? item.color : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 4px 12px ${item.border}` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#ffffff',
                      background: item.color,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.code}
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                      {item.name}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {item.percent}%
                    </span>
                    <strong style={{ fontSize: '15px', color: item.color, fontWeight: 800 }}>
                      {item.count} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>Jiwa</span>
                    </strong>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: '#e2e8f0',
                  borderRadius: '99px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${item.barWidth}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    borderRadius: '99px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Region Quick Badges Summary */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginRight: '4px' }}>
            Filter Wilayah:
          </span>
          <button
            onClick={() => setSelectedDPW('ALL')}
            style={{
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid',
              borderColor: selectedDPW === 'ALL' ? '#0f172a' : '#cbd5e1',
              background: selectedDPW === 'ALL' ? '#0f172a' : '#ffffff',
              color: selectedDPW === 'ALL' ? '#ffffff' : '#475569',
              cursor: 'pointer'
            }}
          >
            Semua Wilayah ({members.length})
          </button>
          {regionStats.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedDPW(selectedDPW === r.code ? 'ALL' : r.code)}
              style={{
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${selectedDPW === r.code ? r.color : r.border}`,
                background: selectedDPW === r.code ? r.color : r.bg,
                color: selectedDPW === r.code ? '#ffffff' : r.color,
                cursor: 'pointer'
              }}
            >
              {r.code}: {r.count} Jiwa
            </button>
          ))}
        </div>
      </div>

      {/* Control Toolbar: Search, Filters, Upload & Export */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#16a34a" size={22} /> Detail Daftar Anggota Aktif SKATA
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px' }}>
              📅 Total Anggota Cut Off Periode Juni 2026
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setViewMode('card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'card' ? '#ffffff' : 'transparent',
                  color: viewMode === 'card' ? '#0f172a' : '#64748b',
                  boxShadow: viewMode === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <LayoutGrid size={15} /> Kartu
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'table' ? '#ffffff' : 'transparent',
                  color: viewMode === 'table' ? '#0f172a' : '#64748b',
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <List size={15} /> Tabel
              </button>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={16} /> Upload Data Excel
            </button>

            <button
              onClick={handleExportExcel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Download size={16} /> Unduh Laporan Excel
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Cari NIK, Nama, Unit, Kantor, Wilayah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Unit Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="#6b7280" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Unit Kerja ({uniqueUnits.length})</option>
              {uniqueUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Kantor / Work Location Filter */}
          <div>
            <select
              value={selectedWorkLocation}
              onChange={(e) => setSelectedWorkLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Kantor ({uniqueWorkLocations.length})</option>
              {uniqueWorkLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Wilayah / DPW Filter */}
          <div>
            <select
              value={selectedDPW}
              onChange={(e) => setSelectedDPW(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Wilayah ({uniqueDPWs.length})</option>
              {uniqueDPWs.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">Semua Status Keanggotaan</option>
              <option value="Aktif">Anggota Aktif</option>
              <option value="Pengurus">Pengurus Organisasi</option>
              <option value="Pembina">Dewan Pembina</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Members Display Area */}
      {viewMode === 'card' ? (
        /* CARD VIEW - Matching requested image style */
        <div>
          {filteredMembers.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '56px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                display: 'inline-flex',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: '#f1f5f9',
                color: '#64748b',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Users size={32} />
              </div>
              {members.length === 0 ? (
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    Data Anggota Belum Diupdate
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                    Database anggota SKATA saat ini masih kosong / belum diupdate. Silakan unggah berkas Excel (.xlsx / .csv) data anggota terbaru melalui tombol di bawah ini.
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    <Upload size={18} /> Upload Data Excel (.xlsx)
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Tidak ada data anggota yang cocok.
                  </div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Coba ubah kata kunci pencarian atau filter unit kerja Anda.</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {filteredMembers.map((member, idx) => (
                <div
                  key={member.id || idx}
                  onClick={() => setSelectedMemberDetail(member)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Anonymous Profile Avatar */}
                  <AnonymousAvatar size={58} borderRadius="18px" />

                  {/* Middle Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>NIK:</span>
                      <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 800, fontFamily: 'monospace' }}>{member.nik}</span>
                    </div>

                    <div style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '2px 0 4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {member.fullName}
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 500
                    }}>
                      <Briefcase size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.unit}
                      </span>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <ChevronRight size={22} color="#cbd5e1" style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}

          {/* Footer info bar for Cards View */}
          <div style={{
            marginTop: '20px',
            padding: '14px 20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#64748b'
          }}>
            <div>
              Menampilkan <strong>{filteredMembers.length}</strong> dari total <strong>{members.length}</strong> Anggota Terdaftar
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleResetData}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={13} /> Kosongkan Data Anggota
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                Terhubung ke Firestore Realtime
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW - Alternative List view */
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '14px 16px', width: '60px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Nomor</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>NIK</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Nama Karyawan</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Nama Unit</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Kantor</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Wilayah</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Status Keanggotaan</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{
                        display: 'inline-flex',
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: '#f1f5f9',
                        color: '#64748b',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}>
                        <Users size={28} />
                      </div>
                      {members.length === 0 ? (
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                            Data Anggota Belum Diupdate
                          </div>
                          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                            Database anggota SKATA saat ini masih kosong / belum diupdate. Silakan unggah berkas Excel (.xlsx / .csv) data anggota terbaru melalui tombol di bawah ini.
                          </p>
                          <button
                            onClick={() => setShowUploadModal(true)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                            }}
                          >
                            <Upload size={16} /> Upload Data Excel (.xlsx)
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                            Tidak ada data anggota yang cocok.
                          </div>
                          <span style={{ fontSize: '13px' }}>Coba ubah kata kunci pencarian atau filter unit kerja Anda.</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, idx) => {
                    const isBoard = member.status.toLowerCase().includes('pengurus') || member.status.toLowerCase().includes('pembina');
                    return (
                      <tr
                        key={member.id || idx}
                        onClick={() => setSelectedMemberDetail(member)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                          background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          cursor: 'pointer'
                        }}
                      >
                        <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                          {member.nik}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AnonymousAvatar size={34} borderRadius="10px" />
                            <div>
                              <div>{member.fullName}</div>
                              {member.position && (
                                <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', display: 'block', marginTop: '2px' }}>
                                  {member.position}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building2 size={15} color="#64748b" />
                            <span>{member.unit}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={15} color="#d97706" />
                            <span>{member.workLocation}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>
                          {member.dpw || '-'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            backgroundColor: isBoard ? '#fef3c7' : '#f0fdf4',
                            color: isBoard ? '#b45309' : '#15803d',
                            border: `1px solid ${isBoard ? '#fde68a' : '#bbf7d0'}`
                          }}>
                            <CheckCircle2 size={14} />
                            {member.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#0284c7' }}>
                          <ChevronRight size={18} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info bar */}
          <div style={{
            padding: '14px 20px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#64748b'
          }}>
            <div>
              Menampilkan <strong>{filteredMembers.length}</strong> dari total <strong>{members.length}</strong> Anggota Terdaftar
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleResetData}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={13} /> Kosongkan Data Anggota
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                Terhubung ke Firestore Realtime
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MEMBER MODAL - Displays when a member card is clicked */}
      {selectedMemberDetail && (
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
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedMemberDetail(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            {/* Header Profile Section with Anonymous Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '8px' }}>
              <div style={{ display: 'inline-block', position: 'relative', marginBottom: '12px' }}>
                <AnonymousAvatar size={84} borderRadius="24px" />
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: '#16a34a',
                  color: '#ffffff',
                  borderRadius: '50%',
                  padding: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                {selectedMemberDetail.fullName}
              </h2>
              <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7', marginTop: '4px' }}>
                NIK: {selectedMemberDetail.nik}
              </div>
            </div>

            {/* Detail Information List */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gap: '14px'
            }}>
              {/* Nama Karyawan */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Nama Karyawan</span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedMemberDetail.fullName}</span>
              </div>

              {/* NIK */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>NIK</span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>{selectedMemberDetail.nik}</span>
              </div>

              {/* Nama Unit */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={15} color="#0284c7" /> Nama Unit
                </span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>{selectedMemberDetail.unit}</span>
              </div>

              {/* Kantor */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={15} color="#0284c7" /> Kantor
                </span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedMemberDetail.workLocation}</span>
              </div>

              {/* Wilayah */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="#d97706" /> Wilayah
                </span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedMemberDetail.dpw || '-'}</span>
              </div>

              {/* Nomor HP */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="#16a34a" /> Nomor HP
                </span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedMemberDetail.phone || '-'}</span>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} color="#2563eb" /> Email
                </span>
                <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{selectedMemberDetail.corpEmail || '-'}</span>
              </div>

              {/* Status Keanggotaan */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#16a34a" /> Status Keanggotaan
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
                  {selectedMemberDetail.status}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setSelectedMemberDetail(null)}
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
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
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
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowUploadModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Upload Data Anggota Excel
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Pembaruan data anggota secara massal
                </p>
              </div>
            </div>

            <div style={{
              margin: '20px 0',
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#334155'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                Format Kolom Template Excel:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {['Nomor', 'NIK', 'Nama Karyawan', 'Nama Unit', 'Kantor', 'Wilayah', 'Status Keanggotaan'].map(col => (
                  <span key={col} style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {col}
                  </span>
                ))}
              </div>

              <button
                onClick={handleDownloadTemplate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2563eb',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Unduh Template Excel (.xlsx)
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #0284c7',
                borderRadius: '16px',
                padding: '32px 20px',
                textAlign: 'center',
                background: '#f0f9ff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={36} color="#0284c7" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0369a1' }}>
                Klik untuk memilih file Excel (.xlsx / .csv)
              </div>
              <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '4px' }}>
                Atau unggah file laporan spreadsheet anggota terbaru
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
