import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../db';
import { Booking, User } from '../types';
import { useNavigate } from 'react-router-dom';
import { ODISHA_DISTRICTS, SKILLS } from '../constants';

const DEMO_WORKERS: any[] = [
  { id: 'demo-1', name: 'Rajesh Kumar', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7ee504e3a?auto=format&fit=crop&w=300&q=80', skillId: 'skill_plumber', districtId: 'dist_khordha', rating: 4.8, reviewCount: 156, experience: 8 },
  { id: 'demo-2', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', skillId: 'skill_electrician', districtId: 'dist_khordha', rating: 4.9, reviewCount: 203, experience: 12 },
  { id: 'demo-3', name: 'Amit Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', skillId: 'skill_painter', districtId: 'dist_cuttack', rating: 4.7, reviewCount: 89, experience: 6 },
  { id: 'demo-4', name: 'Sunita Devi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80', skillId: 'skill_cleaning', districtId: 'dist_ganjam', rating: 4.8, reviewCount: 178, experience: 10 },
  { id: 'demo-5', name: 'Ramesh Das', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', skillId: 'skill_mason', districtId: 'dist_puri', rating: 4.6, reviewCount: 134, experience: 7 },
  { id: 'demo-11', name: 'Sagar Nayak', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=300&q=80', skillId: 'skill_electrician', districtId: 'dist_khordha', rating: 4.5, reviewCount: 42, experience: 4 },
];

const CustomerDashboard: React.FC = () => {
  const { user, t, language } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [showRateModal, setShowRateModal] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'FIND_WORKER'>('DASHBOARD');
  
  const [filterDistrictId, setFilterDistrictId] = useState(user?.districtId || 'dist_khordha');
  const [filterSkillId, setFilterSkillId] = useState('');
  const [appliedDistrictId, setAppliedDistrictId] = useState(user?.districtId || 'dist_khordha');
  const [appliedSkillId, setAppliedSkillId] = useState('');

  const getDistrictKey = (id: string) => ODISHA_DISTRICTS.find(d => d.id === id)?.key || '';
  const getSkillKey = (id: string) => SKILLS.find(s => s.id === id)?.key || '';

  const refreshBookings = () => {
    if (user) {
      const all = db.getBookings().filter(b => b.customerId === user.id);
      setBookings(all.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)));
    }
  };

  useEffect(() => {
    refreshBookings();
  }, [user, language]);

  const getWorker = (id: string) => db.getUser(id) || DEMO_WORKERS.find(w => w.id === id);

  const handleRate = () => {
    if (!showRateModal) return;
    const bookingId = showRateModal;
    const booking = db.getBooking(bookingId);
    if (!booking) return;
    db.updateBooking(bookingId, { status: 'COMPLETED', rating, review });
    const worker = db.getUser(booking.workerId);
    if (worker) {
      const currentRating = worker.rating || 0;
      const count = worker.reviewCount || 0;
      const newRating = Number(((currentRating * count + rating) / (count + 1)).toFixed(1));
      db.updateUser(worker.id, { rating: newRating, reviewCount: count + 1 });
    }
    refreshBookings();
    setShowRateModal(null);
    setReview('');
    setRating(5);
  };

  const handleCancelBookingAction = () => {
    if (!showCancelModal) return;
    db.updateBooking(showCancelModal, { status: 'CANCELLED' });
    refreshBookings();
    setShowCancelModal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'DECLINED': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ALL') return true;
    if (filter === 'ONGOING') return ['REQUESTED', 'ACCEPTED'].includes(b.status);
    return b.status === filter;
  });

  const allWorkers = [...db.getUsers().filter(u => u.role === 'WORKER' && (u.isVerified || u.verificationStatus === 'PENDING')), ...DEMO_WORKERS];
  
  const displayWorkers = allWorkers.filter(w => {
    const matchesDistrict = !appliedDistrictId || w.districtId === appliedDistrictId;
    const matchesSkill = !appliedSkillId || w.skillId === appliedSkillId;
    return matchesDistrict && matchesSkill;
  });

  const handleSearch = () => {
    setAppliedDistrictId(filterDistrictId);
    setAppliedSkillId(filterSkillId);
  };

  const renderDashboard = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6 md:gap-8">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
             <div className="hidden md:block w-1.5 h-8 bg-odisha-teal rounded-full"></div>
             <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{t('Namaskar')}, {user?.name}</h1>
          </div>
          <p className="text-gray-500 font-medium text-base md:text-lg md:ml-4">Manage your bookings and professional requests</p>
        </div>
        <button 
          onClick={() => setViewMode('FIND_WORKER')}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-odisha-terracotta text-white font-black rounded-2xl shadow-lg md:shadow-[0_20px_40px_-10px_rgba(192,64,0,0.3)] hover:shadow-xl transform hover:-translate-y-1 transition-all uppercase tracking-widest text-xs"
        >
          <i className="fas fa-plus-circle mr-3"></i> {t('Browse Specialist Network')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 text-lg md:text-xl mb-6 md:mb-8 flex items-center">
              <i className="fas fa-chart-line mr-3 text-odisha-teal opacity-60"></i> {t('Platform Usage')}
            </h3>
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-center p-4 md:p-6 bg-premium-sand rounded-2xl md:rounded-3xl border border-gray-50">
                <span className="text-gray-400 font-black uppercase tracking-widest text-[9px] md:text-[10px]">{t('Total Bookings')}</span>
                <span className="text-2xl md:text-3xl font-black text-gray-900">{bookings.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 md:p-6 bg-emerald-50 rounded-2xl md:rounded-3xl border border-emerald-100">
                <span className="text-emerald-600 font-black uppercase tracking-widest text-[9px] md:text-[10px]">{t('Ongoing Jobs')}</span>
                <span className="text-2xl md:text-3xl font-black text-emerald-700">{bookings.filter(b => ['REQUESTED', 'ACCEPTED'].includes(b.status)).length}</span>
              </div>
              <div className="flex justify-between items-center p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100">
                <span className="text-gray-500 font-black uppercase tracking-widest text-[9px] md:text-[10px]">{t('Completed')}</span>
                <span className="text-2xl md:text-3xl font-black text-gray-600">{bookings.filter(b => b.status === 'COMPLETED').length}</span>
              </div>
            </div>
          </div>
          <div className="bg-odisha-teal text-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-12 -bottom-12 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="flex items-center space-x-4 md:space-x-5 mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-inner backdrop-blur-md">
                <i className="fas fa-shield-heart"></i>
              </div>
              <h4 className="font-black text-xl md:text-2xl tracking-tight">Worker Safety</h4>
            </div>
            <p className="text-sm md:text-base opacity-80 leading-relaxed mb-6 md:mb-8 font-medium">Always verify Government ID proof before site entry. MajdoorLink workers are KYC-checked, but resident vigilance is key.</p>
            <button className="w-full sm:w-auto bg-white text-odisha-teal px-6 md:px-8 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-odisha-saffron hover:text-white transition-all shadow-lg">Safety Handbook</button>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
              <h3 className="font-black text-xl md:text-2xl text-gray-900 tracking-tight">{t('Booking History')}</h3>
              <div className="flex bg-gray-100/50 p-1 rounded-xl md:rounded-[20px] border border-gray-50 shadow-inner w-full sm:w-auto">
                {['ALL', 'ONGOING', 'COMPLETED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black rounded-lg md:rounded-[15px] transition-all uppercase tracking-widest ${filter === f ? 'bg-white text-odisha-teal shadow-md md:shadow-xl' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {filteredBookings.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredBookings.map(booking => {
                  const worker = getWorker(booking.workerId);
                  return (
                    <div key={booking.id} className="p-6 md:p-10 hover:bg-premium-light transition-all duration-300 animate-fade-in group">
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 md:mb-8 gap-4 md:gap-6">
                        <div className="flex items-center space-x-4 md:space-x-6">
                          <div className="relative">
                            <img 
                              src={worker?.avatar} 
                              alt={worker?.name} 
                              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[30px] border-2 md:border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                            />
                            {worker?.isVerified && (
                              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-emerald-500 text-white text-[7px] md:text-[9px] w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 md:border-4 border-white shadow-lg">
                                <i className="fas fa-check"></i>
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5 md:space-y-1">
                            <h4 className="font-black text-xl md:text-2xl text-gray-900 tracking-tight">{worker?.name}</h4>
                            <div className="flex items-center text-odisha-terracotta font-black text-[9px] md:text-xs uppercase tracking-widest opacity-80">
                              <i className="fas fa-briefcase mr-2"></i> {t(getSkillKey(booking.skillId || ''))}
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black tracking-widest uppercase border ${getStatusColor(booking.status)} shadow-sm`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
                        <div className="bg-premium-sand p-4 md:p-5 rounded-2xl md:rounded-[24px] border border-gray-50 flex items-center group/card hover:bg-white hover:border-odisha-teal/20 transition-all">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-gray-300 mr-3 md:mr-4 shadow-sm group-hover/card:text-odisha-teal transition-colors">
                            <i className="far fa-calendar-alt text-sm md:text-base"></i>
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">Date</p>
                            <p className="text-xs md:text-sm font-black text-gray-700">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="bg-premium-sand p-4 md:p-5 rounded-2xl md:rounded-[24px] border border-gray-100 flex items-center group/card hover:bg-white hover:border-odisha-teal/20 transition-all">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-gray-300 mr-3 md:mr-4 shadow-sm group-hover/card:text-odisha-teal transition-colors">
                            <i className="fas fa-map-pin text-sm md:text-base"></i>
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">Region</p>
                            <p className="text-xs md:text-sm font-black text-gray-700 truncate max-w-[120px]">{worker?.locality}</p>
                          </div>
                        </div>
                        <div className="bg-odisha-saffron/5 p-4 md:p-5 rounded-2xl md:rounded-[24px] border border-odisha-saffron/10 flex items-center sm:col-span-2 md:col-span-1 group/card hover:bg-white transition-all">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-odisha-saffron mr-3 md:mr-4 shadow-sm">
                            <i className="fas fa-rupee-sign text-sm md:text-base"></i>
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[9px] text-odisha-saffron font-black uppercase tracking-widest">Rate</p>
                            <p className="text-xs md:text-sm font-black text-odisha-teal">₹{booking.price || '500'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        {['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
                          <button 
                            onClick={() => setShowCancelModal(booking.id)}
                            className="flex-1 py-4 md:py-5 bg-red-50 text-red-600 text-[10px] font-black rounded-xl md:rounded-2xl border border-red-100 hover:bg-red-100 transition-all uppercase tracking-widest"
                          >
                            <i className="fas fa-times-circle mr-2"></i> Cancel Booking
                          </button>
                        )}
                        {booking.status === 'ACCEPTED' && (
                          <a 
                            href={`tel:${worker?.phone}`}
                            className="flex-1 py-4 md:py-5 bg-emerald-600 text-white text-[10px] font-black rounded-xl md:rounded-2xl shadow-lg hover:bg-emerald-700 text-center transition-all uppercase tracking-widest"
                          >
                            <i className="fas fa-phone-alt mr-2"></i> Contact Specialist
                          </a>
                        )}
                        {booking.status === 'COMPLETED' && !booking.rating ? (
                          <button 
                            onClick={() => setShowRateModal(booking.id)}
                            className="flex-1 py-4 md:py-5 bg-odisha-terracotta text-white text-[10px] font-black rounded-xl md:rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                          >
                            <i className="fas fa-star mr-2"></i> Rate Experience
                          </button>
                        ) : booking.status === 'COMPLETED' ? (
                          <div className="flex-1 p-4 md:p-5 bg-gray-50 rounded-2xl md:rounded-[24px] flex items-center justify-center border border-gray-100">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`${i < (booking.rating || 0) ? 'fas' : 'far'} fa-star text-odisha-saffron text-xs`}></i>
                              ))}
                            </div>
                            <span className="text-[9px] md:text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Rating Submitted</span>
                          </div>
                        ) : booking.status === 'REQUESTED' ? (
                          <div className="flex-1 p-4 md:p-5 border-2 border-dashed border-gray-100 rounded-2xl md:rounded-[24px] flex items-center justify-center bg-gray-50/50">
                             <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Awaiting Confirmation</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 md:p-24 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-gray-200">
                  <i className="fas fa-history text-2xl md:text-3xl"></i>
                </div>
                <h4 className="text-lg md:text-xl font-black text-gray-400 uppercase tracking-widest">{t('No Service History')}</h4>
                <p className="text-gray-300 text-xs md:text-sm mt-2 max-w-xs mx-auto">Your upcoming and past service requests will appear here once you book a worker.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFindWorker = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-4">
        <button 
          onClick={() => setViewMode('DASHBOARD')}
          className="text-gray-400 hover:text-odisha-teal font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center group"
        >
          <i className="fas fa-arrow-left mr-3 group-hover:-translate-x-1 transition-transform"></i> Back to Dashboard
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Hire a Specialist</h2>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 mb-8 md:mb-12 flex flex-col md:flex-row gap-4 md:gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Odisha District</label>
          <select 
            className="w-full p-4 bg-gray-50 border-none rounded-xl md:rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-odisha-teal/5 transition-all text-sm"
            value={filterDistrictId}
            onChange={(e) => setFilterDistrictId(e.target.value)}
          >
            {ODISHA_DISTRICTS.map(d => <option key={d.id} value={d.id}>{t(d.key)}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Worker Skill</label>
          <select 
            className="w-full p-4 bg-gray-50 border-none rounded-xl md:rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-odisha-teal/5 transition-all text-sm"
            value={filterSkillId}
            onChange={(e) => setFilterSkillId(e.target.value)}
          >
            <option value="">Any Service</option>
            {SKILLS.map(s => <option key={s.id} value={s.id}>{t(s.key)}</option>)}
          </select>
        </div>
        <button 
          onClick={handleSearch}
          className="w-full md:w-auto px-10 md:px-12 py-4 bg-odisha-teal text-white font-black rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[10px] md:text-xs"
        >
          Search Workers
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayWorkers.map(worker => (
          <div key={worker.id} className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
            {worker.isVerified && (
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                <i className="fas fa-check-circle mr-1"></i> Verified
              </div>
            )}
            <div className="flex items-center space-x-4 md:space-x-5 mb-6 md:mb-8">
              <img src={worker.avatar} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[30px] shadow-lg border-2 md:border-4 border-white group-hover:scale-110 transition-transform duration-500" alt={worker.name} />
              <div>
                <h4 className="font-black text-lg md:text-xl text-gray-800 tracking-tight">{worker.name}</h4>
                <p className="text-odisha-terracotta font-black uppercase text-[9px] md:text-[10px] tracking-widest">{t(getSkillKey(worker.skillId || ''))}</p>
                <div className="flex items-center mt-2">
                  <div className="flex text-odisha-saffron text-[9px] md:text-[10px] space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.round(worker.rating || 0) ? '' : 'text-gray-100'}`}></i>
                    ))}
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">({worker.reviewCount})</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">Exp</p>
                <p className="text-xs md:text-sm font-black text-gray-700">{worker.experience || 5}+ Yrs</p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">Rate</p>
                <p className="text-xs md:text-sm font-black text-odisha-teal">₹{worker.price || 500}/d</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/worker-profile/${worker.id}`)}
              className="w-full py-3 md:py-4 bg-white border-2 border-gray-100 text-gray-800 font-black rounded-xl md:rounded-2xl hover:bg-odisha-terracotta hover:border-odisha-terracotta hover:text-white transition-all shadow-sm active:scale-95 text-[10px] md:text-xs uppercase tracking-widest"
            >
              Check Availability
            </button>
          </div>
        ))}
        {displayWorkers.length === 0 && (
           <div className="col-span-full py-16 md:py-20 text-center bg-gray-50/50 rounded-[30px] md:rounded-[40px] border-2 border-dashed border-gray-100">
              <i className="fas fa-search-minus text-3xl md:text-4xl text-gray-200 mb-4"></i>
              <h4 className="text-base md:text-lg font-black text-gray-400 uppercase tracking-widest">No matching specialists found</h4>
              <p className="text-gray-300 text-xs md:text-sm mt-2">Try expanding your search to other districts or skills.</p>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
      {viewMode === 'DASHBOARD' ? renderDashboard() : renderFindWorker()}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-bounce-in">
            <div className="p-8 md:p-10 text-center">
               <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-xl md:text-2xl shadow-inner">
                  <i className="fas fa-exclamation-triangle"></i>
               </div>
               <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Cancel Booking?</h3>
               <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">Are you sure you want to cancel this request? Frequent cancellations may affect your platform reliability rating.</p>
               <div className="flex flex-col gap-3">
                  <button onClick={handleCancelBookingAction} className="w-full py-3.5 md:py-4 bg-red-600 text-white font-black rounded-xl md:rounded-2xl shadow-xl hover:bg-red-700 active:scale-95 transition-all text-[10px] md:text-xs uppercase tracking-widest">
                    Confirm Cancellation
                  </button>
                  <button onClick={() => setShowCancelModal(null)} className="w-full py-3.5 md:py-4 bg-gray-50 text-gray-500 font-black rounded-xl md:rounded-2xl hover:bg-gray-100 active:scale-95 transition-all text-[10px] md:text-xs uppercase tracking-widest">
                    Go Back
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRateModal(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-bounce-in">
             <div className="p-8 md:p-12">
                <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Rate Your Experience</h3>
                <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8 font-medium">Your feedback helps local professionals improve and keeps the community safe.</p>
                
                <div className="space-y-6 md:space-y-8">
                   <div className="text-center">
                      <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Overall Service Quality</p>
                      <div className="flex justify-center space-x-3 md:space-x-4">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num} 
                            onClick={() => setRating(num)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${rating >= num ? 'bg-odisha-saffron text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-200 hover:bg-gray-100'}`}
                          >
                            <i className="fas fa-star text-base md:text-lg"></i>
                          </button>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Feedback</label>
                      <textarea 
                        className="w-full p-4 md:p-5 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium outline-none h-24 md:h-32 resize-none focus:ring-4 focus:ring-odisha-teal/5 transition-all"
                        placeholder="Tell us what went well..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                   </div>

                   <button 
                    onClick={handleRate}
                    className="w-full py-4 md:py-5 bg-odisha-teal text-white font-black rounded-xl md:rounded-2xl shadow-xl hover:bg-odisha-teal/90 active:scale-95 transition-all text-xs md:text-sm uppercase tracking-widest"
                   >
                     Submit Rating
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;