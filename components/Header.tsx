import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { user, logout, t } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-odisha-terracotta rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-6 transition-transform">
              ML
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-gray-800 group-hover:text-odisha-terracotta transition-colors leading-none">
                {t('app_name')}
              </span>
              <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                Skilled Odisha
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="scale-90 xl:scale-100">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center space-x-4 border-l-2 border-gray-50 pl-6">
              <Link 
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'WORKER' ? '/worker' : '/customer'}
                className="text-[10px] font-black text-gray-500 hover:text-odisha-teal transition-colors uppercase tracking-widest"
              >
                {t('my_dashboard')}
              </Link>
              <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-100">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-xl border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer object-cover"
                />
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                  title="Logout"
                >
                  <i className="fas fa-power-off text-sm"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-xs font-black text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors uppercase tracking-widest">
                {t('login')}
              </Link>
              <Link 
                to="/register" 
                className="bg-odisha-teal text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
              >
                {t('register')}
              </Link>
              <Link 
                to="/login"
                state={{ role: 'ADMIN' }}
                className="bg-gray-800 text-white text-[10px] font-black px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all btn-micro uppercase tracking-widest"
              >
                {t('admin')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View: Language Switcher always prominent + Menu Trigger */}
        <div className="flex lg:hidden items-center space-x-3">
          <div className="scale-75 origin-right sm:scale-90">
             <LanguageSwitcher />
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-sm border ${
              isMenuOpen 
              ? 'bg-odisha-terracotta text-white border-odisha-terracotta' 
              : 'bg-white text-gray-600 border-gray-100 active:scale-90'
            }`}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar/Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl animate-fade-in-up z-[60] max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                   <img src={user.avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover" alt={user.name} />
                   <div>
                     <p className="font-black text-gray-800 text-lg">{user.name}</p>
                     <p className="text-[10px] text-odisha-teal font-black uppercase tracking-[0.2em]">{user.role}</p>
                   </div>
                </div>
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'WORKER' ? '/worker' : '/customer'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full p-5 bg-white border-2 border-gray-100 font-black rounded-2xl text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                >
                  <i className="fas fa-th-large mr-3 text-odisha-terracotta"></i>
                  {t('my_dashboard')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full p-5 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest text-xs"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  {t('logout') || 'Logout'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-5 bg-white border-2 border-gray-100 text-center font-black rounded-2xl text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-5 bg-odisha-teal text-white text-center font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
                >
                  {t('register')}
                </Link>
                <Link 
                  to="/login"
                  state={{ role: 'ADMIN' }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-4 bg-gray-800 text-white text-center font-black rounded-2xl shadow-lg transition-all uppercase tracking-widest text-[10px]"
                >
                  {t('admin')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;