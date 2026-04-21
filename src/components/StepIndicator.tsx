'use client';

const STEPS = [
  { n: 1, label: '역량 선택' },
  { n: 2, label: '현재 역량' },
  { n: 3, label: '미래 목표' },
  { n: 4, label: '결과 보기' },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                ${current === step.n ? 'bg-stone-800 text-white' : current > step.n ? 'bg-stone-400 text-white' : 'bg-stone-200 text-stone-400'}`}
            >
              {current > step.n ? '✓' : step.n}
            </div>
            {/* 라벨: 모바일에서는 현재 step만 표시 */}
            <span
              className={`mt-1 text-[10px] whitespace-nowrap transition-all
                ${current === step.n ? 'text-stone-700 font-medium opacity-100' : 'text-stone-400 opacity-0 sm:opacity-100'}`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 sm:w-12 h-px mb-4 mx-1 ${current > step.n ? 'bg-stone-400' : 'bg-stone-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
