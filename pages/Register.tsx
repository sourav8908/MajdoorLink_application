import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole, Language, VerificationStatus } from '../types';
import { db } from '../db';
import { ODISHA_DISTRICTS, SKILLS } from '../constants';
import BackButton from '../components/BackButton';

const Register: React.FC = () => {
  const { t, language } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    districtId: '',
    locality: '',
    skillId: '',
    password: '',
    confirmPassword: '',
    language: language as Language,
  });

  const [documents, setDocuments] = useState<{
    photo?: string;
    aadhaar?: string;
    pan?: string;
    bank?: string;
  }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof documents) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isPhoneValid = useMemo(() => {
    return /^[6-9]\d{9}$/.test(formData.phone);
  }, [formData.phone]);

  const passwordsMatch = useMemo(() => {
    return formData.password.length > 0 && formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const isFormValid = () => {
    const commonFields = formData.name && formData.email && isPhoneValid && formData.districtId && formData.locality && passwordsMatch;
    if (role === 'CUSTOMER') return commonFields;
    return commonFields && formData.skillId && documents.photo && documents.aadhaar;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    const { password, confirmPassword, ...otherData } = formData;
    const newUser = {
        id: `u-${Date.now()}`,
        ...otherData,
        password,
        role,
        language,
        joinedAt: new Date().toISOString(),
        avatar: documents.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        documents: role === 'WORKER' ? documents : undefined,
        isVerified: role === 'CUSTOMER',
        verificationStatus: (role === 'WORKER' ? 'PENDING' : 'VERIFIED') as VerificationStatus,
        rating: 0,
        reviewCount: 0
    };

    db.addUser(newUser as any);

    setTimeout(() => {
        setIsSubmitting(false);
        alert(role === 'WORKER' ? t('worker_reg_success') : t('cust_reg_success'));
        navigate('/login');
    }, 800); 
  };

  return (
    <div className="min-h-screen bg-premium-sand py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
        <div className="flex justify-start">
          <BackButton />
        </div>

        <div className="bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          <div className="bg-odisha-terracotta h-2 w-full"></div>
          <div className="p-6 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 italic tracking-tight">{t('register')}</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('join_trusted_network')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* SECTION: Account Type */}
              <fieldset className="bg-gray-50/50 p-6 md:p-10 rounded-[32px] border border-gray-100">
                <legend className="sr-only">{t('join_as')}</legend>
                <p className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center" aria-hidden="true">{t('join_as')}</p>
                <div 
                  role="radiogroup" 
                  aria-label={t('join_as')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {(['CUSTOMER', 'WORKER'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      role="radio"
                      aria-checked={role === r}
                      onClick={() => setRole(r)}
                      className={`group p-6 md:p-8 font-black rounded-3xl border-4 transition-all flex items-center space-x-5 ${
                        role === r 
                          ? 'bg-odisha-teal text-white border-odisha-teal shadow-2xl scale-[1.02]' 
                          : 'bg-white text-gray-400 border-gray-50 hover:border-gray-100'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${role === r ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                          <i className={`fas ${r === 'CUSTOMER' ? 'fa-user-circle' : 'fa-tools'}`} aria-hidden="true"></i>
                      </div>
                      <div className="text-left flex-1">
                          <span className="text-lg md:text-xl uppercase tracking-tighter block leading-none mb-1">{t(r === 'CUSTOMER' ? 'cust_role' : 'work_role')}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${role === r ? 'opacity-60' : 'opacity-40'}`}>
                             {r === 'CUSTOMER' ? 'I want to hire' : 'I am looking for jobs'}
                          </span>
                      </div>
                      {role === r && <i className="fas fa-check-circle text-xl" aria-hidden="true"></i>}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* SECTION: Basic Info */}
                <fieldset className="space-y-8">
                  <legend className="flex items-center space-x-3 border-b border-gray-100 pb-4 w-full">
                    <div className="w-8 h-8 bg-odisha-terracotta/10 text-odisha-terracotta rounded-lg flex items-center justify-center text-sm" aria-hidden="true">
                      <i className="fas fa-user"></i>
                    </div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">{t('acc_details')}</h3>
                  </legend>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="reg-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('full_name')} *</label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        autoComplete="name"
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="reg-email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('email_address')} *</label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="reg-phone"
                        className={`text-[10px] font-black uppercase tracking-widest ml-1 ${formData.phone && !isPhoneValid ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        {t('phone_label')} *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        maxLength={10}
                        autoComplete="tel"
                        placeholder={t('phone_placeholder')}
                        aria-invalid={formData.phone ? !isPhoneValid : undefined}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* SECTION: Security & Region */}
                <fieldset className="space-y-8">
                  <legend className="flex items-center space-x-3 border-b border-gray-100 pb-4 w-full">
                    <div className="w-8 h-8 bg-odisha-terracotta/10 text-odisha-terracotta rounded-lg flex items-center justify-center text-sm" aria-hidden="true">
                      <i className="fas fa-shield-halved"></i>
                    </div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">{t('security_loc')}</h3>
                  </legend>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="reg-pass" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('password')} *</label>
                        <div className="relative">
                          <input
                            id="reg-pass"
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete="new-password"
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-odisha-teal"
                          >
                            <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`} aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label 
                          htmlFor="reg-conf-pass"
                          className={`text-[10px] font-black uppercase tracking-widest ml-1 ${formData.confirmPassword && !passwordsMatch ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          {t('confirm_password')} *
                        </label>
                        <input
                          id="reg-conf-pass"
                          type={showPassword ? 'text' : 'password'}
                          required
                          aria-invalid={formData.confirmPassword ? !passwordsMatch : undefined}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="reg-district" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('district')} *</label>
                      <select
                        id="reg-district"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                        value={formData.districtId}
                        onChange={e => setFormData({...formData, districtId: e.target.value})}
                      >
                        <option value="">{t('select_district')}</option>
                        {ODISHA_DISTRICTS.map(d => <option key={d.id} value={d.id}>{t(d.key)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="reg-locality" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('locality_village')} *</label>
                      <input
                        id="reg-locality"
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm input-micro"
                        value={formData.locality}
                        onChange={e => setFormData({...formData, locality: e.target.value})}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* SECTION: Worker Only Logic */}
              {role === 'WORKER' && (
                <div className="space-y-12 animate-fade-in">
                  <fieldset className="space-y-8">
                    <legend className="flex items-center space-x-3 border-b border-gray-100 pb-4 w-full">
                      <div className="w-8 h-8 bg-odisha-terracotta/10 text-odisha-terracotta rounded-lg flex items-center justify-center text-sm" aria-hidden="true">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">{t('primary_skill')}</h3>
                    </legend>
                    <div className="space-y-1.5 max-w-md">
                      <label htmlFor="reg-skill" className="sr-only">{t('primary_skill')}</label>
                      <select
                        id="reg-skill"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700 focus:ring-4 focus:ring-odisha-teal/5 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                        value={formData.skillId}
                        onChange={e => setFormData({...formData, skillId: e.target.value})}
                      >
                        <option value="">{t('select_skill')}</option>
                        {SKILLS.map(s => <option key={s.id} value={s.id}>{t(s.key)}</option>)}
                      </select>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-8">
                    <legend className="flex items-center space-x-3 border-b border-gray-100 pb-4 w-full">
                      <div className="w-8 h-8 bg-odisha-terracotta/10 text-odisha-terracotta rounded-lg flex items-center justify-center text-sm" aria-hidden="true">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">{t('kyc_docs')}</h3>
                    </legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: 'photo', label: t('kyc_photo'), icon: 'fa-user' },
                        { key: 'aadhaar', label: t('kyc_aadhaar'), icon: 'fa-id-card' },
                        { key: 'pan', label: t('kyc_pan'), icon: 'fa-id-badge' },
                        { key: 'bank', label: t('kyc_passbook'), icon: 'fa-university' }
                      ].map(doc => (
                        <div key={doc.key}>
                          <label 
                            htmlFor={`upload-${doc.key}`}
                            className="group block cursor-pointer"
                          >
                            <input 
                              id={`upload-${doc.key}`}
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleFileUpload(e, doc.key as any)} 
                            />
                            <div className={`aspect-square rounded-[32px] border-4 border-dashed flex flex-col items-center justify-center transition-all ${
                              documents[doc.key as keyof typeof documents] 
                                ? 'bg-emerald-50 border-emerald-400' 
                                : 'bg-gray-50 border-gray-100 hover:border-odisha-terracotta/20 hover:bg-white hover:shadow-xl'
                            }`}>
                              {documents[doc.key as keyof typeof documents] ? (
                                <div className="text-center">
                                  <i className="fas fa-check-circle text-emerald-500 text-3xl mb-2" aria-hidden="true"></i>
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('kyc_uploaded')}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <i className={`fas ${doc.icon} text-gray-300 group-hover:text-odisha-terracotta transition-colors`} aria-hidden="true"></i>
                                  </div>
                                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center px-4 leading-tight">
                                    {doc.label}
                                  </span>
                                </>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              <div className="pt-10">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  aria-busy={isSubmitting}
                  className={`w-full py-6 text-white font-black rounded-3xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center space-x-4 text-lg uppercase tracking-widest ${
                    isSubmitting || !isFormValid() 
                    ? 'bg-gray-100 cursor-not-allowed text-gray-400 shadow-none' 
                    : 'bg-odisha-terracotta hover:opacity-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin text-2xl" aria-hidden="true"></i>
                      <span className="sr-only">Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('create_account')}</span>
                      <i className="fas fa-arrow-right text-sm" aria-hidden="true"></i>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-12 text-center border-t border-gray-50 pt-10">
              <p className="text-gray-400 font-bold text-xs">
                {t('already_have_account')} {' '}
                <Link to="/login" className="text-odisha-teal font-black hover:underline uppercase tracking-widest ml-2">
                  {t('login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;