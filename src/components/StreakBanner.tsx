import React from 'react';
import { Flame, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { getPast7Days } from '../utils/storage';
import { soundEffects } from '../utils/audio';

interface StreakBannerProps {
  user: UserProfile;
  onUseStreakFreeze: () => void;
  onOpenNotifications: () => void;
}

export const StreakBanner: React.FC<StreakBannerProps> = ({
  user,
  onUseStreakFreeze,
  onOpenNotifications,
}) => {
  const past7Days = getPast7Days();
  const todayProgressPercent = Math.min(100, Math.round((user.todayXp / user.dailyGoalXp) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 p-5 shadow-xs transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Streak Flame & Motivation */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
            <Flame className="h-8 w-8 fill-white/90 animate-bounce" />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                <span className="tabular-nums font-mono">{user.streak}</span> Day Streak!
              </h2>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Personal best: {user.bestStreak}d
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {user.todayCompleted
                ? 'Streak secured for today! Amazing dedication.'
                : 'Complete 1 daily lesson or practice quiz today to keep your streak burning.'}
            </p>
          </div>
        </div>

        {/* Center: 7-Day Calendar Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {past7Days.map((item, idx) => {
            const isCompleted = !!user.streakHistory[item.date] || (idx === past7Days.length - 1 && user.todayCompleted);
            const isToday = idx === past7Days.length - 1;

            return (
              <div key={item.date} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {item.short}
                </span>
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                      : isToday
                      ? 'border-2 border-dashed border-amber-500/80 text-amber-600 dark:text-amber-400 bg-amber-500/5'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                  title={`${item.dayName}: ${isCompleted ? 'Completed' : 'Pending'}`}
                >
                  {isCompleted ? (
                    <Flame className="w-4 h-4 fill-white" />
                  ) : (
                    <span>{item.date.split('-')[2]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Daily Goal & Streak Protection */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
          {/* XP Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-500" /> Daily Goal
              </span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                {user.todayXp} / {user.dailyGoalXp} XP
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${todayProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Streak Freeze & Reminder Button */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <button
              onClick={() => {
                soundEffects.playClick();
                onUseStreakFreeze();
              }}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              title="Streak Freeze saves your streak if you miss a day"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>{user.streakFreeze} Freezes</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenNotifications();
              }}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              <span>Set Reminder</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
