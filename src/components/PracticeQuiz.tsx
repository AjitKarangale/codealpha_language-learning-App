import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Zap, Sparkles, Trophy, Brain, Layers, Heart, AlertCircle, Gem } from 'lucide-react';
import { VocabItem, QuizQuestion, LanguageCode, CEFRLevel, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from '../data/languages';
import { generateQuizForLanguage } from '../utils/quizGenerator';
import { soundEffects, speakWord } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CountryFlag } from './CountryFlag';

interface PracticeQuizProps {
  vocabList: VocabItem[];
  selectedLanguage: LanguageCode;
  baseLanguage: LanguageCode;
  currentCefrLevel: CEFRLevel;
  user?: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onUpdateVocab: (updated: VocabItem) => void;
  onQuizComplete: (score: number, totalQuestions: number, xpEarned: number) => void;
  onOpenShop?: () => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({
  vocabList,
  selectedLanguage,
  baseLanguage,
  currentCefrLevel,
  user,
  onUpdateUser,
  onUpdateVocab,
  onQuizComplete,
  onOpenShop,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const baseLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === baseLanguage) || SUPPORTED_LANGUAGES[0];

  const [quizLevelFilter, setQuizLevelFilter] = useState<CEFRLevel | 'all'>(currentCefrLevel);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Sentence builder tile state
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Initialize questions
  const initQuiz = () => {
    const lvlFilter = quizLevelFilter === 'all' ? undefined : quizLevelFilter;
    const generated = generateQuizForLanguage(vocabList, selectedLanguage, baseLanguage, lvlFilter, 5);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setPlacedWords([]);
    setAvailableWords(generated[0]?.scrambledWords || []);
    setIsAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setCombo(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    initQuiz();
  }, [selectedLanguage, baseLanguage, quizLevelFilter, vocabList]);

  const currentQ = questions[currentIndex];

  // Update scrambled words when question changes
  useEffect(() => {
    if (currentQ && currentQ.type === 'sentence-build') {
      setPlacedWords([]);
      setAvailableWords(currentQ.scrambledWords || []);
    }
  }, [currentIndex, currentQ]);

  // Handle Speech playback
  const handlePlayAudio = (text: string) => {
    soundEffects.playClick();
    speakWord(text, currentLang.speechLang);
  };

  // Multiple Choice / Listening / Translation choice check
  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const right = idx === currentQ.correctOptionIndex;
    setIsCorrect(right);

    if (right) {
      soundEffects.playSuccess();
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      updateVocabRetention(currentQ.vocabId, true);
    } else {
      soundEffects.playError();
      setCombo(0);
      updateVocabRetention(currentQ.vocabId, false);
      if (user && onUpdateUser) {
        onUpdateUser({ hearts: Math.max(0, (user.hearts ?? 5) - 1) });
      }
    }
  };

  // Sentence Builder tile click
  const handleAddWordTile = (word: string, index: number) => {
    if (isAnswered) return;
    soundEffects.playClick();
    setPlacedWords([...placedWords, word]);
    const nextAvailable = [...availableWords];
    nextAvailable.splice(index, 1);
    setAvailableWords(nextAvailable);
  };

  const handleRemoveWordTile = (word: string, index: number) => {
    if (isAnswered) return;
    soundEffects.playClick();
    const nextPlaced = [...placedWords];
    nextPlaced.splice(index, 1);
    setPlacedWords(nextPlaced);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheckSentence = () => {
    if (isAnswered || !currentQ) return;
    setIsAnswered(true);

    const assembled = placedWords.join(' ').trim().toLowerCase();
    const expected = (currentQ.correctSentence || '').trim().toLowerCase();

    const right = assembled === expected;
    setIsCorrect(right);

    if (right) {
      soundEffects.playSuccess();
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      updateVocabRetention(currentQ.vocabId, true);
    } else {
      soundEffects.playError();
      setCombo(0);
      updateVocabRetention(currentQ.vocabId, false);
      if (user && onUpdateUser) {
        onUpdateUser({ hearts: Math.max(0, (user.hearts ?? 5) - 1) });
      }
    }
  };

  // Update Leitner box and retention in DB
  const updateVocabRetention = (vocabId: string, success: boolean) => {
    const item = vocabList.find((v) => v.id === vocabId);
    if (!item) return;

    const newBox = success ? Math.min(5, item.box + 1) : Math.max(1, item.box - 1);
    const updated: VocabItem = {
      ...item,
      box: newBox as 1 | 2 | 3 | 4 | 5,
      reviewCount: item.reviewCount + 1,
      retentionScore: Math.min(100, Math.max(10, item.retentionScore + (success ? 15 : -15))),
      lastReviewed: new Date().toISOString()
    };
    onUpdateVocab(updated);
  };

  // Next question
  const handleNext = () => {
    soundEffects.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      const total = questions.length;
      const finalCorrect = correctCount + (isCorrect ? 0 : 0);
      const earnedXp = finalCorrect * 10 + (finalCorrect === total ? 25 : 0);

      setQuizFinished(true);
      if (finalCorrect >= total * 0.7) {
        fireConfetti();
        soundEffects.playFanfare();
      }
      onQuizComplete(finalCorrect, total, earnedXp);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto p-6">
        <Brain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Not Enough Vocabulary for This Level
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1 flex-wrap">
          <span>Switch to &ldquo;All Levels&rdquo; or add new words for</span>
          <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
          <span>{currentLang.name}.</span>
        </p>
        <button
          onClick={() => setQuizLevelFilter('all')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
        >
          Practice All Levels
        </button>
      </div>
    );
  }

  // Quiz summary screen
  if (quizFinished) {
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const earnedXp = correctCount * 10 + (correctCount === questions.length ? 25 : 0);

    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 mb-5">
          <Trophy className="h-10 w-10 fill-white/80" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Practice Test Complete!
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
          <span>Reinforced retention in</span>
          <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
          <span>{currentLang.name} · Explained in</span>
          <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
          <span>{baseLangObj.name}</span>
        </p>

        {/* Score & XP Cards */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Accuracy
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {scorePct}%
            </div>
            <span className="text-[11px] text-slate-500">
              {correctCount} of {questions.length} correct
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              XP Earned
            </span>
            <div className="text-2xl font-bold font-mono text-amber-500 mt-0.5">
              +{earnedXp} XP
            </div>
            <span className="text-[11px] text-slate-500">
              {correctCount === questions.length ? 'Perfect combo bonus!' : 'Daily practice bonus'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              soundEffects.playClick();
              initQuiz();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Round</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      
      {/* Top Quiz Level Strip & Language pair info */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
            <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
            <span>{currentLang.name}</span>
            <span className="text-slate-400">➔</span>
            <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
            <span>{baseLangObj.name}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Level:
          </span>
          <button
            onClick={() => {
              soundEffects.playClick();
              setQuizLevelFilter('all');
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              quizLevelFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All
          </button>
          {CEFR_LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                soundEffects.playClick();
                setQuizLevelFilter(lvl.id);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                quizLevelFilter === lvl.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Top Quiz Header: Progress bar, Heart Counter & Combo Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            {user && (
              <button
                type="button"
                onClick={onOpenShop}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs border border-rose-500/20 hover:scale-105 transition-transform"
                title="Hearts remaining - click to refill with gems"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{user.hearts ?? 5} / {user.maxHearts ?? 5}</span>
              </button>
            )}
            {combo > 1 && (
              <span className="flex items-center gap-1 font-bold text-amber-500 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-500" /> {combo}x Combo!
              </span>
            )}
            <span className="font-mono">{Math.round(((currentIndex) / questions.length) * 100)}%</span>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Out of Hearts Warning Alert (Duolingo Style) */}
      {user && (user.hearts ?? 5) <= 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0" />
            <span><strong>You're out of hearts!</strong> Practicing now is in Free Practice mode.</span>
          </div>
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500 shadow-xs"
            >
              Refill Hearts
            </button>
          )}
        </div>
      )}

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        
        {/* Question Prompt */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
            {currentQ.type === 'sentence-build'
              ? 'Sentence Construction'
              : currentQ.type === 'listening'
              ? 'Listening Comprehension'
              : 'Memory Recall'}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {currentQ.prompt}
          </h2>

          {/* Sub-prompt */}
          {currentQ.subPrompt && (
            <div className="mt-3 flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              {currentQ.audioText && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(currentQ.audioText!)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:scale-105 transition-transform"
                    title="Normal Speed Audio"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => speakWord(currentQ.audioText!, currentLang.speechLang, 0.5)}
                    className="flex h-10 px-2.5 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform text-xs font-bold gap-1"
                    title="Turtle Slow Audio (Duolingo signature feature)"
                  >
                    <span className="text-sm">🐢</span>
                    <span>Slow</span>
                  </button>
                </div>
              )}
              <span className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100">
                {currentQ.subPrompt}
              </span>
            </div>
          )}
        </div>

        {/* FORMAT 1, 3, 4: Multiple Choice / Audio Options / Reverse Translation */}
        {currentQ.options && currentQ.options.length > 0 && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isRightOption = idx === currentQ.correctOptionIndex;

              let btnClass = 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200';

              if (isAnswered) {
                if (isRightOption) {
                  btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isRightOption) {
                  btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
                } else {
                  btnClass = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isRightOption && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isRightOption && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* FORMAT 2: Sentence Builder with Interactive Tiles */}
        {currentQ.type === 'sentence-build' && (
          <div className="space-y-5">
            {/* Placed Words Tray */}
            <div className="min-h-[64px] p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap gap-2 items-center">
              {placedWords.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  Tap word tiles below in the correct sentence order...
                </span>
              ) : (
                placedWords.map((word, idx) => (
                  <button
                    key={`placed-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handleRemoveWordTile(word, idx)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs sm:text-sm hover:bg-emerald-500 transition-colors shadow-xs"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Available Word Tiles */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {availableWords.map((word, idx) => (
                <button
                  key={`avail-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleAddWordTile(word, idx)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shadow-xs"
                >
                  {word}
                </button>
              ))}
            </div>

            {!isAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  disabled={placedWords.length === 0}
                  onClick={handleCheckSentence}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
                >
                  Check Sentence
                </button>
              </div>
            )}
          </div>
        )}

        {/* Immediate Explanatory Feedback */}
        {isAnswered && (
          <div className={`mt-6 p-4 rounded-xl border ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm flex items-center gap-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Correct! +10 XP
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Not quite right
                  </>
                )}
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs mt-1 opacity-90 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
