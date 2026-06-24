export interface ActStructure {
  introduction: string; // 도입
  confrontation: string; // 전개
  resolution: string; // 결말
}

export interface Project {
  id: string;
  title: string;
  genre: string;
  serializationCycle: 'weekly' | 'biweekly' | 'monthly' | 'irregular'; // 연재 주기
  status: 'ongoing' | 'completed' | 'paused' | 'planning';
  progress: number; // 0 - 100
  startDate: string;
  endDate: string; // 마감 목표일
  createdAt: string;
  actStructure: ActStructure;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: 'main' | 'supporting' | 'extra';
  personality: string;
  appearance: string;
  relationships: string; // 인물 관계 설명
  conflicts: string; // 설정 충돌 유무 / 검토 내용
  avatarUrl?: string;
}

export interface Foreshadowing {
  id: string;
  projectId: string;
  description: string;
  episodeRegistered: string; // 등록된 회차
  status: 'unresolved' | 'resolved';
  episodeResolved: string; // 회수된 회차
}

export interface Scene {
  id: string;
  index: number;
  description: string;
  cuts: string; // 컷 구성 설명
  endingHook: string; // 엔딩 훅
}

export interface Episode {
  id: string;
  projectId: string;
  chapterNumber: number; // 회차 번호
  title: string;
  summary: string;
  status: 'planning' | 'drafting' | 'storyboarding' | 'completed';
  panelCount: number; // 컷수
  endingHook: string; // 엔딩 훅
  scenes: Scene[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface AIRiskReport {
  projectId: string;
  riskScore: number; // 0 - 100
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  causes: string[];
  suggestions: string[];
  analyzedAt: string;
}

export interface Notification {
  id: string;
  projectId: string;
  projectName: string;
  type: 'deadline' | 'risk_increase' | 'schedule_change';
  message: string;
  createdAt: string;
  read: boolean;
}
