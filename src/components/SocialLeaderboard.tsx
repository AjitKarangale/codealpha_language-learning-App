import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Users,
  ArrowUp,
  ArrowDown,
  Flame,
  UserPlus,
  Sparkles,
  Columns,
  MessageSquare,
  Plus,
  Send,
  Swords,
  BookOpen,
  Check,
  CheckCircle2,
  X,
  Volume2,
  Share2,
  Globe,
  Award,
  Zap,
  Target
} from 'lucide-react';
import {
  LeaderboardUser,
  UserProfile,
  StudyGroup,
  GroupChatMessage,
  GroupMember,
  VocabItem,
  LanguageCode,
  CEFRLevel
} from '../types';
import { SUPPORTED_LANGUAGES, CEFR_LEVELS } from '../data/languages';
import { soundEffects, speakWord } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { INITIAL_GROUPS } from '../utils/storage';
import { CountryFlag } from './CountryFlag';

interface SocialLeaderboardProps {
  currentUser: UserProfile;
  leaderboardUsers: LeaderboardUser[];
  groups?: StudyGroup[];
  vocabList?: VocabItem[];
  onUpdateGroups?: (groups: StudyGroup[]) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onAddFriend: (username: string) => void;
  onSendHighFive: (friendName: string) => void;
}

const WORLD_COUNTRY_FLAGS = [
  { flag: '🇺🇸', name: 'United States', countryCode: 'us' },
  { flag: '🇮🇳', name: 'India', countryCode: 'in' },
  { flag: '🇪🇸', name: 'Spain', countryCode: 'es' },
  { flag: '🇬🇧', name: 'United Kingdom', countryCode: 'gb' },
  { flag: '🇫🇷', name: 'France', countryCode: 'fr' },
  { flag: '🇩🇪', name: 'Germany', countryCode: 'de' },
  { flag: '🇯🇵', name: 'Japan', countryCode: 'jp' },
  { flag: '🇮🇹', name: 'Italy', countryCode: 'it' },
  { flag: '🇧🇷', name: 'Brazil', countryCode: 'br' },
  { flag: '🇨🇦', name: 'Canada', countryCode: 'ca' },
  { flag: '🇦🇺', name: 'Australia', countryCode: 'au' },
  { flag: '🇲🇽', name: 'Mexico', countryCode: 'mx' },
  { flag: '🇨🇳', name: 'China', countryCode: 'cn' },
  { flag: '🇰🇷', name: 'South Korea', countryCode: 'kr' },
  { flag: '🇳🇱', name: 'Netherlands', countryCode: 'nl' },
  { flag: '🇹🇷', name: 'Turkey', countryCode: 'tr' },
  { flag: '🇻🇳', name: 'Vietnam', countryCode: 'vn' },
  { flag: '🇮🇩', name: 'Indonesia', countryCode: 'id' },
  { flag: '🇵🇱', name: 'Poland', countryCode: 'pl' },
  { flag: '🇬🇷', name: 'Greece', countryCode: 'gr' },
  { flag: '🇧🇩', name: 'Bangladesh', countryCode: 'bd' },
  { flag: '🇰🇪', name: 'Kenya', countryCode: 'ke' }
];

export const SocialLeaderboard: React.FC<SocialLeaderboardProps> = ({
  currentUser,
  leaderboardUsers,
  groups: propGroups,
  vocabList = [],
  onUpdateGroups,
  onUpdateUser,
  onAddFriend,
  onSendHighFive,
}) => {
  // Use passed groups or fallback to default
  const groups = propGroups && propGroups.length > 0 ? propGroups : INITIAL_GROUPS;

  const [layoutView, setLayoutView] = useState<'split' | 'league' | 'friends' | 'chat'>('split');
  const [activeGroupId, setActiveGroupId] = useState<string>(currentUser.activeGroupId || groups[0]?.id || 'group-1');
  const [selectedFriendCircle, setSelectedFriendCircle] = useState<'all' | string>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showFlagPickerModal, setShowFlagPickerModal] = useState(false);
  const [showShareWordModal, setShowShareWordModal] = useState(false);
  
  // Search & input state
  const [searchUsername, setSearchUsername] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [highFiveToast, setHighFiveToast] = useState<string | null>(null);

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupLang, setNewGroupLang] = useState<LanguageCode>(currentUser.selectedLanguage);
  const [newGroupLevel, setNewGroupLevel] = useState<CEFRLevel>(currentUser.currentCefrLevel);
  const [newGroupTargetWords, setNewGroupTargetWords] = useState<number>(350);

  // 1v1 Word Duel State
  const [duelActive, setDuelActive] = useState(false);
  const [duelFriend, setDuelFriend] = useState<LeaderboardUser | GroupMember | null>(null);
  const [duelScore, setDuelScore] = useState(0);
  const [duelOpponentScore, setDuelOpponentScore] = useState(0);
  const [duelTimeLeft, setDuelTimeLeft] = useState(30);
  const [duelQuestionIndex, setDuelQuestionIndex] = useState(0);

  // Find active group
  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  // Process leaderboard users with live stats of current user
  const processedUsers = leaderboardUsers.map((u) => {
    if (u.isCurrentUser) {
      return {
        ...u,
        xp: currentUser.xp,
        streak: currentUser.streak,
        league: currentUser.league,
        wordsLearned: currentUser.wordsLearned,
        countryFlag: currentUser.countryFlag || '🇺🇸'
      };
    }
    return u;
  });

  // Sort by XP descending for global league
  const sortedLeagueUsers = [...processedUsers].sort((a, b) => b.xp - a.xp);

  // Local Friends list sorted by words learned
  const allFriendsList = processedUsers
    .filter((u) => u.isFriend || u.isCurrentUser)
    .sort((a, b) => b.wordsLearned - a.wordsLearned);

  // If specific group selected, filter to that group members
  const currentDisplayedFriends = selectedFriendCircle === 'all'
    ? allFriendsList
    : (activeGroup ? activeGroup.members.map((m) => {
        const matchingLeader = processedUsers.find((p) => p.id === m.id);
        return {
          id: m.id,
          name: m.name,
          username: m.username,
          avatar: m.avatar,
          countryFlag: m.countryFlag || matchingLeader?.countryFlag || '🌐',
          xp: m.xp,
          wordsLearned: m.isCurrentUser ? currentUser.wordsLearned : m.wordsLearned,
          streak: m.streak,
          league: currentUser.league,
          isCurrentUser: m.isCurrentUser,
          isFriend: true,
          trend: 'same' as const,
          weeklyDelta: 50
        };
      }).sort((a, b) => b.wordsLearned - a.wordsLearned) : allFriendsList);

  const currentUserRank = sortedLeagueUsers.findIndex((u) => u.isCurrentUser) + 1;
  const currentUserFriendRank = currentDisplayedFriends.findIndex((u) => u.isCurrentUser) + 1;

  // Cheer / High-five handler
  const handleHighFive = (name: string) => {
    soundEffects.playSuccess();
    fireConfetti(1000);
    setHighFiveToast(`Sent a cheer to ${name}! 🎉`);
    onSendHighFive(name);
    setTimeout(() => setHighFiveToast(null), 3000);
  };

  // Add friend handler
  const handleFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    soundEffects.playSuccess();
    onAddFriend(searchUsername.trim());
    setSearchUsername('');
    setShowAddModal(false);
    setHighFiveToast(`Added ${searchUsername} to your friends circle!`);
    setTimeout(() => setHighFiveToast(null), 3000);
  };

  // Change current user country flag
  const handleSelectCountryFlag = (flag: string) => {
    soundEffects.playClick();
    if (onUpdateUser) {
      onUpdateUser({ countryFlag: flag });
    }
    setShowFlagPickerModal(false);
    setHighFiveToast(`Updated profile country flag to ${flag}!`);
    setTimeout(() => setHighFiveToast(null), 3000);
  };

  // Create new group handler
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    soundEffects.playSuccess();
    fireConfetti(1200);

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === newGroupLang) || SUPPORTED_LANGUAGES[0];

    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: `${newGroupName.trim()} ${langObj.flag}`,
      description: newGroupDesc.trim() || `Daily language study circle for ${langObj.flag} ${langObj.name}`,
      language: newGroupLang,
      level: newGroupLevel,
      avatar: langObj.flag,
      code: `${newGroupLang.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      weeklyTargetWords: newGroupTargetWords,
      isUserMember: true,
      members: [
        {
          id: 'user-current',
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          countryFlag: currentUser.countryFlag || '🇺🇸',
          wordsLearned: currentUser.wordsLearned,
          streak: currentUser.streak,
          xp: currentUser.xp,
          isLeader: true,
          isCurrentUser: true,
          statusText: 'Founder & Study Captain'
        },
        {
          id: 'user-1',
          name: 'Sofia Martinez',
          username: 'sofia_madrid',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          countryFlag: '🇪🇸',
          wordsLearned: 74,
          streak: 18,
          xp: 2180,
          statusText: 'Reviewing Level A2 idioms ☕'
        }
      ],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'user-current',
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `Welcome to our new squad: ${newGroupName.trim()}! Let's compete and learn ${langObj.flag} ${langObj.name} words together.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: true,
          reactions: [{ emoji: '🔥', count: 1, users: ['user-current'] }]
        }
      ]
    };

    const nextGroups = [newGroup, ...groups];
    if (onUpdateGroups) {
      onUpdateGroups(nextGroups);
    }
    setActiveGroupId(newGroup.id);
    setSelectedFriendCircle(newGroup.id);
    if (onUpdateUser) {
      onUpdateUser({ activeGroupId: newGroup.id });
    }

    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setHighFiveToast(`Created group "${newGroup.name}"!`);
    setTimeout(() => setHighFiveToast(null), 3500);
  };

  // Send message in group chat
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeGroup) return;

    soundEffects.playClick();
    const newMsg: GroupChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-current',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
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

    if (onUpdateGroups) {
      onUpdateGroups(updatedGroups);
    }
    setChatInput('');
  };

  // Add Emoji reaction
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
                nextReactions = nextReactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== 'user-current') }
                      : r
                  )
                  .filter((r) => r.count > 0);
              } else {
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

    if (onUpdateGroups) {
      onUpdateGroups(updatedGroups);
    }
  };

  // Share Word to chat
  const handleShareWordToChat = (item: VocabItem) => {
    if (!activeGroup) return;
    soundEffects.playSuccess();
    fireConfetti(800);

    const shareMsg: GroupChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-current',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
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

    if (onUpdateGroups) {
      onUpdateGroups(updatedGroups);
    }
    setShowShareWordModal(false);
    setHighFiveToast(`Shared "${item.word}" to ${activeGroup.name} chat!`);
    setTimeout(() => setHighFiveToast(null), 3000);
  };

  // Start 1v1 Word Duel
  const startWordDuel = (friend: LeaderboardUser | GroupMember) => {
    soundEffects.playClick();
    setDuelFriend(friend);
    setDuelScore(0);
    setDuelOpponentScore(0);
    setDuelTimeLeft(30);
    setDuelQuestionIndex(0);
    setDuelActive(true);
  };

  // Duel Timer
  useEffect(() => {
    if (!duelActive) return;
    if (duelTimeLeft <= 0) {
      soundEffects.playFanfare();
      fireConfetti(1500);
      if (onUpdateUser) {
        onUpdateUser({ xp: currentUser.xp + 45, gems: currentUser.gems + 15 });
      }
      return;
    }
    const timer = setInterval(() => {
      setDuelTimeLeft((t) => t - 1);
      // Simulate opponent score progress
      if (Math.random() > 0.65) {
        setDuelOpponentScore((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [duelActive, duelTimeLeft]);

  // Handle Answer in Duel
  const handleDuelAnswer = (isCorrectAnswer: boolean) => {
    if (isCorrectAnswer) {
      soundEffects.playSuccess();
      setDuelScore((s) => s + 1);
    } else {
      soundEffects.playError();
    }
    setDuelQuestionIndex((i) => i + 1);
  };

  // Sample duel questions based on active language or Spanish
  const targetDuelLang = SUPPORTED_LANGUAGES.find((l) => l.code === (activeGroup?.language || currentUser.selectedLanguage)) || SUPPORTED_LANGUAGES[0];
  const duelQuestions = [
    { q: 'How do you say "Hello / Good morning" in ' + targetDuelLang.name + '?', options: ['Hola', 'Bonjour', 'Ciao', 'Hallo'], correct: 0 },
    { q: 'What does "Gracias / Merci" express?', options: ['Goodbye', 'Thank you', 'Please', 'Excuse me'], correct: 1 },
    { q: 'Choose the word for "Water":', options: ['Fuego', 'Agua / Eau', 'Pan', 'Vino'], correct: 1 },
    { q: 'Which word means "Friend"?', options: ['Amigo / Ami', 'Casa', 'Perro', 'Libro'], correct: 0 },
    { q: 'What is the number "Three"?', options: ['Uno', 'Dos', 'Tres / Trois', 'Cuatro'], correct: 2 },
  ];

  const currentDuelQ = duelQuestions[duelQuestionIndex % duelQuestions.length];

  // Group collective words calculation
  const groupTotalWords = activeGroup
    ? activeGroup.members.reduce((acc, m) => acc + (m.isCurrentUser ? currentUser.wordsLearned : m.wordsLearned), 0)
    : 380;
  const groupTargetWords = activeGroup ? activeGroup.weeklyTargetWords : 500;
  const groupProgressPct = Math.min(100, Math.round((groupTotalWords / groupTargetWords) * 100));

  return (
    <div className="space-y-6">
      
      {/* ================= TOP BANNER: LEAGUE STATUS & PROFILE FLAGS ================= */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2 overflow-hidden">
              <img
                src="/src/assets/images/league_trophy_badge_1791732889314.jpg"
                alt="Championship Trophy"
                className="h-full w-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-500">
                  {currentUser.league} League · Division 2
                </span>
                <span className="text-[11px] text-slate-400">
                  Weekly Reset in 2d 14h
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                Competitive Rankings & Local Friend Circles
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Global Rank: <strong className="text-emerald-600 dark:text-emerald-400">#{currentUserRank}</strong>
                </span>
                <span>·</span>
                <span>
                  Friends Rank: <strong className="text-amber-500 font-bold">#{currentUserFriendRank} of {currentDisplayedFriends.length}</strong>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  My Country:
                  <button
                    onClick={() => setShowFlagPickerModal(true)}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Change your country flag"
                  >
                    <CountryFlag flag={currentUser.countryFlag || '🇺🇸'} size="xs" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Change</span>
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Controllers & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setLayoutView('split');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  layoutView === 'split'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="View League and Local Friends side-by-side in separate columns"
              >
                <Columns className="w-3.5 h-3.5 text-emerald-500" />
                <span>Side-by-Side</span>
              </button>
              
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setLayoutView('friends');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  layoutView === 'friends'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="View Local Friends Word Computation column"
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>Friends Column ({currentDisplayedFriends.length})</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setLayoutView('league');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  layoutView === 'league'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="View Global League Tournament"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>League</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setLayoutView('chat');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  layoutView === 'chat'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Open Group Chat & Word Sharing"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                <span>Group Chat</span>
              </button>
            </div>

            {/* Quick Action: Create Group Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowCreateGroupModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
              title="Create a study squad with friends on this page"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Group</span>
            </button>

            {/* Quick Action: Add Friend Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>

        </div>
      </div>

      {/* Cheer / Toast Notification */}
      {highFiveToast && (
        <div className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {highFiveToast}
          </span>
          <button onClick={() => setHighFiveToast(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* ================= SEPARATE COLUMNS COMPETITION LAYOUT ================= */}
      <div className={`grid gap-6 ${layoutView === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* COLUMN 1: GLOBAL LEAGUE TOURNAMENT */}
        {(layoutView === 'split' || layoutView === 'league') && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col">
            
            {/* Column Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Global League Division
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Ranks 1–3 promote to Diamond League · Weekly tournament
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60">
                  {currentUser.league} Tier
                </span>
              </div>
            </div>

            {/* Promotion zone indicator */}
            <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5 text-emerald-600" /> PROMOTION ZONE
              </span>
              <span className="text-[10px] opacity-80 font-normal">Next: Diamond Tier</span>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
              {sortedLeagueUsers.map((user, idx) => {
                const rank = idx + 1;
                const isMe = user.isCurrentUser;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-4 sm:px-5 py-3.5 transition-colors ${
                      isMe
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 font-semibold border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank, Avatar, Country Flag & Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-mono font-bold text-xs">
                        {rank === 1 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 text-[11px] font-black">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-[11px] font-black">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-white text-[11px] font-black">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400">{rank}</span>
                        )}
                      </div>

                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1">
                          <CountryFlag flag={user.countryFlag} size="xs" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <CountryFlag flag={user.countryFlag} size="xs" title="Competitor country" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </span>
                          {isMe && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1 py-0.2 rounded font-bold font-mono">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-500 font-mono">
                            <Flame className="w-3 h-3 fill-amber-500" /> {user.streak}d streak
                          </span>
                          <span>·</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">
                            {user.wordsLearned} words
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* XP & Weekly Delta */}
                    <div className="text-right">
                      <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {user.xp} <span className="text-[10px] text-slate-400 font-normal">XP</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-0.5">
                        <ArrowUp className="w-2.5 h-2.5" /> +{user.weeklyDelta}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Demotion zone indicator */}
            <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ArrowDown className="w-3.5 h-3.5 text-rose-600" /> DEMOTION ZONE
              </span>
              <span className="text-[10px] opacity-80 font-normal">Ranks 9–10</span>
            </div>

          </div>
        )}

        {/* COLUMN 2: LOCAL FRIENDS & STUDY GROUP SEPARATE COMPUTATION COLUMN */}
        {(layoutView === 'split' || layoutView === 'friends') && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col">
            
            {/* Column Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Local Friends Circle Computation
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Ranked by Words Learned · Head-to-Head Comparison
                    </p>
                  </div>
                </div>

                {/* Squad Selector Pill Dropdown */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-medium">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedFriendCircle('all');
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      selectedFriendCircle === 'all'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All Friends ({allFriendsList.length})
                  </button>
                  {groups.slice(0, 2).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedFriendCircle(g.id);
                        setActiveGroupId(g.id);
                      }}
                      className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                        selectedFriendCircle === g.id
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{g.avatar}</span>
                      <span className="hidden sm:inline">{g.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Squad Collective Goal Banner */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-500/20">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  Squad Collective Target: {groupTotalWords} / {groupTargetWords} Words
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {groupProgressPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${groupProgressPct}%` }}
                />
              </div>
            </div>

            {/* Friend Comparison Header Banner */}
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
              <span>FRIENDS WORD PROGRESS COMPUTATION</span>
              <span className="text-[10px] opacity-80 font-normal">
                Your Words: <strong className="font-mono">{currentUser.wordsLearned}</strong>
              </span>
            </div>

            {/* Friend Rows with Direct Word & Streak Computation */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
              {currentDisplayedFriends.map((friend, idx) => {
                const rank = idx + 1;
                const isMe = friend.isCurrentUser;
                const wordsDiff = friend.wordsLearned - currentUser.wordsLearned;

                return (
                  <div
                    key={friend.id}
                    className={`flex items-center justify-between px-4 sm:px-5 py-3.5 transition-colors ${
                      isMe
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 font-semibold border-l-4 border-l-emerald-500'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank, Country Flag, Avatar & Friend Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-mono font-bold text-xs text-slate-400">
                        #{rank}
                      </div>

                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        {/* Country Flag badge on avatar */}
                        <span className="absolute -bottom-1 -right-1">
                          <CountryFlag flag={friend.countryFlag || '🇺🇸'} size="xs" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          {/* Country Flag strictly in front of friend's name */}
                          <CountryFlag flag={friend.countryFlag || '🇺🇸'} size="xs" title="Country flag" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {friend.name}
                          </span>
                          {isMe && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1 py-0.2 rounded font-bold font-mono">
                              YOU
                            </span>
                          )}
                        </div>

                        {/* Relative Word Computation Indicator */}
                        <div className="flex items-center gap-2 text-[11px] mt-0.5">
                          {isMe ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              Base score · You
                            </span>
                          ) : wordsDiff > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold flex items-center gap-0.5">
                              <ArrowUp className="w-3 h-3 text-amber-500" /> +{wordsDiff} words ahead
                            </span>
                          ) : wordsDiff < 0 ? (
                            <span className="text-slate-400 font-mono flex items-center gap-0.5">
                              <ArrowDown className="w-3 h-3 text-slate-400" /> {Math.abs(wordsDiff)} words behind
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">Tied with you</span>
                          )}
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-mono">
                            <Flame className="w-3 h-3 fill-amber-500" /> {friend.streak}d
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Words Learned Count & Social Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-right">
                        <div className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {friend.wordsLearned} <span className="text-[10px] text-slate-400 font-normal">words</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {friend.xp} XP
                        </span>
                      </div>

                      {/* Duel & Cheer Action Buttons */}
                      {!isMe && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startWordDuel(friend)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title={`Challenge ${friend.name} to a 30-sec Word Duel`}
                          >
                            <Swords className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              soundEffects.playClick();
                              setLayoutView('chat');
                            }}
                            className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                            title={`Chat with ${friend.name} in Squad Chat`}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleHighFive(friend.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                            title={`Send high-five cheer to ${friend.name}`}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions of Friends Column */}
            <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Active Squad: <strong className="text-slate-800 dark:text-slate-200">{activeGroup?.name}</strong>
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowCreateGroupModal(true);
                }}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Group
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ================= INTEGRATED GROUP CHAT SECTION ================= */}
      {(layoutView === 'chat' || layoutView === 'split') && activeGroup && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeGroup.avatar}</span>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{activeGroup.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {activeGroup.code}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeGroup.members.length} members · Chat together, cheer streaks & share learned words
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {vocabList.length > 0 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setShowShareWordModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Share a Word</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowCreateGroupModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Group</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto">
            {activeGroup.chatMessages.map((msg) => {
              const isMe = msg.senderId === 'user-current' || msg.isCurrentUser;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className={`max-w-[78%] sm:max-w-[65%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {msg.senderName}
                      </span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Shared Vocabulary Word Card inside chat */}
                      {msg.sharedWord && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-white/15 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/60 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm">{msg.sharedWord.word}</span>
                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                const lang = SUPPORTED_LANGUAGES.find((l) => l.code === activeGroup.language) || SUPPORTED_LANGUAGES[0];
                                speakWord(msg.sharedWord?.word || '', lang.speechLang);
                              }}
                              className="p-1 rounded-md hover:bg-white/20 text-white"
                              title="Listen pronunciation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] opacity-80 italic mt-0.5">
                            [{msg.sharedWord.phonetic}]
                          </p>
                          <p className="text-xs font-semibold mt-1">
                            {msg.sharedWord.translation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Emoji Reactions */}
                    <div className={`flex flex-wrap items-center gap-1.5 pt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {msg.reactions.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => handleReact(msg.id, r.emoji)}
                          className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-mono text-[10px] text-slate-500">{r.count}</span>
                        </button>
                      ))}

                      {/* Quick React Buttons */}
                      <button
                        onClick={() => handleReact(msg.id, '🔥')}
                        className="text-slate-400 hover:text-amber-500 text-xs px-1"
                        title="React Fire"
                      >
                        🔥
                      </button>
                      <button
                        onClick={() => handleReact(msg.id, '👏')}
                        className="text-slate-400 hover:text-emerald-500 text-xs px-1"
                        title="React Clap"
                      >
                        👏
                      </button>
                      <button
                        onClick={() => handleReact(msg.id, '❤️')}
                        className="text-slate-400 hover:text-rose-500 text-xs px-1"
                        title="React Heart"
                      >
                        ❤️
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Send message to ${activeGroup.name} friends...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>
      )}

      {/* ================= MODAL: 1v1 RAPID WORD DUEL ================= */}
      {duelActive && duelFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-center">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <Swords className="w-4 h-4" /> 1v1 Rapid Word Duel
              </span>
              <button
                onClick={() => setDuelActive(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duel Scoreboard */}
            <div className="flex items-center justify-around py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <div className="text-center">
                <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                  <span>YOU</span> (<CountryFlag flag={currentUser.countryFlag || '🇺🇸'} size="xs" />)
                </span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{duelScore}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-rose-500 font-mono">VS</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 mt-1">
                  ⏱️ {duelTimeLeft}s
                </span>
              </div>

              <div className="text-center">
                <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                  <span>{duelFriend.name.split(' ')[0]}</span> (<CountryFlag flag={duelFriend.countryFlag || '🇺🇸'} size="xs" />)
                </span>
                <span className="text-2xl font-black font-mono text-amber-500">{duelOpponentScore}</span>
              </div>
            </div>

            {/* Duel Question */}
            {duelTimeLeft > 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Question #{duelQuestionIndex + 1}:
                </p>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {currentDuelQ.q}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {currentDuelQ.options.map((opt, optIdx) => (
                    <button
                      key={opt}
                      onClick={() => handleDuelAnswer(optIdx === currentDuelQ.correct)}
                      className="p-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {duelScore >= duelOpponentScore ? 'Victory! You Won the Duel! 🎉' : 'Great Effort! Practice Makes Perfect! 💪'}
                </h3>
                <p className="text-xs text-slate-500">
                  You earned +45 XP and +15 Gems for challenging {duelFriend.name}!
                </p>
                <button
                  onClick={() => setDuelActive(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-sm"
                >
                  Return to Leaderboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE STUDY GROUP ================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Create Study Group & Compete
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Form a private group to compete with friends and track words learned.
                </p>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Polyglot Masters or Paris Study Club"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Target Language</span>
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
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Learning Level
                  </label>
                  <select
                    value={newGroupLevel}
                    onChange={(e) => setNewGroupLevel(e.target.value as CEFRLevel)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {CEFR_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.id} ({lvl.name.split('·')[1]?.trim() || lvl.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Weekly Words Target
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="50"
                    value={newGroupTargetWords}
                    onChange={(e) => setNewGroupTargetWords(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description / Study Goal (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master 50 new words per week together"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                >
                  Create & Launch Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: COUNTRY FLAG PICKER FOR USER ================= */}
      {showFlagPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Choose Your Country Flag
              </h3>
              <button
                onClick={() => setShowFlagPickerModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              This flag is shown in front of your name in the leaderboard, friend circles, and chats.
            </p>

            <div className="grid grid-cols-4 gap-2 max-h-[260px] overflow-y-auto p-1">
              {WORLD_COUNTRY_FLAGS.map((c) => {
                const isSelected = currentUser.countryFlag === c.flag;
                return (
                  <button
                    key={c.flag}
                    onClick={() => handleSelectCountryFlag(c.flag)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CountryFlag countryCode={c.countryCode} flag={c.flag} size="lg" className="drop-shadow-2xs" />
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-1 truncate max-w-full">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SHARE A WORD TO GROUP CHAT ================= */}
      {showShareWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Share a Vocabulary Word to Squad
              </h3>
              <button
                onClick={() => setShowShareWordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Pick a word you reviewed to share with your friends in {activeGroup?.name}.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[280px] overflow-y-auto">
              {vocabList.slice(0, 8).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{item.word}</span>
                    <span className="text-[11px] text-slate-400 block">{item.translation}</span>
                  </div>
                  <button
                    onClick={() => handleShareWordToChat(item)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD FRIEND ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Connect with Friends
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter a username or friend code to start competing together.
            </p>

            <form onSubmit={handleFriendSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Friend Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. marco_roma or chloe_lyon"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
