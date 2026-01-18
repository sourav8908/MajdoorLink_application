import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { db } from '../db';
import Hero from '../components/Hero';
import { ODISHA_DISTRICTS, SKILLS } from '../constants';

const DEMO_WORKERS: any[] = [
  { id: 'demo-1', name: 'Rajesh Kumar', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7ee504e3a?auto=format&fit=crop&w=300&q=80', skillId: 'skill_plumber', rating: 4.8, reviewCount: 156, experience: 8 },
  { id: 'demo-2', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', skillId: 'skill_electrician', rating: 4.9, reviewCount: 203, experience: 12 },
  { id: 'demo-3', name: 'Amit Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', skillId: 'skill_painter', rating: 4.7, reviewCount: 89, experience: 6 },
  { id: 'demo-4', name: 'Sunita Devi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80', skillId: 'skill_cleaning', rating: 4.8, reviewCount: 178, experience: 10 },
  { id: 'demo-5', name: 'Ramesh Das', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', skillId: 'skill_mason', rating: 4.6, reviewCount: 134, experience: 7 },
  { id: 'demo-6', name: 'Kavita Rout', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', skillId: 'skill_nurse', rating: 4.9, reviewCount: 67, experience: 5 },
];

const Home: React.FC = () => {
  const { t, user } = useAuth();
  const navigate = useNavigate();
  const [districtId, setDistrictId] = useState('');
  const [skillId, setSkillId] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);

  const realWorkers = db.getUsers()
    .filter(u => u.role === 'WORKER' && (u.isVerified || u.verificationStatus === 'PENDING'))
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  const displayWorkers = [...realWorkers, ...DEMO_WORKERS].slice(0, 10);

  const getSkillKey = (id: string) => SKILLS.find(s => s.id === id)?.key || '';

  const handleServiceClick = (sId?: string) => {
    if (!user) {
      navigate('/login', { state: { message: "Access Restricted", subMessage: "Please sign in to browse and book specialists." } });
    } else {
      if (sId) {
          navigate('/customer', { state: { skillId: sId } });
      } else {
          navigate('/customer');
      }
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth < 640 ? sliderRef.current.offsetWidth * 0.8 : 350;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="animate-fade-in bg-premium-sand">
      <Hero />
      
      {/* Search Section */}
      <section id="discovery" className="container mx-auto px-4 -mt-10 md:-mt-12 relative z-30">
        <div className="bg-white p-5 md:p-8 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-center gap-4 border border-white/50 backdrop-blur-sm">
          <div className="flex-1 w-full group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block group-focus-within:text-odisha-teal transition-colors">{t('district')}</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-odisha-teal/5 transition-all cursor-pointer text-gray-700 text-sm md:text-base"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
            >
              <option value="">{t('all_odisha')}</option>
              {ODISHA_DISTRICTS.map(d => <option key={d.id} value={d.id}>{t(d.key)}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block group-focus-within:text-odisha-teal transition-colors">{t('skill')}</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-odisha-teal/5 transition-all cursor-pointer text-gray-700 text-sm md:text-base"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
            >
              <option value="">{t('any_skill')}</option>
              {SKILLS.map(s => <option key={s.id} value={s.id}>{t(s.key)}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto md:pt-6">
            <button 
                onClick={() => handleServiceClick(skillId)}
                className="w-full md:px-12 py-4 md:py-5 bg-odisha-teal text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              {t('search')}
            </button>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 space-y-3">
            <span className="inline-block px-4 py-1.5 bg-odisha-teal/5 border border-odisha-teal/10 rounded-full text-[9px] md:text-[10px] font-black text-odisha-teal uppercase tracking-widest">
              {t('our_services')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight px-4">{t('Popular Services')}</h2>
            <p className="text-gray-500 font-medium text-sm md:text-lg max-w-2xl mx-auto px-4">{t('Most requested services by our clients')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-8">
            {SKILLS.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleServiceClick(skill.id)}
                className="group flex flex-col items-center p-5 md:p-8 rounded-[30px] md:rounded-[40px] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-95 text-center"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] ${skill.bg} ${skill.color} flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <i className={`fas ${skill.icon}`}></i>
                </div>
                <h3 className="font-black text-gray-800 text-[11px] md:text-sm tracking-tight mb-1">{t(skill.key)}</h3>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">{t('book_specialist')}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Odisha Impact Section */}
      <section className="py-16 md:py-24 bg-premium-light overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="bg-odisha-teal rounded-[40px] md:rounded-[60px] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('growth_story_label')}</span>
                        <h2 className="text-3xl md:text-6xl font-black leading-tight tracking-tight">{t('digitizing_odisha_title')}</h2>
                        <p className="text-white/70 text-base md:text-lg font-medium max-w-lg mx-auto lg:mx-0">
                            {t('mission_desc')}
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <button className="w-full sm:w-auto px-10 py-4 bg-odisha-saffron text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] md:text-xs tracking-widest">{t('view_impact_report')}</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {[
                            { val: '30+', lab: t('districts_covered'), icon: 'fa-map-location-dot' },
                            { val: '12k', lab: t('jobs_created'), icon: 'fa-briefcase' },
                            { val: '₹1.2Cr', lab: t('worker_earnings'), icon: 'fa-wallet' },
                            { val: '98%', lab: t('safety_rating'), icon: 'fa-shield-check' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-[30px] md:rounded-[40px] text-center backdrop-blur-md hover:bg-white/10 transition-all group">
                                <i className={`fas ${stat.icon} text-odisha-saffron text-lg md:text-xl mb-3 md:mb-4 opacity-60 group-hover:scale-110 transition-transform`}></i>
                                <div className="text-xl md:text-3xl font-black mb-1">{stat.val}</div>
                                <div className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">{stat.lab}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="bg-white py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-left">
            <div className="space-y-3 px-4">
                <span className="inline-block px-4 py-1.5 bg-odisha-terracotta/5 border border-odisha-terracotta/10 rounded-full text-[9px] md:text-[10px] font-black text-odisha-terracotta uppercase tracking-widest">
                    {t('top_rated_experts')}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{t('meet_verified_title')}</h2>
                <p className="text-gray-500 font-medium text-sm md:text-lg">{t('meet_verified_subtitle')}</p>
            </div>
            <div className="flex space-x-3">
                <button onClick={() => scrollSlider('left')} className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-odisha-teal transition-all"><i className="fas fa-chevron-left text-xs md:text-base"></i></button>
                <button onClick={() => scrollSlider('right')} className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-odisha-teal transition-all"><i className="fas fa-chevron-right text-xs md:text-base"></i></button>
            </div>
          </div>

          <div 
            ref={sliderRef}
            className="flex overflow-x-auto space-x-4 md:space-x-8 pb-12 pt-4 px-4 md:px-0 hide-scrollbar snap-x scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayWorkers.map((worker, index) => (
              <div 
                key={worker.id + index}
                className="w-[85%] sm:w-auto min-w-[280px] sm:min-w-[320px] bg-white rounded-[40px] shadow-sm flex flex-col items-center p-8 md:p-10 text-center relative snap-center border border-gray-100/50 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative mb-6 md:mb-8">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <img src={worker.avatar} className="w-full h-full object-cover" alt={worker.name} />
                  </div>
                  {worker.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-odisha-teal text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <i className="fas fa-check text-[8px] md:text-[10px]"></i>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{worker.name}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                    {t(getSkillKey(worker.skillId || ''))}
                  </p>
                </div>

                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center text-gray-500 text-[10px] md:text-[11px] font-bold">
                    <i className="far fa-star mr-2 text-odisha-saffron"></i>
                    {worker.rating}
                  </div>
                  <div className="flex items-center text-gray-500 text-[10px] md:text-[11px] font-bold">
                    <i className="fas fa-briefcase mr-2 text-gray-300"></i>
                    {worker.reviewCount} {t('jobs_done')}
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/worker-profile/${worker.id}`)}
                  className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:bg-odisha-teal hover:text-white hover:border-odisha-teal transition-all shadow-sm active:scale-95 text-[10px] md:text-xs uppercase tracking-widest"
                >
                  {t('hire_now')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-premium-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-odisha-terracotta/5 border border-odisha-terracotta/10 rounded-full text-[9px] md:text-[10px] font-black text-odisha-terracotta uppercase tracking-widest">
              {t('seamless_process')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight px-4 leading-tight">{t('how_it_works')}</h2>
            <p className="text-gray-500 font-medium text-sm md:text-lg max-w-2xl mx-auto px-4">{t('how_it_works_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-y-1/2 z-0"></div>
            {[
              { step: '01', title: t('Search'), desc: t('step_1_desc'), icon: 'fa-magnifying-glass' },
              { step: '02', title: t('Connect'), desc: t('step_2_desc'), icon: 'fa-handshake' },
              { step: '03', title: t('Get Work Done'), desc: t('step_3_desc'), icon: 'fa-house-circle-check' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group px-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[28px] md:rounded-[32px] shadow-xl border border-gray-100 flex items-center justify-center text-2xl md:text-3xl text-odisha-terracotta mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                  <i className={`fas ${item.icon}`}></i>
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 bg-odisha-teal text-white text-[10px] md:text-xs font-black rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-800 mb-2 md:mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="relative px-4">
                    <div className="aspect-square bg-odisha-saffron/5 rounded-[40px] md:rounded-[60px] overflow-hidden flex items-center justify-center p-8">
                        <img 
                          src={t('safety_illustration')} 
                          className="w-full h-auto max-h-[400px] object-contain transform hover:scale-105 transition-transform duration-700" 
                          alt="Trust and Safety Illustration" 
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-2 md:-bottom-10 md:-right-10 bg-white p-5 md:p-8 rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-50 flex items-center space-x-4 md:space-x-6 animate-fade-in-up">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 text-green-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-xl md:text-3xl">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <div>
                            <div className="text-lg md:text-2xl font-black text-gray-800">100% KYC</div>
                            <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('verified')}</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6 md:space-y-8 px-4">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight text-center md:text-left">{t('safety_priority_title')}</h2>
                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed text-center md:text-left">
                        {t('safety_priority_desc')}
                    </p>
                    <ul className="space-y-3 md:space-y-4 max-w-lg mx-auto md:mx-0">
                        {[
                            t('safety_point_1'),
                            t('safety_point_2'),
                            t('safety_point_3'),
                            t('safety_point_4')
                        ].map((item, i) => (
                            <li key={i} className="flex items-center space-x-3 md:space-x-4 text-gray-700 font-bold text-xs md:text-sm">
                                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-odisha-teal/10 text-odisha-teal rounded-full flex items-center justify-center text-[8px] md:text-[10px]">
                                    <i className="fas fa-check"></i>
                                </div>
                                <span className="leading-tight">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4 text-center md:text-left">
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-10 py-4 md:py-5 bg-odisha-terracotta text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] md:text-xs tracking-widest">{t('register_now')}</button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;