import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const { t } = useAuth();

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label={t('back') || "Go back to previous page"}
      className={`group flex items-center space-x-2 text-gray-500 hover:text-odisha-terracotta transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all">
        <i className="fas fa-chevron-left text-[10px]" aria-hidden="true"></i>
      </div>
      <span>{t('back')}</span>
    </button>
  );
};

export default BackButton;