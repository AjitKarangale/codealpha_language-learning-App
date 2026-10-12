import React from 'react';
import { Gem, Heart, Shield, Zap, Sparkles, X, Check, Flame } from 'lucide-react';
import { UserProfile } from '../types';
import { soundEffects } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';

interface DuolingoShopModalProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  onStartPracticeToRefill?: () => void;
}

export const DuolingoShopModal: React.FC<DuolingoShopModalProps> = ({
  user,
  onUpdateUser,
  onClose,
  onStartPracticeToRefill,
}) => {
  const handleBuyHeart = () => {
    if (user.gems < 50) {
      soundEffects.playError();
      return;
    }
    soundEffects.playSuccess();
    fireConfetti(800);
    onUpdateUser({
      gems: user.gems - 50,
      hearts: Math.min(user.maxHearts || 5, (user.hearts || 0) + 1)
    });
  };

  const handleBuyFullHearts = () => {
    if (user.gems < 150) {
      soundEffects.playError();
      return;
    }
    soundEffects.playSuccess();
    fireConfetti(1200);
    onUpdateUser({
      gems: user.gems - 150,
      hearts: user.maxHearts || 5
    });
  };

  const handleBuyStreakFreeze = () => {
    if (user.gems < 100) {
      soundEffects.playError();
      return;
    }
    soundEffects.playSuccess();
    fireConfetti(1000);
    onUpdateUser({
      gems: user.gems - 100,
      streakFreeze: user.streakFreeze + 1
    });
  };

  const handleBuyDoubleXp = () => {
    if (user.gems < 75) {
      soundEffects.playError();
      return;
    }
    soundEffects.playSuccess();
    fireConfetti(1200);
    onUpdateUser({
      gems: user.gems - 75,
      doubleXpMinutesLeft: (user.doubleXpMinutesLeft || 0) + 15
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-500">
              <Gem className="w-6 h-6 fill-sky-500 text-sky-500" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Duolingo Gem Shop & Power-Ups
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spend gems on hearts, streak freezes, and 2x XP potions!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold font-mono text-xs border border-sky-500/20">
              <Gem className="w-3.5 h-3.5 fill-sky-500" />
              <span>{user.gems} Gems</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Hearts Status Banner */}
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: user.maxHearts || 5 }).map((_, idx) => (
                <Heart
                  key={idx}
                  className={`w-6 h-6 ${
                    idx < (user.hearts ?? 5)
                      ? 'fill-rose-500 text-rose-500'
                      : 'fill-slate-200 text-slate-300 dark:fill-slate-800 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <div>
              <span className="font-bold text-xs text-rose-950 dark:text-rose-200 block">
                {user.hearts ?? 5} of {user.maxHearts ?? 5} Hearts
              </span>
              <span className="text-[11px] text-rose-700 dark:text-rose-300">
                Hearts keep you learning during tests & challenges!
              </span>
            </div>
          </div>

          {onStartPracticeToRefill && (
            <button
              onClick={() => {
                onClose();
                onStartPracticeToRefill();
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              Practice Free
            </button>
          )}
        </div>

        {/* Shop Items Grid */}
        <div className="space-y-3">
          
          {/* Item 1: Refill +1 Heart */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Refill +1 Heart
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Restore 1 heart immediately so you don't fail lessons.
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyHeart}
              disabled={user.gems < 50 || (user.hearts ?? 5) >= (user.maxHearts ?? 5)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Gem className="w-3.5 h-3.5 fill-white" />
              <span>50 Gems</span>
            </button>
          </div>

          {/* Item 2: Full Heart Refill */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Full Heart Shield</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">Best Value</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instantly restore all 5 hearts to maximum capacity.
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyFullHearts}
              disabled={user.gems < 150 || (user.hearts ?? 5) >= (user.maxHearts ?? 5)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Gem className="w-3.5 h-3.5 fill-white" />
              <span>150 Gems</span>
            </button>
          </div>

          {/* Item 3: Streak Freeze */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-sky-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Streak Freeze
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Protects your streak for 1 full missed day. (You have {user.streakFreeze})
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyStreakFreeze}
              disabled={user.gems < 100}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Gem className="w-3.5 h-3.5 fill-white" />
              <span>100 Gems</span>
            </button>
          </div>

          {/* Item 4: Double XP Boost Potion (15 mins) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  15-Min 2x XP Boost
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Earn double XP on every lesson, quiz & match game for 15 minutes!
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyDoubleXp}
              disabled={user.gems < 75}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Gem className="w-3.5 h-3.5 fill-white" />
              <span>75 Gems</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
