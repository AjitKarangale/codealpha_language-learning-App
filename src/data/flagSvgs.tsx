import React from 'react';

// Crisp, authentic vector SVG flags for all supported languages and countries
export const FLAG_SVGS: Record<string, React.ReactNode> = {
  // United Kingdom / Great Britain
  gb: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="flag-gb-clip">
        <rect width="60" height="40" rx="1" />
      </clipPath>
      <g clipPath="url(#flag-gb-clip)">
        <path d="M0,0 h60 v40 H0 z" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#ffffff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v40 M0,20 h60" stroke="#ffffff" strokeWidth="12" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  ),

  // Spain
  es: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="10" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
      <rect y="30" width="60" height="10" fill="#AA151B" />
      <g transform="translate(13, 14) scale(0.65)">
        <rect x="0" y="2" width="10" height="11" rx="2" fill="#AA151B" stroke="#770000" strokeWidth="0.5" />
        <circle cx="5" cy="0.5" r="2" fill="#F1BF00" />
        <path d="M2,4 h6 v7 H2 z" fill="#F1BF00" />
        <path d="M-2,2 v12 M12,2 v12" stroke="#666666" strokeWidth="1.2" />
      </g>
    </svg>
  ),

  // France
  fr: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#002654" />
      <rect x="20" width="20" height="40" fill="#FFFFFF" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  ),

  // Japan
  jp: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#FFFFFF" />
      <circle cx="30" cy="20" r="11.5" fill="#BC002D" />
    </svg>
  ),

  // Germany
  de: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#000000" />
      <rect y="13.33" width="60" height="13.34" fill="#DD0000" />
      <rect y="26.67" width="60" height="13.33" fill="#FFCE00" />
    </svg>
  ),

  // Italy
  it: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#009246" />
      <rect x="20" width="20" height="40" fill="#FFFFFF" />
      <rect x="40" width="20" height="40" fill="#CE2B37" />
    </svg>
  ),

  // China
  cn: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#DE2910" />
      <polygon points="10,4 12,10 18,10 13,14 15,20 10,16 5,20 7,14 2,10 8,10" fill="#FFDE00" />
      <polygon points="20,4 20.8,6.5 23.3,6.5 21.2,8 22,10.5 20,9 18,10.5 18.8,8 16.7,6.5 19.2,6.5" fill="#FFDE00" />
      <polygon points="24,9 24.8,11.5 27.3,11.5 25.2,13 26,15.5 24,14 22,15.5 22.8,13 20.7,11.5 23.2,11.5" fill="#FFDE00" />
      <polygon points="24,16 24.8,18.5 27.3,18.5 25.2,20 26,22.5 24,21 22,22.5 22.8,20 20.7,18.5 23.2,18.5" fill="#FFDE00" />
      <polygon points="20,21 20.8,23.5 23.3,23.5 21.2,25 22,27.5 20,26 18,27.5 18.8,25 16.7,23.5 19.2,23.5" fill="#FFDE00" />
    </svg>
  ),

  // India
  in: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#FF9933" />
      <rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
      <rect y="26.67" width="60" height="13.33" fill="#128807" />
      <circle cx="30" cy="20" r="5" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="30" cy="20" r="1.2" fill="#000080" />
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="30"
          y1="20"
          x2={30 + 4.6 * Math.cos((i * Math.PI) / 6)}
          y2={20 + 4.6 * Math.sin((i * Math.PI) / 6)}
          stroke="#000080"
          strokeWidth="0.55"
        />
      ))}
    </svg>
  ),

  // Saudi Arabia
  sa: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#006C35" />
      <path d="M14,14 Q22,11 30,14 Q38,11 46,14 Q38,17 30,14" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M17,11 L18,17 M23,10 L24,17 M35,10 L36,17 M41,11 L42,17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="26" x2="44" y2="26" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="42" y1="24" x2="42" y2="28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="45" cy="26" r="1.2" fill="#FFFFFF" />
    </svg>
  ),

  // Brazil
  br: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#009739" />
      <polygon points="30,4 56,20 30,36 4,20" fill="#FEDD00" />
      <circle cx="30" cy="20" r="8.5" fill="#002776" />
      <path d="M22,21 Q30,17 38,21" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
      <circle cx="28" cy="24" r="0.7" fill="#FFFFFF" />
      <circle cx="32" cy="24.5" r="0.7" fill="#FFFFFF" />
      <circle cx="30" cy="25.5" r="0.6" fill="#FFFFFF" />
    </svg>
  ),

  // Russia
  ru: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#FFFFFF" />
      <rect y="13.33" width="60" height="13.34" fill="#0039A6" />
      <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
    </svg>
  ),

  // South Korea
  kr: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#FFFFFF" />
      <circle cx="30" cy="20" r="8" fill="#0047A0" />
      <path d="M30,12 A8,8 0 0,1 30,28 A4,4 0 0,1 30,20 A4,4 0 0,0 30,12" fill="#CD2E3A" />
      {/* 4 Trigrams */}
      <g transform="translate(13, 8) rotate(-35)">
        <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="2" x2="3" y2="2" stroke="#000" strokeWidth="0.9" />
      </g>
      <g transform="translate(47, 32) rotate(-35)">
        <line x1="-3" y1="-2" x2="-0.6" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="-2" x2="3" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="0" x2="-0.6" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="0" x2="3" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="2" x2="-0.6" y2="2" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="2" x2="3" y2="2" stroke="#000" strokeWidth="0.9" />
      </g>
      <g transform="translate(47, 8) rotate(35)">
        <line x1="-3" y1="-2" x2="-0.6" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="-2" x2="3" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="2" x2="-0.6" y2="2" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="2" x2="3" y2="2" stroke="#000" strokeWidth="0.9" />
      </g>
      <g transform="translate(13, 32) rotate(35)">
        <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="0" x2="-0.6" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="0.6" y1="0" x2="3" y2="0" stroke="#000" strokeWidth="0.9" />
        <line x1="-3" y1="2" x2="3" y2="2" stroke="#000" strokeWidth="0.9" />
      </g>
    </svg>
  ),

  // Netherlands
  nl: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#AE1C28" />
      <rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
      <rect y="26.67" width="60" height="13.33" fill="#21468B" />
    </svg>
  ),

  // Turkey
  tr: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#E30A17" />
      <circle cx="26" cy="20" r="10" fill="#FFFFFF" />
      <circle cx="28.8" cy="20" r="8" fill="#E30A17" />
      <polygon points="36,17.2 37.3,20.5 41,20.5 38,22.5 39.2,25.8 36,23.8 32.8,25.8 34,22.5 31,20.5 34.7,20.5" fill="#FFFFFF" />
    </svg>
  ),

  // Vietnam
  vn: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#DA251D" />
      <polygon points="30,7 33.7,18.5 45.8,18.5 36,25.6 39.7,37 30,30 20.3,37 24,25.6 14.2,18.5 26.3,18.5" fill="#FFFF00" />
    </svg>
  ),

  // Indonesia
  id: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="20" fill="#CE1126" />
      <rect y="20" width="60" height="20" fill="#FFFFFF" />
    </svg>
  ),

  // Poland
  pl: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="20" fill="#FFFFFF" />
      <rect y="20" width="60" height="20" fill="#DC143C" />
    </svg>
  ),

  // Greece
  gr: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      {[...Array(9)].map((_, i) => (
        <rect key={i} y={(i * 40) / 9} width="60" height={40 / 9 + 0.15} fill={i % 2 === 0 ? '#0D5EAF' : '#FFFFFF'} />
      ))}
      <rect width="20" height="20" fill="#0D5EAF" />
      <rect x="7.5" y="0" width="5" height="20" fill="#FFFFFF" />
      <rect x="0" y="7.5" width="20" height="5" fill="#FFFFFF" />
    </svg>
  ),

  // Bangladesh
  bd: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#006A4E" />
      <circle cx="26" cy="20" r="11" fill="#F42A41" />
    </svg>
  ),

  // Kenya
  ke: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="11" fill="#000000" />
      <rect y="11" width="60" height="2" fill="#FFFFFF" />
      <rect y="13" width="60" height="14" fill="#BB0000" />
      <rect y="27" width="60" height="2" fill="#FFFFFF" />
      <rect y="29" width="60" height="11" fill="#006600" />
      <ellipse cx="30" cy="20" rx="5" ry="10" fill="#800000" stroke="#FFFFFF" strokeWidth="0.8" />
      <ellipse cx="30" cy="20" rx="3.2" ry="7" fill="#000000" />
      <circle cx="30" cy="20" r="1.3" fill="#FFFFFF" />
    </svg>
  ),

  // United States
  us: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      {[...Array(13)].map((_, i) => (
        <rect key={i} y={(i * 40) / 13} width="60" height={40 / 13 + 0.15} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
      ))}
      <rect width="25" height="21.5" fill="#3C3B6E" />
      {[...Array(4)].map((_, r) =>
        [...Array(5)].map((_, c) => (
          <circle key={`${r}-${c}`} cx={3.2 + c * 4.6} cy={3.2 + r * 5} r="0.9" fill="#FFFFFF" />
        ))
      )}
    </svg>
  ),

  // Canada
  ca: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="15" height="40" fill="#FF0000" />
      <rect x="15" width="30" height="40" fill="#FFFFFF" />
      <rect x="45" width="15" height="40" fill="#FF0000" />
      <g transform="translate(30, 19) scale(0.65)">
        <polygon points="0,-14 2,-7 6,-8 4,-3 10,-3 7,2 10,5 5,5 3,11 0,8 -3,11 -5,5 -10,5 -7,2 -10,-3 -4,-3 -6,-8 -2,-7" fill="#FF0000" />
        <rect x="-0.8" y="8" width="1.6" height="6.5" fill="#FF0000" />
      </g>
    </svg>
  ),

  // Australia
  au: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#00008B" />
      <g transform="scale(0.5)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#ffffff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v40 M0,20 h60" stroke="#ffffff" strokeWidth="12" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
      </g>
      <polygon points="15,26 16,29 19,27 18,30 21,31 18,33 19,36 16,34 15,37 14,34 11,36 12,33 9,31 12,30 11,27 14,29" fill="#FFFFFF" />
      <circle cx="45" cy="8" r="1.2" fill="#FFFFFF" />
      <circle cx="52" cy="16" r="1.2" fill="#FFFFFF" />
      <circle cx="48" cy="22" r="0.9" fill="#FFFFFF" />
      <circle cx="40" cy="20" r="1.2" fill="#FFFFFF" />
      <circle cx="45" cy="32" r="1.4" fill="#FFFFFF" />
    </svg>
  ),

  // Mexico
  mx: (
    <svg viewBox="0 0 60 40" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#006847" />
      <rect x="20" width="20" height="40" fill="#FFFFFF" />
      <rect x="40" width="20" height="40" fill="#CE2B37" />
      <circle cx="30" cy="20" r="5" fill="#C8963E" />
      <path d="M28,21 Q30,17 32,21 Q30,23 28,21" fill="#4B3621" />
      <path d="M26,24 Q30,26 34,24" stroke="#006847" strokeWidth="1" fill="none" />
    </svg>
  )
};
