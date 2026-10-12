import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  VocabItem,
  LeaderboardUser,
  Achievement,
  StudyGroup,
  LanguageCode,
  CEFRLevel,
  NotificationSettings,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadVocabItems,
  saveVocabItems,
  loadLeaderboard,
  saveLeaderboard,
  loadStudyGroups,
  saveStudyGroups,
  loadAchievements,
  saveAchievements,
  getTodayDateString,
} from './utils/storage';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from './data/languages';
import { soundEffects } from './utils/audio';
import { NotificationManager } from './utils/notifications';
import { Navbar, AppTab } from './components/Navbar';
import { StreakBanner } from './components/StreakBanner';
import { LearningPath } from './components/LearningPath';
import { MatchMadness } from './components/MatchMadness';
import { DailyVocabChallenge } from './components/DailyVocabChallenge';
import { PracticeQuiz } from './components/PracticeQuiz';
import { StudyGroups } from './components/StudyGroups';
import { SocialLeaderboard } from './components/SocialLeaderboard';
import { RetentionStats } from './components/RetentionStats';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { DuolingoShopModal } from './components/DuolingoShopModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { CountryFlag } from './components/CountryFlag';
import { Sparkles, ShieldCheck, Wifi, Flame, Zap, Trophy, BookOpen, Globe, Layers, Users, MapPin, Store, Heart } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('linguapulse_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('linguapulse_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('linguapulse_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  // App state
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [vocabList, setVocabList] = useState<VocabItem[]>(loadVocabItems);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(loadLeaderboard);
  const [groups, setGroups] = useState<StudyGroup[]>(loadStudyGroups);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [activeTab, setActiveTab] = useState<AppTab>('path');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<{ title: string; body: string } | null>(null);

  // Register Service Worker for offline PWA capabilities
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped:', err);
      });
    }
  }, []);

  // Schedule background check for daily reminder notification
  useEffect(() => {
    const cleanup = NotificationManager.scheduleDailyCheck(
      user.notificationSettings.time,
      user.streak,
      user.todayCompleted,
      (title, body) => {
        setNotificationBanner({ title, body });
      }
    );
    return cleanup;
  }, [user.notificationSettings.time, user.streak, user.todayCompleted]);

  // Save changes to persistent storage
  useEffect(() => {
    saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    saveVocabItems(vocabList);
  }, [vocabList]);

  useEffect(() => {
    saveLeaderboard(leaderboardUsers);
  }, [leaderboardUsers]);

  useEffect(() => {
    saveStudyGroups(groups);
  }, [groups]);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  // Language & Level change handlers
  const handleSelectLanguage = (lang: LanguageCode) => {
    soundEffects.playClick();
    setUser((prev) => ({ ...prev, selectedLanguage: lang }));
  };

  const handleSaveLanguageSelection = (
    baseLang: LanguageCode,
    targetLang: LanguageCode,
    level: CEFRLevel
  ) => {
    setUser((prev) => ({
      ...prev,
      baseLanguage: baseLang,
      selectedLanguage: targetLang,
      currentCefrLevel: level,
    }));
  };

  const handleChangeLevel = (level: CEFRLevel) => {
    setUser((prev) => ({
      ...prev,
      currentCefrLevel: level,
    }));
  };

  // Vocab updates
  const handleUpdateVocab = (updated: VocabItem) => {
    setVocabList((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleAddVocab = (newItem: VocabItem) => {
    setVocabList((prev) => [newItem, ...prev]);
  };

  // Complete Daily Challenge handler
  const handleCompleteDailyChallenge = (xpEarned: number) => {
    const today = getTodayDateString();
    setUser((prev) => {
      const alreadyDone = prev.todayCompleted;
      const nextStreak = alreadyDone ? prev.streak : prev.streak + 1;
      const nextBest = Math.max(prev.bestStreak, nextStreak);

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        todayXp: prev.todayXp + xpEarned,
        gems: prev.gems + 15,
        streak: nextStreak,
        bestStreak: nextBest,
        wordsLearned: (prev.wordsLearned || 0) + 4,
        todayCompleted: true,
        streakHistory: {
          ...prev.streakHistory,
          [today]: true,
        },
      };
    });

    // Update achievements progress
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'streak-7') {
          return { ...ach, progress: Math.min(ach.maxProgress, ach.progress + 1) };
        }
        return ach;
      })
    );
  };

  // Practice Quiz complete handler
  const handleQuizComplete = (score: number, total: number, xpEarned: number) => {
    const today = getTodayDateString();
    setUser((prev) => {
      const nextTodayXp = prev.todayXp + xpEarned;
      const isGoalMet = nextTodayXp >= prev.dailyGoalXp;

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        todayXp: nextTodayXp,
        gems: prev.gems + (score === total ? 20 : 10),
        wordsLearned: (prev.wordsLearned || 0) + Math.min(score, 5),
        todayCompleted: isGoalMet ? true : prev.todayCompleted,
        streakHistory: isGoalMet
          ? { ...prev.streakHistory, [today]: true }
          : prev.streakHistory,
      };
    });

    // Update quiz achievement
    if (score === total) {
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'quiz-master') {
            return { ...ach, progress: Math.min(ach.maxProgress, ach.progress + 1) };
          }
          return ach;
        })
      );
    }
  };

  // Use or buy Streak Freeze
  const handleUseStreakFreeze = () => {
    if (user.gems >= 100) {
      soundEffects.playSuccess();
      setUser((prev) => ({
        ...prev,
        gems: prev.gems - 100,
        streakFreeze: prev.streakFreeze + 1,
      }));
    } else {
      soundEffects.playClick();
      alert('You need 100 Gems to equip an extra Streak Freeze shield! Complete quizzes to earn more.');
    }
  };

  // Add friend to leaderboard
  const handleAddFriend = (username: string) => {
    const newFriend: LeaderboardUser = {
      id: `friend-${Date.now()}`,
      name: username.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      username,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      countryFlag: '🇪🇸',
      xp: Math.floor(Math.random() * 800) + 900,
      wordsLearned: Math.floor(Math.random() * 30) + 15,
      streak: Math.floor(Math.random() * 8) + 2,
      league: user.league,
      isFriend: true,
      trend: 'up',
      weeklyDelta: 60,
    };
    setLeaderboardUsers((prev) => [...prev, newFriend]);
  };

  // Send high five cheer
  const handleSendHighFive = (friendName: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'social-challenger') {
          return { ...ach, progress: Math.min(ach.maxProgress, ach.progress + 1) };
        }
        return ach;
      })
    );
  };

  // Claim achievement
  const handleClaimAchievement = (id: string, rewardGems: number) => {
    setUser((prev) => ({ ...prev, gems: prev.gems + rewardGems }));
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, unlocked: true } : ach))
    );
  };

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === user.selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const baseLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === user.baseLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const currentLevelObj =
    CEFR_LEVELS.find((l) => l.id === user.currentCefrLevel) ||
    CEFR_LEVELS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        openNotificationModal={() => setShowNotificationModal(true)}
        openLanguageSelectorModal={() => setShowLanguageModal(true)}
        openShopModal={() => setShowShopModal(true)}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* In-app Notification Alert Banner */}
      {notificationBanner && (
        <div className="bg-amber-500 text-slate-900 px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="mx-auto flex items-center gap-2 max-w-7xl">
            <Flame className="w-4 h-4 fill-slate-900 text-slate-900 shrink-0" />
            <span>
              <strong>{notificationBanner.title}</strong> — {notificationBanner.body}
            </span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-slate-900/80 hover:text-slate-900 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Banner with World Language Pair & Level display */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-white shadow-xs">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/hero_learning_journey_1791732859974.jpg"
              alt="Global Language Learning Journey"
              className="h-full w-full object-cover opacity-35 dark:opacity-25"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                  <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                  <span>{currentLang.name} · {currentLevelObj.name}</span>
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Computed via</span>
                  <CountryFlag countryCode={baseLang.countryCode} flag={baseLang.flag} langCode={baseLang.code} size="xs" />
                  <span>{baseLang.name}</span>
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-400" /> Offline Ready
                </span>
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> {user.hearts ?? 5}/5 Hearts
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance flex items-center gap-2.5 flex-wrap">
                <span>Master</span>
                <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="md" />
                <span>{currentLang.name} with Stepping Stones & Friends</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Winding learning path, Match Madness frenzy, local friend circles, group chat, and daily streaks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('path');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
                  activeTab === 'path'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Learning Path</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('match');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
                  activeTab === 'match'
                    ? 'bg-amber-500 text-slate-900 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Match Blitz</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowLanguageModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Languages</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowShopModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-400/30 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Gem Shop</span>
              </button>

              <PWAInstallButton />
            </div>
          </div>
        </div>

        {/* Daily Streak Tracker Banner */}
        <StreakBanner
          user={user}
          onUseStreakFreeze={handleUseStreakFreeze}
          onOpenNotifications={() => setShowNotificationModal(true)}
        />

        {/* Active Tab View */}
        {activeTab === 'path' && (
          <LearningPath
            user={user}
            vocabList={vocabList}
            selectedLanguage={user.selectedLanguage}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onOpenShop={() => setShowShopModal(true)}
          />
        )}

        {activeTab === 'match' && (
          <MatchMadness
            vocabList={vocabList}
            selectedLanguage={user.selectedLanguage}
            baseLanguage={user.baseLanguage}
            user={user}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onOpenShop={() => setShowShopModal(true)}
          />
        )}

        {activeTab === 'vocab' && (
          <DailyVocabChallenge
            vocabList={vocabList}
            selectedLanguage={user.selectedLanguage}
            baseLanguage={user.baseLanguage}
            currentCefrLevel={user.currentCefrLevel}
            onChangeLevel={handleChangeLevel}
            onOpenLanguageSelector={() => setShowLanguageModal(true)}
            onUpdateVocab={handleUpdateVocab}
            onAddVocab={handleAddVocab}
            onCompleteDailyChallenge={handleCompleteDailyChallenge}
            todayCompleted={user.todayCompleted}
          />
        )}

        {activeTab === 'quiz' && (
          <PracticeQuiz
            vocabList={vocabList}
            selectedLanguage={user.selectedLanguage}
            baseLanguage={user.baseLanguage}
            currentCefrLevel={user.currentCefrLevel}
            user={user}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onUpdateVocab={handleUpdateVocab}
            onQuizComplete={handleQuizComplete}
            onOpenShop={() => setShowShopModal(true)}
          />
        )}

        {activeTab === 'squads' && (
          <StudyGroups
            user={user}
            groups={groups}
            vocabList={vocabList}
            onUpdateGroups={setGroups}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          />
        )}

        {activeTab === 'leaderboard' && (
          <SocialLeaderboard
            currentUser={user}
            leaderboardUsers={leaderboardUsers}
            groups={groups}
            vocabList={vocabList}
            onUpdateGroups={setGroups}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onAddFriend={handleAddFriend}
            onSendHighFive={handleSendHighFive}
          />
        )}

        {activeTab === 'stats' && (
          <RetentionStats
            user={user}
            vocabList={vocabList}
            achievements={achievements}
            onClaimAchievement={handleClaimAchievement}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">LinguaPulse</span>
            <span>·</span>
            <span>Duolingo Learning Path, Match Madness, Study Squads & Gamified Learning</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{SUPPORTED_LANGUAGES.length} World Languages</span>
            <span>·</span>
            <span>5 Hearts Life System</span>
            <span>·</span>
            <span>Friends Chat & Word Duels</span>
            <span>·</span>
            <span>100% Offline Access</span>
          </div>
        </div>
      </footer>

      {/* Push Notification Settings Modal */}
      {showNotificationModal && (
        <NotificationSettingsModal
          settings={user.notificationSettings}
          streakCount={user.streak}
          onUpdateSettings={(newSettings) =>
            setUser((prev) => ({ ...prev, notificationSettings: newSettings }))
          }
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {/* World Language & Level Selector Modal */}
      {showLanguageModal && (
        <LanguageSelectorModal
          baseLanguage={user.baseLanguage}
          selectedLanguage={user.selectedLanguage}
          currentCefrLevel={user.currentCefrLevel}
          onSaveSelection={handleSaveLanguageSelection}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Duolingo Gem Shop & Heart Refill Modal */}
      {showShopModal && (
        <DuolingoShopModal
          user={user}
          onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          onClose={() => setShowShopModal(false)}
          onStartPracticeToRefill={() => {
            setShowShopModal(false);
            setActiveTab('quiz');
          }}
        />
      )}

    </div>
  );
}
