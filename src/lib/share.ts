import { Competency, Scores } from '@/types';

// ─── 인코딩 헬퍼 ───────────────────────────────────────────────
function serializeComp(c: Competency): string {
  // 커스텀 역량: "c|이름|카테고리"
  if (c.id.startsWith('custom-')) return `c|${c.name}|${c.category}`;
  // 미리 정의된 역량: ID만
  return c.id;
}

function resolveComp(token: string, allComps: Competency[]): Competency | null {
  if (token.startsWith('c|')) {
    const [, name = '', category = 'traditional'] = token.split('|');
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      description: `${name}에 대한 역량`,
      category: category as Competency['category'],
    };
  }
  return allComps.find((c) => c.id === token) ?? null;
}

// ─── 공개 API ──────────────────────────────────────────────────
export function encodeState(selected: (Competency | null)[], scores: Scores): string {
  const payload = {
    s: selected.map((c) => (c ? serializeComp(c) : null)),
    c: scores.current,
    f: scores.future,
  };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

export function decodeState(
  encoded: string,
  allCompetencies: Competency[]
): { sel: (Competency | null)[]; cur: number[]; fut: number[] } | null {
  try {
    const raw = JSON.parse(decodeURIComponent(atob(encoded)));

    // 구버전: sel 필드에 전체 객체 저장
    if (Array.isArray(raw.sel)) {
      return { sel: raw.sel, cur: raw.cur, fut: raw.fut };
    }

    // 신버전: s 필드에 ID/커스텀 토큰 저장
    if (Array.isArray(raw.s)) {
      const sel = raw.s.map((token: string | null) =>
        token ? resolveComp(token, allCompetencies) : null
      );
      return { sel, cur: raw.c, fut: raw.f };
    }

    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(role: string, selected: (Competency | null)[], scores: Scores): string {
  const encoded = encodeState(selected, scores);
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/${role}?state=${encoded}`;
}

export function shareToTwitter(url: string, role: string) {
  const text = encodeURIComponent(`나의 ${role} AI 역량 레이더 차트를 확인해보세요!`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

export function shareToLinkedIn(url: string) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

export function shareToKakao(url: string) {
  if (navigator.share) {
    navigator.share({ url, title: '5 Competences — AI 역량 진단' });
  } else {
    navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었습니다!'));
  }
}
