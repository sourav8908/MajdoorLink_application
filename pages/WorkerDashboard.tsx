import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../db';
import { Booking, Availability, ShiftType } from '../types';
import { ODISHA_DISTRICTS, SKILLS } from '../constants';

const WorkerDashboard: React.FC = () => {
  const { user, t } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<Availability>(db.getAvailability(user?.id || ''));
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);

  const getDistrictKey = (id: string) => ODISHA_DISTRICTS.find(d => d.id === id)?.key || '';
  const getSkillKey = (id: string) => SKILLS.find(s => s.id === id)?.key || '';

  const refreshData = () => {
    if (user) {
      const all = db.getBookings().filter(b => b.workerId === user.id);
      setBookings(all.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)));
      setAvailability(db.getAvailability(user.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const handleToggleOnline = () => {
    if (user?.verificationStatus !== 'VERIFIED') {
        setNotification({ message: "You must be verified to go online.", type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
    }
    const newVal = !availability.isOnline;
    db.updateAvailability(user!.id, { isOnline: newVal });
    setAvailability({ ...availability, isOnline: newVal });
  };

  const handleBookingAction = (id: string, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED') => {
    db.updateBooking(id, { status });
    refreshData();
    
    const booking = db.getBooking(id);
    const customer = booking ? db.getUser(booking.customerId) : null;
    
    if (status === 'DECLINED') {
      setNotification({ message: `Booking declined. ${customer?.name} notified.`, type: 'success' });
    } else if (status === 'ACCEPTED') {
      setNotification({ message: `Booking accepted! Start when ready.`, type: 'success' });
    } else if (status === 'COMPLETED') {
       setNotification({ message: `Job marked as completed. Well done!`, type: 'success' });
    }
    
    setTimeout(() => setNotification(null), 4000);
  };

  const updateShift = (date: string, shift: ShiftType) => {
    const newSchedule = { ...availability.schedule, [date]: shift };
    db.updateAvailability(user!.id, { schedule: newSchedule });
    setAvailability({ ...availability, schedule: newSchedule });
  };

  const updatePrice = (type: keyof Availability['pricing'], val: number) => {
    const newPricing = { ...availability.pricing, [type]: val };
    db.updateAvailability(user!.id, { pricing: newPricing });
    setAvailability({ ...availability, pricing: newPricing });
  };

  const getCustomer = (id: string) => db.getUser(id);

  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.price || 500), 0);

  const next14Days = [...Array(14)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const shifts: { type: ShiftType; label: string; icon: string; color: string }[] = [
    { type: 'FULL_DAY', label: t('full_day'), icon: 'fa-sun', color: 'bg-orange-100 text-orange-700' },
    { type: 'MORNING', label: t('morning'), icon: 'fa-cloud-sun', color: 'bg-blue-100 text-blue-700' },
    { type: 'EVENING', label: t('evening'), icon: 'fa-moon', color: 'bg-indigo-100 text-indigo-700' },
    { type: 'REST', label: t('rest'), icon: 'fa-bed', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {notification && (
        <div className={`fixed top-20 md:top-24 right-4 left-4 sm:left-auto sm:right-6 z-[100] px-5 py-3.5 rounded-2xl shadow-2xl animate-bounce-in border flex items-center space-x-4 ${
          notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-red-500'} text-lg md:text-xl`}></i>
          <span className="font-bold text-xs md:text-sm uppercase tracking-tight">{notification.message}</span>
        </div>
      )}

      {user?.verificationStatus !== 'VERIFIED' && (
          <div className={`mb-8 p-5 rounded-2xl md:rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-xl ${user?.verificationStatus === 'DECLINED' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'} interactive-card`}>
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-md ${user?.verificationStatus === 'DECLINED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    <i className={`fas ${user?.verificationStatus === 'DECLINED' ? 'fa-circle-exclamation' : 'fa-hourglass-half'}`}></i>
                </div>
                <div>
                    <h3 className={`text-base md:text-lg font-black ${user?.verificationStatus === 'DECLINED' ? 'text-red-800' : 'text-orange-800'}`}>
                        {user?.verificationStatus === 'DECLINED' ? 'Verification Declined' : 'Verification In Progress'}
                    </h3>
                    <p className={`text-[10px] md:text-xs font-medium ${user?.verificationStatus === 'DECLINED' ? 'text-red-600' : 'text-orange-600'}`}>
                        {user?.verificationStatus === 'DECLINED' 
                           ? `Reason: ${user.declineReason || 'Invalid documents'}` 
                           : 'Our admin team is reviewing your documents. You will be notified once verified.'}
                    </p>
                </div>
              </div>
          </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative group cursor-pointer" onClick={() => setShowIdCard(true)}>
            <img src={user?.avatar} className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 md:border-4 border-white shadow-xl ${user?.verificationStatus !== 'VERIFIED' ? 'grayscale' : ''} group-hover:scale-105 transition-transform duration-500`} alt={user?.name} />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-colors duration-500 ${availability.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
              <i className={`fas fa-power-off text-white text-[7px] md:text-[8px]`}></i>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-odisha-teal mb-1">{user?.name}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 md:px-3 py-1 bg-odisha-terracotta/10 text-odisha-terracotta rounded-full text-[8px] md:text-[10px] font-bold uppercase">{t(getSkillKey(user?.skillId || ''))}</span>
              <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[8px] md:text-[10px] font-bold uppercase">{t(getDistrictKey(user?.districtId || ''))}</span>
              {user?.verificationStatus === 'VERIFIED' && (
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">
                      <i className="fas fa-check-circle mr-1"></i> {t('verified')}
                  </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
            <button 
                onClick={() => setShowIdCard(true)}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 md:px-6 py-3 bg-white border border-gray-100 text-gray-600 text-[9px] md:text-[10px] font-black rounded-xl shadow-sm hover:bg-gray-50 uppercase tracking-widest"
            >
                <i className="fas fa-id-card mr-2 text-odisha-terracotta"></i> Digital ID
            </button>
            <div className="flex items-center bg-white px-4 md:px-5 py-3 rounded-xl shadow-sm border border-gray-100 group/status transition-all hover:shadow-md">
              <div className="mr-3 md:mr-5">
                <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Status</p>
                <span className={`text-[10px] md:text-xs font-black ${availability.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                  {availability.isOnline ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <button 
                onClick={handleToggleOnline}
                className={`relative inline-flex h-6 w-10 md:h-7 md:w-12 items-center rounded-full focus:outline-none transition-colors duration-500 ${availability.isOnline ? 'bg-odisha-teal' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-white shadow-md transition-all duration-500 ${availability.isOnline ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100 text-center interactive-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-odisha-teal opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-1000" />
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Earnings</span>
            <h2 className="text-3xl md:text-4xl font-black text-odisha-teal mt-2 mb-6 tracking-tighter">₹{totalEarnings}</h2>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div>
                <p className="text-lg md:text-xl font-black text-gray-800">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
                <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase">Jobs Done</p>
              </div>
              <div className="border-l border-gray-50">
                <p className="text-lg md:text-xl font-black text-odisha-saffron">{user?.rating || '0.0'}</p>
                <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase">Rating</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-[30px] shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 text-sm md:text-base mb-5 uppercase tracking-wider">Set Market Pricing</h3>
            <div className="space-y-4">
              {['FULL_DAY', 'MORNING', 'EVENING'].map((type) => (
                <div key={type} className="flex flex-col group">
                  <label className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase mb-1 group-focus-within:text-odisha-teal transition-colors">{t(type.toLowerCase())}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-all outline-none text-sm font-bold"
                      value={availability.pricing[type as keyof Availability['pricing']]}
                      onChange={(e) => updatePrice(type as any, parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="font-black text-base md:text-lg text-gray-800 mb-6 uppercase tracking-wider">{t('availability')}</h3>
            <div className="overflow-x-auto pb-4 hide-scrollbar">
               <div className="flex space-x-3 min-w-[600px] md:min-w-0 md:grid md:grid-cols-7 md:gap-3">
                {next14Days.map(date => {
                  const d = new Date(date);
                  const currentShift = availability.schedule[date] || 'REST';
                  const shiftData = shifts.find(s => s.type === currentShift)!;
                  return (
                    <div key={date} className="flex flex-col group relative w-16 md:w-full flex-shrink-0">
                      <div className="text-center mb-2">
                        <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                        <p className="text-xs md:text-sm font-bold text-gray-800">{d.getDate()}</p>
                      </div>
                      <button className={`w-full p-2.5 rounded-xl border flex flex-col items-center transition-all ${shiftData.color}`}>
                        <i className={`fas ${shiftData.icon} text-xs mb-1`}></i>
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest truncate w-full text-center">{shiftData.label}</span>
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white shadow-2xl rounded-xl p-2 z-10 border border-gray-100 hidden group-hover:block w-32">
                        {shifts.map(s => (
                          <button key={s.type} onClick={() => updateShift(date, s.type)} className="w-full flex items-center space-x-2 p-2 rounded-lg text-left hover:bg-gray-50">
                            <i className={`fas ${s.icon} text-[10px] ${s.type === currentShift ? 'text-odisha-terracotta' : 'text-gray-400'}`}></i>
                            <span className="text-[9px] font-bold text-gray-700">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-base md:text-lg text-gray-800 uppercase tracking-wider">Site Assignments</h3>
              <span className="text-[9px] md:text-[10px] font-black text-odisha-teal bg-odisha-teal/10 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
            </div>
            <div className="divide-y divide-gray-50">
              {bookings.filter(b => ['REQUESTED', 'ACCEPTED'].includes(b.status)).map(booking => {
                const customer = getCustomer(booking.customerId);
                return (
                  <div key={booking.id} className="p-5 md:p-6 hover:bg-gray-50/80 transition-all animate-fade-in group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 md:gap-6">
                      <div className="flex items-center space-x-4">
                        <img src={customer?.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-sm border border-white" alt={customer?.name} />
                        <div>
                          <h4 className="font-black text-sm md:text-base text-gray-800">{customer?.name}</h4>
                          <div className="flex items-center space-x-2">
                             <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                               {booking.status}
                             </span>
                             <span className="text-[9px] md:text-[10px] font-bold text-gray-400">{new Date(booking.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'REQUESTED' ? (
                          <>
                            <button onClick={() => handleBookingAction(booking.id, 'DECLINED')} className="flex-1 sm:flex-none px-4 py-2 text-[9px] md:text-[10px] font-black text-red-500 rounded-xl uppercase hover:bg-red-50 transition-all">DECLINE</button>
                            <button onClick={() => handleBookingAction(booking.id, 'ACCEPTED')} className="flex-1 sm:flex-none px-5 py-2.5 bg-odisha-teal text-white text-[9px] md:text-[10px] font-black rounded-xl shadow-lg uppercase">ACCEPT</button>
                          </>
                        ) : (
                          <>
                            <a href={`tel:${customer?.phone}`} className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"><i className="fas fa-phone-alt text-sm"></i></a>
                            <button onClick={() => handleBookingAction(booking.id, 'COMPLETED')} className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-800 text-white text-[9px] md:text-[10px] font-black rounded-xl shadow-lg uppercase hover:bg-black">FINISH</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {bookings.filter(b => ['REQUESTED', 'ACCEPTED'].includes(b.status)).length === 0 && (
                <div className="p-16 text-center opacity-30">
                  <i className="fas fa-clipboard-list text-3xl md:text-4xl mb-3"></i>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">No pending assignments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Digital ID Card Modal */}
      {showIdCard && (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="absolute inset-0" onClick={() => setShowIdCard(false)}></div>
              <div className="relative bg-white w-full max-w-xs sm:max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-bounce-in">
                <div className="bg-odisha-teal p-6 md:p-8 text-white text-center relative">
                    <div className="absolute top-4 right-4 text-[7px] md:text-[8px] font-black opacity-40 uppercase tracking-widest">Verified Partner</div>
                    <img src={user?.avatar} className="w-20 h-20 md:w-24 md:h-24 rounded-[25px] md:rounded-[30px] border-2 md:border-4 border-white shadow-xl mx-auto mb-3 md:mb-4 object-cover" alt={user?.name} />
                    <h3 className="text-lg md:text-xl font-black">{user?.name}</h3>
                    <p className="text-[9px] md:text-[10px] font-bold opacity-70 uppercase tracking-widest">{t(getSkillKey(user?.skillId || ''))}</p>
                </div>
                <div className="p-6 md:p-8 space-y-3 md:space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-2 md:pb-3">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase">District</span>
                        <span className="text-[9px] md:text-[10px] font-black text-gray-800">{t(getDistrictKey(user?.districtId || ''))}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2 md:pb-3">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase">Worker ID</span>
                        <span className="text-[9px] md:text-[10px] font-mono font-black text-gray-800">ML-{user?.id.split('-')[1] || '0021'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2 md:pb-3">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase">Phone</span>
                        <span className="text-[9px] md:text-[10px] font-black text-gray-800">+91 {user?.phone}</span>
                    </div>
                    <div className="pt-2 md:pt-4 flex flex-col items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 md:mb-4 border border-gray-100">
                            <i className="fas fa-qrcode text-4xl md:text-5xl text-gray-300"></i>
                        </div>
                        <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scan for platform verification</p>
                    </div>
                    <button onClick={() => setShowIdCard(false)} className="w-full py-3 md:py-4 mt-4 md:mt-6 bg-gray-800 text-white font-black rounded-xl md:rounded-2xl shadow-xl uppercase text-[10px] md:text-xs tracking-widest">Close ID</button>
                </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default WorkerDashboard;