'use client';

import React from 'react';

interface CountryFlagProps {
  country?: string;
  className?: string;
}

export function CountryFlag({ country = 'india', className = 'w-5 h-3.5' }: CountryFlagProps) {
  const code = (country || '').toLowerCase().trim();

  // 1. INDIA
  if (code.includes('ind') || code === 'in') {
    return (
      <span className={`inline-block overflow-hidden rounded-xs border border-zinc-300/80 shadow-2xs shrink-0 ${className}`}>
        <svg viewBox="0 0 640 480" className="w-full h-full block">
          <path fill="#FF9933" d="M0 0h640v160H0z" />
          <path fill="#FFFFFF" d="M0 160h640v160H0z" />
          <path fill="#128807" d="M0 320h640v160H0z" />
          <g transform="translate(320 240)">
            <circle r="70" fill="none" stroke="#000088" strokeWidth="6" />
            <circle r="14" fill="#000088" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke="#000088"
                strokeWidth="2.8"
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>
        </svg>
      </span>
    );
  }

  // 2. AUSTRALIA
  if (code.includes('aus') || code === 'au') {
    return (
      <span className={`inline-block overflow-hidden rounded-xs border border-zinc-300/80 shadow-2xs shrink-0 ${className}`}>
        <svg viewBox="0 0 640 320" className="w-full h-full block">
          <path fill="#00008B" d="M0 0h640v320H0z" />
          <g transform="scale(0.5)">
            <path fill="#012169" d="M0 0h640v320H0z" />
            <path d="M0 0l640 320M640 0L0 320" stroke="#FFFFFF" strokeWidth="60" />
            <path d="M0 0l640 320M640 0L0 320" stroke="#C8102E" strokeWidth="20" />
            <path d="M320 0v320M0 160h640" stroke="#FFFFFF" strokeWidth="100" />
            <path d="M320 0v320M0 160h640" stroke="#C8102E" strokeWidth="60" />
          </g>
          <polygon
            fill="#FFFFFF"
            points="160,200 165,215 180,215 168,225 172,240 160,230 148,240 152,225 140,215 155,215"
          />
          <polygon fill="#FFFFFF" points="480,50 484,62 496,62 486,70 490,82 480,74 470,82 474,70 464,62 476,62" />
          <polygon fill="#FFFFFF" points="540,120 544,132 556,132 546,140 550,152 540,144 530,152 534,140 524,132 536,132" />
          <polygon fill="#FFFFFF" points="480,220 484,232 496,232 486,240 490,252 480,244 470,252 474,240 464,232 476,232" />
          <polygon fill="#FFFFFF" points="420,130 424,142 436,142 426,150 430,162 420,154 410,162 414,150 404,142 416,142" />
          <polygon fill="#FFFFFF" points="505,170 508,178 516,178 509,183 512,191 505,186 498,191 501,183 494,178 502,178" />
        </svg>
      </span>
    );
  }

  // 3. USA
  if (code.includes('usa') || code === 'us' || code.includes('america')) {
    return (
      <span className={`inline-block overflow-hidden rounded-xs border border-zinc-300/80 shadow-2xs shrink-0 ${className}`}>
        <svg viewBox="0 0 640 400" className="w-full h-full block">
          <path fill="#B22234" d="M0 0h640v400H0z" />
          <path fill="#FFFFFF" d="M0 31h640v31H0zM0 92h640v31H0zM0 154h640v31H0zM0 215h640v31H0zM0 277h640v31H0zM0 338h640v31H0z" />
          <path fill="#3C3B6E" d="M0 0h260v215H0z" />
          <g fill="#FFFFFF">
            {[
              [26, 25], [78, 25], [130, 25], [182, 25], [234, 25],
              [52, 50], [104, 50], [156, 50], [208, 50],
              [26, 75], [78, 75], [130, 75], [182, 75], [234, 75],
              [52, 100], [104, 100], [156, 100], [208, 100],
              [26, 125], [78, 125], [130, 125], [182, 125], [234, 125],
              [52, 150], [104, 150], [156, 150], [208, 150],
              [26, 175], [78, 175], [130, 175], [182, 175], [234, 175]
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="5" />
            ))}
          </g>
        </svg>
      </span>
    );
  }

  // 4. UK
  if (code.includes('uk') || code === 'gb' || code.includes('britain')) {
    return (
      <span className={`inline-block overflow-hidden rounded-xs border border-zinc-300/80 shadow-2xs shrink-0 ${className}`}>
        <svg viewBox="0 0 640 400" className="w-full h-full block">
          <path fill="#012169" d="M0 0h640v400H0z" />
          <path d="M0 0l640 400M640 0L0 400" stroke="#FFFFFF" strokeWidth="60" />
          <path d="M0 0l640 400M640 0L0 400" stroke="#C8102E" strokeWidth="22" />
          <path d="M320 0v400M0 200h640" stroke="#FFFFFF" strokeWidth="100" />
          <path d="M320 0v400M0 200h640" stroke="#C8102E" strokeWidth="60" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center bg-zinc-200 text-zinc-600 font-bold text-[10px] rounded-xs ${className}`}>
      🌐
    </span>
  );
}

export default CountryFlag;
