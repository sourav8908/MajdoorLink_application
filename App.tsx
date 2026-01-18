import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Language } from './types';
import { db } from './db';
import { TRANSLATIONS } from './constants';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WorkerProfile from './pages/WorkerProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import LanguageModal from './components/LanguageModal';
import AIAssistant from './components/AIAssistant';

interface AuthContextType {
  user: User | null;
  language: Language;
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('majdoorlink_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('majdoorlink_lang');
    if (savedLang) return savedLang as Language;
    return (user?.language as Language) || 'EN';
  });

  useEffect(() => {
    document.body.className = `bg-[#fcfaf7] text-gray-900 min-h-screen lang-${language.toLowerCase()}`;
    localStorage.setItem('majdoorlink_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) {
      db.updateUser(user.id, { language: lang });
      const updatedUser = { ...user, language: lang };
      setUser(updatedUser);
      localStorage.setItem('majdoorlink_auth', JSON.stringify(updatedUser));
    }
  };

  const login = (email: string, password: string, role: string) => {
    const found = db.getUsers().find(u => u.email === email && u.role === role);
    if (found && found.password === password && !found.isBanned) {
      setUser(found);
      setLanguageState(found.language);
      localStorage.setItem('majdoorlink_auth', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('majdoorlink_auth');
  };

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <AuthContext.Provider value={{ user, language, login, logout, setLanguage, t }}>
      {children}
    </AuthContext.Provider>
  );
};

const RoleGuard: React.FC<{ children: React.ReactNode; allowed: string[] }> = ({ children, allowed }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowed.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [showLangModal, setShowLangModal] = useState(() => {
    return localStorage.getItem('majdoorlink_lang_initialized') !== 'true';
  });

  return (
    <div className="flex flex-col min-h-screen">
      {showLangModal && <LanguageModal onSelect={() => setShowLangModal(false)} />}
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer" element={<RoleGuard allowed={['CUSTOMER']}><CustomerDashboard /></RoleGuard>} />
          <Route path="/worker" element={<RoleGuard allowed={['WORKER']}><WorkerDashboard /></RoleGuard>} />
          <Route path="/admin" element={<RoleGuard allowed={['ADMIN']}><AdminDashboard /></RoleGuard>} />
          <Route path="/worker-profile/:id" element={<WorkerProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <AIAssistant />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;