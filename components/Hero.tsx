import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { SLIDER_IMAGES } from '../constants';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const { t } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
  };

  return (
    <div className="relative h-[450px] md:h-[600px] overflow-hidden">
      {/* Background Images */}
      {SLIDER_IMAGES.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } transform transition-transform duration-[2000ms]`}
        >
          <img 
            src={img} 
            alt={`Odisha Landscape ${idx}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 z-20">
        <div className="max-w-4xl space-y-4 md:space-y-8">
          {/* Trust Badge at top */}
          <div className="animate-fade-in-up">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-2xl inline-block">
              <i className="fas fa-shield-halved mr-2 text-odisha-saffron"></i>
              {t('trusted_badge')}
            </span>
          </div>

          {/* Large Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white leading-[1.2] md:leading-[1.1] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-fade-in-up delay-75 tracking-tight px-2">
            {t('hero_title_line_1')} <br />
            <span className="text-odisha-saffron">{t('hero_highlight')}</span> {t('hero_title_line_2')}
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-sm md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-up delay-150 font-medium leading-relaxed px-2">
            {t('hero_subtitle')}
          </p>

          {/* CTA Buttons - High Contrast Hierarchy */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-4 md:pt-10 animate-fade-in-up delay-200 w-full max-w-xs sm:max-w-none mx-auto">
            <button 
                onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-odisha-terracotta text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(192,64,0,0.5)] hover:scale-105 active:scale-95 transition-all text-xs md:text-sm uppercase tracking-widest border border-white/10"
            >
              {t('find_worker_cta')}
            </button>
            <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-gray-900 font-black rounded-2xl shadow-xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm uppercase tracking-widest"
            >
              {t('become_worker_cta')}
            </button>
          </div>

          {/* Small Reassurance Line */}
          <p className="text-[8px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em] md:tracking-[0.3em] animate-fade-in-up delay-300 drop-shadow-md hidden sm:block">
            {t('hero_reassurance')}
          </p>
        </div>
      </div>

      {/* Manual Controls - Hidden on mobile for cleaner look */}
      <button 
        onClick={handlePrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all z-30 hidden md:flex border border-white/10"
      >
        <i className="fas fa-chevron-left text-sm"></i>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all z-30 hidden md:flex border border-white/10"
      >
        <i className="fas fa-chevron-right text-sm"></i>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-30">
        {SLIDER_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 ${
              idx === currentSlide 
                ? 'w-6 md:w-10 h-1.5 md:h-2 bg-odisha-saffron rounded-full' 
                : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-white/30 hover:bg-white/60 rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;