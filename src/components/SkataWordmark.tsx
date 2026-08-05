import React from 'react';

interface SkataWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SkataWordmark({ className = '', size = 'md' }: SkataWordmarkProps) {
  return (
    <div className={`skata-wordmark-wrapper ${size} ${className}`}>
      <div className="skata-wordmark-main" aria-label="SKATA">
        <span className="skata-char">SKA</span>
        <span className="skata-t-symbol" aria-hidden="true">
          <span className="skata-t-wing" />
          <span className="skata-t-bar" />
        </span>
        <span className="skata-char">A</span>
      </div>
      <div className="skata-wordmark-sub">
        SERIKAT KARYAWAN GSD
      </div>
    </div>
  );
}

export default SkataWordmark;
