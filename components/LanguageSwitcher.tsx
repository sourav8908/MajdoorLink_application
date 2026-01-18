import React from 'react';
import { useAuth } from '../App';
import { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAuth();

  const langs: { code: Language; label: string; sub: string }[] = [
    { code: 'OR', label: 'ଓଡ଼ିଆ', sub: 'OR' },
    { code: 'HI', label: 'हिन्दी', sub: 'HI' },
    { code: 'EN', label: 'EN', sub: 'EN' },
  ];

  return (
    <div 
      role="group" 
      aria-label="Select Language"
      className="flex items-center bg-white border-2 border-gray-100 p-1 rounded-2xl shadow-sm"
    >
      {langs.map((l) => (
        <button
          key={l.code}
          aria-pressed={language === l.code}
          onClick={(e) => {
            e.stopPropagation();
            setLanguage(l.code);
          }}
          className={`relative group flex flex-col items-center justify-center min-w-[50px] md:min-w-[64px] px-2 py-1.5 md:py-2 rounded-xl transition-all duration-300 active:scale-95 ${
            language === l.code 
              ? 'bg-odisha-teal text-white shadow-md' 
              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
          }`}
        >
          <span className={`text-[11px] md:text-xs font-black leading-tight ${language === l.code ? 'text-white' : 'text-gray-800'}`}>
            {l.label}
          </span>
          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest leading-none mt-0.5 ${language === l.code ? 'text-white/70' : 'text-gray-300'}`}>
            {l.sub}
          </span>
          
          {/* Subtle indicator for non-active states on hover */}
          {language !== l.code && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-odisha-teal group-hover:w-4 transition-all duration-300 rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;