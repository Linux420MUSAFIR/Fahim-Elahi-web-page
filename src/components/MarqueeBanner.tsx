import React from 'react';

interface MarqueeBannerProps {
  text?: string[];
  theme?: 'dark' | 'light' | 'mustard';
  reverse?: boolean;
  className?: string;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  text = [
    'visual poetry',
    '35mm cinematics',
    'brutalist form',
    'contemporary avant-garde',
    'art direction',
    'spatial light'
  ],
  theme = 'dark',
  reverse = false,
  className = '',
}) => {
  const themeClasses = {
    dark: 'bg-[#0A0A0A] text-white border-y border-[#262626]',
    light: 'bg-[#F7F6F2] text-[#111111] border-y border-[#E5E5E5]',
    mustard: 'bg-[#F5AC27] text-[#0A0A0A] border-y border-[#0A0A0A]'
  }[theme];

  const dotColor = {
    dark: 'text-[#F5AC27]',
    light: 'text-[#F5AC27]',
    mustard: 'text-[#0A0A0A]'
  }[theme];

  // Repeat the items to make the loop infinite and seamless
  const repeatedItems = [...text, ...text, ...text, ...text];

  return (
    <div
      className={`relative overflow-hidden py-3 select-none ${themeClasses} ${className}`}
      aria-hidden="true"
    >
      <div className={reverse ? 'animate-marquee-reverse' : 'animate-marquee'}>
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center mx-4 sm:mx-6 shrink-0">
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tighter lowercase">
              {item}
            </span>
            <span className={`ml-6 text-sm font-mono ${dotColor}`}>
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
