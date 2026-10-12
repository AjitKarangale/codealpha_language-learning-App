import React from 'react';
import { Flame, Gem, Bell, Moon, Sun, Globe, Heart, Zap, MapPin, Sparkles, Store } from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundEffects } from '../utils/audio';
import { CountryFlag } from './CountryFlag';

export type AppTab = 'path' | 'match' | 'vocab' | 'quiz' | 'squads' | 'leaderboard' | 'stats';

interface NavbarProps {
  user: UserProfile;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  openNotificationModal: () => void;
  openLanguageSelectorModal: () => void;
  openShopModal: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  isDark,
  toggleDarkMode,
  openNotificationModal,
  openLanguageSelectorModal,
  openShopModal,
  onSelectLanguage,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === user.selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const baseLang = SUPPORTED_LANGUAGES.find((l) => l.code === user.baseLanguage) || SUPPORTED_LANGUAGES[0];

  const handleTabClick = (tab: AppTab) => {
    soundEffects.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Wordmark Brand with Duo mascot */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleTabClick('path')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/20 overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/src/assets/images/mascot_owl_badge_1791732878866.jpg"
                alt="LinguaPulse Mascot"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Lingua<span className="text-emerald-500">Pulse</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => handleTabClick('path')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'path'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Learning Path</span>
          </button>

          <button
            onClick={() => handleTabClick('match')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'match'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Match Blitz</span>
          </button>

          <button
            onClick={() => handleTabClick('vocab')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'vocab'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Daily Vocab
          </button>

          <button
            onClick={() => handleTabClick('quiz')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Practice Quiz
          </button>

          <button
            onClick={() => handleTabClick('leaderboard')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Ranks & Friends
          </button>

          <button
            onClick={() => handleTabClick('squads')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'squads'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Squads & Chat
          </button>

          <button
            onClick={() => handleTabClick('stats')}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'stats'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Stats
          </button>
        </nav>

        {/* Zone 3: Gamification Metrics & Duolingo Hearts */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* World Language & Level Trigger Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              openLanguageSelectorModal();
            }}
            aria-label="Select Language and Level"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={`Learning ${currentLang.name} (${user.currentCefrLevel}) with ${baseLang.name}`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
            <span className="hidden sm:inline font-bold">{currentLang.name}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              {user.currentCefrLevel}
            </span>
          </button>

          {/* Daily Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            title={`${user.streak} Day Learning Streak`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-bold font-mono tabular-nums">{user.streak}d</span>
          </div>

          {/* DUOLINGO HEARTS SYSTEM */}
          <button
            onClick={() => {
              soundEffects.playClick();
              openShopModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:scale-105 transition-transform"
            title="Duolingo Hearts - Click to refill"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span className="text-xs font-bold font-mono tabular-nums">{user.hearts ?? 5}</span>
          </button>

          {/* Gems Counter */}
          <button
            onClick={() => {
              soundEffects.playClick();
              openShopModal();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:scale-105 transition-transform"
            title={`${user.gems} Gems - Click to open shop`}
          >
            <Gem className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
            <span className="text-xs font-bold font-mono tabular-nums">{user.gems}</span>
          </button>

          {/* Double XP Lightning Pill if active */}
          {(user.doubleXpMinutesLeft || 0) > 0 && (
            <div
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-400 text-slate-900 text-[11px] font-black animate-pulse"
              title="Double XP Active!"
            >
              <Zap className="w-3 h-3 fill-slate-900" />
              <span>2x XP</span>
            </div>
          )}

          {/* Gem Shop Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              openShopModal();
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Open Gem Shop"
          >
            <Store className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Push Notification Reminders Trigger */}
          <button
            onClick={() => {
              soundEffects.playClick();
              openNotificationModal();
            }}
            aria-label="Notification Settings"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Lesson Reminders & Push Notifications"
          >
            <Bell className="w-4 h-4" />
            {!user.todayCompleted && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              toggleDarkMode();
            }}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 justify-around bg-slate-50 dark:bg-slate-900/50 overflow-x-auto text-[11px] font-bold">
        <button
          onClick={() => handleTabClick('path')}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'path'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>Path</span>
        </button>
        <button
          onClick={() => handleTabClick('match')}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'match'
              ? 'bg-amber-500 text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>Match</span>
        </button>
        <button
          onClick={() => handleTabClick('vocab')}
          className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'vocab'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Vocab
        </button>
        <button
          onClick={() => handleTabClick('quiz')}
          className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => handleTabClick('leaderboard')}
          className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Ranks
        </button>
        <button
          onClick={() => handleTabClick('squads')}
          className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'squads'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Squads
        </button>
        <button
          onClick={() => handleTabClick('stats')}
          className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Stats
        </button>
      </div>
    </header>
  );
};
