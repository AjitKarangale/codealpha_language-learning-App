import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Plus,
  Send,
  Trophy,
  Swords,
  Flame,
  BookOpen,
  Sparkles,
  Share2,
  Check,
  Smile,
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { StudyGroup, GroupChatMessage, UserProfile, VocabItem, LanguageCode, CEFRLevel } from '../types';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from '../data/languages';
import { soundEffects } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { CountryFlag } from './CountryFlag';

interface StudyGroupsProps {
  user: UserProfile;
  groups: StudyGroup[];
  vocabList: VocabItem[];
  onUpdateGroups: (groups: StudyGroup[]) => void;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
}

export const StudyGroups: React.FC<StudyGroupsProps> = ({
  user,
  groups,
  vocabList,
  onUpdateGroups,
  onUpdateUser,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>(
    user.activeGroupId || groups[0]?.id || 'group-1'
  );
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'leaderboard' | 'duel'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareWordModal, setShowShareWordModal] = useState(false);

  // New Group state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupLang, setNewGroupLang] = useState<LanguageCode>(user.selectedLanguage);
  const [newGroupLevel, setNewGroupLevel] = useState<CEFRLevel>(user.currentCefrLevel);

  // 60-Second Head-to-Head Duel state
  const [duelActive, setDuelActive] = useState(false);
  const [duelOpponent, setDuelOpponent] = useState<string | null>(null);
  const [duelScore, setDuelScore] = useState(0);
  const [duelOpponentScore, setDuelOpponentScore] = useState(0);
  const [duelTimer, setDuelTimer] = useState(30);
  const [duelQuestionIndex, setDuelQuestionIndex] = useState(0);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const targetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === (activeGroup?.language || 'es')) || SUPPORTED_LANGUAGES[1];

  // Send Chat message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeGroup) return;

    soundEffects.playClick();
    const newMsg: GroupChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-current',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
      reactions: []
    };

    const updatedGroups = groups.map((g) => {
      if (g.id === activeGroup.id) {
        return {
          ...g,
          chatMessages: [...g.chatMessages, newMsg]
        };
      }
      return g;
    });

    onUpdateGroups(updatedGroups);
    setChatInput('');
  };

  // Add Reaction
  const handleReact = (messageId: string, emoji: string) => {
    soundEffects.playClick();
    if (!activeGroup) return;

    const updatedGroups = groups.map((g) => {
      if (g.id === activeGroup.id) {
        const nextMessages = g.chatMessages.map((msg) => {
          if (msg.id === messageId) {
            const existingReact = msg.reactions.find((r) => r.emoji === emoji);
            let nextReactions = [...msg.reactions];

            if (existingReact) {
              if (existingReact.users.includes('user-current')) {
                // remove reaction
                nextReactions = nextReactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== 'user-current') }
                      : r
                  )
                  .filter((r) => r.count > 0);
              } else {
                // add reaction
                nextReactions = nextReactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, count: r.count + 1, users: [...r.users, 'user-current'] }
                    : r
                );
              }
            } else {
              nextReactions.push({ emoji, count: 1, users: ['user-current'] });
            }
            return { ...msg, reactions: nextReactions };
          }
          return msg;
        });
        return { ...g, chatMessages: nextMessages };
      }
      return g;
    });

    onUpdateGroups(updatedGroups);
  };

  // Share Word to Group Chat
  const handleShareWord = (item: VocabItem) => {
    if (!activeGroup) return;
    soundEffects.playSuccess();
    fireConfetti(800);

    const shareMsg: GroupChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-current',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: `Just reviewed "${item.word}" in our daily challenge! Check this word:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
      sharedWord: {
        word: item.word,
        translation: item.translation,
        phonetic: item.phonetic
      },
      reactions: [{ emoji: '🔥', count: 1, users: ['user-current'] }]
    };

    const updatedGroups = groups.map((g) => {
      if (g.id === activeGroup.id) {
        return {
          ...g,
          chatMessages: [...g.chatMessages, shareMsg]
        };
      }
      return g;
    });

    onUpdateGroups(updatedGroups);
    setShowShareWordModal(false);
  };

  // Quick Chat Prompts
  const handleQuickPrompt = (text: string) => {
    setChatInput(text);
  };

  // Create New Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    soundEffects.playSuccess();
    fireConfetti(1200);

    const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === newGroupLang) || SUPPORTED_LANGUAGES[0];

    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: `${newGroupName.trim()} ${targetLang.flag}`,
      description: newGroupDesc.trim() || `Collaborative ${targetLang.name} study squad.`,
      language: newGroupLang,
      level: newGroupLevel,
      avatar: targetLang.flag,
      code: `${targetLang.name.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
      weeklyTargetWords: 300,
      isUserMember: true,
      members: [
        {
          id: 'user-current',
          name: `${user.name} (Founder)`,
          username: user.username,
          avatar: user.avatar,
          wordsLearned: user.wordsLearned,
          streak: user.streak,
          xp: user.xp,
          isLeader: true,
          isCurrentUser: true,
          statusText: 'Squad Leader 🚀'
        }
      ],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'user-current',
          senderName: user.name,
          senderAvatar: user.avatar,
          text: `Welcome to ${newGroupName.trim()}! Let’s learn together and crush our word goals! 🎉`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '🎉', count: 1, users: ['user-current'] }]
        }
      ]
    };

    const nextGroups = [newGroup, ...groups];
    onUpdateGroups(nextGroups);
    setActiveGroupId(newGroup.id);
    onUpdateUser({ activeGroupId: newGroup.id });
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  // Head-to-Head Duel Starter
  const handleStartDuel = (opponentName: string) => {
    soundEffects.playSuccess();
    setDuelOpponent(opponentName);
    setDuelScore(0);
    setDuelOpponentScore(0);
    setDuelTimer(30);
    setDuelActive(true);
    setDuelQuestionIndex(0);
  };

  const handleDuelAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      soundEffects.playSuccess();
      setDuelScore((prev) => prev + 10);
    } else {
      soundEffects.playError();
    }

    // Simulate opponent randomly answering
    if (Math.random() > 0.35) {
      setDuelOpponentScore((prev) => prev + 10);
    }

    if (duelQuestionIndex < 4) {
      setDuelQuestionIndex((prev) => prev + 1);
    } else {
      // Duel finished!
      setDuelActive(false);
      fireConfetti(1500);
      soundEffects.playFanfare();
      onUpdateUser({
        xp: user.xp + duelScore + 15,
        gems: user.gems + 10,
        wordsLearned: user.wordsLearned + 3
      });
    }
  };

  // Sample duel questions based on active language
  const activeVocabs = vocabList.filter((v) => v.language === (activeGroup?.language || 'es'));
  const duelCurrentItem = activeVocabs[duelQuestionIndex % activeVocabs.length] || activeVocabs[0];
  const duelWrongItem = activeVocabs[(duelQuestionIndex + 1) % activeVocabs.length] || activeVocabs[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Squad Title & Goal Progress */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2">
              <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="2xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
                  <span>{targetLangObj.name} · Level {activeGroup?.level || 'A1'}</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  Code: {activeGroup?.code}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {activeGroup?.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeGroup?.description}
              </p>
            </div>
          </div>

          {/* Group Switcher & Create Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              {groups.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveGroupId(grp.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeGroupId === grp.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{grp.avatar}</span>
                  <span className="hidden sm:inline">{grp.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Squad</span>
            </button>
          </div>

        </div>

        {/* Collective Squad Progress: Words Learned Goal */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1.5 gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Squad Word Target (</span>
              <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
              <span>{targetLangObj.name})</span>
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">
              {activeGroup?.members.reduce((acc, m) => acc + m.wordsLearned, 0)} of {activeGroup?.weeklyTargetWords || 300} words learned together
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    ((activeGroup?.members.reduce((acc, m) => acc + m.wordsLearned, 0) || 0) /
                      (activeGroup?.weeklyTargetWords || 300)) *
                      100
                  )
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Group Chat vs Words Learned Leaderboard vs Speed Duel */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveSubTab('chat');
          }}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeSubTab === 'chat'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Squad Chat ({activeGroup?.chatMessages.length || 0})</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveSubTab('leaderboard');
          }}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeSubTab === 'leaderboard'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Words Learned Ranks ({activeGroup?.members.length} Friends)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveSubTab('duel');
          }}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
            activeSubTab === 'duel'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4 text-rose-500" />
          <span>Head-to-Head Duel</span>
        </button>
      </div>

      {/* ================= TAB 1: GROUP CHAT FEED ================= */}
      {activeSubTab === 'chat' && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-[520px]">
          
          {/* Chat Message List */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {activeGroup?.chatMessages.map((msg) => {
              const isMe = msg.senderId === 'user-current' || msg.isCurrentUser;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`max-w-[78%] sm:max-w-[65%] space-y-1.5 ${isMe ? 'items-end' : ''}`}>
                    <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {msg.senderName}
                      </span>
                      <span className="text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Shared Vocabulary Word Bubble */}
                    {msg.sharedWord && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                          <span>Word Shared</span>
                          <span className="inline-flex items-center gap-1">
                            <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
                            <span>{targetLangObj.name}</span>
                          </span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                          {msg.sharedWord.word}
                        </h4>
                        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                          [{msg.sharedWord.phonetic}]
                        </p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          Meaning: {msg.sharedWord.translation}
                        </p>
                      </div>
                    )}

                    {/* Standard Text Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Emoji Reactions Tray */}
                    <div className={`flex flex-wrap items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      {msg.reactions.map((react, rIdx) => {
                        const hasReacted = react.users.includes('user-current');
                        return (
                          <button
                            key={rIdx}
                            onClick={() => handleReact(msg.id, react.emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-colors ${
                              hasReacted
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span>{react.emoji}</span>
                            <span className="font-bold tabular-nums font-mono">{react.count}</span>
                          </button>
                        );
                      })}

                      {/* Add quick reaction trigger */}
                      <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                        {['🔥', '👏', '🎉', '💡'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReact(msg.id, emoji)}
                            className="text-xs p-1 hover:scale-125 transition-transform"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Chat Presets */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Quick:</span>
            <button
              onClick={() => handleQuickPrompt('Streak check! Don’t forget your lesson today 🔥')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-emerald-500"
            >
              🔥 Streak check!
            </button>
            <button
              onClick={() => handleQuickPrompt('Who wants to duel in a 60-second word match? ⚔️')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-emerald-500"
            >
              ⚔️ 60s Word Duel
            </button>
            <button
              onClick={() => setShowShareWordModal(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold whitespace-nowrap flex items-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Word to Chat</span>
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              placeholder={`Message ${activeGroup?.name}...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 disabled:opacity-40 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>
      )}

      {/* ================= TAB 2: WORDS LEARNED LEADERBOARD ================= */}
      {activeSubTab === 'leaderboard' && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Squad Words Learned Rankings (</span>
                <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
                <span>{targetLangObj.name})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track how many vocabulary words each friend has mastered this week.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Friendly Competition Active</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {activeGroup?.members
              .sort((a, b) => b.wordsLearned - a.wordsLearned)
              .map((member, idx) => {
                const rank = idx + 1;
                const isMe = member.isCurrentUser || member.id === 'user-current';

                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between px-5 py-4 transition-colors ${
                      isMe
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 font-semibold border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank & User details */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex w-7 items-center justify-center font-mono font-bold text-sm">
                        {rank === 1 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-900 text-xs font-black">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-xs font-black">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-white text-xs font-black">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400">{rank}</span>
                        )}
                      </div>

                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <CountryFlag flag={member.countryFlag || '🇺🇸'} size="xs" title="Country flag" />
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {member.name}
                          </span>
                          {member.isLeader && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                              Leader
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>@{member.username}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-mono">
                            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> {member.streak}d
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Words Learned & Challenge button */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {isMe ? user.wordsLearned : member.wordsLearned}{' '}
                          <span className="text-xs font-normal text-slate-400">words</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {member.xp} XP total
                        </span>
                      </div>

                      {!isMe && (
                        <button
                          onClick={() => {
                            setActiveSubTab('duel');
                            handleStartDuel(member.name);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs"
                        >
                          <Swords className="w-3.5 h-3.5 text-rose-400" />
                          <span className="hidden sm:inline">Duel</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* ================= TAB 3: 60-SECOND WORD DUEL ================= */}
      {activeSubTab === 'duel' && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm text-center max-w-xl mx-auto">
          {!duelActive ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Swords className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                60-Second Head-to-Head Duel
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto flex items-center justify-center gap-1.5 flex-wrap">
                <span>Challenge squad members to a rapid-fire vocabulary match in</span>
                <CountryFlag countryCode={targetLangObj.countryCode} flag={targetLangObj.flag} langCode={targetLangObj.code} size="xs" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{targetLangObj.name}</span>.
                <span>Test who has learned more words under pressure!</span>
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Opponent:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {activeGroup?.members
                    .filter((m) => !m.isCurrentUser && m.id !== 'user-current')
                    .map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleStartDuel(m.name)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors"
                      >
                        <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{m.name}</span>
                        <span className="text-[10px] text-emerald-600 font-mono">({m.wordsLearned}w)</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Duel Live Scoreboard */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">You</span>
                  <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {duelScore} pts
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold font-mono text-sm">
                  <Zap className="w-4 h-4 fill-rose-500" />
                  <span>Q {duelQuestionIndex + 1}/5</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{duelOpponent}</span>
                  <span className="text-xl font-mono font-bold text-amber-500">
                    {duelOpponentScore} pts
                  </span>
                </div>
              </div>

              {/* Question */}
              {duelCurrentItem && (
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 space-y-4">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    What does this word mean?
                  </span>
                  <h4 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                    {duelCurrentItem.word}
                  </h4>
                  <p className="text-xs font-mono text-emerald-600">[{duelCurrentItem.phonetic}]</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <button
                      onClick={() => handleDuelAnswer(true)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      {duelCurrentItem.translation}
                    </button>
                    <button
                      onClick={() => handleDuelAnswer(false)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      {duelWrongItem?.translation || 'to walk leisurely'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL 1: CREATE SQUAD ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Create New Friends Study Squad
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Form a language learning club with your friends to track words learned and chat!
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barcelona Camino Club"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Language to Practice</span>
                    {(() => {
                      const lObj = SUPPORTED_LANGUAGES.find(l => l.code === newGroupLang);
                      return lObj ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CountryFlag countryCode={lObj.countryCode} flag={lObj.flag} langCode={lObj.code} size="xs" />
                          <span>{lObj.name}</span>
                        </span>
                      ) : null;
                    })()}
                  </label>
                  <select
                    value={newGroupLang}
                    onChange={(e) => setNewGroupLang(e.target.value as LanguageCode)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Level
                  </label>
                  <select
                    value={newGroupLevel}
                    onChange={(e) => setNewGroupLevel(e.target.value as CEFRLevel)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {CEFR_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Squad Motto / Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50 words each week and daily streak goals!"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SHARE WORD TO CHAT ================= */}
      {showShareWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Share Vocabulary Word with {activeGroup?.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick a word from your learning vault to post directly to your friends squad chat:
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activeVocabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleShareWord(item)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800 text-left transition-all"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.word}
                    </span>
                    <span className="text-xs text-emerald-600 block">[{item.phonetic}]</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Meaning: {item.translation}
                    </span>
                  </div>
                  <Share2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareWordModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
