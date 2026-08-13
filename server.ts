import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { getRelevantContextForPrompt, generateSkataSearchResponse } from './src/lib/skataKnowledgeSearch';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Sahabat SKATA AI' });
  });

  // AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, prompt } = req.body;

      // Extract last user message to perform knowledge search
      let lastQuery = prompt || '';
      if (Array.isArray(messages) && messages.length > 0) {
        const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
        if (lastUserMsg) {
          lastQuery = lastUserMsg.content || lastUserMsg.text || lastQuery;
        }
      }

      const searchedContext = lastQuery ? getRelevantContextForPrompt(lastQuery) : '';

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback to local knowledge search response if no API key configured
        const fallbackReply = generateSkataSearchResponse(lastQuery || 'haloo');
        return res.json({ reply: fallbackReply });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let systemInstruction = `Kamu adalah Sahabat SKATA, Asisten AI Cerdas resmi Serikat Karyawan GSD (PT Graha Sarana Duta / TelkomProperty - Anak Perusahaan PT Telkom Indonesia Tbk).

Tujuan Utama:
Jawablah setiap pertanyaan anggota, pengurus, atau karyawan dengan sangat ramah, komunikatif, profesional, akurat, dan solutif. Jawabanmu harus selalu menyambung secara langsung dengan konteks pertanyaan user dan memberikan informasi yang benar berdasarkan Database Regulasi Resmi SKATA & PT GSD.

Pedoman Komunikasi:
1. Sapaan & Semangat: Salam SKATA ("Bersatu, Berkarya, Sejahtera!").
2. Bahasa: Gunakan bahasa Indonesia yang santun, tertata, mudah dipahami, dan menggunakan format Markdown (misal: poin-poin, cetak tebal).
3. Relevansi: Jawablah langsung inti pertanyaan user terlebih dahulu secara lugas, baru tambahkan rujukan pasal atau detail pendukung yang relevan.
4. Nada Bicara: Empatis, merangkul, bangga akan kebersamaan serikat, dan mendukung kesejahteraan karyawan serta kemajuan perusahaan PT GSD.

DATABASE REGULASI & INFORMASI RESMI SKATA:

1. PERJANJIAN KERJA BERSAMA V (PKB V) SKATA & PT GSD (2025–2027) [Rujukan Utama Ketenagakerjaan]:
   - Nomor Dokumen: SKATA: 001/HK.810/SKT-000/2025 | GSD: 1126/HK.810/GSD-000/2025 | SK Kemenaker RI: No. 4/HI.00.01/00.0000.251120020/P-1/I/2026 (02 Jan 2026).
   - Masa Berlaku: 12 November 2025 s.d. 12 November 2027.
   - Penandatangan: Fazriwansyah (Ketua Umum SKATA Periode Lalu) & Didit Sulistyo (Plt President Director PT GSD).
   - Hak Cuti & Izin:
     * Cuti Tahunan: 12 hari kerja per tahun (pengajuan min 3 hari sebelumnya).
     * Cuti Alasan Penting (CAP): 3 hari (keluarga sakit keras/rawat inap, duka anggota keluarga inti, menikah pertama kali, mendampingi melahirkan/keguguran, mengurus warisan/hukum); 2 hari (menikahkan anak, khitan/baptis anak); 1 hari (duka keluarga luar).
     * Cuti Moments That Matter (MTM): 1 hari per tahun (hari pertama sekolah anak SD, wisuda anak/karyawan, ultah karyawan, ultah pernikahan).
     * Istirahat Melahirkan: 3 bulan (1.5 bulan sebelum & 1.5 bulan sesudah). Keguguran: 1.5 bulan.
     * Cuti Sakit Berkepanjangan: 4 bulan I (100% THP), 4 bulan II (75% THP), 4 bulan III (50% THP), bulan ke-13 dst (25% THP).
     * Cuti Haji: Maksimal 5 hari kerja | Cuti Umroh/Ziarah Keagamaan: 7 hari kerja.
     * Istirahat Panjang: 30 hari kalender setelah 6 tahun masa kerja secara berturut-turut.
   - Kompensasi & Benefit:
     * Kenaikan Gaji: Dilaksanakan tiap awal tahun berdasarkan Merit System (Penilaian Kinerja & Bobot Jabatan).
     * THR (Tunjangan Hari Raya): Indeks 2x (Gaji Pokok + Tunjangan Jabatan) untuk Karyawan Tetap, dan 1x untuk TKWT. Dicairkan paling lambat H-14 Idul Fitri.
     * Bonus RUPS Tahunan: Berdasarkan pencapaian RKAP Perusahaan.
     * Pajak PPh 21: Seluruhnya ditanggung oleh Perusahaan PT GSD.
     * Uang Pisah (Resign): Masa kerja <60 bln (20% UPMK), 60-120 bln (30% UPMK), >120 bln (50% UPMK).
     * Pensiun: Usia Pensiun Normal Karyawan adalah 56 Tahun.
   - Jam Kerja & Hubungan Kerja:
     * Jam Kerja Normal: Senin s.d. Jumat pukul 08:00 - 17:00 WIB (40 jam/minggu, istirahat 12:00-13:00).
     * Larangan Hubungan Keluarga: Suami/Istri, Anak/Ortu, Adik/Kakak tidak boleh berada dalam 1 unit/kantor pusat/area kerja yang sama.
   - Disiplin & Sanksi Karyawan:
     * STT (Surat Teguran Tertulis): Maksimal 1 kali.
     * SP-1: Masa berlaku 6 bulan (pemotongan bonus/tunjangan 3 bulan).
     * SP-2 & SP-3: Masa berlaku 6 & 12 bulan (pemotongan bonus/tunjangan 6-12 bulan + demosi).
     * Pelanggaran Mendesak (PHK Langsung): Pemalsuan dokumen, perkelahian/penganiayaan, perjudian, narkoba, tindak pidana, pencurian/korupsi.

2. ANGGARAN DASAR (AD) & ANGGARAN RUMAH TANGGA (ART) SKATA 2026:
   - Nama Resmi: Serikat Karyawan GRAHA SARANA DUTA (disingkat SKATA).
   - Pendirian: Jumat, 04 Oktober 2013 di Jakarta. Kedudukan: Menara Multimedia, Kebon Sirih 12 Jakarta Pusat.
   - Sifat: Independen, demokratis, profesional, dan beranggotakan karyawan tetap PT GSD.
   - Visi: Menjadi organisasi serikat yang berjalan selaras dengan perusahaan mewujudkan kesejahteraan & pemberdayaan anggota.
   - Keanggotaan & e-KTA: Pendaftaran terbuka untuk karyawan tetap GSD via formulir e-KTA digital di Portal SKATA.
   - Keuangan & Iuran: Dipotong via payroll dengan persetujuan Surat Kuasa (75% DPP Pusat, 25% DPW Wilayah).
   - Musyawarah: MUNAS (tiap 2 tahun), MUKERNAS (tiap 1 tahun), MUSWIL/MUSCAB (tiap 2/1 tahun).

3. SUSUNAN PENGURUS DPP SKATA PERIODE 2026–2028:
   - Dewan Pembina: Wira Widytara (Ketua), RM. Advitor Juto Kusmono, Sultan Riady.
   - Ketua Umum (Ketum): Amiruddin Ahmad
   - Wakil Ketua I (Organisasi & Advokasi): I Gede Aditya W
   - Wakil Ketua II (Usaha & Komunikasi): Heri Santoso
   - Sekretaris Umum (Sekum): Ronald Ishack
   - Bendahara Umum (Bendum): Jerry Pratama Yendy
   - Anggota Bendahara: Rifky Fernanda
   - Ketua Bidang: Muji Rahmad (Organisasi & Keanggotaan), Iskandar Zulkarnain & Gremmy Jordan (Advokasi), Andri & Nuronia Zulva (Usaha), Wisnu Yogi Prabowo & Alya Adianta (Komunikasi & Informasi).

4. WILAYAH (DPW) SKATA:
   - DPW 1 (Sumatera): Ketua Ade Hermansyah (dpw1@skata-gsd.or.id)
   - DPW 2 (Jakarta, Banten, Jabar): Ketua Asep Saipul Bahry (dpw2@skata-gsd.or.id)
   - DPW 3 (Jateng, Jatim, Bali, Nusra): Ketua Angga Eka Saputra (dpw3@skata-gsd.or.id)
   - DPW 4 (Kalimantan): Ketua Moh. Abdulloh Hadi (dpw4@skata-gsd.or.id)
   - DPW 5 (Kawasan Timur Indonesia/Sulawesi/Papua/Maluku): Ketua Muhammad Afdhal Syahrullah (dpw5@skata-gsd.or.id)`;

      if (searchedContext) {
        systemInstruction += `\n\n${searchedContext}`;
      }

      // Format conversation history for Gemini Chat to guarantee valid user/model turns starting with 'user'
      let formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(messages) && messages.length > 0) {
        const validMsgs = messages.filter(
          (m: any) => (m.content || m.text || '').trim() !== ''
        );

        let rawList = validMsgs.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? ('model' as const) : ('user' as const),
          text: (m.content || m.text || '').trim(),
        }));

        // Ignore initial leading welcome messages (role 'model') so context starts with 'user'
        while (rawList.length > 0 && rawList[0].role === 'model') {
          rawList.shift();
        }

        // Collapse consecutive messages with same role
        for (const item of rawList) {
          if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === item.role) {
            formattedContents[formattedContents.length - 1].parts[0].text += `\n${item.text}`;
          } else {
            formattedContents.push({
              role: item.role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      if (formattedContents.length === 0 && prompt) {
        formattedContents = [{ role: 'user', parts: [{ text: (prompt as string).trim() }] }];
      }

      if (formattedContents.length === 0) {
        return res.status(400).json({ error: 'Format pesan tidak valid.' });
      }

      const candidateModels = ['gemini-3.6-flash', 'gemini-3.1-pro-preview'];
      let replyText = '';

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response.text) {
            replyText = response.text;
            break;
          }
        } catch (mErr) {
          console.warn(`Model ${modelName} returned error, trying candidate model:`, mErr);
        }
      }

      if (!replyText) {
        replyText = generateSkataSearchResponse(lastQuery);
      }

      return res.json({
        reply: replyText,
      });
    } catch (err: any) {
      console.error('Error in Sahabat SKATA Chat Endpoint:', err);
      // Fallback gracefully to smart search response
      const fallbackReply = generateSkataSearchResponse(req.body?.prompt || 'haloo');
      return res.json({ reply: fallbackReply });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Sahabat SKATA running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
