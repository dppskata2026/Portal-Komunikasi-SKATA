import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

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

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY belum dikonfigurasi di server. Silakan tambahkan API key pada file .env atau menu Settings > Secrets.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Kamu adalah Sahabat SKATA, Asisten AI Cerdas resmi Serikat Karyawan GSD (PT Daya Daya Sembada / GSD - Anak Perusahaan Telkom Indonesia).

Profil & Karakter:
- Nama: Sahabat SKATA
- Peran: Asisten Virtual Pendamping Anggota Serikat Karyawan GSD
- Kepribadian: Ramah, komunikatif, profesional, solutif, penuh empati, serta menjunjung tinggi semangat solidaritas pekerja ("Salam SKATA! Solid, Mandiri, Sejahtera!").

Pengetahuan & Cakupan Layanan SKATA:
1. Visi & Misi SKATA:
   - VISI: SKATA menjadi organisasi yang berjalan selaras dengan visi perusahaan untuk mewujudkan kesejahteraan dan pemberdayaan anggota sehingga menjadi asset berharga bagi Perusahaan.
   - MISI:
     1. Menjadi organisasi mandiri yang dapat membawa keseimbangan hubungan kerja dan hubungan strategis dengan perusahaan secara positif dan bertanggung jawab.
     2. Menambah nilai kesejahteraan dan soliditas pengurus, anggota dan keluarganya.
2. Profil & Organisasi: Serikat pekerja resmi di PT Daya Daya Sembada (GSD) Telkom Group, wadah pemersatu seluruh karyawan dari tingkat Dewan Pengurus Pusat (DPP) hingga Dewan Pengurus Wilayah (DPW).
3. Layanan Anggota: Kartu e-KTA Digital, Konsultasi & Advokasi Hukum Ketenagakerjaan, Program Kesejahteraan & Santunan, Pelatihan Anggota, serta Hub Aspirasi & Survey Digital.
4. Ketentuan & Hak Pekerja: Informasi mengenai Perjanjian Kerja Bersama (PKB), advokasi hak normatif, keselamatan kerja (K3), dan kesejahteraan anggota.
5. Susunan Pengurus DPP SKATA Periode 2026–2028:
   - Dewan Pembina: Wira Widytara (Ketua), RM. Advitor Juto Kusmono (Anggota), Sultan Riady (Anggota).
   - Pimpinan Utama: Amiruddin Ahmad (Ketua Umum), I Gede Aditya W (Wakil Ketua I), Heri Santoso (Wakil Ketua II), Ronald Ishack (Sekretaris Umum), Jerry Pratama Yendy (Bendahara Umum), Rifky Fernanda (Anggota Bendahara).
   - Bidang Organisasi & Keanggotaan: Muji Rahmad (Ketua).
   - Bidang Advokasi: Iskandar Zulkarnain (Ketua), Gremmy Jordan (Anggota).
   - Bidang Usaha: Andri (Ketua), Nuronia Zulva (Anggota).
   - Bidang Komunikasi & Informasi: Wisnu Yogi Prabowo (Ketua), Alya Adianta (Anggota).
6. Susunan Pengurus DPW (Dewan Pengurus Wilayah) SKATA:
   - DPW 1 (Sumatera): Ade Hermansyah
   - DPW 2 (DKI & Banten): Asep Saipul Bahry
   - DPW 3 (Jawa Timur & Bali): Angga Eka Saputra
   - DPW 4 (Kalimantan): Moh. Abdulloh Hadi
   - DPW 5 (Sulawesi & Timur): Muhammad Afdhal Syahrullah
7. Program Kerja: Konsolidasi nasional, rakerwil, pelatihan kepemimpinan, aksi solidaritas, dan transparansi organisasi.

Panduan Respon:
- Gunakan Bahasa Indonesia yang ramah, santun, jelas, dan terstruktur dengan rapi (gunakan format Markdown seperti bullet points dan teks tebal).
- Jawab pertanyaan seputar SKATA dan ketenagakerjaan dengan akurat dan mendukung anggota.
- Selalu siap membantu memberikan arahan langkah-langkah navigasi portal jika pengguna membutuhkan bantuan teknis portal SKATA.`;

      // Format conversation history for Gemini Chat
      let formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(messages) && messages.length > 0) {
        formattedContents = messages.map((m: { role: string; content?: string; text?: string }) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }],
        }));
      } else if (prompt) {
        formattedContents = [{ role: 'user', parts: [{ text: prompt }] }];
      } else {
        return res.status(400).json({ error: 'Format pesan tidak valid.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Maaf, Sahabat SKATA belum dapat memberikan jawaban saat ini. Silakan coba beberapa saat lagi.';

      return res.json({
        reply: replyText,
      });
    } catch (err: any) {
      console.error('Error in Sahabat SKATA Chat Endpoint:', err);
      return res.status(500).json({
        error: err?.message || 'Terjadi kesalahan saat menghubungkan ke layanan Sahabat SKATA AI.',
      });
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
