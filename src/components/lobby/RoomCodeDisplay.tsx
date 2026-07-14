'use client';

import { useState } from 'react';

interface RoomCodeDisplayProps {
  code: string;
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/room/${code}`
    : '';

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center">
      <p className="text-ink-soft text-xs font-bold uppercase tracking-wider mb-2">Room Code</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-4xl font-mono font-bold text-ink tracking-[0.3em]">
          {code}
        </span>
        <button
          onClick={copyCode}
          className="px-3 py-2 rounded-xl bg-teal/15 hover:bg-teal/25 text-teal-dark font-bold transition-colors text-sm"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <button
        onClick={copyLink}
        className="mt-2 text-xs font-semibold text-teal-dark hover:text-ink underline transition-colors"
      >
        Copy invite link
      </button>
    </div>
  );
}
