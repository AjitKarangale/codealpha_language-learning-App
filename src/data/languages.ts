import { Language, VocabItem, LevelInfo, CEFRLevel, LanguageCode } from '../types';

export const CEFR_LEVELS: LevelInfo[] = [
  {
    id: 'A1',
    name: 'Level A1 · Absolute Beginner',
    tagline: 'Greetings, daily essentials, and survival basics',
    minXp: 0,
    description: 'Master core greetings, numbers, courtesy phrases, and daily objects.'
  },
  {
    id: 'A2',
    name: 'Level A2 · Elementary',
    tagline: 'Routine conversations, dining, shopping, and directions',
    minXp: 300,
    description: 'Navigate restaurants, describe personal surroundings, and ask for travel guidance.'
  },
  {
    id: 'B1',
    name: 'Level B1 · Intermediate',
    tagline: 'Personal experiences, storytelling, and practical opinions',
    minXp: 800,
    description: 'Express aspirations, describe events in past and future, and handle travel hurdles.'
  },
  {
    id: 'B2',
    name: 'Level B2 · Upper Intermediate',
    tagline: 'Cultural nuances, idioms, debate, and career dialogue',
    minXp: 1500,
    description: 'Interact with spontaneous native speakers and articulate detailed viewpoint arguments.'
  },
  {
    id: 'C1',
    name: 'Level C1 · Advanced Polyglot',
    tagline: 'Complex literature, poetic idioms, and implicit meaning',
    minXp: 2500,
    description: 'Understand demanding texts, flexible idiomatic expressions, and professional mastery.'
  }
];

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    countryCode: 'gb',
    speechLang: 'en-US',
    region: 'Global',
    description: 'Global lingua franca of international business, technology, and science.',
    speakers: '1.5 Billion',
    accentColor: '#3b82f6'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    countryCode: 'es',
    speechLang: 'es-ES',
    region: 'Europe',
    description: 'Vibrant Latin and European Spanish spoken across 21 sovereign nations.',
    speakers: '595 Million',
    accentColor: '#f97316'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    countryCode: 'fr',
    speechLang: 'fr-FR',
    region: 'Europe',
    description: 'The global language of diplomacy, culinary arts, philosophy, and elegance.',
    speakers: '320 Million',
    accentColor: '#2563eb'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    countryCode: 'jp',
    speechLang: 'ja-JP',
    region: 'Asia',
    description: 'Nuanced honorifics, kanji concepts, and poetic everyday expressions.',
    speakers: '128 Million',
    accentColor: '#ef4444'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    countryCode: 'de',
    speechLang: 'de-DE',
    region: 'Europe',
    description: 'Precise compound phrasing and the cultural engine of Central Europe.',
    speakers: '135 Million',
    accentColor: '#eab308'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    countryCode: 'it',
    speechLang: 'it-IT',
    region: 'Europe',
    description: 'Melodic cadence, expressive conversation, and rich Mediterranean heritage.',
    speakers: '85 Million',
    accentColor: '#10b981'
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文 (普通话)',
    flag: '🇨🇳',
    countryCode: 'cn',
    speechLang: 'zh-CN',
    region: 'Asia',
    description: 'Tonal beauty, ancient logographic ideograms, and world-leading culture.',
    speakers: '1.1 Billion',
    accentColor: '#dc2626'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    countryCode: 'in',
    speechLang: 'hi-IN',
    region: 'Asia',
    description: 'Melodious Indo-Aryan language written in classical Devanagari script.',
    speakers: '610 Million',
    accentColor: '#f59e0b'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    countryCode: 'sa',
    speechLang: 'ar-SA',
    region: 'Middle East & Africa',
    description: 'Ancient Semitic language with poetic roots, calligraphy, and rich dialects.',
    speakers: '420 Million',
    accentColor: '#059669'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    countryCode: 'br',
    speechLang: 'pt-BR',
    region: 'Americas',
    description: 'Lyrical Romance language of Brazil, Portugal, and lusophone Africa.',
    speakers: '260 Million',
    accentColor: '#16a34a'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    countryCode: 'ru',
    speechLang: 'ru-RU',
    region: 'Europe',
    description: 'Slavic language famous for classical literature and expressive Cyrillic script.',
    speakers: '255 Million',
    accentColor: '#6366f1'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    countryCode: 'kr',
    speechLang: 'ko-KR',
    region: 'Asia',
    description: 'Scientific Hangul alphabet, respectful speech tiers, and global pop culture.',
    speakers: '82 Million',
    accentColor: '#8b5cf6'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    countryCode: 'nl',
    speechLang: 'nl-NL',
    region: 'Europe',
    description: 'Warm Germanic language bridging English and German with friendly idioms.',
    speakers: '28 Million',
    accentColor: '#ea580c'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    countryCode: 'tr',
    speechLang: 'tr-TR',
    region: 'Middle East & Africa',
    description: 'Agglutinative Eurasian bridge language with vowel harmony and warmth.',
    speakers: '88 Million',
    accentColor: '#e11d48'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    countryCode: 'vn',
    speechLang: 'vi-VN',
    region: 'Asia',
    description: 'Musical tonal language written in Latin script with distinctive diacritics.',
    speakers: '95 Million',
    accentColor: '#d97706'
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    countryCode: 'id',
    speechLang: 'id-ID',
    region: 'Asia',
    description: 'Accessible Malayo-Polynesian language unifying the world’s largest archipelago.',
    speakers: '200 Million',
    accentColor: '#0284c7'
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    countryCode: 'pl',
    speechLang: 'pl-PL',
    region: 'Europe',
    description: 'Rich West Slavic language with unique consonant blends and vibrant history.',
    speakers: '45 Million',
    accentColor: '#be123c'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    countryCode: 'gr',
    speechLang: 'el-GR',
    region: 'Europe',
    description: 'Cradle of Western philosophy, mathematics, drama, and Mediterranean poetry.',
    speakers: '14 Million',
    accentColor: '#0ea5e9'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    countryCode: 'bd',
    speechLang: 'bn-IN',
    region: 'Asia',
    description: 'Sweet poetic language of Nobel laureate Tagore, spoken in Bengal & Bangladesh.',
    speakers: '270 Million',
    accentColor: '#059669'
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    countryCode: 'ke',
    speechLang: 'sw-KE',
    region: 'Middle East & Africa',
    description: 'East African Bantu lingua franca of unity, hospitality, and wildlife heritage.',
    speakers: '100 Million',
    accentColor: '#7c3aed'
  }
];

export const INITIAL_VOCAB_DATABASE: VocabItem[] = [
  // =================== SPANISH (LEVELS A1 -> C1) ===================
  {
    id: 'es-a1-1',
    language: 'es',
    level: 'A1',
    word: 'Hola, ¿cómo estás?',
    phonetic: 'OH-lah, KOH-moh es-TAHS',
    translation: 'Hello, how are you?',
    translationsByBaseLang: {
      hi: 'नमस्ते, आप कैसे हैं?',
      fr: 'Bonjour, comment allez-vous ?',
      de: 'Hallo, wie geht es dir?',
      it: 'Ciao, come stai?',
      zh: '你好，你好吗？',
      ja: 'こんにちは、お元気ですか？'
    },
    partOfSpeech: 'phrase',
    exampleTarget: 'Hola, ¿cómo estás hoy amigo?',
    exampleTranslation: 'Hello, how are you today my friend?',
    exampleTranslationsByBaseLang: {
      hi: 'नमस्ते, आज आप कैसे हैं मेरे दोस्त?',
      fr: 'Bonjour, comment vas-tu aujourd\'hui mon ami ?',
      de: 'Hallo, wie geht es dir heute mein Freund?'
    },
    notes: 'The universal warm Spanish greeting.',
    box: 4,
    reviewCount: 6,
    retentionScore: 95
  },
  {
    id: 'es-a1-2',
    language: 'es',
    level: 'A1',
    word: 'gracias',
    phonetic: 'GRAH-syahs',
    translation: 'thank you',
    translationsByBaseLang: {
      hi: 'धन्यवाद / शुक्रिया',
      fr: 'merci',
      de: 'danke',
      it: 'grazie',
      zh: '谢谢',
      ja: 'ありがとう'
    },
    partOfSpeech: 'interjection',
    exampleTarget: 'Muchas gracias por su hospitalidad.',
    exampleTranslation: 'Thank you very much for your hospitality.',
    notes: 'Essential polite word in all Spanish-speaking countries.',
    box: 4,
    reviewCount: 8,
    retentionScore: 98
  },
  {
    id: 'es-a2-1',
    language: 'es',
    level: 'A2',
    word: 'la cuenta, por favor',
    phonetic: 'lah KWEN-tah por fah-VOR',
    translation: 'the bill, please',
    translationsByBaseLang: {
      hi: 'बिल लाइए, कृपया',
      fr: 'l\'addition, s\'il vous plaît',
      de: 'die Rechnung, bitte',
      it: 'il conto, per favore',
      zh: '请结账',
      ja: 'お会計をお願いします'
    },
    partOfSpeech: 'phrase (dining)',
    exampleTarget: 'Camarero, ¿nos trae la cuenta, por favor?',
    exampleTranslation: 'Waiter, could you bring us the bill, please?',
    notes: 'Standard phrase when finishing dining at a café or restaurant.',
    box: 3,
    reviewCount: 4,
    retentionScore: 85
  },
  {
    id: 'es-a2-2',
    language: 'es',
    level: 'A2',
    word: 'acogedor',
    phonetic: 'ah-koh-heh-DOR',
    translation: 'cozy / welcoming',
    translationsByBaseLang: {
      hi: 'आरामदायक / स्वागत करने वाला',
      fr: 'chaleureux / accueillant',
      de: 'gemütlich / einladend',
      it: 'accogliente',
      zh: '温馨的 / 宜人的',
      ja: '居心地の良い'
    },
    partOfSpeech: 'adjective',
    exampleTarget: 'Esta pequeña cafetería tiene un ambiente muy acogedor.',
    exampleTranslation: 'This little cafe has a very cozy atmosphere.',
    notes: 'From verb "acoger" (to welcome).',
    box: 3,
    reviewCount: 5,
    retentionScore: 88
  },
  {
    id: 'es-b1-1',
    language: 'es',
    level: 'B1',
    word: 'desarrollar',
    phonetic: 'deh-sah-rroh-YAR',
    translation: 'to develop / to expand',
    translationsByBaseLang: {
      hi: 'विकसित करना',
      fr: 'développer',
      de: 'entwickeln',
      it: 'sviluppare',
      zh: '开发 / 发展',
      ja: '開発する / 発展させる'
    },
    partOfSpeech: 'verb',
    exampleTarget: 'Queremos desarrollar una aplicación fácil de usar.',
    exampleTranslation: 'We want to develop an easy-to-use application.',
    notes: 'Common in personal growth and technology.',
    box: 2,
    reviewCount: 3,
    retentionScore: 72
  },
  {
    id: 'es-b1-2',
    language: 'es',
    level: 'B1',
    word: 'madrugada',
    phonetic: 'mah-droo-GAH-dah',
    translation: 'early morning / dawn hours',
    translationsByBaseLang: {
      hi: 'भोर / सुबह-सवेरे',
      fr: 'petit matin / aube',
      de: 'Morgendämmerung',
      it: 'alba / prime ore del mattino',
      zh: '清晨 / 黎明',
      ja: '夜明け / 早朝'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'Me gusta estudiar en la madrugada cuando todo está en silencio.',
    exampleTranslation: 'I like to study in the early morning hours when everything is silent.',
    notes: 'The quiet hours between midnight and sunrise.',
    box: 2,
    reviewCount: 3,
    retentionScore: 70
  },
  {
    id: 'es-b2-1',
    language: 'es',
    level: 'B2',
    word: 'sobremesa',
    phonetic: 'soh-breh-MEH-sah',
    translation: 'post-meal conversation at the table',
    translationsByBaseLang: {
      hi: 'खाने के बाद की बातचीत',
      fr: 'discussion d\'après-repas',
      de: 'Tischgespräch nach dem Essen',
      it: 'chiacchierata dopo pasto a tavola',
      zh: '餐后闲谈',
      ja: '食後の歓談'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'Disfrutamos de una larga sobremesa con amigos después de cenar.',
    exampleTranslation: 'We enjoyed a long post-dinner conversation with friends after eating.',
    notes: 'Famous untranslatable cultural concept of Spain and Latin America.',
    box: 3,
    reviewCount: 4,
    retentionScore: 82
  },
  {
    id: 'es-c1-1',
    language: 'es',
    level: 'C1',
    word: 'imprescindible',
    phonetic: 'eem-preh-seen-DEE-bleh',
    translation: 'essential / indispensable',
    translationsByBaseLang: {
      hi: 'अपरिहार्य / अत्यंत आवश्यक',
      fr: 'indispensable',
      de: 'unabdingbar',
      it: 'imprescindibile',
      zh: '不可或缺的',
      ja: '必要不可欠な'
    },
    partOfSpeech: 'adjective',
    exampleTarget: 'La constancia diaria es imprescindible para alcanzar el dominio.',
    exampleTranslation: 'Daily consistency is indispensable for reaching mastery.',
    notes: 'Higher register than "necesario".',
    box: 1,
    reviewCount: 1,
    retentionScore: 45
  },

  // =================== JAPANESE (LEVELS A1 -> C1) ===================
  {
    id: 'ja-a1-1',
    language: 'ja',
    level: 'A1',
    word: 'こんにちは',
    phonetic: 'kon-ni-chi-wa',
    translation: 'hello / good day',
    translationsByBaseLang: {
      hi: 'नमस्ते',
      es: 'hola / buenos días',
      fr: 'bonjour',
      de: 'guten Tag / hallo',
      it: 'buongiorno',
      zh: '你好'
    },
    partOfSpeech: 'greeting',
    exampleTarget: '皆さん、こんにちは！',
    exampleTranslation: 'Hello everyone!',
    notes: 'Written with は (ha) but pronounced "wa".',
    box: 5,
    reviewCount: 8,
    retentionScore: 98
  },
  {
    id: 'ja-a1-2',
    language: 'ja',
    level: 'A1',
    word: 'ありがとう',
    phonetic: 'a-ri-ga-tou',
    translation: 'thank you',
    translationsByBaseLang: {
      hi: 'धन्यवाद',
      es: 'gracias',
      fr: 'merci',
      de: 'danke',
      it: 'grazie',
      zh: '谢谢'
    },
    partOfSpeech: 'phrase',
    exampleTarget: '手伝ってくれてありがとう。',
    exampleTranslation: 'Thank you for helping me.',
    notes: 'Polite version is ありがとうございます (arigatou gozaimasu).',
    box: 4,
    reviewCount: 7,
    retentionScore: 94
  },
  {
    id: 'ja-a2-1',
    language: 'ja',
    level: 'A2',
    word: '美味しい (おいしい)',
    phonetic: 'o-i-shi-i',
    translation: 'delicious / tasty',
    translationsByBaseLang: {
      hi: 'स्वादिष्ट / लज़ीज़',
      es: 'delicioso / rico',
      fr: 'délicieux',
      de: 'lecker',
      it: 'buonissimo / delizioso',
      zh: '美味的 / 好吃'
    },
    partOfSpeech: 'i-adjective',
    exampleTarget: 'このラーメンは本当に美味しいです！',
    exampleTranslation: 'This ramen is truly delicious!',
    notes: 'Exclaimed frequently when dining out.',
    box: 3,
    reviewCount: 4,
    retentionScore: 86
  },
  {
    id: 'ja-b1-1',
    language: 'ja',
    level: 'B1',
    word: '継続 (けいぞく)',
    phonetic: 'kei-zoku',
    translation: 'continuity / persistence',
    translationsByBaseLang: {
      hi: 'निरंतरता / जारी रखना',
      es: 'continuidad / perseverancia',
      fr: 'continuité / persévérance',
      de: 'Kontinuität / Ausdauer',
      it: 'continuità / costanza',
      zh: '坚持 / 持续'
    },
    partOfSpeech: 'noun / verb',
    exampleTarget: '継続は力なり、毎日少しずつ勉強しましょう。',
    exampleTranslation: 'Continuity is power; let\'s study a little every day.',
    notes: 'Japanese proverb: 継続は力なり.',
    box: 3,
    reviewCount: 5,
    retentionScore: 88
  },
  {
    id: 'ja-b2-1',
    language: 'ja',
    level: 'B2',
    word: '木漏れ日 (こもれび)',
    phonetic: 'ko-mo-re-bi',
    translation: 'sunlight filtering through trees',
    translationsByBaseLang: {
      hi: 'पेड़ों की शाखाओं से छनती धूप',
      es: 'rayos de sol filtrados por los árboles',
      fr: 'lumière du soleil filtrant à travers les arbres',
      de: 'Sonnenlicht durch die Baumkronen',
      it: 'luce del sole filtrata tra le fronde',
      zh: '树叶缝隙透过的阳光'
    },
    partOfSpeech: 'noun',
    exampleTarget: '森の中を歩きながら木漏れ日を楽しんだ。',
    exampleTranslation: 'Walking through the forest, I enjoyed the sunlight filtering through trees.',
    notes: 'Classic poetic untranslatable Japanese imagery.',
    box: 2,
    reviewCount: 3,
    retentionScore: 78
  },
  {
    id: 'ja-c1-1',
    language: 'ja',
    level: 'C1',
    word: '一期一会 (いちごいちえ)',
    phonetic: 'i-chi-go i-chi-e',
    translation: 'once-in-a-lifetime encounter',
    translationsByBaseLang: {
      hi: 'जीवन में एक बार होने वाला अनमोल मिलन',
      es: 'encuentro único en la vida',
      fr: 'rencontre unique dans une vie',
      de: 'einmalige Begegnung im Leben',
      it: 'incontro unico nella vita',
      zh: '一生一世的相逢'
    },
    partOfSpeech: 'idiom (yojijukugo)',
    exampleTarget: '旅先での出会いはまさに一期一会です。',
    exampleTranslation: 'Encounters on a journey are truly once-in-a-lifetime moments.',
    notes: 'Centuries-old tea ceremony philosophy.',
    box: 1,
    reviewCount: 2,
    retentionScore: 50
  },

  // =================== FRENCH (LEVELS A1 -> C1) ===================
  {
    id: 'fr-a1-1',
    language: 'fr',
    level: 'A1',
    word: 'bonjour',
    phonetic: 'bohn-ZHOOR',
    translation: 'good day / hello',
    translationsByBaseLang: {
      hi: 'नमस्ते / शुभ दिन',
      es: 'hola / buenos días',
      de: 'guten Tag',
      it: 'buongiorno',
      zh: '你好 / 早上好'
    },
    partOfSpeech: 'greeting',
    exampleTarget: 'Bonjour monsieur, comment allez-vous ?',
    exampleTranslation: 'Good day sir, how are you?',
    notes: 'Polite and indispensable in all shops and cafés.',
    box: 5,
    reviewCount: 9,
    retentionScore: 99
  },
  {
    id: 'fr-a2-1',
    language: 'fr',
    level: 'A2',
    word: 's’il vous plaît',
    phonetic: 'seel voo PLEH',
    translation: 'please',
    translationsByBaseLang: {
      hi: 'कृपया',
      es: 'por favor',
      de: 'bitte',
      it: 'per favore',
      zh: '请'
    },
    partOfSpeech: 'courtesy phrase',
    exampleTarget: 'Un croissant et un café, s’il vous plaît.',
    exampleTranslation: 'A croissant and a coffee, please.',
    notes: 'Informal equivalent is "s\'il te plaît".',
    box: 4,
    reviewCount: 6,
    retentionScore: 92
  },
  {
    id: 'fr-b1-1',
    language: 'fr',
    level: 'B1',
    word: 'quotidien',
    phonetic: 'koh-tee-DYEN',
    translation: 'daily routine / everyday life',
    translationsByBaseLang: {
      hi: 'दैनिक दिनचर्या',
      es: 'cotidiano / vida diaria',
      de: 'Alltag / täglich',
      it: 'quotidiano / vita di tutti i giorni',
      zh: '日常生活'
    },
    partOfSpeech: 'noun / adj',
    exampleTarget: 'La lecture fait partie de mon quotidien.',
    exampleTranslation: 'Reading is part of my daily routine.',
    notes: 'Feminine form is "quotidienne".',
    box: 3,
    reviewCount: 4,
    retentionScore: 84
  },
  {
    id: 'fr-b2-1',
    language: 'fr',
    level: 'B2',
    word: 'flâner',
    phonetic: 'flah-NAY',
    translation: 'to stroll aimlessly / wander',
    translationsByBaseLang: {
      hi: 'बिना किसी मकसद के टहलना',
      es: 'pasear sin rumbo fijo',
      de: 'flanieren / umherschlendern',
      it: 'gironzolare / passeggiare oziosamente',
      zh: '漫步闲逛'
    },
    partOfSpeech: 'verb',
    exampleTarget: 'J’adore flâner dans les ruelles du quartier latin.',
    exampleTranslation: 'I love strolling aimlessly through the Latin Quarter alleys.',
    notes: 'Quintessential Parisian literary tradition.',
    box: 2,
    reviewCount: 3,
    retentionScore: 78
  },
  {
    id: 'fr-c1-1',
    language: 'fr',
    level: 'C1',
    word: 'dépaysement',
    phonetic: 'day-peh-eez-MAHN',
    translation: 'feeling of cultural disorientation and wonder',
    translationsByBaseLang: {
      hi: 'नयी जगह में अनूठा अनुभव',
      es: 'sensación de estar fuera del propio entorno',
      de: 'das Gefühl, in der Fremde zu sein',
      it: 'spaesamento benefico in terra straniera',
      zh: '异国情调 / 身处异乡的新奇感'
    },
    partOfSpeech: 'noun (m)',
    exampleTarget: 'Ce voyage lointain offre un vrai dépaysement.',
    exampleTranslation: 'This faraway trip offers true escapism and scenery change.',
    notes: 'From pays (country).',
    box: 1,
    reviewCount: 1,
    retentionScore: 40
  },

  // =================== GERMAN (LEVELS A1 -> C1) ===================
  {
    id: 'de-a1-1',
    language: 'de',
    level: 'A1',
    word: 'Guten Tag',
    phonetic: 'GOO-ten TAHK',
    translation: 'good day / hello',
    translationsByBaseLang: {
      hi: 'शुभ दिन / नमस्ते',
      es: 'buenos días / hola',
      fr: 'bonjour',
      it: 'buongiorno',
      zh: '你好 / 日安'
    },
    partOfSpeech: 'greeting',
    exampleTarget: 'Guten Tag! Wie kann ich Ihnen helfen?',
    exampleTranslation: 'Good day! How can I help you?',
    notes: 'Standard polite German greeting.',
    box: 5,
    reviewCount: 7,
    retentionScore: 96
  },
  {
    id: 'de-a2-1',
    language: 'de',
    level: 'A2',
    word: 'Gemütlichkeit',
    phonetic: 'geh-MOOT-likh-kite',
    translation: 'coziness / warmth and good cheer',
    translationsByBaseLang: {
      hi: 'सुकून और आत्मीयता',
      es: 'comodidad y calidez hogareña',
      fr: 'convivialité et chaleur',
      it: 'accoglienza e calore',
      zh: '舒适惬意'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'Die rustikale Berghütte strahlt pure Gemütlichkeit aus.',
    exampleTranslation: 'The rustic mountain cabin radiates pure coziness.',
    notes: 'Key cultural feeling in German-speaking lands.',
    box: 3,
    reviewCount: 4,
    retentionScore: 82
  },
  {
    id: 'de-b1-1',
    language: 'de',
    level: 'B1',
    word: 'Feierabend',
    phonetic: 'FY-er-ah-bent',
    translation: 'end of the working day',
    translationsByBaseLang: {
      hi: 'काम खत्म होने का समय',
      es: 'fin de la jornada laboral',
      fr: 'fin de journée de travail',
      it: 'fine della giornata lavorativa',
      zh: '下班时间'
    },
    partOfSpeech: 'noun (m)',
    exampleTarget: 'Es ist 18 Uhr, wir machen jetzt endlich Feierabend!',
    exampleTranslation: 'It is 6 PM, we are finally calling it a day!',
    notes: 'Celebrates work-life harmony.',
    box: 4,
    reviewCount: 5,
    retentionScore: 90
  },
  {
    id: 'de-b2-1',
    language: 'de',
    level: 'B2',
    word: 'Fernweh',
    phonetic: 'FERN-vay',
    translation: 'longing for distant places / wanderlust',
    translationsByBaseLang: {
      hi: 'दूर देशों की यात्रा की तीव्र चाह',
      es: 'ansias de viajar a tierras lejanas',
      fr: 'nostalgie des pays lointains',
      it: 'nostalgia di luoghi lontani',
      zh: '对远方的渴望'
    },
    partOfSpeech: 'noun (n)',
    exampleTarget: 'Beim Anblick der Weltkarte packte ihn das Fernweh.',
    exampleTranslation: 'Looking at the world map, wanderlust seized him.',
    notes: 'Opposite of Heimweh (homesickness).',
    box: 3,
    reviewCount: 4,
    retentionScore: 84
  },
  {
    id: 'de-c1-1',
    language: 'de',
    level: 'C1',
    word: 'Durchhaltevermögen',
    phonetic: 'DOORKH-hal-teh-fer-mer-gen',
    translation: 'perseverance / endurance / grit',
    translationsByBaseLang: {
      hi: 'कड़ा धैर्य और सहनशीलता',
      es: 'aguante y tenacidad inquebrantable',
      fr: 'persévérance et ténacité',
      it: 'capacità di perseverare',
      zh: '坚韧不拔的毅力'
    },
    partOfSpeech: 'noun (n)',
    exampleTarget: 'Erfolg erfordert Geduld und Durchhaltevermögen.',
    exampleTranslation: 'Success requires patience and endurance.',
    notes: 'Compound word: durchhalten (persevere) + Vermögen (capacity).',
    box: 1,
    reviewCount: 1,
    retentionScore: 48
  },

  // =================== HINDI (LEVELS A1 -> C1) ===================
  {
    id: 'hi-a1-1',
    language: 'hi',
    level: 'A1',
    word: 'नमस्ते (Namaste)',
    phonetic: 'nuh-muh-STAY',
    translation: 'hello / greetings',
    translationsByBaseLang: {
      es: 'hola / saludos',
      fr: 'bonjour',
      de: 'hallo / guten Tag',
      it: 'salve / ciao',
      zh: '你好'
    },
    partOfSpeech: 'greeting',
    exampleTarget: 'नमस्ते! आप कैसे हैं?',
    exampleTranslation: 'Hello! How are you?',
    notes: 'Respectful greeting accompanied by folded hands.',
    box: 5,
    reviewCount: 8,
    retentionScore: 98
  },
  {
    id: 'hi-a2-1',
    language: 'hi',
    level: 'A2',
    word: 'धन्यवाद (Dhanyavaad)',
    phonetic: 'dhun-yuh-VAAD',
    translation: 'thank you',
    translationsByBaseLang: {
      es: 'gracias',
      fr: 'merci',
      de: 'danke',
      it: 'grazie',
      zh: '谢谢'
    },
    partOfSpeech: 'noun / phrase',
    exampleTarget: 'आपकी मदद के लिए बहुत धन्यवाद।',
    exampleTranslation: 'Thank you very much for your help.',
    notes: 'Formal appreciation in Hindi.',
    box: 4,
    reviewCount: 6,
    retentionScore: 92
  },
  {
    id: 'hi-b1-1',
    language: 'hi',
    level: 'B1',
    word: 'दोस्ती (Dosti)',
    phonetic: 'DOS-tee',
    translation: 'friendship',
    translationsByBaseLang: {
      es: 'amistad',
      fr: 'amitié',
      de: 'Freundschaft',
      it: 'amicizia',
      zh: '友谊'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'सच्ची दोस्ती जीवन का सबसे बड़ा उपहार है।',
    exampleTranslation: 'True friendship is the greatest gift in life.',
    notes: 'Celebrated cultural bond across India.',
    box: 3,
    reviewCount: 4,
    retentionScore: 86
  },
  {
    id: 'hi-b2-1',
    language: 'hi',
    level: 'B2',
    word: 'जिज्ञासा (Jigyasa)',
    phonetic: 'jig-YAH-sah',
    translation: 'curiosity / desire to learn',
    translationsByBaseLang: {
      es: 'curiosidad e ingenio',
      fr: 'curiosité intellectuelle',
      de: 'Wissbegier / Neugier',
      it: 'curiosità',
      zh: '求知欲 / 好奇心'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'नया ज्ञान पाने के लिए जिज्ञासा ज़रूरी है।',
    exampleTranslation: 'Curiosity is essential for acquiring new knowledge.',
    notes: 'Derived from Sanskrit "jñā" (to know).',
    box: 2,
    reviewCount: 3,
    retentionScore: 75
  },
  {
    id: 'hi-c1-1',
    language: 'hi',
    level: 'C1',
    word: 'अपूर्व (Apoorva)',
    phonetic: 'uh-POOR-vuh',
    translation: 'unprecedented / matchless',
    translationsByBaseLang: {
      es: 'sin precedentes / inigualable',
      fr: 'sans précédent / exceptionnel',
      de: 'noch nie dagewesen / unvergleichlich',
      it: 'senza precedenti / unico',
      zh: '空前绝后的'
    },
    partOfSpeech: 'adjective',
    exampleTarget: 'उनकी प्रतिभा वाकई अपूर्व और प्रेरणादायक है।',
    exampleTranslation: 'Their talent is truly unprecedented and inspiring.',
    notes: 'Literally: like nothing that came before.',
    box: 1,
    reviewCount: 1,
    retentionScore: 42
  },

  // =================== MANDARIN CHINESE (LEVELS A1 -> C1) ===================
  {
    id: 'zh-a1-1',
    language: 'zh',
    level: 'A1',
    word: '你好 (Nǐ hǎo)',
    phonetic: 'nee how',
    translation: 'hello',
    translationsByBaseLang: {
      hi: 'नमस्ते',
      es: 'hola',
      fr: 'bonjour',
      de: 'hallo',
      it: 'ciao'
    },
    partOfSpeech: 'greeting',
    exampleTarget: '你好！很高兴认识你。',
    exampleTranslation: 'Hello! Nice to meet you.',
    notes: 'Literal: "You good". Tones: 3rd + 3rd (half 3rd + 2nd).',
    box: 5,
    reviewCount: 8,
    retentionScore: 98
  },
  {
    id: 'zh-a2-1',
    language: 'zh',
    level: 'A2',
    word: '谢谢 (Xièxie)',
    phonetic: 'shyeh-shyeh',
    translation: 'thank you',
    translationsByBaseLang: {
      hi: 'धन्यवाद',
      es: 'gracias',
      fr: 'merci',
      de: 'danke',
      it: 'grazie'
    },
    partOfSpeech: 'phrase',
    exampleTarget: '太感谢你了！',
    exampleTranslation: 'Thank you so much!',
    notes: '4th tone followed by neutral tone.',
    box: 4,
    reviewCount: 6,
    retentionScore: 94
  },
  {
    id: 'zh-b1-1',
    language: 'zh',
    level: 'B1',
    word: '坚持 (Jiānchí)',
    phonetic: 'jyen-chur',
    translation: 'persistence / to persevere',
    translationsByBaseLang: {
      hi: 'लगातार लगे रहना',
      es: 'perseverar / insistir',
      fr: 'persévérer / s\'accrocher',
      de: 'durchhalten / beharren',
      it: 'perseverare'
    },
    partOfSpeech: 'verb',
    exampleTarget: '坚持每天学习，一定会有收获。',
    exampleTranslation: 'Persisting with daily study will surely yield results.',
    notes: 'Composed of 坚 (firm) + 持 (hold).',
    box: 3,
    reviewCount: 4,
    retentionScore: 85
  },
  {
    id: 'zh-b2-1',
    language: 'zh',
    level: 'B2',
    word: '温故知新 (Wēn gù zhī xīn)',
    phonetic: 'wen goo jur sheen',
    translation: 'gaining new insight by reviewing the past',
    translationsByBaseLang: {
      hi: 'पुराने अनुभव से नया ज्ञान पाना',
      es: 'repasar lo aprendido para comprender lo nuevo',
      fr: 'revisiter le passé pour en tirer de nouvelles leçons',
      de: 'aus dem Alten Neues lernen',
      it: 'comprendere il nuovo attraverso il vecchio'
    },
    partOfSpeech: 'chengyu (idiom)',
    exampleTarget: '复习词汇就是温故知新的过程。',
    exampleTranslation: 'Reviewing vocabulary is the process of gaining new insight from past learning.',
    notes: 'From Confucius\' Analects.',
    box: 2,
    reviewCount: 2,
    retentionScore: 65
  },
  {
    id: 'zh-c1-1',
    language: 'zh',
    level: 'C1',
    word: '豁然开朗 (Huò rán kāi lǎng)',
    phonetic: 'hwaw rahn kye lahng',
    translation: 'sudden burst of clarity / epiphany',
    translationsByBaseLang: {
      hi: 'अचानक सब कुछ स्पष्ट हो जाना',
      es: 'iluminación o claridad repentina',
      fr: 'soudaine illumination et clarté',
      de: 'plötzliche Erleuchtung und Klarheit',
      it: 'improvvisa chiarezza mentale'
    },
    partOfSpeech: 'chengyu (idiom)',
    exampleTarget: '听了老师的解释，他顿觉豁然开朗。',
    exampleTranslation: 'After hearing the teacher’s explanation, he suddenly had an epiphany.',
    notes: 'From Tao Yuanming’s Peach Blossom Spring.',
    box: 1,
    reviewCount: 1,
    retentionScore: 40
  },

  // =================== ITALIAN (LEVELS A1 -> C1) ===================
  {
    id: 'it-a1-1',
    language: 'it',
    level: 'A1',
    word: 'buongiorno',
    phonetic: 'bwon-DJOR-noh',
    translation: 'good morning / hello',
    translationsByBaseLang: {
      hi: 'शुभ प्रभात / नमस्ते',
      es: 'buenos días',
      fr: 'bonjour',
      de: 'guten Morgen',
      zh: '早上好'
    },
    partOfSpeech: 'greeting',
    exampleTarget: 'Buongiorno a tutti!',
    exampleTranslation: 'Good morning everyone!',
    notes: 'Used until early afternoon.',
    box: 5,
    reviewCount: 7,
    retentionScore: 97
  },
  {
    id: 'it-a2-1',
    language: 'it',
    level: 'A2',
    word: 'passeggiata',
    phonetic: 'pahs-sedj-JAH-tah',
    translation: 'leisurely stroll / evening walk',
    translationsByBaseLang: {
      hi: 'शाम की सुकून भरी सैर',
      es: 'paseo relajado al atardecer',
      fr: 'promenade tranquille',
      de: 'Abendspaziergang',
      zh: '散步漫步'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'Facciamo una passeggiata in piazza dopo il gelato.',
    exampleTranslation: 'Let’s take a leisurely stroll in the piazza after gelato.',
    notes: 'Essential Italian lifestyle ritual.',
    box: 3,
    reviewCount: 4,
    retentionScore: 84
  },
  {
    id: 'it-b1-1',
    language: 'it',
    level: 'B1',
    word: 'meraviglia',
    phonetic: 'meh-rah-VEEL-yah',
    translation: 'wonder / marvel',
    translationsByBaseLang: {
      hi: 'अद्भुत आश्चर्य',
      es: 'maravilla',
      fr: 'merveille',
      de: 'Wunder / Staunen',
      zh: '奇迹 / 惊叹'
    },
    partOfSpeech: 'noun (f)',
    exampleTarget: 'Gli occhi dei bambini brillavano di meraviglia.',
    exampleTranslation: 'The children’s eyes were shining with wonder.',
    notes: 'From Latin mirabilia.',
    box: 2,
    reviewCount: 3,
    retentionScore: 76
  },
  {
    id: 'it-b2-1',
    language: 'it',
    level: 'B2',
    word: 'mozzafiato',
    phonetic: 'moht-tsah-FYAH-toh',
    translation: 'breathtaking / stunning',
    translationsByBaseLang: {
      hi: 'सांस रोक देने वाला दृश्य',
      es: 'impresionante / que quita el aliento',
      fr: 'à couper le souffle',
      de: 'atemberaubend',
      zh: '令人叹为观止的'
    },
    partOfSpeech: 'adjective (invariable)',
    exampleTarget: 'Il tramonto sulle colline toscane era un panorama mozzafiato.',
    exampleTranslation: 'The sunset over the Tuscan hills was a breathtaking panorama.',
    notes: 'Compound: mozzare (to cut off) + fiato (breath).',
    box: 3,
    reviewCount: 4,
    retentionScore: 88
  },
  {
    id: 'it-c1-1',
    language: 'it',
    level: 'C1',
    word: 'indispensabile',
    phonetic: 'een-dee-spen-SAH-bee-leh',
    translation: 'essential / indispensable',
    translationsByBaseLang: {
      hi: 'अपरिहार्य',
      es: 'indispensable',
      fr: 'indispensable',
      de: 'unabdingbar',
      zh: '不可或缺的'
    },
    partOfSpeech: 'adjective',
    exampleTarget: 'La curiosità è indispensabile per la padronanza linguistica.',
    exampleTranslation: 'Curiosity is indispensable for linguistic mastery.',
    notes: 'High literary and formal cadence.',
    box: 1,
    reviewCount: 1,
    retentionScore: 50
  }
];

/**
 * Helper to get the correct translation based on user's native (base) language.
 * If user speaks Hindi and is learning Spanish, returns Hindi translation if available, else English.
 */
export function getTranslatedWord(
  item: VocabItem,
  baseLang: LanguageCode
): string {
  if (baseLang !== 'en' && item.translationsByBaseLang && item.translationsByBaseLang[baseLang]) {
    return item.translationsByBaseLang[baseLang]!;
  }
  return item.translation;
}

export function getTranslatedExample(
  item: VocabItem,
  baseLang: LanguageCode
): string {
  if (baseLang !== 'en' && item.exampleTranslationsByBaseLang && item.exampleTranslationsByBaseLang[baseLang]) {
    return item.exampleTranslationsByBaseLang[baseLang]!;
  }
  return item.exampleTranslation;
}
