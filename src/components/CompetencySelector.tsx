'use client';

import { useState } from 'react';
import { Competency, CompetencyCategory } from '@/types';

interface Props {
  competencies: Competency[];
  customCompetencies: Competency[];
  selected: (Competency | null)[];
  onToggle: (competency: Competency, slot: number) => void;
  onSlotClick: (slot: number) => void;
  onAddCustom: (competency: Competency) => void;
  onRemoveCustom: (competency: Competency) => void;
  activeSlot: number | null;
  tab: CompetencyCategory;
  onTabChange: (tab: CompetencyCategory) => void;
}

const TAB_LABELS = {
  traditional: '📚 전통 역량',
  ai: '🤖 AI 시대 역량',
} as const;

export default function CompetencySelector({
  competencies,
  customCompetencies,
  selected,
  onToggle,
  onSlotClick,
  onAddCustom,
  onRemoveCustom,
  activeSlot,
  tab,
  onTabChange,
}: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showFullAlert, setShowFullAlert] = useState(false);

  const allCompetencies = [...competencies, ...customCompetencies];
  const filtered = allCompetencies.filter((c) => c.category === tab);

  const isSelected = (c: Competency) => selected.some((s) => s?.id === c.id);
  const getSlotOf = (c: Competency) => selected.findIndex((s) => s?.id === c.id);

  const handleCompetencyClick = (c: Competency) => {
    if (isSelected(c)) {
      onToggle(c, getSlotOf(c));
      return;
    }
    const targetSlot = activeSlot !== null ? activeSlot : selected.findIndex((s) => s === null);
    if (targetSlot === -1) {
      setShowFullAlert(true);
      return;
    }
    onToggle(c, targetSlot);
  };

  const handleAddCustom = () => {
    const name = customName.trim();
    if (!name) return;
    const newComp: Competency = {
      id: `custom-${Date.now()}`,
      name,
      description: customDesc.trim() || `${name}에 대한 역량`,
      category: tab,
    };
    onAddCustom(newComp);
    setCustomName('');
    setCustomDesc('');
    setShowForm(false);
    const targetSlot = activeSlot !== null ? activeSlot : selected.findIndex((s) => s === null);
    if (targetSlot !== -1) onToggle(newComp, targetSlot);
  };

  return (
    <div className="space-y-5">
      {/* 슬롯 구성 */}
      <div>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-2.5 font-medium tracking-wide uppercase">
          꼭지점 구성 — 탭해서 교체할 슬롯 선택
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => onSlotClick(i)}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs transition-all min-h-[56px]
                ${activeSlot === i
                  ? 'border-stone-700 bg-stone-800 text-white'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 active:bg-stone-50 dark:active:bg-stone-800'
                }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                ${activeSlot === i ? 'bg-white text-stone-800' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                {i + 1}
              </span>
              {selected[i] ? (
                <span className="font-medium leading-tight text-center text-[11px] w-full">
                  {(() => {
                    const name = selected[i]!.name;
                    const parenIdx = name.indexOf(' (');
                    if (parenIdx === -1) return name;
                    return (
                      <>
                        <span className="block truncate">{name.slice(0, parenIdx)}</span>
                        <span className="block truncate opacity-75">{name.slice(parenIdx + 1)}</span>
                      </>
                    );
                  })()}
                </span>
              ) : (
                <span className="text-[10px] text-stone-500 dark:text-stone-600">미선택</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
        {(['traditional', 'ai'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { onTabChange(t); setShowForm(false); setTooltip(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              tab === t
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* 역량 섹션 */}
      <div className="space-y-3">

        {/* 역량 카드 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((c) => {
            const sel = isSelected(c);
            const slotIdx = getSlotOf(c);
            const isCustom = c.id.startsWith('custom-');
            return (
              <div key={c.id} className="relative">
                <button
                  onClick={() => handleCompetencyClick(c)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all active:scale-[0.98]
                    ${sel
                      ? 'border-stone-700 bg-stone-800 text-white'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 active:bg-stone-50 dark:active:bg-stone-800'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium leading-snug flex items-center gap-1">
                      {isCustom && <span className="text-[10px] opacity-50">✏️</span>}
                      {c.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sel ? (
                        <span className="w-5 h-5 rounded-full bg-white text-stone-800 text-[10px] font-bold flex items-center justify-center">
                          {slotIdx + 1}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setTooltip(tooltip === c.id ? null : c.id); }}
                          className="text-stone-500 dark:text-stone-500 text-xs w-5 h-5 flex items-center justify-center"
                          aria-label="설명 보기"
                        >
                          ?
                        </button>
                      )}
                      {/* 커스텀 역량 삭제 버튼 */}
                      {isCustom && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveCustom(c); }}
                          className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] transition-colors
                            ${sel ? 'text-white/70 hover:text-white' : 'text-stone-300 hover:text-red-400'}`}
                          aria-label="역량 삭제"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  {tooltip === c.id && !sel && (
                    <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{c.description}</p>
                  )}
                </button>
              </div>
            );
          })}

          {/* 직접 입력 버튼 */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-stone-400 dark:border-stone-600 text-stone-600 dark:text-stone-400 text-sm transition-all active:scale-[0.98] active:bg-stone-50 dark:active:bg-stone-800"
            >
              <span className="text-base leading-none">+</span>
              <span>직접 입력</span>
            </button>
          )}
        </div>

        {/* 직접 입력 폼 */}
        {showForm && (
          <div className="p-4 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 space-y-3">
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {tab === 'traditional' ? '📚 전통 역량' : '🤖 AI 시대 역량'} 직접 입력
            </p>
            <input
              type="text"
              placeholder="역량 이름 *"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-500 dark:focus:border-stone-400"
              autoFocus
            />
            <input
              type="text"
              placeholder="설명 (선택사항)"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-500 dark:focus:border-stone-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className="flex-1 py-2.5 rounded-lg bg-stone-800 text-white text-sm font-medium disabled:opacity-40"
              >
                추가
              </button>
              <button
                onClick={() => { setShowForm(false); setCustomName(''); setCustomDesc(''); }}
                className="px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-sm"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 슬롯 가득 참 팝업 */}
      {showFullAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFullAlert(false)} />
          <div className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl p-6 w-full max-w-sm">
            <div className="text-2xl mb-3">✋</div>
            <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100 mb-2">
              5개 역량이 모두 선택됐어요
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
              역량을 교체하려면 상단 슬롯에서 바꿀 번호를 먼저 선택한 뒤, 새 역량을 탭해주세요.
            </p>
            <button
              onClick={() => setShowFullAlert(false)}
              className="w-full py-3 rounded-xl bg-stone-800 dark:bg-stone-700 text-white text-sm font-semibold active:opacity-80 transition-opacity"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
