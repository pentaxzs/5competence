'use client';

import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Role, Competency, Scores, CompetencyCategory } from '@/types';
import StepIndicator from '@/components/StepIndicator';
import CompetencySelector from '@/components/CompetencySelector';
import ScoreSlider from '@/components/ScoreSlider';
import RadarChart from '@/components/RadarChart';
import ExportPanel from '@/components/ExportPanel';
import { buildShareUrl, decodeState } from '@/lib/share';

const DEFAULT_SCORES: Scores = { current: [3, 3, 3, 3, 3], future: [4, 4, 4, 4, 4] };

interface Props { role: Role; }

export default function RoleApp({ role }: Props) {
  const chartId = useId().replace(/:/g, '-') + 'chart';
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selected, setSelected] = useState<(Competency | null)[]>([null, null, null, null, null]);
  const [customCompetencies, setCustomCompetencies] = useState<Competency[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(0);
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [showAiHint, setShowAiHint] = useState(false);
  const [activeTab, setActiveTab] = useState<CompetencyCategory>('traditional');

  // URL state 복원
  useEffect(() => {
    const state = searchParams.get('state');
    if (!state) return;
    const decoded = decodeState(state, role.competencies);
    if (!decoded) return;
    // 커스텀 역량은 URL에서 복원
    const restoredCustom: Competency[] = decoded.sel
      .filter((s): s is Competency => s !== null && s.id.startsWith('custom-'))
      .filter((s) => !role.competencies.find((c) => c.id === s.id));
    setCustomCompetencies(restoredCustom);
    setSelected(decoded.sel);
    setScores({ current: decoded.cur, future: decoded.fut });
    setStep(4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (competency: Competency, slot: number) => {
    setSelected((prev) => {
      const next = [...prev];
      const existingIdx = next.findIndex((s) => s?.id === competency.id);
      if (existingIdx !== -1) {
        next[existingIdx] = null;
      } else {
        next[slot] = competency;
        const nextEmpty = next.findIndex((s, i) => s === null && i !== slot);
        setActiveSlot(nextEmpty === -1 ? null : nextEmpty);
      }
      return next;
    });
  };

  const handleSlotClick = (slot: number) => {
    setActiveSlot(activeSlot === slot ? null : slot);
  };

  const handleAddCustom = (competency: Competency) => {
    setCustomCompetencies((prev) => [...prev, competency]);
  };

  const handleRemoveCustom = (competency: Competency) => {
    // 슬롯에 배치돼 있으면 슬롯에서도 제거
    setSelected((prev) => prev.map((s) => (s?.id === competency.id ? null : s)));
    setCustomCompetencies((prev) => prev.filter((c) => c.id !== competency.id));
  };

  const updateScore = (type: 'current' | 'future', idx: number, val: number) => {
    setScores((prev) => {
      const arr = [...prev[type]];
      arr[idx] = val;
      return { ...prev, [type]: arr };
    });
  };

  const handleReset = () => {
    setSelected([null, null, null, null, null]);
    setCustomCompetencies([]);
    setScores(DEFAULT_SCORES);
    setStep(1);
    setActiveSlot(0);
    setActiveTab('traditional');
  };

  const filledCount = selected.filter(Boolean).length;
  const labels = selected.map((s, i) => s?.name ?? `꼭지점 ${i + 1}`);
  const shareUrl = buildShareUrl(role.id, selected, scores);

  return (
    <main className="min-h-screen py-8 px-4 pb-16">
      <div className="max-w-2xl mx-auto">

        {/* 상단 네비 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-xs text-stone-600 dark:text-stone-400 active:text-stone-800 dark:active:text-stone-200 py-2 pr-2"
          >
            ← 역할
          </Link>
          <div className="text-center flex-1 px-2">
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 truncate">
              <span className="mr-1.5">{role.emoji}</span>
              <span className="hidden xs:inline">5 Competences for </span>
              {role.label}
            </p>
          </div>
          <div className="w-12" />
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex justify-center">
          <StepIndicator current={step} />
        </div>

        {/* STEP 1: 역량 선택 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-0.5">역량을 선택하세요</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                꼭지점에 넣을 역량 5가지를 고르거나 직접 입력하세요. ({filledCount}/5)
              </p>
            </div>

            <CompetencySelector
              competencies={role.competencies}
              customCompetencies={customCompetencies}
              selected={selected}
              onToggle={handleToggle}
              onSlotClick={handleSlotClick}
              onAddCustom={handleAddCustom}
              onRemoveCustom={handleRemoveCustom}
              activeSlot={activeSlot}
              tab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex justify-end pt-1">
              <button
                disabled={filledCount < 5}
                onClick={() => {
                  const allTraditional = selected.every((s) => !s || s.category === 'traditional');
                  if (allTraditional) {
                    setShowAiHint(true);
                  } else {
                    setStep(2);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-800 text-white text-sm font-medium disabled:opacity-40 active:bg-stone-700 transition-colors"
              >
                다음 — 현재 역량 입력 →
              </button>
            </div>
          </div>
        )}

        {/* AI 역량 힌트 팝업 */}
        {showAiHint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAiHint(false)} />
            <div className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl p-6 w-full max-w-sm">
              <div className="text-2xl mb-3">🤖</div>
              <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100 mb-2">
                AI 시대 역량도 살펴보셨나요?
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                선택하신 5가지가 모두 전통 역량입니다. <strong className="text-stone-700 dark:text-stone-300">AI 시대 역량</strong> 탭에는 프롬프트 엔지니어링, 데이터 리터러시 등 지금 시대에 주목받는 역량들이 있어요. 함께 비교해보시겠어요?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setShowAiHint(false); setActiveTab('ai'); }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold active:bg-blue-700 transition-colors"
                >
                  AI 역량 탭 확인하기
                </button>
                <button
                  onClick={() => { setShowAiHint(false); setStep(2); }}
                  className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-sm active:bg-stone-50 dark:active:bg-stone-800 transition-colors"
                >
                  전통 역량으로 계속하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: 현재 역량 점수 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-0.5">현재 역량을 평가하세요</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">지금 나의 역량 수준을 1~5점으로 선택합니다.</p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-5">
              {selected.map((comp, i) => comp && (
                <ScoreSlider
                  key={comp.id}
                  label={comp.name}
                  value={scores.current[i]}
                  onChange={(v) => updateScore('current', i, v)}
                  color="blue"
                />
              ))}
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-2 text-center">미리보기</p>
              <RadarChart labels={labels} current={scores.current} future={scores.future} />
            </div>

            <div className="flex justify-between pt-1">
              <button onClick={() => setStep(1)} className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 active:text-stone-800">
                ← 이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-stone-800 text-white text-sm font-medium active:bg-stone-700 transition-colors"
              >
                다음 — 미래 목표 입력 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 미래 목표 점수 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-0.5">미래 목표를 설정하세요</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">6개월~1년 후 달성하고 싶은 목표를 1~5점으로 선택합니다.</p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-5">
              {selected.map((comp, i) => comp && (
                <ScoreSlider
                  key={comp.id}
                  label={comp.name}
                  value={scores.future[i]}
                  onChange={(v) => updateScore('future', i, v)}
                  color="red"
                />
              ))}
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-2 text-center">미리보기</p>
              <RadarChart labels={labels} current={scores.current} future={scores.future} />
            </div>

            <div className="flex justify-between pt-1">
              <button onClick={() => setStep(2)} className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 active:text-stone-800">
                ← 이전
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-stone-800 text-white text-sm font-medium active:bg-stone-700 transition-colors"
              >
                결과 보기 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 결과 */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-0.5">나의 역량 레이더 차트</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">현재와 미래 목표를 비교해보세요</p>
            </div>

            {/* 차트 컨테이너 (내보내기 대상) */}
            <div id={chartId} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5">
              <div className="text-center mb-3">
                <p className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 mb-0.5">5 Competences for</p>
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">{role.label}</p>
              </div>
              <RadarChart labels={labels} current={scores.current} future={scores.future} />
              <div className="mt-4 grid grid-cols-5 gap-1.5 text-center">
                {selected.map((comp, i) => comp && (
                  <div key={comp.id} className="space-y-0.5">
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight line-clamp-2">{comp.name}</p>
                    <p className="text-xs">
                      <span className="text-blue-500 font-bold">{scores.current[i]}</span>
                      <span className="text-stone-500 dark:text-stone-400 mx-0.5">→</span>
                      <span className="text-rose-400 font-bold">{scores.future[i]}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 내보내기 & 공유 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5">
              <ExportPanel chartContainerId={chartId} shareUrl={shareUrl} roleLabel={role.label} />
            </div>

            <div className="flex justify-between pt-1 pb-4">
              <button onClick={() => setStep(3)} className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 active:text-stone-800">
                ← 이전
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-xl active:bg-stone-50 dark:active:bg-stone-800"
              >
                처음부터 다시
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
