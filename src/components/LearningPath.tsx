import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Lock,
  Check,
  Sparkles,
  Zap,
  Gift,
  Heart,
  Volume2,
  ArrowRight,
  BookOpen,
  Star,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';
import { LearningPathNode, UserProfile, LanguageCode, VocabItem } from '../types';
import { DUOLINGO_LEARNING_PATH, DUO_OWL_TIPS } from '../data/learningPath';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundEffects, speakWord } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CountryFlag } from './CountryFlag';

interface LearningPathProps {
  user: UserProfile;
  vocabList: VocabItem[];
  selectedLanguage: LanguageCode;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenShop?: () => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  user,
  vocabList,
  selectedLanguage,
  onUpdateUser,
  onOpenShop,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const [nodes, setNodes] = useState<LearningPathNode[]>(() => {
    return DUOLINGO_LEARNING_PATH.map((n) => ({
      ...n,
      completed: user.completedPathNodes?.includes(n.id) ?? n.completed
    }));
  });

  const [activeModalNode, setActiveModalNode] = useState<LearningPathNode | null>(null);
  const [activeLessonStep, setActiveLessonStep] = useState<number>(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [lessonAnswered, setLessonAnswered] = useState(false);
  const [lessonIsCorrect, setLessonIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [duoTipIndex, setDuoTipIndex] = useState(0);

  // Group nodes by Unit
  const units = [
    {
      unitId: 1,
      title: 'Unit 1: First Steps & Greetings',
      desc: 'Master basic introductions, politeness, and greetings.',
      color: 'from-emerald-500 to-teal-600',
      nodes: nodes.filter((n) => n.unitId === 1)
    },
    {
      unitId: 2,
      title: 'Unit 2: Dining Out & Tapas',
      desc: 'Order food, ask for the check, and describe tastes.',
      color: 'from-amber-500 to-orange-600',
      nodes: nodes.filter((n) => n.unitId === 2)
    },
    {
      unitId: 3,
      title: 'Unit 3: Travel, Trains & Streets',
      desc: 'Ask for directions, buy tickets, and travel abroad.',
      color: 'from-blue-500 to-indigo-600',
      nodes: nodes.filter((n) => n.unitId === 3)
    }
  ];

  // Handle clicking on a node
  const handleNodeClick = (node: LearningPathNode) => {
    soundEffects.playClick();
    if (node.locked) {
      soundEffects.playError();
      return;
    }

    if (node.type === 'chest') {
      if (node.completed) return;
      // Claim chest reward
      soundEffects.playFanfare();
      fireConfetti(1200);
      const nextCompleted = [...(user.completedPathNodes || []), node.id];
      onUpdateUser({
        gems: user.gems + (node.gemReward || 25),
        xp: user.xp + node.xpReward,
        completedPathNodes: nextCompleted
      });
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, completed: true } : n))
      );
      return;
    }

    // Open lesson modal
    setActiveModalNode(node);
    setActiveLessonStep(0);
    setLessonFinished(false);
    setLessonAnswered(false);
    setSelectedOption(null);
  };

  // Sample interactive lesson questions for the active node
  const lessonQuestions = [
    {
      prompt: `How do you say "Hello" in ${currentLang.name}?`,
      options: ['Hola / Bonjour', 'Adiós', 'Por favor', 'Gracias'],
      correct: 0
    },
    {
      prompt: `Which word means "Thank you very much"?`,
      options: ['De nada', 'Muchas gracias / Merci', 'Hasta luego', 'Buenos días'],
      correct: 1
    },
    {
      prompt: `Choose the correct polite phrase for "Please":`,
      options: ['Disculpe', 'Perdón', 'Por favor / S\'il vous plaît', 'Lo siento'],
      correct: 2
    }
  ];

  const currentQ = lessonQuestions[activeLessonStep % lessonQuestions.length];

  const handleSelectOption = (idx: number) => {
    if (lessonAnswered) return;
    soundEffects.playClick();
    setSelectedOption(idx);
    setLessonAnswered(true);

    const right = idx === currentQ.correct;
    setLessonIsCorrect(right);

    if (right) {
      soundEffects.playSuccess();
      fireConfetti(600);
    } else {
      soundEffects.playError();
      // Duolingo Heart deduction!
      const currentHearts = user.hearts ?? 5;
      const nextHearts = Math.max(0, currentHearts - 1);
      onUpdateUser({ hearts: nextHearts });
    }
  };

  const handleNextStep = () => {
    soundEffects.playClick();
    if (activeLessonStep < lessonQuestions.length - 1) {
      setActiveLessonStep((s) => s + 1);
      setLessonAnswered(false);
      setSelectedOption(null);
    } else {
      // Completed lesson!
      soundEffects.playFanfare();
      fireConfetti(1500);
      setLessonFinished(true);

      if (activeModalNode) {
        const nextCompleted = Array.from(new Set([...(user.completedPathNodes || []), activeModalNode.id]));
        onUpdateUser({
          xp: user.xp + activeModalNode.xpReward,
          gems: user.gems + (activeModalNode.gemReward || 10),
          wordsLearned: user.wordsLearned + 4,
          completedPathNodes: nextCompleted
        });
        setNodes((prev) =>
          prev.map((n) =>
            n.id === activeModalNode.id
              ? { ...n, completed: true, crowns: Math.min(n.maxCrowns, n.crowns + 1) }
              : n
          )
        );
      }
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 relative pb-16">
      
      {/* ================= DUO MASCOT MOTIVATION WIDGET ================= */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/src/assets/images/mascot_owl_badge_1791732878866.jpg"
                alt="Duo Owl Mascot"
                className="h-full w-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Duo's Daily Motivation
              </span>
              <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                <span>{currentLang.name} Path</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              "{DUO_OWL_TIPS[duoTipIndex].text}"
            </p>
          </div>
        </div>

        <button
          onClick={() => setDuoTipIndex((i) => (i + 1) % DUO_OWL_TIPS.length)}
          className="text-slate-400 hover:text-emerald-500 text-xs font-bold p-1 shrink-0"
          title="Next Duo Tip"
        >
          Next ➜
        </button>
      </div>

      {/* ================= LEARNING UNITS & WINDING STEPPING STONES ================= */}
      {units.map((unit) => (
        <div key={unit.unitId} className="space-y-6">
          
          {/* Unit Header Card */}
          <div className={`rounded-3xl bg-gradient-to-r ${unit.color} text-white p-6 shadow-md shadow-emerald-500/10 flex items-center justify-between gap-4`}>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
                <Crown className="w-4 h-4 fill-white" />
                <span>Section 1 · {unit.title.split(':')[0]}</span>
              </div>
              <h2 className="font-display text-xl font-black text-white mt-1">
                {unit.title.split(':')[1]?.trim() || unit.title}
              </h2>
              <p className="text-xs text-white/90 mt-1">
                {unit.desc}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xs text-white shrink-0">
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-0.5">UNIT {unit.unitId}</span>
            </div>
          </div>

          {/* Stepping Stones Snake Path (sinusoidal offsets) */}
          <div className="flex flex-col items-center space-y-6 py-4">
            {unit.nodes.map((node, idx) => {
              // Calculate offset (center, left, center, right)
              const offsets = [
                'translate-x-0',
                '-translate-x-12',
                'translate-x-0',
                'translate-x-12',
                'translate-x-0',
                '-translate-x-8'
              ];
              const offsetClass = offsets[idx % offsets.length];

              const isCompleted = node.completed;
              const isLocked = node.locked;
              const isCurrent = !isCompleted && !isLocked;

              return (
                <div
                  key={node.id}
                  className={`flex flex-col items-center transform transition-transform duration-200 ${offsetClass}`}
                >
                  {/* Floating Action Banner for Current active node */}
                  {isCurrent && (
                    <div className="mb-2 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider animate-bounce shadow-md">
                      START!
                    </div>
                  )}

                  {/* 3D Round Node Button */}
                  <button
                    onClick={() => handleNodeClick(node)}
                    disabled={isLocked}
                    className={`relative flex h-20 w-20 items-center justify-center rounded-full border-b-6 transition-all active:translate-y-1 active:border-b-2 shadow-lg select-none ${
                      isCompleted
                        ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-amber-400/30'
                        : isCurrent
                        ? 'bg-emerald-500 border-emerald-700 text-white shadow-emerald-500/40 ring-4 ring-emerald-500/25 ring-offset-2 dark:ring-offset-slate-950 animate-pulse'
                        : 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-900 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                    title={node.title}
                  >
                    {/* Node Center Icon */}
                    {isLocked ? (
                      <Lock className="w-7 h-7 text-slate-400" />
                    ) : node.type === 'chest' ? (
                      <Gift className={`w-8 h-8 ${isCompleted ? 'text-amber-900' : 'text-amber-500 animate-wiggle'}`} />
                    ) : node.type === 'checkpoint' ? (
                      <Trophy className="w-8 h-8 fill-amber-300 text-amber-500" />
                    ) : (
                      <span className="text-2xl leading-none">{node.icon}</span>
                    )}

                    {/* Completion Crown Badge */}
                    {isCompleted && node.type === 'lesson' && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-900 border-2 border-white dark:border-slate-900 text-xs font-black shadow-xs">
                        👑
                      </span>
                    )}
                  </button>

                  {/* Node Label Below */}
                  <div className="text-center mt-2 max-w-[130px]">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                      {node.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      +{node.xpReward} XP
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ))}

      {/* ================= INTERACTIVE LESSON MODAL ================= */}
      {activeModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-6">
            
            {/* Top Bar with Hearts & Close */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span className="font-mono font-bold text-xs text-rose-500">
                  {user.hearts ?? 5} / {user.maxHearts ?? 5}
                </span>
                {(user.hearts ?? 5) <= 1 && (
                  <span className="text-[10px] text-amber-500 font-bold ml-1">Low Hearts!</span>
                )}
              </div>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {activeLessonStep + 1} of {lessonQuestions.length}
              </span>

              <button
                onClick={() => setActiveModalNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Card */}
            {!lessonFinished ? (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <span className="text-3xl">{activeModalNode.icon}</span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {currentQ.prompt}
                  </h3>
                </div>

                {/* Audio prompt button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => speakWord(currentQ.options[currentQ.correct], currentLang.speechLang)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="inline-flex items-center gap-1.5">
                      <span>Listen in</span>
                      <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                      <span>{currentLang.name}</span>
                    </span>
                  </button>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isRight = idx === currentQ.correct;

                    let btnClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 hover:border-slate-300';
                    if (lessonAnswered) {
                      if (isRight) {
                        btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500';
                      } else if (isSelected) {
                        btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(idx)}
                        disabled={lessonAnswered}
                        className={`p-4 rounded-2xl text-left text-xs sm:text-sm font-bold border transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Feedback Bar */}
                {lessonAnswered && (
                  <div className={`p-4 rounded-2xl flex items-center justify-between animate-fade-in ${
                    lessonIsCorrect ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {lessonIsCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Nicely done! Super accurate!</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                          <span>Lost 1 Heart! Correct: {currentQ.options[currentQ.correct]}</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <Trophy className="w-14 h-14 text-amber-500 mx-auto" />
                <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                  Lesson Complete!
                </h3>
                <p className="text-xs text-slate-500">
                  You earned +{activeModalNode.xpReward} XP and +10 Gems on the learning path!
                </p>

                <button
                  onClick={() => setActiveModalNode(null)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Claim & Return to Path
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
