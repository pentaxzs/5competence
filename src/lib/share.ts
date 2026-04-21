import { Competency, Scores } from '@/types';

// 선택된 역량 전체 데이터를 인코딩 (커스텀 역량도 포함)
export function encodeState(selected: (Competency | null)[], scores: Scores): string {
  const payload = {
    sel: selected.map((s) =>
      s ? { id: s.id, name: s.name, description: s.description, category: s.category } : null
    ),
    cur: scores.current,
    fut: scores.future,
  };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

export function decodeState(encoded: string): {
  sel: (Competency | null)[];
  cur: number[];
  fut: number[];
} | null {
  try {
    const raw = JSON.parse(decodeURIComponent(atob(encoded)));
    // 구버전 (ids 필드) 호환
    if (raw.ids) return null;
    return raw;
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
  // KakaoTalk 공유 — Web Share API fallback
  if (navigator.share) {
    navigator.share({ url, title: '5 Competences — AI 역량 진단' });
  } else {
    navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었습니다!'));
  }
}
