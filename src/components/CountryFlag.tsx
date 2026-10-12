import React, { useState } from 'react';
import { FLAG_SVGS } from '../data/flagSvgs';

// Maps language code to 2-letter ISO country code
export const LANG_TO_COUNTRY: Record<string, string> = {
  en: 'gb',
  es: 'es',
  fr: 'fr',
  ja: 'jp',
  de: 'de',
  it: 'it',
  zh: 'cn',
  hi: 'in',
  ar: 'sa',
  pt: 'br',
  ru: 'ru',
  ko: 'kr',
  nl: 'nl',
  tr: 'tr',
  vi: 'vn',
  id: 'id',
  pl: 'pl',
  el: 'gr',
  bn: 'bd',
  sw: 'ke'
};

// Maps common country/language names to 2-letter ISO country code
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'united states': 'us',
  'usa': 'us',
  'us': 'us',
  'united kingdom': 'gb',
  'uk': 'gb',
  'great britain': 'gb',
  'england': 'gb',
  'spain': 'es',
  'france': 'fr',
  'japan': 'jp',
  'germany': 'de',
  'italy': 'it',
  'china': 'cn',
  'india': 'in',
  'saudi arabia': 'sa',
  'brazil': 'br',
  'russia': 'ru',
  'south korea': 'kr',
  'korea': 'kr',
  'netherlands': 'nl',
  'turkey': 'tr',
  'vietnam': 'vn',
  'indonesia': 'id',
  'poland': 'pl',
  'greece': 'gr',
  'bangladesh': 'bd',
  'kenya': 'ke',
  'canada': 'ca',
  'australia': 'au',
  'mexico': 'mx'
};

// Converts Unicode Regional Indicator flag emojis (e.g. 🇬🇧, 🇪🇸, 🇺🇸) into 2-letter ISO country codes ('gb', 'es', 'us')
export function emojiToCountryCode(emoji?: string): string | null {
  if (!emoji || typeof emoji !== 'string') return null;
  const trimmed = emoji.trim();
  const chars = [...trimmed];
  if (chars.length >= 2) {
    const c0 = chars[0].codePointAt(0);
    const c1 = chars[1].codePointAt(0);
    if (c0 && c1 && c0 >= 0x1F1E6 && c0 <= 0x1F1FF && c1 >= 0x1F1E6 && c1 <= 0x1F1FF) {
      const code1 = String.fromCharCode(c0 - 0x1F1E6 + 65).toLowerCase();
      const code2 = String.fromCharCode(c1 - 0x1F1E6 + 65).toLowerCase();
      return `${code1}${code2}`;
    }
  }
  return null;
}

export interface CountryFlagProps {
  countryCode?: string;
  flag?: string; // emoji or country code or language code
  langCode?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  title?: string;
  alt?: string;
}

const SIZE_CLASSES: Record<NonNullable<CountryFlagProps['size']>, string> = {
  xs: 'w-5 h-3.5',
  sm: 'w-6 h-4',
  md: 'w-7 h-5',
  lg: 'w-9 h-6',
  xl: 'w-11 h-7.5',
  '2xl': 'w-14 h-9.5'
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  flag,
  langCode,
  size = 'md',
  className = '',
  title,
  alt
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine 2-letter ISO country code
  let resolvedCode = (countryCode || '').toLowerCase().trim();

  if (!resolvedCode && flag) {
    const fromEmoji = emojiToCountryCode(flag);
    if (fromEmoji) {
      resolvedCode = fromEmoji;
    } else if (flag.length === 2 && /^[a-z]{2}$/i.test(flag)) {
      resolvedCode = flag.toLowerCase();
    } else if (LANG_TO_COUNTRY[flag.toLowerCase()]) {
      resolvedCode = LANG_TO_COUNTRY[flag.toLowerCase()];
    } else if (COUNTRY_NAME_TO_CODE[flag.toLowerCase().trim()]) {
      resolvedCode = COUNTRY_NAME_TO_CODE[flag.toLowerCase().trim()];
    }
  }

  if (!resolvedCode && langCode) {
    resolvedCode = LANG_TO_COUNTRY[langCode.toLowerCase()] || '';
  }

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const flagTitle = title || (resolvedCode ? `${resolvedCode.toUpperCase()} Flag` : 'Country Flag');

  // 1. If we have a vector SVG for this country, render it directly (zero latency, offline, crisp on any screen)
  if (resolvedCode && FLAG_SVGS[resolvedCode]) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 align-middle aspect-[3/2] overflow-hidden rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-black/15 dark:border-white/20 select-none ${sizeClass} ${className}`}
        title={flagTitle}
        aria-label={flagTitle}
        role="img"
      >
        {FLAG_SVGS[resolvedCode]}
      </span>
    );
  }

  // 2. If it's a valid 2-letter code not in our SVG map, use FlagCDN image
  if (resolvedCode && /^[a-z]{2}$/.test(resolvedCode) && !imgError) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 align-middle aspect-[3/2] overflow-hidden rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-black/15 dark:border-white/20 select-none ${sizeClass} ${className}`}
        title={flagTitle}
      >
        <img
          src={`https://flagcdn.com/w80/${resolvedCode}.png`}
          alt={alt || flagTitle}
          className="w-full h-full object-cover block"
          onError={() => setImgError(true)}
        />
      </span>
    );
  }

  // 3. Fallback
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle aspect-[3/2] bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-[3px] text-[10px] font-bold font-mono border border-slate-200 dark:border-slate-600 ${sizeClass} ${className}`}
      title={flagTitle}
      role="img"
    >
      {resolvedCode ? resolvedCode.toUpperCase() : '🌐'}
    </span>
  );
};

export default CountryFlag;
