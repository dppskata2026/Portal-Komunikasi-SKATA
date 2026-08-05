import { organizationProfile } from '../data/skataMasterData';
import { ArrowLeft, BookOpen, ShieldCheck, Users, Globe } from 'lucide-react';

interface ProfilSKATAProps {
  onBack: () => void;
}

export function ProfilSKATA({ onBack }: ProfilSKATAProps) {
  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display: 'grid', gap: '40px' }}>
        {/* Header Hero Area */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fffbfb 100%)',
          border: '1px solid #ffe3e3',
          borderRadius: '16px',
          padding: '40px 32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red, #ff2424)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Profil Organisasi</span>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111', lineHeight: '1.2', marginBottom: '16px' }}>
              {organizationProfile.name} ({organizationProfile.shortName})
            </h1>
            <p style={{ fontSize: '18px', color: '#444', fontStyle: 'italic', marginBottom: '24px', fontWeight: 500 }}>
              "{organizationProfile.slogan}"
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '14px', color: '#666' }}>
              <div><strong>Masa Bakti:</strong> {organizationProfile.activePeriod}</div>
              <div><strong>Perusahaan:</strong> {organizationProfile.company}</div>
              <div><strong>Ketua Umum:</strong> {organizationProfile.chairman}</div>
            </div>
          </div>
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.05,
            pointerEvents: 'none'
          }}>
            <BookOpen size={240} />
          </div>
        </div>

        {/* Content sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ color: 'var(--red, #ff2424)' }}><Globe size={24} /></span> Pengantar Organisasi
            </h2>
            <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.7, marginBottom: '16px' }}>
              <strong>{organizationProfile.name} (SKATA)</strong> adalah organisasi serikat karyawan resmi di lingkungan <strong>{organizationProfile.company}</strong>. SKATA berfungsi sebagai wadah pemersatu, pembela, dan penyalur aspirasi karyawan guna mewujudkan keseimbangan yang sehat antara hak pekerja dan tujuan strategis perusahaan.
            </p>
            <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.7 }}>
              Berpegang teguh pada komitmen kebersamaan dan profesionalisme, SKATA bertekad untuk menciptakan lingkungan kerja yang aman, adil, transparan, dan produktif secara berkelanjutan di seluruh wilayah operasional Indonesia.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ color: 'var(--red, #ff2424)' }}><BookOpen size={24} /></span> Sejarah Perjuangan
            </h2>
            <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.7, marginBottom: '16px' }}>
              Didirikan sebagai wujud kesadaran kolektif karyawan, SKATA telah melewati berbagai dinamika perkembangan industri dan organisasi ketenagakerjaan. Sejak awal pembentukannya, organisasi ini aktif mengawal penyusunan dan kesepakatan Perjanjian Kerja Bersama (PKB), menjamin perlindungan ketenagakerjaan, serta berkontribusi nyata dalam menjaga hubungan industrial yang harmonis dengan manajemen PT Graha Sarana Duta.
            </p>
            <p style={{ fontSize: '16px', color: '#666', fontStyle: 'italic', lineHeight: 1.7 }}>
              *Sejarah lengkap dan kronologi formal pembentukan SKATA sedang dalam proses pemutakhiran dan digitalisasi dokumen oleh bidang Kesekretariatan DPP SKATA.*
            </p>
          </div>

          {/* Slogan, Headquarters & Purpose */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Tujuan Organisasi</h3>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6 }}>
                Memperjuangkan kepentingan sosial ekonomi karyawan, mengadvokasi hak-hak normatif secara profesional, serta mempererat tali persaudaraan sesama anggota tanpa diskriminasi.
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Alamat Kantor Pusat</h3>
              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, marginBottom: '8px' }}>
                {organizationProfile.address}
              </p>
              <div style={{ fontSize: '13.5px', color: '#444', borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '8px' }}>
                <div><strong>Email:</strong> {organizationProfile.email}</div>
                <div><strong>Telepon:</strong> {organizationProfile.phone}</div>
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Slogan Perjuangan</h3>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--red, #ff2424)', textAlign: 'center', padding: '12px 0' }}>
                {organizationProfile.slogan}
              </div>
            </div>
          </div>

          {/* Tri-Values Section */}
          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Nilai Utama Organisasi</h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>Tiga pilar dasar yang menjiwai setiap langkah pengurus dan anggota SKATA</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
                <div style={{ color: 'var(--red, #ff2424)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><ShieldCheck size={36} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Profesional</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>Menjalankan tugas dan kewajiban organisasi secara disiplin, tertib, kompeten, dan objektif.</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
                <div style={{ color: 'var(--red, #ff2424)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Users size={36} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Transparan</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>Keterbukaan dalam pengelolaan tata kelola organisasi, laporan keuangan, dan pengambilan keputusan.</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
                <div style={{ color: 'var(--red, #ff2424)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><ShieldCheck size={36} /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Berintegritas</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>Menjunjung tinggi etika berserikat, amanah, jujur, serta berorientasi penuh pada kesejahteraan anggota.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
