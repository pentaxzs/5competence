export type RoleId = 'product-designer' | 'product-manager' | 'ux-writer';

export type CompetencyCategory = 'traditional' | 'ai';

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
}

export interface Role {
  id: RoleId;
  label: string;
  subtitle: string;
  description: string;
  emoji: string;
  competencies: Competency[];
}

export interface SelectedCompetency {
  slot: number; // 0~4 (5개 꼭지점)
  competency: Competency;
}

export interface Scores {
  current: number[]; // 5개 슬롯, 1~5점
  future: number[];  // 5개 슬롯, 1~5점
}

export interface AppState {
  role: RoleId | null;
  selected: (Competency | null)[]; // length 5
  scores: Scores;
  step: 1 | 2 | 3 | 4;
}
