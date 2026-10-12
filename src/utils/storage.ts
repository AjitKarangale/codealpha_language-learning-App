import { UserProfile, VocabItem, LeaderboardUser, Achievement, StudyGroup } from '../types';
import { INITIAL_VOCAB_DATABASE } from '../data/languages';

const USER_KEY = 'linguapulse_user';
const VOCAB_KEY = 'linguapulse_vocab';
const LEADERBOARD_KEY = 'linguapulse_leaderboard';
const ACHIEVEMENTS_KEY = 'linguapulse_achievements';
const GROUPS_KEY = 'linguapulse_groups';

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getPast7Days(): { date: string; dayName: string; short: string }[] {
  const days: { date: string; dayName: string; short: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      dayName: dayNames[d.getDay()],
      short: dayNames[d.getDay()][0]
    });
  }
  return days;
}

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  username: 'alex_polyglot',
  avatar: '/src/assets/images/mascot_owl_badge_1791732878866.jpg',
  countryFlag: '🇺🇸',
  streak: 5,
  bestStreak: 12,
  streakHistory: (() => {
    const hist: { [k: string]: boolean } = {};
    const days = getPast7Days();
    for (let i = 0; i < 5; i++) {
      if (days[i]) hist[days[i].date] = true;
    }
    return hist;
  })(),
  streakFreeze: 2,
  xp: 1420,
  gems: 380,
  level: 8,
  wordsLearned: 38,
  hearts: 5,
  maxHearts: 5,
  doubleXpMinutesLeft: 12,
  completedPathNodes: ['u1-n1', 'u1-n2'],
  dailyQuests: [
    {
      id: 'quest-xp',
      title: 'Earn 30 XP in lessons or match frenzy',
      icon: '⚡',
      progress: 20,
      target: 30,
      rewardGems: 15,
      rewardXp: 20,
      claimed: false
    },
    {
      id: 'quest-quiz',
      title: 'Score 80%+ on any practice test',
      icon: '🎯',
      progress: 1,
      target: 1,
      rewardGems: 20,
      rewardXp: 25,
      claimed: true
    },
    {
      id: 'quest-match',
      title: 'Complete 1 Match Madness round',
      icon: '⏱️',
      progress: 0,
      target: 1,
      rewardGems: 25,
      rewardXp: 30,
      claimed: false
    }
  ],
  currentCefrLevel: 'A1',
  league: 'Gold',
  baseLanguage: 'en',
  selectedLanguage: 'es',
  todayCompleted: false,
  todayXp: 20,
  dailyGoalXp: 50,
  activeGroupId: 'group-1',
  notificationSettings: {
    enabled: true,
    time: '20:00',
    streakProtection: true,
    weekendReminders: true,
    soundEnabled: true,
    hasPermission: typeof Notification !== 'undefined' && Notification.permission === 'granted'
  }
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-1',
    name: 'Sofia Martinez',
    username: 'sofia_madrid',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇪🇸',
    xp: 2180,
    wordsLearned: 74,
    streak: 18,
    league: 'Gold',
    isFriend: true,
    trend: 'up',
    weeklyDelta: 240
  },
  {
    id: 'user-2',
    name: 'Kenji Sato',
    username: 'kenji_tokyo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇯🇵',
    xp: 1950,
    wordsLearned: 62,
    streak: 9,
    league: 'Gold',
    isFriend: true,
    trend: 'up',
    weeklyDelta: 180
  },
  {
    id: 'user-current',
    name: 'Alex Rivera (You)',
    username: 'alex_polyglot',
    avatar: '/src/assets/images/mascot_owl_badge_1791732878866.jpg',
    countryFlag: '🇺🇸',
    xp: 1420,
    wordsLearned: 38,
    streak: 5,
    league: 'Gold',
    isCurrentUser: true,
    isFriend: false,
    trend: 'same',
    weeklyDelta: 110
  },
  {
    id: 'user-3',
    name: 'Camille Dupont',
    username: 'camille_paris',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇫🇷',
    xp: 1390,
    wordsLearned: 45,
    streak: 14,
    league: 'Gold',
    isFriend: true,
    trend: 'down',
    weeklyDelta: 70
  },
  {
    id: 'user-4',
    name: 'Lukas Weber',
    username: 'lukas_berlin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇩🇪',
    xp: 1210,
    wordsLearned: 34,
    streak: 4,
    league: 'Gold',
    isFriend: false,
    trend: 'up',
    weeklyDelta: 90
  },
  {
    id: 'user-5',
    name: 'Elena Rossi',
    username: 'elena_milano',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇮🇹',
    xp: 980,
    wordsLearned: 29,
    streak: 2,
    league: 'Gold',
    isFriend: true,
    trend: 'down',
    weeklyDelta: 30
  },
  {
    id: 'user-6',
    name: 'Marcus Vance',
    username: 'marcus_v',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    countryFlag: '🇬🇧',
    xp: 750,
    wordsLearned: 19,
    streak: 1,
    league: 'Gold',
    isFriend: false,
    trend: 'down',
    weeklyDelta: 20
  }
];

export const INITIAL_GROUPS: StudyGroup[] = [
  {
    id: 'group-1',
    name: 'Madrid Camino Squad 🇪🇸',
    description: 'Daily conversational Spanish practice and collaborative vocabulary mastery!',
    language: 'es',
    level: 'A1',
    avatar: '🇪🇸',
    code: 'MADRID-77',
    weeklyTargetWords: 350,
    isUserMember: true,
    members: [
      {
        id: 'user-1',
        name: 'Sofia Martinez',
        username: 'sofia_madrid',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇪🇸',
        wordsLearned: 74,
        streak: 18,
        xp: 2180,
        isLeader: true,
        statusText: 'Reviewing Level A2 idioms ☕'
      },
      {
        id: 'user-current',
        name: 'Alex Rivera (You)',
        username: 'alex_polyglot',
        avatar: '/src/assets/images/mascot_owl_badge_1791732878866.jpg',
        countryFlag: '🇺🇸',
        wordsLearned: 38,
        streak: 5,
        xp: 1420,
        isCurrentUser: true,
        statusText: 'Completed 5-day streak goal!'
      },
      {
        id: 'user-5',
        name: 'Elena Rossi',
        username: 'elena_milano',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇮🇹',
        wordsLearned: 29,
        streak: 2,
        xp: 980,
        statusText: 'Mastering restaurant phrases 🥘'
      },
      {
        id: 'user-3',
        name: 'Camille Dupont',
        username: 'camille_paris',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇫🇷',
        wordsLearned: 45,
        streak: 14,
        xp: 1390,
        statusText: 'Practicing past tense verbs'
      }
    ],
    chatMessages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'Sofia Martinez',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: '¡Hola amigos! Welcome to our Spanish study squad. Who is ready for today’s 5-minute quiz?',
        timestamp: '10:15 AM',
        reactions: [
          { emoji: '🔥', count: 3, users: ['user-current', 'user-3', 'user-5'] },
          { emoji: '👏', count: 2, users: ['user-current', 'user-5'] }
        ]
      },
      {
        id: 'msg-2',
        senderId: 'user-3',
        senderName: 'Camille Dupont',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'I just reviewed 10 new words in Level A2! The word "sobremesa" is so wonderful.',
        timestamp: '10:32 AM',
        sharedWord: {
          word: 'sobremesa',
          phonetic: 'soh-breh-MEH-sah',
          translation: 'post-meal table conversation'
        },
        reactions: [
          { emoji: '❤️', count: 4, users: ['user-1', 'user-current', 'user-5', 'user-3'] }
        ]
      },
      {
        id: 'msg-3',
        senderId: 'user-5',
        senderName: 'Elena Rossi',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'Alex, your streak is on fire! Keep it going! 🎉',
        timestamp: '11:05 AM',
        reactions: [
          { emoji: '🎉', count: 2, users: ['user-1', 'user-current'] }
        ]
      }
    ]
  },
  {
    id: 'group-2',
    name: 'Tokyo Kanji Trail 🇯🇵',
    description: 'Learn Japanese daily Kanji, vocabulary, and daily life phrases with friends!',
    language: 'ja',
    level: 'A1',
    avatar: '🇯🇵',
    code: 'TOKYO-88',
    weeklyTargetWords: 280,
    isUserMember: false,
    members: [
      {
        id: 'user-2',
        name: 'Kenji Sato',
        username: 'kenji_tokyo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇯🇵',
        wordsLearned: 62,
        streak: 9,
        xp: 1950,
        isLeader: true,
        statusText: 'Studying JLPT N5 vocabulary'
      },
      {
        id: 'user-4',
        name: 'Lukas Weber',
        username: 'lukas_berlin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        countryFlag: '🇩🇪',
        wordsLearned: 34,
        streak: 4,
        xp: 1210,
        statusText: 'Practicing Hiragana flashcards'
      }
    ],
    chatMessages: [
      {
        id: 'msg-201',
        senderId: 'user-2',
        senderName: 'Kenji Sato',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Konnichiwa! Let’s learn 10 new words today together. 継続は力なり (Continuity is power)!',
        timestamp: '09:20 AM',
        reactions: [
          { emoji: '⚡', count: 2, users: ['user-4', 'user-2'] }
        ]
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak-7',
    title: '7-Day Streak Warrior',
    description: 'Maintain a learning streak for 7 consecutive days',
    icon: '🔥',
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    rewardGems: 50
  },
  {
    id: 'vocab-20',
    title: 'Lexicon Pioneer',
    description: 'Learn and review 20 unique vocabulary words',
    icon: '📚',
    progress: 14,
    maxProgress: 20,
    unlocked: false,
    rewardGems: 40
  },
  {
    id: 'group-collaborator',
    title: 'Squad Champion',
    description: 'Join a study squad and share vocabulary words in group chat',
    icon: '👥',
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    rewardGems: 45
  },
  {
    id: 'quiz-master',
    title: 'Retention Champion',
    description: 'Score 100% on 3 practice retention quizzes',
    icon: '🎯',
    progress: 2,
    maxProgress: 3,
    unlocked: false,
    rewardGems: 60
  },
  {
    id: 'social-challenger',
    title: 'Friendly Rival',
    description: 'Send high-fives or compete with friends on the leaderboard',
    icon: '🤝',
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    rewardGems: 30
  },
  {
    id: 'polyglot-curious',
    title: 'Polyglot Explorer',
    description: 'Practice vocabulary in at least 3 distinct languages',
    icon: '🌍',
    progress: 2,
    maxProgress: 3,
    unlocked: false,
    rewardGems: 80
  }
];

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return INITIAL_USER;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_USER, ...parsed };
  } catch {
    return INITIAL_USER;
  }
}

export function saveUserProfile(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadVocabItems(): VocabItem[] {
  if (typeof window === 'undefined') return INITIAL_VOCAB_DATABASE;
  try {
    const raw = localStorage.getItem(VOCAB_KEY);
    if (!raw) {
      saveVocabItems(INITIAL_VOCAB_DATABASE);
      return INITIAL_VOCAB_DATABASE;
    }
    const parsed: VocabItem[] = JSON.parse(raw);
    const existingIds = new Set(parsed.map((item) => item.id));
    const merged = [...parsed];
    INITIAL_VOCAB_DATABASE.forEach((dbItem) => {
      if (!existingIds.has(dbItem.id)) {
        merged.push(dbItem);
      }
    });
    return merged;
  } catch {
    return INITIAL_VOCAB_DATABASE;
  }
}

export function saveVocabItems(items: VocabItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOCAB_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save vocab items', e);
  }
}

export function loadLeaderboard(): LeaderboardUser[] {
  if (typeof window === 'undefined') return INITIAL_LEADERBOARD;
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return INITIAL_LEADERBOARD;
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboard(users: LeaderboardUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export function loadStudyGroups(): StudyGroup[] {
  if (typeof window === 'undefined') return INITIAL_GROUPS;
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    if (!raw) {
      saveStudyGroups(INITIAL_GROUPS);
      return INITIAL_GROUPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GROUPS;
  }
}

export function saveStudyGroups(groups: StudyGroup[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save study groups', e);
  }
}

export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements', e);
  }
}
