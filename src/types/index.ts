export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'ja'
  | 'de'
  | 'it'
  | 'zh'
  | 'hi'
  | 'ar'
  | 'pt'
  | 'ru'
  | 'ko'
  | 'nl'
  | 'tr'
  | 'vi'
  | 'id'
  | 'pl'
  | 'el'
  | 'bn'
  | 'sw';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface LevelInfo {
  id: CEFRLevel;
  name: string;
  tagline: string;
  minXp: number;
  description: string;
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string; // Exactly one distinct national flag
  countryCode?: string; // 2-letter ISO country code for reliable visual flag rendering (e.g. 'gb', 'es')
  speechLang: string;
  region: 'Europe' | 'Asia' | 'Americas' | 'Middle East & Africa' | 'Global';
  description: string;
  speakers: string;
  accentColor: string;
}

export interface VocabItem {
  id: string;
  language: LanguageCode;
  level: CEFRLevel; // A1, A2, B1, B2, C1
  word: string;
  phonetic: string;
  translation: string;
  translationsByBaseLang?: Partial<Record<LanguageCode, string>>;
  partOfSpeech: string;
  exampleTarget: string;
  exampleTranslation: string;
  exampleTranslationsByBaseLang?: Partial<Record<LanguageCode, string>>;
  notes?: string;
  box: 1 | 2 | 3 | 4 | 5; // Leitner box (1 = Novice, 5 = Mastered)
  lastReviewed?: string;
  reviewCount: number;
  retentionScore: number; // 0 to 100%
}

export interface DailyQuest {
  id: string;
  title: string;
  icon: string;
  progress: number;
  target: number;
  rewardGems: number;
  rewardXp: number;
  claimed: boolean;
}

export type NodeType = 'lesson' | 'chest' | 'checkpoint' | 'story';

export interface LearningPathNode {
  id: string;
  unitId: number;
  unitTitle: string;
  unitDescription: string;
  unitColor: string;
  title: string;
  subtitle: string;
  type: NodeType;
  crowns: number;
  maxCrowns: number;
  icon: string;
  xpReward: number;
  gemReward?: number;
  completed: boolean;
  locked: boolean;
  wordsIntroduced: string[];
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  countryFlag: string; // e.g. '🇺🇸', '🇪🇸', '🇮🇳', '🇬🇧', '🇯🇵'
  streak: number;
  bestStreak: number;
  streakHistory: { [dateKey: string]: boolean }; // YYYY-MM-DD
  streakFreeze: number;
  xp: number;
  gems: number;
  hearts: number; // Duolingo heart system (default 5, max 5)
  maxHearts: number;
  doubleXpMinutesLeft?: number;
  completedPathNodes: string[];
  dailyQuests: DailyQuest[];
  level: number;
  wordsLearned: number;
  currentCefrLevel: CEFRLevel;
  league: LeagueTier;
  baseLanguage: LanguageCode; // The language user speaks (UI / translation base)
  selectedLanguage: LanguageCode; // The language user is learning
  todayCompleted: boolean;
  todayXp: number;
  dailyGoalXp: number;
  activeGroupId?: string;
  notificationSettings: NotificationSettings;
}

export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby' | 'Diamond';

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  countryFlag: string;
  xp: number;
  wordsLearned: number;
  streak: number;
  league: LeagueTier;
  isCurrentUser?: boolean;
  isFriend?: boolean;
  trend: 'up' | 'down' | 'same';
  weeklyDelta: number;
}

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  countryFlag?: string;
  wordsLearned: number;
  streak: number;
  xp: number;
  isLeader?: boolean;
  isCurrentUser?: boolean;
  statusText?: string;
}

export interface GroupChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
  sharedWord?: {
    word: string;
    translation: string;
    phonetic: string;
  };
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  language: LanguageCode;
  level: CEFRLevel;
  avatar: string;
  code: string;
  weeklyTargetWords: number;
  members: GroupMember[];
  chatMessages: GroupChatMessage[];
  isUserMember: boolean;
}

export type QuestionType = 'multiple-choice' | 'sentence-build' | 'listening' | 'translation';

export interface QuizQuestion {
  id: string;
  vocabId: string;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  audioText?: string;
  options?: string[];
  correctOptionIndex?: number;
  correctSentence?: string;
  scrambledWords?: string[];
  explanation: string;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string; // e.g. "20:00"
  streakProtection: boolean;
  weekendReminders: boolean;
  soundEnabled: boolean;
  hasPermission: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardGems: number;
}
