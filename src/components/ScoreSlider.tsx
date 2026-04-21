'use client';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color?: 'blue' | 'red';
}

const DOTS = [1, 2, 3, 4, 5];

export default function ScoreSlider({ label, value, onChange, color = 'blue' }: Props) {
  const pct = ((value - 1) / 4) * 100;
  const trackColor = color === 'blue' ? 'bg-blue-500' : 'bg-rose-400';
  const dotActive = color === 'blue' ? 'bg-blue-500 ring-blue-200' : 'bg-rose-400 ring-rose-200';
  const scoreColor = color === 'blue' ? 'text-blue-500' : 'text-rose-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-700 font-medium leading-snug">{label}</span>
        <span className={`text-base font-bold ${scoreColor}`}>{value}<span className="text-xs font-normal text-stone-300">/5</span></span>
      </div>
      <div className="relative py-3">
        {/* 트랙 */}
        <div className="relative h-1.5 rounded-full bg-stone-200">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${trackColor} transition-all`}
            style={{ width: `${pct}%` }}
          />
          {/* 눈금 점 */}
          {DOTS.map((d) => (
            <button
              key={d}
              onClick={() => onChange(d)}
              style={{ left: `${((d - 1) / 4) * 100}%` }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full transition-all
                ${d <= value ? `${dotActive} ring-2` : 'bg-stone-300'}`}
              aria-label={`${d}점`}
            />
          ))}
        </div>
        {/* 숨김 range input — 드래그 지원 */}
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '100%' }}
        />
      </div>
      {/* 눈금 라벨 */}
      <div className="flex justify-between px-0.5">
        {DOTS.map((d) => (
          <span key={d} className={`text-[9px] ${d === value ? scoreColor + ' font-bold' : 'text-stone-300'}`}>
            {d === 1 ? '기초' : d === 3 ? '보통' : d === 5 ? '전문가' : d}
          </span>
        ))}
      </div>
    </div>
  );
}
