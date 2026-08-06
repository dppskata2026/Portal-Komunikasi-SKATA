import { SKATA_REGULATIONS_DATABASE, SkataRegulationDoc, RegulationChapter } from '../data/skataRegulationsDatabase';

export interface SearchMatch {
  docTitle: string;
  category: string;
  number?: string;
  bab: string;
  chapterTitle: string;
  pasals: string;
  detail: string;
  score: number;
}

// ---------------- STRUCTURED SKATA ORGANIZATIONAL & MEMBERSHIP DATA ----------------
export const SKATA_MEMBERSHIP_STATS = {
  totalKaryawan: 3850,
  totalAnggotaTerdaftar: 3420,
  persentasePenetrasi: '88.8%',
  eKtaDigitalActive: 3210,
  dpcCount: 42,
  dpwBreakdown: [
    { code: 'DPW 1', region: 'Sumatera', members: 640, dpcCount: 8, chairman: 'Ade Hermansyah', email: 'dpw1@skata-gsd.or.id' },
    { code: 'DPW 2', region: 'Jakarta, Banten & Jawa Barat (Jabodetabek)', members: 1280, dpcCount: 14, chairman: 'Asep Saipul Bahry', email: 'dpw2@skata-gsd.or.id' },
    { code: 'DPW 3', region: 'Jateng, Jatim, Bali & Nusra', members: 710, dpcCount: 10, chairman: 'Angga Eka Saputra', email: 'dpw3@skata-gsd.or.id' },
    { code: 'DPW 4', region: 'Kalimantan', members: 420, dpcCount: 5, chairman: 'Moh. Abdulloh Hadi', email: 'dpw4@skata-gsd.or.id' },
    { code: 'DPW 5', region: 'Kawasan Timur Indonesia (Sulawesi, Papua, Maluku)', members: 370, dpcCount: 5, chairman: 'Muhammad Afdhal Syahrullah', email: 'dpw5@skata-gsd.or.id' }
  ]
};

export const EXTERNAL_KNOWLEDGE_BASE = {
  ketenagakerjaan: {
    uu13_2003: "UU No. 13 Tahun 2003 tentang Ketenagakerjaan mengatur hak dasar pekerja, perjanjian kerja (PKWT/PKWTT), waktu kerja (7 jam/hari 40 jam/minggu untuk 6 hari kerja, atau 8 jam/hari 40 jam/minggu untuk 5 hari kerja), perlindungan K3, serta mekanisme penyelesaian perselisihan hubungan industrial.",
    uu6_2023_ciptaker: "UU No. 6 Tahun 2023 (Penetapan Perpu Cipta Kerja menjadi UU) mengatur fleksibilitas jam kerja, ketentuan pesangon, UPMK, UPH, program Jaminan Kehilangan Pekerjaan (JKP) BPJS, serta aturan alih daya (outsourcing) & PKWT.",
    bpjs: {
      ketenagakerjaan: "BPJS Ketenagakerjaan mencakup 5 program utama: JKK (Jaminan Kecelakaan Kerja), JKM (Jaminan Kematian), JHT (Jaminan Hari Tua), JP (Jaminan Pensiun), dan JKP (Jaminan Kehilangan Pekerjaan). PT GSD mendaftarkan seluruh karyawan tetap dan TKWT pada program BPJS TK secara patuh.",
      kesehatan: "BPJS Kesehatan memberikan perlindungan jaminan kesehatan nasional bagi karyawan beserta keluarga (suami/istri dan hingga 3 anak sah). Di samping BPJS Kesehatan, karyawan GSD didukung manfaat Asuransi Kesehatan Tambahan / Inhealth sesuai PKB V."
    },
    hubunganIndustrial: "Perselisihan Hubungan Industrial diatur dalam UU No. 2 Tahun 2004, yang wajib diselesaikan bertahap: Musyawarah Bipartit (Pekerja/Serikat dengan Manajemen), Mediasi/Konsiliasi Tripartit (Dinas Terapkan Ketenagakerjaan), hingga Pengadilan Hubungan Industrial (PHI)."
  },
  perusahaan: {
    ptGsd: "PT Graha Sarana Duta (TelkomProperty) didirikan pada tahun 1981, merupakan anak perusahaan PT Telkom Indonesia Tbk yang bergerak di bidang Property Management, Project Management, Construction, Facility Management, dan Trading & Services di seluruh Indonesia.",
    telkomGroup: "PT Telkom Indonesia (Persero) Tbk adalah BUMN telekomunikasi terbesar di Indonesia. SKATA berjejaring erat dengan FSPB (Federasi Serikat Pekerja BUMN) & Sekar Telkom dalam memperjuangkan hak-hak pekerja di lingkungan Telkom Group."
  }
};

/**
 * Searches the SKATA Regulations Database (AD 2026, ART 2026, PKB V 2025-2027)
 * and returns matched chapters ordered by relevance.
 */
export function searchRegulations(query: string): SearchMatch[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  // Stopwords to filter out
  const stopwords = new Set(['yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'atau', 'pada', 'untuk', 'dengan', 'adalah', 'bagaimana', 'apa', 'siapa', 'berapa', 'mana', 'tolong', 'bisa', 'kah']);
  const tokens = cleanQuery
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopwords.has(t));

  const matches: SearchMatch[] = [];

  for (const docObj of SKATA_REGULATIONS_DATABASE) {
    for (const chap of docObj.chapters) {
      let score = 0;
      const combinedText = `${docObj.title} ${docObj.category} ${chap.bab} ${chap.title} ${chap.pasals} ${chap.detail}`.toLowerCase();

      // Full phrase match bonus
      if (combinedText.includes(cleanQuery)) {
        score += 30;
      }

      // Keyword token scoring
      for (const token of tokens) {
        if (chap.detail.toLowerCase().includes(token)) score += 5;
        if (chap.title.toLowerCase().includes(token)) score += 8;
        if (chap.pasals.toLowerCase().includes(token)) score += 10;
        if (docObj.title.toLowerCase().includes(token)) score += 3;
      }

      // Domain Synonym boosts
      if ((cleanQuery.includes('libur') || cleanQuery.includes('cuti') || cleanQuery.includes('ijin') || cleanQuery.includes('izin')) && chap.bab === 'BAB VI') score += 15;
      if ((cleanQuery.includes('gaji') || cleanQuery.includes('thr') || cleanQuery.includes('bonus') || cleanQuery.includes('pesangon') || cleanQuery.includes('pisah')) && chap.bab === 'BAB VII') score += 15;
      if ((cleanQuery.includes('sanksi') || cleanQuery.includes('sp') || cleanQuery.includes('phk') || cleanQuery.includes('tegoran') || cleanQuery.includes('sakit')) && (chap.bab === 'BAB XI' || chap.bab === 'BAB XII')) score += 15;

      if (score > 0) {
        matches.push({
          docTitle: docObj.title,
          category: docObj.category,
          number: docObj.number,
          bab: chap.bab,
          chapterTitle: chap.title,
          pasals: chap.pasals,
          detail: chap.detail,
          score
        });
      }
    }
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);
  return matches;
}

/**
 * Generates an accurate, well-formatted response for a user query using search results.
 */
export function generateSkataSearchResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. Membership & Member Count Query
  if (q.includes('jumlah') || q.includes('anggota') || q.includes('total anggota') || q.includes('statistik') || q.includes('karyawan') || q.includes('penetrasi') || q.includes('dpc')) {
    return `Berikut adalah **Statistik & Database Keanggotaan Resmi SKATA (Update 2026)**:

👥 **Data Keanggotaan Terdaftar:**
- **Total Anggota Terdaftar (e-KTA):** ${SKATA_MEMBERSHIP_STATS.totalAnggotaTerdaftar.toLocaleString('id-ID')} Anggota
- **Total Karyawan Tetap PT GSD:** ${SKATA_MEMBERSHIP_STATS.totalKaryawan.toLocaleString('id-ID')} Karyawan
- **Tingkat Penetrasi Keanggotaan:** **${SKATA_MEMBERSHIP_STATS.persentasePenetrasi}** dari seluruh karyawan
- **e-KTA Digital Aktif:** ${SKATA_MEMBERSHIP_STATS.eKtaDigitalActive.toLocaleString('id-ID')} Pengguna
- **Total Dewan Pengurus Cabang (DPC):** ${SKATA_MEMBERSHIP_STATS.dpcCount} Cabang di Seluruh Indonesia

🗺️ **Rincian Anggota Per Wilayah (DPW):**
${SKATA_MEMBERSHIP_STATS.dpwBreakdown.map(dpw => `- **${dpw.code} (${dpw.region}):** ${dpw.members} Anggota (${dpw.dpcCount} DPC) | Ketua: ${dpw.chairman}`).join('\n')}

*Rujukan data: Database Keanggotaan & Portal e-KTA SKATA 2026.*`;
  }

  // 2. External Knowledge & Labor Law Query
  if (q.includes('uu') || q.includes('undang') || q.includes('cipta kerja') || q.includes('ciptaker') || q.includes('bpjs') || q.includes('ketenagakerjaan') || q.includes('outsourcing') || q.includes('pesangon uu') || q.includes('sekar telkom') || q.includes('fspb') || q.includes('sejarah gsd') || q.includes('telkomproperty')) {
    let extReply = `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊\n\nBerikut rujukan **Pengetahuan Ketenagakerjaan & Korporasi Eksternal** terkait pertanyaan Anda:\n\n`;

    if (q.includes('uu') || q.includes('undang') || q.includes('ciptaker') || q.includes('cipta kerja')) {
      extReply += `⚖️ **Aturan Hukum Ketenagakerjaan Nasional:**\n- **UU No. 13/2003:** ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.uu13_2003}\n- **UU No. 6/2023 (Cipta Kerja):** ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.uu6_2023_ciptaker}\n\n`;
    }

    if (q.includes('bpjs')) {
      extReply += `🏥 **Jaminan BPJS Ketenagakerjaan & Kesehatan:**\n- **BPJS Ketenagakerjaan:** ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.bpjs.ketenagakerjaan}\n- **BPJS Kesehatan & Inhealth:** ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.bpjs.kesehatan}\n\n`;
    }

    if (q.includes('gsd') || q.includes('telkomproperty') || q.includes('telkom') || q.includes('fspb') || q.includes('sekar')) {
      extReply += `🏢 **Profil Korporasi & Jejaring Serikat:**\n- **PT GSD (TelkomProperty):** ${EXTERNAL_KNOWLEDGE_BASE.perusahaan.ptGsd}\n- **Jejaring Telkom Group:** ${EXTERNAL_KNOWLEDGE_BASE.perusahaan.telkomGroup}\n\n`;
    }

    extReply += `*Catatan: Ketentuan dalam PKB V SKATA & PT GSD memberikan manfaat yang lebih tinggi atau sejalan dengan regulasi ketenagakerjaan nasional di atas.*`;
    return extReply;
  }

  // 3. Leadership / Pengurus Query
  if (q.includes('pengurus') || q.includes('dpp') || q.includes('dpw') || q.includes('ketua') || q.includes('pimpinan') || q.includes('susunan') || q.includes('pembina') || q.includes('sekretaris') || q.includes('bendahara') || q.includes('amiruddin') || q.includes('aditya') || q.includes('heri') || q.includes('ronald') || q.includes('jerry')) {
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

📌 **Pengurus Bidang DPP SKATA:**
- **Ketua Bidang Organisasi & Keanggotaan:** Muji Rahmad
- **Ketua Bidang Advokasi:** Iskandar Zulkarnain (Anggota: Gremmy Jordan)
- **Ketua Bidang Usaha:** Andri (Anggota: Nuronia Zulva)
- **Ketua Bidang Komunikasi & Informasi:** Wisnu Yogi Prabowo (Anggota: Alya Adianta)

🗺️ **Ketua Dewan Pengurus Wilayah (DPW):**
${SKATA_MEMBERSHIP_STATS.dpwBreakdown.map(item => `- **${item.code} (${item.region}):** ${item.chairman} (\`${item.email}\`) | ${item.members} Anggota`).join('\n')}

*Rujukan resmi: AD/ART SKATA 2026 & SK Pengurus DPP SKATA Periode 2026–2028.*`;
  }

  // 2. Search Regulation Database
  const matches = searchRegulations(query);

  if (matches.length > 0) {
    const topMatches = matches.slice(0, 3);
    let output = `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊\n\nBerdasarkan **Database Regulasi Resmi SKATA (AD, ART & PKB V)**, berikut rujukan informasi mengenai **"${query}"**:\n\n`;

    topMatches.forEach((m, idx) => {
      output += `### ${idx + 1}. ${m.category}: ${m.bab} - ${m.chapterTitle}\n`;
      output += `**Rujukan:** ${m.docTitle} (${m.pasals})\n`;
      output += `**Ketentuan Resmi:**\n${m.detail}\n\n`;
    });

    output += `---
*Apabila Anda memerlukan konsultasi atau pendampingan lebih lanjut, silakan hubungi Tim Advokasi & Pengurus SKATA melalui Portal ini.*`;

    return output;
  }

  // 3. Fallback Greeting or General Query
  return `Salam SKATA! **Bersatu, Berkarya, Sejahtera!** ✊

Terima kasih atas pertanyaan Anda mengenai **"${query}"**.

Sahabat SKATA telah terhubung langsung ke **Database Regulasi Resmi SKATA & PT GSD**. Saya siap memberikan penjelasan akurat seputar:
1. 📜 **Perjanjian Kerja Bersama V (PKB V) 2025–2027**: Aturan Cuti (Tahunan, CAP, MTM, Melahirkan, Sakit), Kenaikan Upah, THR, Bonus, Uang Pisah, Pensiun, dan Disiplin/Sanksi.
2. 🏛️ **Anggaran Dasar (AD) SKATA 2026**: Visi, Misi, Asas, Kedudukan, dan Sifat Organisasi.
3. 📘 **Anggaran Rumah Tangga (ART) SKATA 2026**: Keanggotaan, iuran payroll (75% DPP / 25% DPW), atribut, dan Rapat/MUNAS.
4. 👤 **Struktur Pengurus DPP & DPW SKATA 2026–2028**.
5. 💳 **Layanan Digital e-KTA & Pengajuan Aspirasi**.

Silakan ajukan pertanyaan yang lebih spesifik, dan Sahabat SKATA akan menyajikan jawaban beserta rujukan Pasalnya!`;
}

/**
 * Context injector for Gemini API calls
 */
export function getRelevantContextForPrompt(userQuery: string): string {
  let contextSnippet = '\n\nDATABASE KNOWLEDGE KHUSUS SKATA, KEANGGOTAAN & KETENAGAKERJAAN:\n';

  // Inject membership stats context
  contextSnippet += `[Data Keanggotaan SKATA 2026]: Total Karyawan GSD: ${SKATA_MEMBERSHIP_STATS.totalKaryawan}, Total Anggota Terdaftar e-KTA: ${SKATA_MEMBERSHIP_STATS.totalAnggotaTerdaftar} (${SKATA_MEMBERSHIP_STATS.persentasePenetrasi}), e-KTA Aktif: ${SKATA_MEMBERSHIP_STATS.eKtaDigitalActive}, Total DPC: ${SKATA_MEMBERSHIP_STATS.dpcCount}.\nBreakdown DPW:\n${SKATA_MEMBERSHIP_STATS.dpwBreakdown.map(d => `- ${d.code} (${d.region}): ${d.members} anggota, ${d.dpcCount} DPC, Ketua: ${d.chairman}`).join('\n')}\n\n`;

  // Inject external knowledge context
  contextSnippet += `[Pengetahuan Ketenagakerjaan Eksternal]:\n- UU Ketenagakerjaan 13/2003: ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.uu13_2003}\n- UU Cipta Kerja 6/2023: ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.uu6_2023_ciptaker}\n- BPJS Ketenagakerjaan: ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.bpjs.ketenagakerjaan}\n- BPJS Kesehatan: ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.bpjs.kesehatan}\n- Perselisihan Industrial: ${EXTERNAL_KNOWLEDGE_BASE.ketenagakerjaan.hubunganIndustrial}\n- Profil GSD: ${EXTERNAL_KNOWLEDGE_BASE.perusahaan.ptGsd}\n- Telkom Group & Jejaring: ${EXTERNAL_KNOWLEDGE_BASE.perusahaan.telkomGroup}\n\n`;

  const matches = searchRegulations(userQuery);
  if (matches.length > 0) {
    const topMatches = matches.slice(0, 3);
    contextSnippet += 'HASIL PENELUSURAN DATABASE REGULASI RESMI TERKAIT PERTANYAAN USER:\n';
    topMatches.forEach((m, i) => {
      contextSnippet += `[Hasil ${i + 1}] Dokumen: ${m.docTitle} | ${m.bab} - ${m.chapterTitle} (${m.pasals}): ${m.detail}\n`;
    });
  }

  return contextSnippet;
}
