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

// ---------------- STRUCTURED SKATA ORGANIZATIONAL DATA ----------------
export const SKATA_LEADERSHIP_DATA = {
  dewanPembina: [
    { role: 'Ketua Dewan Pembina', name: 'Wira Widytara' },
    { role: 'Anggota Dewan Pembina', name: 'RM. Advitor Juto Kusmono' },
    { role: 'Anggota Dewan Pembina', name: 'Sultan Riady' }
  ],
  dppHarian: [
    { role: 'Ketua Umum (Ketum)', name: 'Amiruddin Ahmad' },
    { role: 'Wakil Ketua I (Organisasi & Advokasi)', name: 'I Gede Aditya W' },
    { role: 'Wakil Ketua II (Usaha & Komunikasi)', name: 'Heri Santoso' },
    { role: 'Sekretaris Umum (Sekum)', name: 'Ronald Ishack' },
    { role: 'Bendahara Umum (Bendum)', name: 'Jerry Pratama Yendy' },
    { role: 'Anggota Bendahara', name: 'Rifky Fernanda' }
  ],
  dppBidang: [
    { role: 'Ketua Bidang Organisasi & Keanggotaan', name: 'Muji Rahmad' },
    { role: 'Ketua Bidang Advokasi', name: 'Iskandar Zulkarnain', member: 'Gremmy Jordan' },
    { role: 'Ketua Bidang Usaha', name: 'Andri', member: 'Nuronia Zulva' },
    { role: 'Ketua Bidang Komunikasi & Informasi', name: 'Wisnu Yogi Prabowo', member: 'Alya Adianta' }
  ],
  dpwRegions: [
    { code: 'DPW 1', region: 'Sumatera', chairman: 'Ade Hermansyah', email: 'dpw1@skata-gsd.or.id' },
    { code: 'DPW 2', region: 'Jakarta, Banten & Jawa Barat', chairman: 'Asep Saipul Bahry', email: 'dpw2@skata-gsd.or.id' },
    { code: 'DPW 3', region: 'Jateng, Jatim, Bali & Nusra', chairman: 'Angga Eka Saputra', email: 'dpw3@skata-gsd.or.id' },
    { code: 'DPW 4', region: 'Kalimantan', chairman: 'Moh. Abdulloh Hadi', email: 'dpw4@skata-gsd.or.id' },
    { code: 'DPW 5', region: 'Kawasan Timur Indonesia (Sulawesi, Papua, Maluku)', chairman: 'Muhammad Afdhal Syahrullah', email: 'dpw5@skata-gsd.or.id' }
  ]
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

  // 1. Leadership / Pengurus Query
  if (q.includes('pengurus') || q.includes('dpp') || q.includes('dpw') || q.includes('ketua') || q.includes('pimpinan') || q.includes('susunan') || q.includes('pembina') || q.includes('sekretaris') || q.includes('bendahara') || q.includes('amiruddin') || q.includes('aditya') || q.includes('heri') || q.includes('ronald') || q.includes('jerry')) {
    return `Berikut adalah **Susunan Resmi Pengurus DPP & DPW SKATA Periode 2026–2028** (Hasil MUNAS VI SKATA 2026):

🏛️ **Dewan Pembina SKATA:**
- **Ketua Dewan Pembina:** ${SKATA_LEADERSHIP_DATA.dewanPembina[0].name}
- **Anggota Dewan Pembina:** ${SKATA_LEADERSHIP_DATA.dewanPembina[1].name} & ${SKATA_LEADERSHIP_DATA.dewanPembina[2].name}

💼 **Dewan Pengurus Pusat (DPP) SKATA:**
${SKATA_LEADERSHIP_DATA.dppHarian.map(item => `- **${item.role}:** ${item.name}`).join('\n')}

📌 **Pengurus Bidang DPP SKATA:**
${SKATA_LEADERSHIP_DATA.dppBidang.map(item => `- **${item.role}:** ${item.name}${item.member ? ` (Anggota: ${item.member})` : ''}`).join('\n')}

🗺️ **Ketua Dewan Pengurus Wilayah (DPW):**
${SKATA_LEADERSHIP_DATA.dpwRegions.map(item => `- **${item.code} (${item.region}):** ${item.chairman} (\`${item.email}\`)`).join('\n')}

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
  const matches = searchRegulations(userQuery);
  if (matches.length === 0) return '';

  const topMatches = matches.slice(0, 3);
  let contextSnippet = '\n\nHASIL PENELUSURAN DATABASE REGULASI RESMI TERKAIT PERTANYAAN USER:\n';
  topMatches.forEach((m, i) => {
    contextSnippet += `[Hasil ${i + 1}] Dokumen: ${m.docTitle} | ${m.bab} - ${m.chapterTitle} (${m.pasals}): ${m.detail}\n`;
  });
  return contextSnippet;
}
