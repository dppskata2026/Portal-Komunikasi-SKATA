import { ArrowLeft, Hourglass } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  responsibleUnit: string;
  onBack: () => void;
}

export function ModulePlaceholder({ title, description, responsibleUnit, onBack }: ModulePlaceholderProps) {
  return (
    <div className="subpage-wrapper container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      <button className="back-link" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--red, #ff2424)', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '12px',
        padding: '48px 32px',
        textAlign: 'center',
        maxWidth: '680px',
        marginInline: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fff5f5',
          color: 'var(--red, #ff2424)',
          marginBottom: '24px'
        }}>
          <Hourglass size={32} />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>{title}</h1>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>{description}</p>

        <div style={{
          background: '#fafafa',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '32px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#444', fontWeight: 500 }}>
            <span style={{ color: 'var(--red, #ff2424)', fontWeight: 600 }}>Status:</span> Modul sedang dalam tahap pengembangan dan pemutakhiran data.
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666' }}>
            <strong>Unit Penanggung Jawab:</strong> {responsibleUnit}
          </p>
        </div>

        <button
          onClick={onBack}
          className="button primary"
          style={{ paddingInline: '24px' }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
