export type SoundCategory = 'danger' | 'caution' | 'info';

export interface SoundDetection {
  id: string;
  titleLao: string;
  titleEn: string;
  category: SoundCategory;
  decibel: number;
  confidence: number;
  timeAgo: string;
  timestamp: number;
  icon: string;
  soundKey: string;
  vibrationType: string;
  acknowledged?: boolean;
}

export interface SoundLibraryItem {
  id: string;
  titleLao: string;
  titleEn: string;
  descriptionLao: string;
  category: SoundCategory;
  icon: string;
  soundKey: string;
  active: boolean;
  isCustom: boolean;
  vibrationPatternText: string;
}

export interface AppSettings {
  aiNarrationEnabled: boolean;
  sensitivity: number; // 1 (Low), 2 (Medium), 3 (High)
  vibrationIntensity: number; // 1 (Light), 2 (Medium), 3 (Strong)
  emergencySirenPriority: boolean;
  screenWakeLock: boolean;
  screenStrobeOnAlert: boolean;
  lastAiNarration: string;
  lastAiTime: string;
}
