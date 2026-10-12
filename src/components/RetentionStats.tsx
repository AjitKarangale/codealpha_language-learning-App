import React from 'react';
import { Brain, Award, TrendingUp, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { VocabItem, UserProfile, Achievement } from '../types';
import { soundEffects } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';

interface RetentionStatsProps {
  user: UserProfile;
  vocabList: VocabItem[];
  achievements: Achievement[];
  onClaimAchievement: (id: string, rewardGems: number) => void;
}

export const RetentionStats: React.FC<RetentionStatsProps> = ({
  user,
  vocabList,
  achievements,
  onClaimAchievement,
}) => {
  // Compute memory metrics
  const totalWords = vocabList.length;
  const masteredWords = vocabList.filter((v) => v.box >= 4).length;
  const avgRetention = Math.round(
    vocabList.reduce((acc, v) => acc + v.retentionScore, 0) / (totalWords || 1)
  );

  // Leitner box counts
  const boxCounts = [1, 2, 3, 4, 5].map((boxNum) => ({
    box: boxNum,
    count: vocabList.filter((v) => v.box === boxNum).length,
    label:
      boxNum === 1
        ? 'Box 1: Novice (Daily)'
        : boxNum === 2
        ? 'Box 2: Learning (3 Days)'
        : boxNum === 3
        ? 'Box 3: Strengthening (1 Wk)'
        : boxNum === 4
        ? 'Box 4: Established (2 Wks)'
        : 'Box 5: Mastered (Permanent)'
  }));

  const handleClaim = (ach: Achievement) => {
    soundEffects.playSuccess();
    fireConfetti(1000);
    onClaimAchievement(ach.id, ach.rewardGems);
  };

  return (
    <div className="space-y-6">
      
      {/* Retention Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Retention Index
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {avgRetention}%
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Based on the Leitner spaced repetition interval model.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Mastered Words
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {masteredWords} <span className="text-xs text-slate-400 font-normal">/ {totalWords}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Reaching Box 4 & 5 consolidates long-term fluency.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Learning Velocity
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                +4.2 <span className="text-xs text-slate-400 font-normal">words/day</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Pacing optimized to prevent memory decay.
          </p>
        </div>

      </div>

      {/* Leitner Spaced-Repetition Distribution */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
          Leitner Memory Consolidation Pyramid
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Words graduate to higher boxes with each successful quiz, increasing intervals between reviews.
        </p>

        <div className="space-y-3">
          {boxCounts.map((item) => {
            const pct = Math.round((item.count / (totalWords || 1)) * 100);

            return (
              <div key={item.box} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {item.count} words ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.box === 5
                        ? 'bg-emerald-500'
                        : item.box === 4
                        ? 'bg-teal-500'
                        : item.box === 3
                        ? 'bg-sky-500'
                        : item.box === 2
                        ? 'bg-amber-500'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${Math.max(item.count > 0 ? 8 : 0, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ebbinghaus Forgetting Curve Simulation Visualizer */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              The Forgetting Curve vs Daily Streaks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Without review, humans forget 70% of new vocabulary in 24 hours. Daily practice resets retention to 100%.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            Active Streak: {user.streak} Days
          </span>
        </div>

        {/* Visual Retention Curve Chart */}
        <div className="relative h-44 w-full border-b border-l border-slate-200 dark:border-slate-800 p-2">
          {/* Grid lines */}
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-100 dark:border-slate-800/60" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100 dark:border-slate-800/60" />

          {/* SVG Curves */}
          <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
            {/* Unreviewed Decay Curve (Red dashed) */}
            <path
              d="M 10 10 Q 70 80 150 100 T 490 115"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Spaced Review Curve (Emerald solid: Resets each day!) */}
            <path
              d="M 10 10 Q 40 45 70 50 L 70 15 Q 120 40 160 45 L 160 15 Q 240 35 300 40 L 300 15 Q 400 25 490 28"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
            />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 right-4 flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-2 w-4 rounded-full bg-emerald-500 inline-block" /> With LinguaPulse Spaced Review
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="h-2 w-4 rounded-full border border-dashed border-rose-500 inline-block" /> Without Daily Practice
            </span>
          </div>
        </div>
      </div>

      {/* Gamification Achievements Section */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
          Milestones & Achievements
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Unlock badges and earn gems to redeem streak freeze power-ups.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const canClaim = ach.progress >= ach.maxProgress && !ach.unlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaim(ach)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-400 shadow-xs animate-bounce"
                    >
                      +{ach.rewardGems} Gems
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {!ach.unlocked && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
