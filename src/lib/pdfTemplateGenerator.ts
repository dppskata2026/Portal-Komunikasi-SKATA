// Helper functions to view and download official SKATA registration PDF templates (2026)

export const SKATA_DOC_TEMPLATES = [
  {
    id: 'formulir-pendaftaran',
    code: 'FORM-REG-01/2026',
    title: 'FORMULIR PENDAFTARAN SKATA_V1_2026',
    shortName: 'Formulir Pendaftaran SKATA V.1 2026',
    description: 'Formulir pendaftaran resmi keanggotaan Serikat Karyawan Graha Sarana Duta (SKATA) tahun 2026.',
    fileSize: '185 KB',
    format: 'PDF',
    filename: 'FORMULIR_PENDAFTARAN_SKATA_V1_2026.pdf'
  },
  {
    id: 'surat-kuasa-iuran',
    code: 'FORM-AUTH-02/2026',
    title: 'Form Surat Kuasa iuran SKATA V.1 2026',
    shortName: 'Form Surat Kuasa Iuran SKATA V.1 2026',
    description: 'Surat kuasa otoritas pemotongan iuran anggota bulanan sebesar Rp 25.000,- via payroll PT GSD.',
    fileSize: '142 KB',
    format: 'PDF',
    filename: 'Form_Surat_Kuasa_iuran_SKATA_V.1_2026.pdf'
  }
];

export function generateFormulirPendaftaranHTML(data?: { nama?: string; nik?: string; jabatan?: string; unit?: string }): string {
  const nama = data?.nama || '_______________________________________________';
  const nik = data?.nik || '_______________________________________________';
  const jabatan = data?.jabatan || '_______________________________________________';
  const unit = data?.unit || '_______________________________________________';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>FORMULIR PENDAFTARAN SKATA_V1_2026</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 20px;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-bottom: 15px;
    }
    .header-table td {
      border: 1px solid #000;
      padding: 8px 12px;
      vertical-align: middle;
    }
    .logo-cell {
      width: 140px;
      text-align: center;
    }
    .logo-text {
      font-size: 20pt;
      font-weight: 900;
      color: #e51b23;
      letter-spacing: -1px;
    }
    .title-cell {
      text-align: center;
    }
    .doc-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-sub {
      font-size: 10pt;
      font-weight: bold;
      margin: 2px 0;
    }
    .doc-address {
      font-size: 8pt;
      margin: 0;
    }
    .sudinaker {
      text-align: right;
      font-weight: bold;
      font-size: 9.5pt;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
    }
    .field-row {
      margin-bottom: 8px;
    }
    .field-label {
      display: inline-block;
      width: 180px;
    }
    .field-dots {
      font-family: monospace;
    }
    .declaration {
      margin-top: 20px;
      text-align: justify;
      line-height: 1.6;
    }
    .attachment {
      margin-top: 15px;
    }
    .signature-section {
      margin-top: 40px;
      float: right;
      width: 250px;
      text-align: center;
    }
    .signature-space {
      height: 80px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#f1f5f9; padding:12px; margin-bottom:20px; border-radius:8px; text-align:right;">
    <button onclick="window.print()" style="background:#e51b23; color:#fff; border:none; padding:8px 20px; border-radius:6px; font-weight:bold; cursor:pointer;">
      🖨️ Cetak / Simpan PDF
    </button>
  </div>

  <table class="header-table">
    <tr>
      <td class="logo-cell">
        <div class="logo-text">SKATA</div>
      </td>
      <td class="title-cell">
        <div class="doc-title">FORMULIR PENDAFTARAN ANGGOTA</div>
        <div class="doc-sub">Serikat Karyawan Graha Sarana Duta (SKATA)</div>
        <div class="doc-address">Gedung Menara Multimedia, Jl. Kebon Sirih No. 12 Jakarta 10110</div>
      </td>
    </tr>
  </table>

  <div class="sudinaker">
    NBP Sudinaker : ........................
  </div>

  <p>Saya yang bertandatangan dibawah ini:</p>

  <div style="margin-left: 10px;">
    <div class="field-row"><span class="field-label">Nama</span>: ${nama}</div>
    <div class="field-row"><span class="field-label">Tempat / Tgl Lahir</span>: _____________________________________________________________</div>
    <div class="field-row"><span class="field-label">Jabatan (GSD)</span>: ${jabatan}</div>
    <div class="field-row"><span class="field-label">NIK (GSD)</span>: ${nik}</div>
    <div class="field-row"><span class="field-label">Unit Kerja (GSD)</span>: ${unit}</div>
    <div class="field-row"><span class="field-label">Alamat tempat tinggal</span>: _____________________________________________________________</div>
    <div class="field-row" style="margin-left: 180px;">Rt. ____, RW. _____ Kel. _________________________________________</div>
    <div class="field-row" style="margin-left: 180px;">Kec. ________________________ Kab/ Kota. ________________________</div>
    <div class="field-row"><span class="field-label">No. HP</span>: _______________________</div>
  </div>

  <div class="declaration">
    Dengan ini mengajukan diri untuk didaftarkan sebagai anggota Serikat Karyawan Graha Sarana Duta (SKATA) dan bersedia tunduk dan patuh kepada Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) SKATA, serta ketentuan-ketentuan lainnya yang dikeluarkan oleh SKATA.
  </div>

  <div class="attachment">
    Bersama ini terlampir saya sertakan: Surat Kuasa pungutan iuran keanggotaan SKATA.
  </div>

  <div class="declaration">
    Demikian Formulir Pendaftaran ini disampaikan, atas perhatiannya saya ucapkan terima kasih.
  </div>

  <div class="signature-section">
    <div>....................., .................. 2026</div>
    <div style="margin-top: 10px; font-weight: bold;">Hormat Saya,</div>
    <div class="signature-space"></div>
    <div>(.........................................)</div>
  </div>
</body>
</html>`;
}

export function generateSuratKuasaHTML(data?: { nama?: string; nik?: string; jabatan?: string; unit?: string }): string {
  const nama = data?.nama || '_______________________________________________';
  const nik = data?.nik || '_______________________________________________';
  const jabatan = data?.jabatan || '_______________________________________________';
  const unit = data?.unit || '_______________________________________________';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Form Surat Kuasa iuran SKATA V.1 2026</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 20px;
    }
    .doc-title {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 4px;
      margin-bottom: 30px;
      text-decoration: underline;
    }
    .field-row {
      margin-bottom: 8px;
    }
    .field-label {
      display: inline-block;
      width: 160px;
    }
    .clause-list {
      margin-top: 15px;
      padding-left: 24px;
    }
    .clause-list li {
      margin-bottom: 10px;
      text-align: justify;
    }
    .statement {
      margin-top: 15px;
      text-align: justify;
    }
    .signature-section {
      margin-top: 40px;
      float: right;
      width: 250px;
      text-align: center;
    }
    .signature-space {
      height: 70px;
      border: 1px dashed #ccc;
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      color: #777;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#f1f5f9; padding:12px; margin-bottom:20px; border-radius:8px; text-align:right;">
    <button onclick="window.print()" style="background:#e51b23; color:#fff; border:none; padding:8px 20px; border-radius:6px; font-weight:bold; cursor:pointer;">
      🖨️ Cetak / Simpan PDF
    </button>
  </div>

  <div class="doc-title">S U R A T   K U A S A</div>

  <p>Saya yang bertanda tangan dibawah ini :</p>

  <div style="margin-left: 10px;">
    <div class="field-row"><span class="field-label">Nama</span>: ${nama}</div>
    <div class="field-row"><span class="field-label">NIK</span>: ${nik}</div>
    <div class="field-row"><span class="field-label">Jabatan</span>: ${jabatan}</div>
    <div class="field-row"><span class="field-label">Unit Kerja</span>: ${unit}</div>
    <div class="field-row"><span class="field-label">Direktorat / Area</span>: _______________________________________________</div>
  </div>

  <div class="statement">
    Berdasarkan keanggotaan saya pada Serikat Karyawan Graha Sarana Duta atau SKATA, dengan ini memberikan kuasa kepada Vice President Human Resource (VP HR) PT. Graha Sarana Duta untuk :
  </div>

  <ol class="clause-list">
    <li>Memungut iuran keanggotaan saya pada SKATA sebesar <strong>Rp. 25.000,- (dua puluh lima ribu rupiah)</strong> setiap bulan dengan memotong langsung dari gaji bulanan saya yang dibayarkan oleh PT. Graha Sarana Duta.</li>
    <li>Menyetorkan hasil pungutan tersebut kepada SKATA melalui nomor rekening bank yang ditentukan oleh Pengurus SKATA.</li>
  </ol>

  <div class="statement">
    Bahwa kuasa ini diberikan sejak saya menjadi anggota SKATA, dan dihentikan dalam hal saya berhenti menjadi anggota SKATA dengan cara mengajukan surat pengunduran diri kepada Pengurus SKATA dan memberikan surat pencabutan kuasa kepada PT. Graha Sarana Duta cq. VP Human Resource.
  </div>

  <div class="statement">
    Demikian kuasa ini diberikan dengan sebenar-benarnya untuk dipergunakan sesuai dengan ketentuan hukum yang berlaku.
  </div>

  <div class="signature-section">
    <div>..........................., ................................2026</div>
    <div style="margin-top: 15px; font-weight: bold;">Yang memberikan kuasa,</div>
    <div class="signature-space">Ttd & Materai Rp 10.000</div>
    <div style="font-weight: bold;">(${nama !== '_______________________________________________' ? nama : 'Nama Lengkap'})</div>
  </div>
</body>
</html>`;
}

export function openTemplatePrintWindow(docId: 'formulir-pendaftaran' | 'surat-kuasa-iuran', userData?: any) {
  const htmlContent = docId === 'formulir-pendaftaran'
    ? generateFormulirPendaftaranHTML(userData)
    : generateSuratKuasaHTML(userData);

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(htmlContent);
    win.document.close();
  } else {
    alert('Pop-up terblokir. Mohon izinkan pop-up di browser Anda untuk membuka template dokumen.');
  }
}

export function downloadTemplateFile(docId: 'formulir-pendaftaran' | 'surat-kuasa-iuran', userData?: any) {
  const doc = SKATA_DOC_TEMPLATES.find(d => d.id === docId);
  const filename = doc ? doc.filename : 'Dokumen_Template_SKATA_2026.html';
  const htmlContent = docId === 'formulir-pendaftaran'
    ? generateFormulirPendaftaranHTML(userData)
    : generateSuratKuasaHTML(userData);

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace('.pdf', '.html');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
