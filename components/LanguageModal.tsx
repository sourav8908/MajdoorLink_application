
import React from 'react';
import { useAuth } from '../App';
import { Language } from '../types';

interface LanguageModalProps {
  onSelect: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ onSelect }) => {
  const { setLanguage, language, t } = useAuth();

  const options: { code: Language; label: string; sub: string }[] = [
    { code: 'OR', label: 'ଓଡ଼ିଆ', sub: 'Odia' },
    { code: 'HI', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'EN', label: 'English', sub: 'English' },
  ];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    localStorage.setItem('majdoorlink_lang_initialized', 'true');
    onSelect();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-odisha-deep/95 backdrop-blur-xl p-4">
      <div className="max-w-xl w-full bg-white rounded-[60px] shadow-2xl overflow-hidden animate-bounce-in">
        <div className="bg-odisha-terracotta h-4 w-full" />
        <div className="p-10 sm:p-16 text-center">
          <div className="w-24 h-24 bg-odisha-terracotta/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <i className="fas fa-language text-5xl text-odisha-terracotta"></i>
          </div>
          
          <h2 className="text-4xl font-black text-gray-800 mb-2 italic">ନମସ୍କାର | Namaskar</h2>
          <p className="text-gray-400 mb-12 font-bold uppercase tracking-widest text-xs">Select Your Language to Enter</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`group flex flex-col items-center justify-center p-8 rounded-[40px] border-4 transition-all hover:scale-105 active:scale-95 ${
                  language === opt.code 
                  ? 'border-odisha-terracotta bg-odisha-terracotta/5 shadow-2xl' 
                  : 'border-gray-50 hover:border-odisha-terracotta/20 bg-gray-50/50'
                }`}
              >
                <span className={`text-2xl font-black mb-1 ${language === opt.code ? 'text-odisha-terracotta' : 'text-gray-800'}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-50">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest flex items-center justify-center">
              <i className="fas fa-shield-halved mr-2 text-odisha-teal"></i> {t('odisha_digital_hub') || "Odisha's Digital Skilled Hub"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
