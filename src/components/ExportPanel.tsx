'use client';

import { useRef, useState } from 'react';
import { downloadPng, downloadJpg, downloadPdf } from '@/lib/export';
import { shareToTwitter, shareToLinkedIn, shareToKakao } from '@/lib/share';

interface Props {
  chartContainerId: string;
  shareUrl: string;
  roleLabel: string;
}

export default function ExportPanel({ chartContainerId, shareUrl, roleLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const getEl = () => document.getElementById(chartContainerId) as HTMLElement | null;

  const handle = async (type: string, fn: () => Promise<void>) => {
    setLoading(type);
    try { await fn(); } finally { setLoading(null); }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 다운로드 */}
      <div>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">다운로드</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'PNG', type: 'png', fn: () => { const el = getEl(); if (el) return downloadPng(el); return Promise.resolve(); } },
            { label: 'JPG', type: 'jpg', fn: () => { const el = getEl(); if (el) return downloadJpg(el); return Promise.resolve(); } },
            { label: 'PDF', type: 'pdf', fn: () => { const el = getEl(); if (el) return downloadPdf(el); return Promise.resolve(); } },
          ].map(({ label, type, fn }) => (
            <button
              key={type}
              disabled={loading !== null}
              onClick={() => handle(type, fn)}
              className="px-4 py-2 rounded-xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {loading === type ? (
                <span className="animate-spin text-xs">⟳</span>
              ) : (
                <span className="text-xs">↓</span>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 공유 */}
      <div>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">공유</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => shareToTwitter(shareUrl, roleLabel)}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-80 transition-opacity"
          >
            𝕏 Twitter
          </button>
          <button
            onClick={() => shareToLinkedIn(shareUrl)}
            className="px-4 py-2 rounded-xl bg-[#0A66C2] text-white text-sm font-medium hover:opacity-80 transition-opacity"
          >
            LinkedIn
          </button>
          <button
            onClick={() => shareToKakao(shareUrl)}
            className="px-4 py-2 rounded-xl bg-[#FEE500] text-stone-900 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            카카오톡
          </button>
          <button
            onClick={copyUrl}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            {copied ? '✓ 복사됨' : '🔗 링크 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}
