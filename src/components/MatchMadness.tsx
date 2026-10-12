import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Timer, Trophy, Sparkles, RotateCcw, Volume2, ArrowRight, Heart, Star, CheckCircle2 } from 'lucide-react';
import { VocabItem, LanguageCode, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundEffects, speakWord } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CountryFlag } from './CountryFlag';

interface MatchMadnessProps {
  vocabList: VocabItem[];
  selectedLanguage: LanguageCode;
  baseLanguage: LanguageCode;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenShop?: () => void;
}

interface MatchCard {
  id: string;
  text: string;
  pairId: string;
  side: 'target' | 'base';
  isMatched: boolean;
}

export const MatchMadness: React.FC<MatchMadnessProps> = ({
  vocabList,
  selectedLanguage,
  baseLanguage,
  user,
  onUpdateUser,
  onOpenShop,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const baseLang = SUPPORTED_LANGUAGES.find((l) => l.code === baseLanguage) || SUPPORTED_LANGUAGES[0];

  const langVocabs = useMemo(() => {
    const filtered = vocabList.filter((v) => v.language === selectedLanguage);
    return filtered.length >= 5 ? filtered : vocabList;
  }, [vocabList, selectedLanguage]);

  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);

  // Cards
  const [targetCards, setTargetCards] = useState<MatchCard[]>([]);
  const [baseCards, setBaseCards] = useState<MatchCard[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [shakeTargetId, setShakeTargetId] = useState<string | null>(null);
  const [shakeBaseId, setShakeBaseId] = useState<string | null>(null);

  // Setup round cards
  const initRound = () => {
    // Pick 6 random vocab items
    const shuffledVocab = [...langVocabs].sort(() => Math.random() - 0.5).slice(0, 6);

    const targets: MatchCard[] = shuffledVocab.map((v) => ({
      id: `target-${v.id}`,
      text: v.word,
      pairId: v.id,
      side: 'target' as const,
      isMatched: false
    })).sort(() => Math.random() - 0.5);

    const bases: MatchCard[] = shuffledVocab.map((v) => ({
      id: `base-${v.id}`,
      text: v.translation,
      pairId: v.id,
      side: 'base' as const,
      isMatched: false
    })).sort(() => Math.random() - 0.5);

    setTargetCards(targets);
    setBaseCards(bases);
    setSelectedTargetId(null);
    setSelectedBaseId(null);
  };

  const startGame = () => {
    soundEffects.playClick();
    setTimeLeft(60);
    setMatchedPairsCount(0);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setGameOver(false);
    setGameActive(true);
    initRound();
  };

  // Timer countdown
  useEffect(() => {
    if (!gameActive || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setGameActive(false);
      soundEffects.playFanfare();
      fireConfetti(1500);

      // Payout rewards
      const earnedXp = Math.max(15, matchedPairsCount * 8 + (combo > 4 ? 20 : 0));
      const earnedGems = matchedPairsCount >= 5 ? 15 : 5;
      onUpdateUser({
        xp: user.xp + earnedXp,
        gems: user.gems + earnedGems,
        wordsLearned: user.wordsLearned + Math.min(3, Math.floor(matchedPairsCount / 2))
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, gameOver, timeLeft, matchedPairsCount, combo]);

  // Check matching pair
  const checkPair = (tId: string, bId: string) => {
    const targetCard = targetCards.find((c) => c.id === tId);
    const baseCard = baseCards.find((c) => c.id === bId);

    if (!targetCard || !baseCard) return;

    if (targetCard.pairId === baseCard.pairId) {
      // MATCH SUCCESS
      soundEffects.playSuccess();
      speakWord(targetCard.text, currentLang.speechLang);

      const nextCount = matchedPairsCount + 1;
      const nextCombo = combo + 1;
      setMatchedPairsCount(nextCount);
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setScore((s) => s + 10 * Math.max(1, nextCombo));

      // Mark matched
      setTargetCards((prev) =>
        prev.map((c) => (c.id === tId ? { ...c, isMatched: true } : c))
      );
      setBaseCards((prev) =>
        prev.map((c) => (c.id === bId ? { ...c, isMatched: true } : c))
      );

      setSelectedTargetId(null);
      setSelectedBaseId(null);

      // If all matched, spawn next fresh set!
      const remaining = targetCards.filter((c) => c.id !== tId && !c.isMatched);
      if (remaining.length === 0) {
        fireConfetti(600);
        setTimeout(initRound, 400);
      }
    } else {
      // WRONG MATCH
      soundEffects.playError();
      setShakeTargetId(tId);
      setShakeBaseId(bId);
      setCombo(0);

      setTimeout(() => {
        setShakeTargetId(null);
        setShakeBaseId(null);
        setSelectedTargetId(null);
        setSelectedBaseId(null);
      }, 500);
    }
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) return;
    soundEffects.playClick();

    if (card.side === 'target') {
      setSelectedTargetId(card.id);
      if (selectedBaseId) {
        checkPair(card.id, selectedBaseId);
      }
    } else {
      setSelectedBaseId(card.id);
      if (selectedTargetId) {
        checkPair(selectedTargetId, card.id);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      
      {/* Top Banner: Mode header & Stats */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25">
              <Zap className="h-7 w-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-500">
                  Duolingo Fast-Paced Frenzy
                </span>
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                  <span>{currentLang.name}</span>
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Match Madness · Word Pairs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap">
                <span>Tap the matching pair between</span>
                <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                <span>{currentLang.name} and</span>
                <CountryFlag countryCode={baseLang.countryCode} flag={baseLang.flag} langCode={baseLang.code} size="xs" />
                <span>{baseLang.name} before time runs out!</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {gameActive && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
                <Timer className="w-4 h-4 animate-spin" />
                <span>{timeLeft}s</span>
              </div>
            )}

            {!gameActive && !gameOver && (
              <button
                onClick={startGame}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Start Match Blitz</span>
              </button>
            )}
          </div>

        </div>

        {/* Live Score & Combo Meter */}
        {gameActive && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-500">
                Matched: <strong className="text-slate-900 dark:text-white font-mono text-sm">{matchedPairsCount} pairs</strong>
              </span>
              <span className="font-semibold text-slate-500">
                Score: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{score}</strong>
              </span>
            </div>

            {combo > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-900 font-black text-xs animate-bounce shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
                <span>{combo}x COMBO!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= ACTIVE PLAYING BOARD ================= */}
      {gameActive && !gameOver && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Target Language Column */}
            <div className="space-y-2.5">
              <div className="text-center pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1">
                  <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                  <span>{currentLang.name}</span>
                </span>
              </div>
              {targetCards.map((card) => {
                const isSelected = selectedTargetId === card.id;
                const isShaking = shakeTargetId === card.id;

                if (card.isMatched) {
                  return (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-center text-xs font-semibold opacity-40 select-none"
                    >
                      ✓ {card.text}
                    </div>
                  );
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold border transition-all duration-150 flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500 scale-[1.02]'
                        : isShaking
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 animate-shake'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                    }`}
                  >
                    <span>{card.text}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(card.text, currentLang.speechLang);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-500"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </button>
                );
              })}
            </div>

            {/* Base Language Column */}
            <div className="space-y-2.5">
              <div className="text-center pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1">
                  <CountryFlag countryCode={baseLang.countryCode} flag={baseLang.flag} langCode={baseLang.code} size="xs" />
                  <span>{baseLang.name}</span>
                </span>
              </div>
              {baseCards.map((card) => {
                const isSelected = selectedBaseId === card.id;
                const isShaking = shakeBaseId === card.id;

                if (card.isMatched) {
                  return (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-center text-xs font-semibold opacity-40 select-none"
                    >
                      ✓ {card.text}
                    </div>
                  );
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold border transition-all duration-150 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500 scale-[1.02]'
                        : isShaking
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 animate-shake'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                    }`}
                  >
                    {card.text}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ================= GAME SUMMARY SCREEN ================= */}
      {gameOver && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-8 text-center shadow-lg space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/25">
            <Trophy className="h-10 w-10 fill-white" />
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Match Madness Complete!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Incredible reflexes! You matched words like a native polyglot.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pairs Matched</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {matchedPairsCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Highest Combo</span>
              <div className="text-2xl font-black font-mono text-amber-500 mt-0.5">
                {maxCombo}x
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">XP & Gems</span>
              <div className="text-2xl font-black font-mono text-sky-500 mt-0.5">
                +{matchedPairsCount * 8} XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Round</span>
            </button>

            {onOpenShop && (
              <button
                onClick={onOpenShop}
                className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
              >
                Visit Gem Shop
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= INTRO EXPLANATION CARD (WHEN IDLE) ================= */}
      {!gameActive && !gameOver && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>How Match Madness Works:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">1. Tap Pairs</strong>
              Select the word on the left and tap its translation on the right.
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">2. Build Combos</strong>
              Consecutive correct matches give 2x, 3x, and 5x multiplier points!
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">3. Earn Gems & XP</strong>
              Clear multiple rounds before the 60-second timer expires to win bonus gems.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
