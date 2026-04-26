import Link from 'next/link';
import { roles } from '@/data/competencies';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-600 dark:text-stone-400 mb-4 font-medium">
          AI Era Competency Radar
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-stone-800 dark:text-stone-100 tracking-tight mb-5">
          5 Competences
        </h1>
        <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed max-w-sm mx-auto">
          나의 현재와 미래 역량을 레이더 차트로 시각화하세요.
          <br />
          역할을 선택해 시작하세요.
        </p>

        {/* 레이더 차트 미리보기 */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <svg viewBox="0 0 200 190" className="w-36 sm:w-44 opacity-90" aria-hidden="true">
            {/* 축선 */}
            <line x1="100" y1="100" x2="100" y2="22" stroke="#d6d3d1" strokeWidth="1"/>
            <line x1="100" y1="100" x2="171" y2="74" stroke="#d6d3d1" strokeWidth="1"/>
            <line x1="100" y1="100" x2="143" y2="163" stroke="#d6d3d1" strokeWidth="1"/>
            <line x1="100" y1="100" x2="57" y2="163" stroke="#d6d3d1" strokeWidth="1"/>
            <line x1="100" y1="100" x2="29" y2="74" stroke="#d6d3d1" strokeWidth="1"/>
            {/* 격자 — 25% */}
            <polygon points="100,82 117,94 111,114 89,114 83,94" fill="none" stroke="#e7e5e4" strokeWidth="0.8"/>
            {/* 격자 — 50% */}
            <polygon points="100,61 135,85 121,132 79,132 65,85" fill="none" stroke="#e7e5e4" strokeWidth="0.8"/>
            {/* 격자 — 75% */}
            <polygon points="100,40 153,76 132,148 68,148 47,76" fill="none" stroke="#e7e5e4" strokeWidth="0.8"/>
            {/* 격자 — 100% */}
            <polygon points="100,22 171,74 143,163 57,163 29,74" fill="none" stroke="#d6d3d1" strokeWidth="0.8"/>
            {/* 미래 목표 (빨간 점선) */}
            <polygon
              points="100,40 171,74 132,148 57,163 47,76"
              fill="rgba(244,63,94,0.08)"
              stroke="rgba(244,63,94,0.65)"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />
            {/* 현재 역량 (파란 실선) */}
            <polygon
              points="100,61 153,85 121,132 68,148 65,85"
              fill="rgba(59,130,246,0.12)"
              stroke="rgba(59,130,246,0.75)"
              strokeWidth="1.5"
            />
          </svg>
          {/* 범례 */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
              <span className="w-5 h-px bg-blue-400 inline-block"/>
              현재 역량
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
              <span className="w-5 h-px border-t border-dashed border-rose-400 inline-block"/>
              미래 목표
            </span>
          </div>
        </div>
      </div>

      {/* Role Cards — mobile: 세로 스택, sm+: 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={`/${role.id}`}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 sm:p-6 flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 text-left sm:text-center active:bg-stone-50 dark:active:bg-stone-800 sm:hover:border-stone-400 dark:sm:hover:border-stone-500 sm:hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl sm:text-4xl sm:mb-4 shrink-0">{role.emoji}</span>
            <div className="flex-1 sm:flex-none">
              <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100 mb-0.5 sm:mb-1">{role.label}</h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{role.description}</p>
            </div>
            <span className="text-stone-500 dark:text-stone-500 sm:hidden shrink-0">›</span>
            <span className="hidden sm:inline mt-5 text-xs text-stone-600 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
              시작하기 →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-stone-500 dark:text-stone-500">
        전통 역량과 AI 시대 역량 중 5가지를 직접 선택합니다
      </p>
    </main>
  );
}
