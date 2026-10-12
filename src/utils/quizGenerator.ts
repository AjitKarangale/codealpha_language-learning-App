import { VocabItem, QuizQuestion, LanguageCode, CEFRLevel } from '../types';
import { getTranslatedWord, getTranslatedExample } from '../data/languages';

export function generateQuizForLanguage(
  vocabList: VocabItem[],
  currentLang: LanguageCode,
  baseLang: LanguageCode = 'en',
  levelFilter?: CEFRLevel,
  count: number = 5
): QuizQuestion[] {
  let langVocab = vocabList.filter((v) => v.language === currentLang);
  if (langVocab.length === 0) return [];

  // If level filter specified and has words in that level, prioritize them
  if (levelFilter) {
    const levelSpecific = langVocab.filter((v) => v.level === levelFilter);
    if (levelSpecific.length >= 2) {
      langVocab = levelSpecific;
    }
  }

  // Shuffle and pick target items
  const shuffled = [...langVocab].sort(() => Math.random() - 0.5);
  const selectedVocab = shuffled.slice(0, Math.min(count, shuffled.length));

  const questions: QuizQuestion[] = [];

  selectedVocab.forEach((item, index) => {
    const questionTypeIndex = index % 4;
    const trans = getTranslatedWord(item, baseLang);
    const exTrans = getTranslatedExample(item, baseLang);

    if (questionTypeIndex === 0) {
      // Multiple Choice: Word to Translation in user's base language
      const otherItems = langVocab.filter((v) => v.id !== item.id);
      const wrongTranslations = otherItems
        .map((v) => getTranslatedWord(v, baseLang))
        .filter((t) => t !== trans)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [trans, ...wrongTranslations].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(trans);

      questions.push({
        id: `q-${item.id}-mc`,
        vocabId: item.id,
        type: 'multiple-choice',
        prompt: `What does this word mean?`,
        subPrompt: item.word,
        audioText: item.word,
        options,
        correctOptionIndex: correctIndex,
        explanation: `"${item.word}" (${item.phonetic}) means "${trans}". Example: ${item.exampleTarget}`
      });
    } else if (questionTypeIndex === 1) {
      // Sentence Builder: Tap tiles in correct order
      const cleanTarget = item.exampleTarget.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?!]/g, '');
      const correctWords = cleanTarget.split(/\s+/).filter(Boolean);

      // Add 2 distractor words from other items
      const distractors = langVocab
        .filter((v) => v.id !== item.id)
        .map((v) => v.word.split(' ')[0])
        .slice(0, 2);

      const scrambled = [...correctWords, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q-${item.id}-sb`,
        vocabId: item.id,
        type: 'sentence-build',
        prompt: `Assemble the translation into the target language:`,
        subPrompt: `"${exTrans}"`,
        audioText: item.exampleTarget,
        correctSentence: cleanTarget,
        scrambledWords: scrambled,
        explanation: `Correct sentence: "${item.exampleTarget}" (${exTrans})`
      });
    } else if (questionTypeIndex === 2) {
      // Listening Comprehension: Audio speech synthesis playback
      const otherItems = langVocab.filter((v) => v.id !== item.id);
      const wrongWords = otherItems
        .map((v) => v.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [item.word, ...wrongWords].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(item.word);

      questions.push({
        id: `q-${item.id}-list`,
        vocabId: item.id,
        type: 'listening',
        prompt: `Listen closely and select the word you heard:`,
        subPrompt: `Tap speaker to repeat audio`,
        audioText: item.word,
        options,
        correctOptionIndex: correctIndex,
        explanation: `You heard "${item.word}" (${item.phonetic}) which translates to "${trans}".`
      });
    } else {
      // Reverse Translation: User base language meaning to Target Word
      const otherItems = langVocab.filter((v) => v.id !== item.id);
      const wrongOptions = otherItems
        .map((v) => v.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [item.word, ...wrongOptions].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(item.word);

      questions.push({
        id: `q-${item.id}-trans`,
        vocabId: item.id,
        type: 'translation',
        prompt: `How do you express:`,
        subPrompt: `"${trans}"`,
        audioText: item.word,
        options,
        correctOptionIndex: correctIndex,
        explanation: `"${trans}" is translated as "${item.word}" (${item.phonetic}).`
      });
    }
  });

  return questions;
}
