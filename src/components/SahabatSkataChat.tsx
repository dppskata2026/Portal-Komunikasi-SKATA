import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Info,
  Database,
  BookOpen,
  FileText
} from 'lucide-react';
import { seedRegulationsToFirebase } from '../lib/firestoreService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SahabatSkataChatProps {
  mode?: 'standalone' | 'widget';
  onClose?: () => void;
  onBack?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Apa saja hak cuti tahunan, CAP, & MTM di PKB V 2025–2027?',
  'Bagaimana ketentuan Kenaikan Gaji, THR & Bonus di PKB V?',
  'Apa isi Anggaran Dasar (AD) & Anggaran Rumah Tangga (ART) SKATA?',
  'Bagaimana alur advokasi hukum jika terjadi perselisihan kerja?',
  'Siapa saja Susunan Pengurus DPP & DPW SKATA 2026–2028?'
];
// Local Knowledge Fallback Engine for Sahabat SKATA AI
async function getFallbackAiResponse(query: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Kamu adalah Sahabat SKATA, Asisten AI Cerdas resmi Serikat Karyawan GSD (PT Graha Sarana Duta / TelkomProperty - Anak Perusahaan PT Telkom Indonesia Tbk). Jawablah setiap pertanyaan dengan sangat ramah, profesional, menyambung, dan akurat berdasarkan regulasi resmi SKATA (PKB V 2025–2027, AD & ART 2026). Gunakan format Markdown yang rapi.`;

      // Clean up message turns so it starts with user and alternates
      const validMsgs = messages.filter((m) => (m.content || '').trim() !== '');
      let rawList = validMsgs.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        text: m.content.trim()
      }));

      while (rawList.length > 0 && rawList[0].role === 'model') {
        rawList.shift();
      }

      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const item of rawList) {
        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
          formattedContents[formattedContents.length - 1].parts[0].text += `\n${item.text}`;
        } else {
          formattedContents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }

      if (formattedContents.length > 0) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: formattedContents,
          config: { systemInstruction, temperature: 0.7 }
        });
        if (response.text) return response.text;
      }
    } catch (gErr) {
      console.warn('Client-side Gemini API fallback error, using SKATA Local Knowledge Engine:', gErr);
    }
  }

  // Local Knowledge Search Matcher
  const q = query.toLowerCase();

  // Greetings & Friendly Chit-chat
  if (q.includes('halo') || q.includes('hai') || q.includes('salam') || q.includes('pagi') || q.includes('siang') || q.includes('malam') || q.includes('terima kasih') || q.includes('terimakasih') || q.includes('makasih')) {
    return `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊

Selamat datang di layanan konsultasi **Sahabat SKATA AI**. Saya siap membantu menjawab pertanyaan Anda seputar:
- **Hak Ketenagakerjaan (PKB V 2025–2027)**: Aturan Cuti, THR, Kenaikan Upah, Jam Kerja, dan Benefit.
- **Regulasi Serikat (AD/ART 2026)**: Keanggotaan, iuran payroll, e-KTA Digital, dan Struktur Pengurus DPP/DPW.
- **Advokasi & Perlindungan Hukum**: Sanksi disiplin dan pendampingan perselisihan kerja.

Ada yang bisa Sahabat SKATA bantu secara khusus hari ini?`;
  }

  // Susunan Pengurus & Pimpinan
  if (q.includes('pengurus') || q.includes('dpp') || q.includes('dpw') || q.includes('ketua') || q.includes('pimpinan') || q.includes('susunan') || q.includes('pembina') || q.includes('sekretaris') || q.includes('bendahara')) {
    return `Berikut adalah **Susunan Resmi Pengurus DPP & DPW SKATA Periode 2026–2028** (Hasil MUNAS VI SKATA 2026):

🏛️ **Dewan Pembina SKATA:**
- **Ketua Dewan Pembina:** Wira Widytara
- **Anggota Dewan Pembina:** RM. Advitor Juto Kusmono & Sultan Riady

💼 **Dewan Pengurus Pusat (DPP) SKATA:**
- **Ketua Umum (Ketum):** Amiruddin Ahmad
- **Wakil Ketua I (Organisasi & Advokasi):** I Gede Aditya W
- **Wakil Ketua II (Usaha & Komunikasi):** Heri Santoso
- **Sekretaris Umum (Sekum):** Ronald Ishack
- **Bendahara Umum (Bendum):** Jerry Pratama Yendy
- **Anggota Bendahara:** Rifky Fernanda

📌 **Ketua Bidang DPP:**
- **Bidang Organisasi & Keanggotaan:** Muji Rahmad
- **Bidang Advokasi:** Iskandar Zulkarnain (Anggota: Gremmy Jordan)
- **Bidang Usaha:** Andri (Anggota: Nuronia Zulva)
- **Bidang Komunikasi & Informasi:** Wisnu Yogi Prabowo (Anggota: Alya Adianta)

🗺️ **Ketua Dewan Pengurus Wilayah (DPW):**
- **DPW 1 Sumatera:** Ade Hermansyah (\`dpw1@skata-gsd.or.id\`)
- **DPW 2 Jakarta, Banten, Jawa Barat:** Asep Saipul Bahry (\`dpw2@skata-gsd.or.id\`)
- **DPW 3 Jateng, Jatim, Bali & Nusra:** Angga Eka Saputra (\`dpw3@skata-gsd.or.id\`)
- **DPW 4 Kalimantan:** Moh. Abdulloh Hadi (\`dpw4@skata-gsd.or.id\`)
- **DPW 5 Kawasan Timur Indonesia:** Muhammad Afdhal Syahrullah (\`dpw5@skata-gsd.or.id\`)

*Rujukan resmi: AD/ART SKATA 2026 & SK Pengurus DPP SKATA Periode 2026–2028.*`;
  }

  // Cuti & Izin
  if (q.includes('cuti') || q.includes('cap') || q.includes('mtm') || q.includes('ijin') || q.includes('izin') || q.includes('melahirkan') || q.includes('sakit') || q.includes('haji') || q.includes('umroh') || q.includes('libur')) {
    return `Berdasarkan **PKB V SKATA & PT GSD 2025–2027 (BAB VI - Cuti & Izin)**:

🗓️ **1. Cuti Tahunan (Pasal 19):**
- Hak cuti tahunan adalah **12 hari kerja per tahun** untuk Karyawan Tetap & TKWT (>6 bulan masa kerja).
- Pengajuan wajib dilakukan minimal **3 hari kerja** sebelumnya.

🎗️ **2. Cuti Alasan Penting / CAP (Pasal 20):**
- **3 Hari Kerja:** Anggota keluarga sakit keras/rawat inap, musibah duka meninggal (istri/suami, anak, ortu/mertua, adik/kakak), pernikahan pertama karyawan, mendampingi istri melahirkan/keguguran, mengurus warisan/hukum.
- **2 Hari Kerja:** Pernikahan anak, khitanan/pembaptisan anak.
- **1 Hari Kerja:** Musibah duka anggota keluarga luar.

🎉 **3. Cuti Moments That Matter / MTM (Pasal 27):**
- **1 Hari Kerja per tahun** untuk momen spesial: Hari pertama sekolah anak (SD), Wisuda anak/karyawan, Ulang tahun karyawan, Ulang tahun pernikahan.

🏥 **4. Istirahat Melahirkan & Keguguran (Pasal 23):**
- **3 Bulan** untuk melahirkan (1.5 bulan sebelum & 1.5 bulan sesudah).
- **1.5 Bulan** untuk keguguran kandungan dengan keterangan dokter.

🏥 **5. Cuti Sakit Berkepanjangan (Pasal 22):**
- **4 bulan I:** Upah dibayar **100% THP**
- **4 bulan II:** Upah dibayar **75% THP**
- **4 bulan III:** Upah dibayar **50% THP**
- **Bulan ke-13 dst:** Upah dibayar **25% THP** sebelum evaluasi medis.

*Rujukan resmi: Perjanjian Kerja Bersama (PKB V) SKATA & GSD 2025–2027.*`;
  }

  // Gaji, THR, Bonus, Benefit, Pensiun, Uang Pisah
  if (q.includes('gaji') || q.includes('thr') || q.includes('bonus') || q.includes('tunjangan') || q.includes('iuran') || q.includes('pisah') || q.includes('pensiun') || q.includes('upah')) {
    return `Berdasarkan **PKB V SKATA & GSD 2025–2027 (BAB VII - Compensation & Benefit)** & **ART SKATA 2026**:

💵 **1. Kenaikan Gaji Berkala (Pasal 28):**
- Kenaikan upah dilaksanakan setiap awal tahun berdasarkan **Merit System** (Penilaian Kinerja & Bobot Jabatan).

🌙 **2. Tunjangan Hari Raya / THR (Pasal 29):**
- **Karyawan Tetap:** Indeks **2x (Basic Salary + Position Allowance)**.
- **TKWT:** Indeks **1x Basic Salary**.
- Dicairkan paling lambat **H-14 sebelum Hari Raya Idul Fitri**.

🎁 **3. Bonus & Pajak PPh (Pasal 32 & 33):**
- Bonus diberikan berdasarkan pencapaian target RUPS Tahunan PT GSD.
- **Pajak PPh 21** atas upah, THR, dan bonus ditanggung sepenuhnya oleh Perusahaan PT GSD.

💰 **4. Uang Pisah Resign (Pasal 42) & Pensiun:**
- Usia Pensiun Normal Karyawan: **56 Tahun**.
- Masa Kerja < 60 bulan: **20%** dari metode UPMK.
- Masa Kerja 60–120 bulan: **30%** dari metode UPMK.
- Masa Kerja > 120 bulan: **50%** dari metode UPMK.

💳 **5. Iuran Keanggotaan SKATA (ART BAB VI):**
- Iuran dipotong langsung via payroll bulanan dengan Surat Kuasa.
- Pembagian iuran: **75% DPP SKATA Pusat** dan **25% DPW Wilayah Asal**.

*Rujukan resmi: PKB V SKATA & PT GSD 2025–2027 & ART SKATA 2026.*`;
  }

  // e-KTA, Pendaftaran, Syarat Anggota
  if (q.includes('kta') || q.includes('ekta') || q.includes('daftar') || q.includes('pendaftaran') || q.includes('anggota') || q.includes('syarat')) {
    return `Berikut informasi **Pendaftaran Anggota & e-KTA Digital SKATA**:

📱 **1. Cara Mendaftar e-KTA Digital:**
- Buka menu **Layanan > Keanggotaan & e-KTA** pada Portal SKATA.
- Isi Formulir Pendaftaran Anggota secara lengkap (NIK, Nama, Unit Kerja, DPW/DPC, No HP, dan Email Korporat).
- Upload tanda tangan digital & persetujuan Surat Kuasa Pemotongan Iuran Keanggotaan via Payroll.

💳 **2. Kartu e-KTA Digital:**
- Kartu e-KTA digital ber-QR Code resmi akan langsung dapat diunduh/dicetak setelah data terverifikasi oleh DPP/DPW.

👥 **3. Syarat Anggota (AD/ART SKATA 2026):**
- Merupakan Karyawan Tetap PT Graha Sarana Duta (GSD).
- Bersedia mendukung asas, visi, misi, dan aturan AD/ART SKATA.

*Rujukan resmi: Anggaran Dasar & Rumah Tangga (AD/ART) SKATA 2026.*`;
  }

  // AD/ART, Visi, Misi, Kedudukan, Logo
  if (q.includes('ad') || q.includes('anggaran dasar') || q.includes('visi') || q.includes('misi') || q.includes('logo') || q.includes('asas') || q.includes('kedudukan') || q.includes('alamat')) {
    return `Berikut ringkasan **Anggaran Dasar (AD) SKATA 2026** (Disahkan MUNAS VI SKATA di Bandung, 23 Juli 2026):

🏢 **Identitas & Kedudukan:**
- **Nama:** Serikat Karyawan GRAHA SARANA DUTA (SKATA).
- **Sifat:** Independen, demokratis, profesional, tidak berafiliasi parpol, beranggotakan karyawan tetap PT GSD.
- **Berdiri:** Jakarta, 04 Oktober 2013.
- **Kedudukan Kantor Pusat:** Menara Multimedia, Jl. Kebon Sirih No. 12, Jakarta Pusat.

🎯 **Asas, Visi & Misi:**
- **Asas:** Pancasila & UUD 1945.
- **Visi:** Menjadi organisasi serikat yang berjalan selaras dengan visi perusahaan untuk mewujudkan kesejahteraan dan pemberdayaan anggota.
- **Misi:** Membawa keseimbangan hubungan kerja strategis, menambah nilai kesejahteraan, dan meningkatkan soliditas anggota & keluarga.

⚡ **Makna Logo:**
- Turunan logo TelkomProperty membentuk huruf **S** dan **Petir** (kekuatan, kecerdasan, intuisi, dan pencerahan). Warna merah pada T melambangkan obor api perjuangan.

*Rujukan resmi: Dokumen Resmi Anggaran Dasar (AD) SKATA 2026.*`;
  }

  // Disiplin, Advokasi, Sanksi, SP, PHK
  if (q.includes('advokasi') || q.includes('sanksi') || q.includes('sp') || q.includes('phk') || q.includes('disiplin') || q.includes('perselisihan') || q.includes('hukum')) {
    return `Berdasarkan **PKB V SKATA & GSD (BAB XI - Disiplin & Sanksi)** & **AD/ART SKATA**:

⚖️ **1. Jenis Sanksi Disiplin Karyawan (Pasal 58–60):**
- **STT (Surat Teguran Tertulis):** Maksimal 1x dari Atasan/Kepala Unit.
- **SP-1 (Surat Peringatan Pertama):** Berlaku **6 bulan**, pemotongan bonus/allowance selama 3 bulan.
- **SP-2 & SP-3:** Berlaku **6 & 12 bulan**, pemotongan bonus/allowance 6–12 bulan dan demosi jabatan.

🚨 **2. Pelanggaran Mendesak / PHK Langsung (Pasal 61):**
- Pemalsuan dokumen, perkelahian/penganiayaan, perjudian, penggunaan/perekrutan narkoba, tindak pidana/kejahatan, dan pencurian/korupsi.

🛡️ **3. Layanan Advokasi Serikat SKATA:**
- Anggota berhak mendapat pendampingan hukum dan pembelaan diri dari Bidang Advokasi SKATA dalam setiap tahapan perselisihan hubungan industrial (Bipartit, Mediasi, hingga PHI).
- **Tim Advokasi DPP SKATA:** Iskandar Zulkarnain & Gremmy Jordan.

*Rujukan resmi: PKB V SKATA & PT GSD 2025–2027 (Pasal 58–64) & AD/ART SKATA.*`;
  }

  // Flexible Fallback Response tailored to user's question
  return `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊

Terima kasih atas pertanyaan Anda mengenai **"${query}"**.

Sahabat SKATA siap memberikan pendampingan dan penjelasan berdasarkan **Database Regulasi Resmi SKATA & PT GSD**:
- 📜 **Perjanjian Kerja Bersama V (PKB V) 2025–2027**
- 🏛️ **Anggaran Dasar (AD) & Anggaran Rumah Tangga (ART) SKATA 2026**
- 👥 **Portal Keanggotaan & Layanan e-KTA Digital**

Silakan ajukan pertanyaan yang lebih rinci (misalnya: aturan cuti, Kenaikan Upah, THR, pengurus DPW, pendaftaran e-KTA, atau advokasi hukum), dan Sahabat SKATA akan menyajikannya dengan rinci beserta rujukan pasalnya!`;
}

export function SahabatSkataChat({ mode = 'standalone', onClose, onBack }: SahabatSkataChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊\n\nSaya **Sahabat SKATA**, asisten AI cerdas resmi Serikat Karyawan GSD.\n\nSaya telah terhubung langsung ke **Database Firebase Firestore** yang memuat seluruh dokumen resmi:\n- **Anggaran Dasar (AD) SKATA 2026**\n- **Anggaran Rumah Tangga (ART) SKATA 2026**\n- **Perjanjian Kerja Bersama V (PKB V) SKATA & GSD 2025–2027** (Disahkan Kemenaker RI)\n\nSilakan ajukan pertanyaan seputar hak pekerja, aturan cuti, THR, advokasi, iuran, e-KTA, atau pasal regulasi SKATA!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed and sync regulations database to Firebase Firestore on mount
    seedRegulationsToFirebase().then((success) => {
      if (success) setDbSynced(true);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Prepare history for backend API
      const conversationHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      let replyText = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          replyText = data.reply;
        } else if (contentType.includes('application/json')) {
          const data = await res.json();
          throw new Error(data.error || `Server error ${res.status}`);
        } else {
          // Non-JSON response (e.g., HTML 404 on Vercel/static host)
          throw new Error('Backend API chat unavailable');
        }
      } catch (backendErr) {
        console.warn('Backend API chat unavailable, using Sahabat SKATA Client Knowledge Engine:', backendErr);
        replyText = await getFallbackAiResponse(query.trim(), conversationHistory);
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText || 'Maaf, Sahabat SKATA belum dapat memberikan jawaban saat ini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Mohon maaf**: ${err.message || 'Layanan Sahabat SKATA AI sedang mengalami gangguan koneksi. Silakan coba beberapa saat lagi.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard error in restricted iframe
    }
  };

  const handleReset = () => {
    if (window.confirm('Bersihkan riwayat percakapan dengan Sahabat SKATA?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Percakapan telah diperbarui. Silakan ajukan pertanyaan baru Anda seputar SKATA!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Helper to render bold markdown and paragraphs
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Format bold text **word**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={lineIdx} className="skata-chat-li">
            {formattedParts.slice(1)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={line.trim() === '' ? 'skata-chat-spacer' : 'skata-chat-p'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={`skata-chat-container ${mode} ${isExpanded ? 'expanded' : ''}`}
    >
      {/* Header */}
      <div className="skata-chat-header">
        <div className="skata-chat-brand">
          {mode === 'standalone' && onBack && (
            <button className="skata-chat-icon-btn back-btn" onClick={onBack} title="Kembali">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="skata-bot-avatar-wrapper">
            <div className="skata-bot-avatar">
              <Bot size={22} className="skata-bot-icon" />
            </div>
            <span className="skata-status-dot" title="Sistem AI Aktif" />
          </div>
          <div className="skata-chat-title">
            <div className="skata-title-row">
              <h3>Sahabat SKATA</h3>
              <span className="skata-ai-badge">
                <Sparkles size={11} /> AI Assistant
              </span>
            </div>
            <p>Asisten Virtual Resmi Serikat Karyawan GSD</p>
          </div>
        </div>

        <div className="skata-chat-actions">
          <button
            className="skata-chat-icon-btn"
            onClick={handleReset}
            title="Reset Percakapan"
          >
            <RefreshCw size={16} />
          </button>

          {mode === 'widget' && (
            <>
              <button
                className="skata-chat-icon-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Kecilkan' : 'Perbesar'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              {onClose && (
                <button className="skata-chat-icon-btn close-btn" onClick={onClose} title="Tutup Chat">
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Info Notice & Database Reference Indicator */}
      <div className="skata-chat-info-banner flex-col gap-1.5 align-start" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 16px', background: 'rgba(2, 132, 199, 0.08)', borderBottom: '1px solid rgba(2, 132, 199, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--skata-navy)' }}>
          <Database size={14} style={{ color: '#0284c7' }} />
          <span>Database Referensi: Firebase Firestore (AD, ART & PKB V SKATA)</span>
          <span style={{ marginLeft: 'auto', fontSize: '10px', background: dbSynced ? '#dcfce7' : '#fef3c7', color: dbSynced ? '#15803d' : '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
            {dbSynced ? '● Database Firestore Aktif' : '○ Menghubungkan Firebase...'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.85 }}>
          <ShieldCheck size={13} className="banner-icon" />
          <span>Diperkuat Google Gemini AI & Referensi Hukum Ketenagakerjaan PT GSD</span>
        </div>
      </div>

      {/* Messages Body */}
      <div className="skata-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`skata-msg-row ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="skata-msg-avatar">
                <Bot size={16} />
              </div>
            )}

            <div className="skata-msg-bubble-wrapper">
              <div className="skata-msg-bubble">
                {renderFormattedText(msg.content)}
              </div>

              <div className="skata-msg-meta">
                <span className="skata-msg-time">{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    className="skata-copy-btn"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    title="Salin Teks"
                  >
                    {copiedId === msg.id ? <Check size={12} className="copied" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="skata-msg-avatar user">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="skata-msg-row assistant loading">
            <div className="skata-msg-avatar">
              <Bot size={16} />
            </div>
            <div className="skata-msg-bubble-wrapper">
              <div className="skata-msg-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-text">Sahabat SKATA sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && !isLoading && (
        <div className="skata-chat-suggestions">
          <div className="suggestions-header">
            <HelpCircle size={13} />
            <span>Rekomendasi Pertanyaan Sering Diajukan:</span>
          </div>
          <div className="suggestions-grid">
            {SUGGESTED_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(promptText)}
              >
                <span>{promptText}</span>
                <ChevronRight size={13} className="chip-arrow" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        className="skata-chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="skata-chat-input"
          placeholder="Tanyakan sesuatu pada Sahabat SKATA..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="skata-chat-send-btn"
          disabled={!input.trim() || isLoading}
          title="Kirim Pesan"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default SahabatSkataChat;
