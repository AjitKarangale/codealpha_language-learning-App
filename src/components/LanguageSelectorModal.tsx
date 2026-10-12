import React, { useState } from 'react';
import { Search, Globe, Check, ArrowRight, X, Sparkles, Layers, BookOpen } from 'lucide-react';
import { Language, LanguageCode, CEFRLevel } from '../types';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from '../data/languages';
import { soundEffects } from '../utils/audio';
import { CountryFlag } from './CountryFlag';

interface LanguageSelectorModalProps {
  baseLanguage: LanguageCode;
  selectedLanguage: LanguageCode;
  currentCefrLevel: CEFRLevel;
  onSaveSelection: (baseLang: LanguageCode, targetLang: LanguageCode, level: CEFRLevel) => void;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  baseLanguage,
  selectedLanguage,
  currentCefrLevel,
  onSaveSelection,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'target' | 'base' | 'level'>('target');
  const [tempBase, setTempBase] = useState<LanguageCode>(baseLanguage);
  const [tempTarget, setTempTarget] = useState<LanguageCode>(selectedLanguage);
  const [tempLevel, setTempLevel] = useState<CEFRLevel>(currentCefrLevel);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const baseLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === tempBase) || SUPPORTED_LANGUAGES[0];
  const targetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === tempTarget) || SUPPORTED_LANGUAGES[1];
  const currentLevelObj = CEFR_LEVELS.find((l) => l.id === tempLevel) || CEFR_LEVELS[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'All' || lang.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const handleApply = () => {
    soundEffects.playSuccess();
    onSaveSelection(tempBase, tempTarget, tempLevel);
    onClose();
  };

  const regions = ['All', 'Europe', 'Asia', 'Americas', 'Middle East & Africa'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Globe className="w-4 h-4" />
              </span>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                World Language & Level Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your native language, learning target, and proficiency level.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Pair Preview Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="md" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">I Speak</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{baseLangObj.name}</span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="md" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block leading-none">Learning</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{targetLangObj.name}</span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLevelObj.id} · {currentLevelObj.name.split('·')[1]?.trim() || currentLevelObj.id}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('target')}
            className={`pb-2.5 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'target'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>1. Target:</span>
            <span className="inline-flex items-center gap-1.5">
              <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
              <span>{targetLangObj.name}</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('level')}
            className={`pb-2.5 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'level'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>2. Level:</span>
            <span>{currentLevelObj.id}</span>
          </button>
          <button
            onClick={() => setActiveTab('base')}
            className={`pb-2.5 px-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'base'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>3. Native:</span>
            <span className="inline-flex items-center gap-1.5">
              <CountryFlag countryCode={baseLangObj.countryCode} flag={baseLangObj.flag} langCode={baseLangObj.code} size="xs" />
              <span>{baseLangObj.name}</span>
            </span>
          </button>
        </div>

        {/* Tab 1 & Tab 3: Language List with Search & Region filters */}
        {(activeTab === 'target' || activeTab === 'base') && (
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search languages by name or native script..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegionFilter(reg)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    regionFilter === reg
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Language List - Single Column with Country Flag in Front */}
            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredLanguages.map((lang) => {
                const isSelected = activeTab === 'target' ? tempTarget === lang.code : tempBase === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      soundEffects.playClick();
                      if (activeTab === 'target') {
                        setTempTarget(lang.code);
                      } else {
                        setTempBase(lang.code);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/80 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* One country flag directly in front of language */}
                      <CountryFlag
                        countryCode={lang.countryCode}
                        flag={lang.flag}
                        langCode={lang.code}
                        size="xl"
                        className="shrink-0 drop-shadow-xs"
                        title={`${lang.name} flag`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {lang.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            · {lang.nativeName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            {lang.speakers}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                            {lang.region}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {lang.description}
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 shrink-0">
                      {isSelected ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: CEFR Level Selector (A1 -> C1) */}
        {activeTab === 'level' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            <div className="mb-2">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <span>Select Your Learning Stage in</span>
                <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
                <span>{targetLangObj.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Word challenges, vocabulary lists, and practice quizzes adapt directly to your chosen level.
              </p>
            </div>

            <div className="space-y-2.5">
              {CEFR_LEVELS.map((lvl) => {
                const isSelected = tempLevel === lvl.id;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setTempLevel(lvl.id);
                    }}
                    className={`w-full flex items-start justify-between p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono font-bold text-xs ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {lvl.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {lvl.name}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          {lvl.tagline}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {lvl.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs shrink-0 mt-1">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Bottom Action Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {SUPPORTED_LANGUAGES.length} World Languages Available
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
            >
              Confirm & Start Learning
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
