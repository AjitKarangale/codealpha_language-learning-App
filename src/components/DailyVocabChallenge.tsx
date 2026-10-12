import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCw, Plus, BookmarkCheck, ArrowRight, BookOpen, Layers, Globe } from 'lucide-react';
import { VocabItem, LanguageCode, CEFRLevel } from '../types';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS, getTranslatedWord, getTranslatedExample } from '../data/languages';
import { speakWord, soundEffects } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CountryFlag } from './CountryFlag';

interface DailyVocabChallengeProps {
  vocabList: VocabItem[];
  selectedLanguage: LanguageCode;
  baseLanguage: LanguageCode;
  currentCefrLevel: CEFRLevel;
  onChangeLevel: (level: CEFRLevel) => void;
  onOpenLanguageSelector: () => void;
  onUpdateVocab: (updated: VocabItem) => void;
  onAddVocab: (newItem: VocabItem) => void;
  onCompleteDailyChallenge: (xpEarned: number) => void;
  todayCompleted: boolean;
}

export const DailyVocabChallenge: React.FC<DailyVocabChallengeProps> = ({
  vocabList,
  selectedLanguage,
  baseLanguage,
  currentCefrLevel,
  onChangeLevel,
  onOpenLanguageSelector,
  onUpdateVocab,
  onAddVocab,
  onCompleteDailyChallenge,
  todayCompleted,
}) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const baseLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === baseLanguage) || SUPPORTED_LANGUAGES[0];
  const langVocabs = vocabList.filter((v) => v.language === selectedLanguage);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CEFRLevel | 'all'>(currentCefrLevel);
  const [filterBox, setFilterBox] = useState<'all' | 'learning' | 'mastered'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered items by level and box
  const filteredVocabs = langVocabs.filter((item) => {
    const matchesLevel = selectedLevelFilter === 'all' || item.level === selectedLevelFilter;
    if (!matchesLevel) return false;
    if (filterBox === 'learning') return item.box < 4;
    if (filterBox === 'mastered') return item.box >= 4;
    return true;
  });

  const activeItem = filteredVocabs[currentIndex] || filteredVocabs[0];

  const handlePronounce = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.playClick();
    speakWord(text, currentLang.speechLang);
  };

  const handleCardFlip = () => {
    soundEffects.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleRate = (action: 'hard' | 'good' | 'easy') => {
    if (!activeItem) return;

    let newBox = activeItem.box;
    let deltaRetention = 0;

    if (action === 'hard') {
      newBox = 1;
      deltaRetention = -10;
      soundEffects.playError();
    } else if (action === 'good') {
      newBox = Math.min(5, activeItem.box + 1) as 1 | 2 | 3 | 4 | 5;
      deltaRetention = 15;
      soundEffects.playSuccess();
    } else if (action === 'easy') {
      newBox = 5;
      deltaRetention = 25;
      soundEffects.playSuccess();
    }

    const updatedItem: VocabItem = {
      ...activeItem,
      box: newBox,
      reviewCount: activeItem.reviewCount + 1,
      retentionScore: Math.min(100, Math.max(10, activeItem.retentionScore + deltaRetention)),
      lastReviewed: new Date().toISOString()
    };

    onUpdateVocab(updatedItem);
    setIsFlipped(false);

    // Next card or complete
    if (currentIndex < filteredVocabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fireConfetti();
      soundEffects.playFanfare();
      onCompleteDailyChallenge(35);
      setCurrentIndex(0);
    }
  };

  // Add word form state
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExampleTarget, setNewExampleTarget] = useState('');
  const [newExampleTrans, setNewExampleTrans] = useState('');
  const [newWordLevel, setNewWordLevel] = useState<CEFRLevel>(currentCefrLevel);

  const handleSaveCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newTranslation) return;

    const newItem: VocabItem = {
      id: `${selectedLanguage}-custom-${Date.now()}`,
      language: selectedLanguage,
      level: newWordLevel,
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || newWord.trim(),
      translation: newTranslation.trim(),
      partOfSpeech: 'noun / phrase',
      exampleTarget: newExampleTarget.trim() || `${newWord.trim()}.`,
      exampleTranslation: newExampleTrans.trim() || `${newTranslation.trim()}.`,
      box: 1,
      reviewCount: 0,
      retentionScore: 20
    };

    onAddVocab(newItem);
    soundEffects.playSuccess();
    setShowAddModal(false);
    setNewWord('');
    setNewPhonetic('');
    setNewTranslation('');
    setNewExampleTarget('');
    setNewExampleTrans('');
  };

  const translatedWord = activeItem ? getTranslatedWord(activeItem, baseLanguage) : '';
  const translatedExample = activeItem ? getTranslatedExample(activeItem, baseLanguage) : '';

  return (
    <div className="space-y-6">
      
      {/* Header bar with Language pair & Offline indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Daily Vocabulary Challenge
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <BookmarkCheck className="w-3 h-3" /> Offline Ready
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="inline-flex items-center gap-1.5">Learning: <strong className="text-slate-800 dark:text-slate-200 inline-flex items-center gap-1"><CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" /> {currentLang.name}</strong></span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">Explained in: <strong className="text-slate-800 dark:text-slate-200 inline-flex items-center gap-1"><CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" /> {baseLangObj.name}</strong></span>
            <button
              onClick={onOpenLanguageSelector}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold ml-1"
            >
              Change Language / Level
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Word Modal Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Word</span>
          </button>

          {/* Quick Complete Daily Challenge Button */}
          {!todayCompleted ? (
            <button
              onClick={() => {
                fireConfetti();
                soundEffects.playFanfare();
                onCompleteDailyChallenge(35);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Claim +35 XP</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Challenge Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Level-Wise Learning Selector Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Proficiency Level Selector
              </span>
              <span className="text-[11px] text-slate-400 block">
                Study words tailored to your exact fluency stage
              </span>
            </div>
          </div>

          {/* CEFR Level buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                soundEffects.playClick();
                setSelectedLevelFilter('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedLevelFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Levels ({langVocabs.length})
            </button>

            {CEFR_LEVELS.map((lvl) => {
              const countInLevel = langVocabs.filter((v) => v.level === lvl.id).length;
              const isActive = selectedLevelFilter === lvl.id;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedLevelFilter(lvl.id);
                    onChangeLevel(lvl.id);
                    setCurrentIndex(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={lvl.tagline}
                >
                  <span>{lvl.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {countInLevel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Flashcard Interactive Area */}
      {filteredVocabs.length > 0 && activeItem ? (
        <div className="mx-auto max-w-2xl">
          {/* Card progress tracker */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
            <span className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold font-mono text-[10px]">
                Level {activeItem.level || currentCefrLevel}
              </span>
              <span>Card {currentIndex + 1} of {filteredVocabs.length}</span>
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span>Box {activeItem.box}/5</span>
              <span>·</span>
              <span>{activeItem.retentionScore}% Memory Retention</span>
            </div>
          </div>

          {/* Interactive 3D Flip Flashcard */}
          <div
            onClick={handleCardFlip}
            className="relative cursor-pointer min-h-[320px] sm:min-h-[340px] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none"
          >
            {/* Top flashcard row */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                {isFlipped ? (
                  <>
                    <span>Meaning in</span>
                    <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
                    <span>{baseLangObj.name}</span>
                  </>
                ) : (
                  activeItem.partOfSpeech
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handlePronounce(isFlipped ? activeItem.exampleTarget : activeItem.word, e)}
                  className="p-2 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:scale-105 transition-transform"
                  title="Listen to native pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Tap to flip
                </span>
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-auto py-6 text-center">
              {!isFlipped ? (
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {activeItem.word}
                  </h2>
                  <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                    [{activeItem.phonetic}]
                  </p>
                  <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 flex-wrap">
                    <span>Tap to reveal meaning in</span>
                    <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
                    <span>{baseLangObj.name} and example sentence</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {translatedWord}
                    </h3>
                    {baseLanguage !== 'en' && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        English: {activeItem.translation}
                      </span>
                    )}
                    {activeItem.notes && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 italic">
                        {activeItem.notes}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-left border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {activeItem.exampleTarget}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handlePronounce(activeItem.exampleTarget, e)}
                        className="text-slate-400 hover:text-emerald-500 shrink-0 p-0.5"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {translatedExample}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom rating buttons when card is flipped */}
            {isFlipped ? (
              <div
                className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleRate('hard')}
                  className="py-2.5 px-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                >
                  Hard (Box 1)
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('good')}
                  className="py-2.5 px-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                >
                  Good (+1 Box)
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('easy')}
                  className="py-2.5 px-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  Easy (Mastered)
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>Leitner Spaced Repetition</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  Flip card to rate memory <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>

          {/* Quick card navigation indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {filteredVocabs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  setCurrentIndex(idx);
                  setIsFlipped(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                title={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-xl mx-auto">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
            <span>No words found for</span>
            {selectedLevelFilter === 'all' ? (
              <span className="inline-flex items-center gap-1">
                <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                <span>{currentLang.name}</span>
              </span>
            ) : (
              <span>Level {selectedLevelFilter}</span>
            )}.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              Show all levels
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              Add a word to this level
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add New Word to Offline Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1 flex-wrap">
              <span>Add a word in</span>
              <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
              <span>{currentLang.name} with translations in</span>
              <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
              <span>{baseLangObj.name}.</span>
            </p>

            <form onSubmit={handleSaveCustomWord} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Learning Level
                  </label>
                  <select
                    value={newWordLevel}
                    onChange={(e) => setNewWordLevel(e.target.value as CEFRLevel)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {CEFR_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Language
                  </label>
                  <div className="py-2 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                    <span>{currentLang.name}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <span>Target Word / Phrase (</span>
                  <CountryFlag countryCode={currentLang.countryCode} flag={currentLang.flag} langCode={currentLang.code} size="xs" />
                  <span>{currentLang.name})</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. solsticio"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phonetic Pronunciation
                </label>
                <input
                  type="text"
                  placeholder="e.g. sohl-STEE-syoh"
                  value={newPhonetic}
                  onChange={(e) => setNewPhonetic(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <span>Meaning in</span>
                  <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
                  <span>{baseLangObj.name}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Meaning in ${baseLangObj.name}`}
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Context Example Sentence (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. El solsticio de verano es el día más largo."
                  value={newExampleTarget}
                  onChange={(e) => setNewExampleTarget(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
