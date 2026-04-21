import Link from 'next/link';
import { roles } from '@/data/competencies';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-4 font-medium">
          AI Era Competency Radar
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-stone-800 tracking-tight mb-5">
          5 Competences
        </h1>
        <p className="text-stone-500 text-base leading-relaxed max-w-sm mx-auto">
          나의 현재와 미래 역량을 레이더 차트로 시각화하세요.
          <br />
          역할을 선택해 시작하세요.
        </p>
      </div>

      {/* Role Cards — mobile: 세로 스택, sm+: 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={`/${role.id}`}
            className="group bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 text-left sm:text-center active:bg-stone-50 sm:hover:border-stone-400 sm:hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl sm:text-4xl sm:mb-4 shrink-0">{role.emoji}</span>
            <div className="flex-1 sm:flex-none">
              <h2 className="text-sm font-semibold text-stone-800 mb-0.5 sm:mb-1">{role.label}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{role.description}</p>
            </div>
            <span className="text-stone-300 sm:hidden shrink-0">›</span>
            <span className="hidden sm:inline mt-5 text-xs text-stone-400 group-hover:text-stone-700 transition-colors">
              시작하기 →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-stone-300">
        전통 역량과 AI 시대 역량 중 5가지를 직접 선택합니다
      </p>
    </main>
  );
}
