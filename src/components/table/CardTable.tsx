'use client';

import { ReactNode } from 'react';

interface CardTableProps {
  children: ReactNode;
}

export default function CardTable({ children }: CardTableProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Wooden rim */}
      <div
        className="relative rounded-[3rem] p-3"
        style={{
          width: '76vw',
          height: '54vh',
          maxWidth: '880px',
          maxHeight: '480px',
          background: 'linear-gradient(145deg, #e0a877 0%, #c98a5b 45%, #a96f42 100%)',
          boxShadow: '0 16px 40px rgba(43,58,74,0.30), inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(90,50,20,0.35)',
        }}
      >
        {/* Felt — teal, matching the app theme */}
        <div
          className="relative w-full h-full rounded-[2.25rem]"
          style={{
            background: 'radial-gradient(ellipse at 50% 38%, #47b8ae 0%, #33a094 55%, #24857b 100%)',
            boxShadow: 'inset 0 4px 18px rgba(15,75,70,0.45)',
          }}
        >
          {/* Stitched inner ring */}
          <div className="absolute inset-4 rounded-[1.75rem] border-2 border-dashed border-white/25" />

          {/* Center watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="flex gap-3 text-white/10 text-4xl">
              <span>♠</span><span>♥</span><span>♣</span><span>♦</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
