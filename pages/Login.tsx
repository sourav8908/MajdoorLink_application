import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import BackButton from '../components/BackButton';

const Login: React.FC = () => {
  const { login, t } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const redirectMessage = location.state?.message;
  const redirectSubMessage = location.state?.subMessage;
  const preferredRole = location.state?.role;

  useEffect(() => {
    if (redirectMessage) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [redirectMessage]);

  useEffect(() => {
    if (preferredRole) {
      setRole(preferredRole);
    }
  }, [preferredRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password, role);
    if (success) {
      navigate(role === 'ADMIN' ? '/admin' : role === 'WORKER' ? '/worker' : '/customer');
    } else {
      setError(role === 'ADMIN' ? 'Incorrect Admin credentials.' : 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-premium-sand px-4 py-8 flex flex-col items-center justify-center">
      {showToast && (
        <div 
          role="alert"
          aria-live="assertive"
          className="fixed top-20 right-4 left-4 sm:left-auto sm:right-8 z-[100] animate-bounce-in sm:max-w-sm"
        >
          <div className="bg-red-50 border border-red-100 rounded-2xl shadow-2xl p-5 md:p-6 flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-600 text-lg" aria-hidden="true"></i>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-black text-red-600">{redirectMessage}</p>
                <button 
                  onClick={() => setShowToast(false)} 
                  className="text-red-300 hover:text-red-500 transition-colors"
                  aria-label="Dismiss alert"
                >
                  <i className="fas fa-times text-xs" aria-hidden="true"></i>
                </button>
              </div>
              <p className="text-[11px] text-red-500 font-medium leading-tight">{redirectSubMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="flex justify-start">
          <BackButton />
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          <div className="bg-odisha-terracotta h-2 w-full"></div>
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">{t('login')}</h2>
              <p className="text-gray-400 font-medium text-sm">{t('login_welcome')}</p>
            </div>

            <div 
              role="radiogroup" 
              aria-label="Select login role"
              className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 border border-gray-100 shadow-inner"
            >
              {(['CUSTOMER', 'WORKER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={role === r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${
                    role === r 
                      ? 'bg-white text-odisha-teal shadow-md scale-105' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t(r.toLowerCase())}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label 
                  htmlFor="login-email"
                  className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                >
                  {t('email_address')}
                </label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-odisha-teal transition-colors">
                     <i className="fas fa-envelope text-sm" aria-hidden="true"></i>
                   </div>
                   <input
                    id="login-email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all input-micro"
                    placeholder={role === 'ADMIN' ? "admin@majdoorlink.com" : "example@mail.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  htmlFor="login-password"
                  className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                >
                  {t('password')}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-odisha-teal transition-colors">
                    <i className="fas fa-lock text-sm" aria-hidden="true"></i>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl outline-none text-sm font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all input-micro"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-odisha-teal transition-colors"
                  >
                    <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-200 text-odisha-teal focus:ring-odisha-teal transition-all" 
                  />
                  <span className="text-gray-500 font-bold">{t('remember_me')}</span>
                </label>
                <button type="button" className="text-odisha-teal font-black hover:underline">{t('forgot_password')}</button>
              </div>

              {error && (
                <div 
                  role="alert"
                  className="p-4 bg-red-50 text-red-600 text-[11px] font-bold rounded-2xl border border-red-100 flex items-center"
                >
                  <i className="fas fa-exclamation-triangle mr-3" aria-hidden="true"></i> {error}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all transform active:scale-95 text-xs uppercase tracking-widest btn-micro ${
                  role === 'ADMIN' ? 'bg-gray-800' : 'bg-odisha-teal'
                }`}
              >
                {t('sign_in')}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400 text-xs font-bold">
                {t('no_account')} {' '}
                <Link to="/register" className="text-odisha-terracotta font-black hover:underline">
                  {t('sign_up')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;