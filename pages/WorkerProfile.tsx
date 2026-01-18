
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { db } from '../db';
import { User, Availability, ShiftType, Booking } from '../types';
import { ODISHA_DISTRICTS, SKILLS } from '../constants';
import BackButton from '../components/BackButton';

const WorkerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, t } = useAuth();
  const [worker, setWorker] = useState<User | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<ShiftType | null>(null);
  const [bookingSent, setBookingSent] = useState(false);
  const [countdown, setCountdown] = useState(1800);

  // Helper functions for translation keys
  const getDistrictKey = (id: string) => ODISHA_DISTRICTS.find(d => d.id === id)?.key || '';
  const getSkillKey = (id: string) => SKILLS.find(s => s.id === id)?.key || '';

  useEffect(() => {
    if (id) {
      const w = db.getUser(id);
      if (w) {
        setWorker(w);
        setAvailability(db.getAvailability(w.id));
      }
    }
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (bookingSent && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [bookingSent, countdown]);

  if (!worker || !availability) return <div className="p-20 text-center">Loading Worker Data...</div>;

  const handleBook = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!selectedDate || !selectedShift) return;

    const price = selectedShift === 'REST' ? 0 : availability.pricing[selectedShift as keyof Availability['pricing']] || 500;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      customerId: currentUser.id,
      workerId: worker.id,
      skillId: worker.skillId!,
      date: selectedDate,
      shift: selectedShift,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      price: price
    };

    db.addBooking(newBooking);
    setBookingSent(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const next14Days = [...Array(14)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const shiftLabels = {
    FULL_DAY: { label: t('full_day'), icon: 'fa-sun', color: 'text-orange-600 bg-orange-50' },
    MORNING: { label: t('morning'), icon: 'fa-cloud-sun', color: 'text-blue-600 bg-blue-50' },
    EVENING: { label: t('evening'), icon: 'fa-moon', color: 'text-indigo-600 bg-indigo-50' },
    REST: { label: t('rest'), icon: 'fa-bed', color: 'text-gray-400 bg-gray-50' },
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <BackButton />
      </div>

      {bookingSent ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-12 text-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-5xl mx-auto mb-8 animate-bounce-in">
            <i className="fas fa-paper-plane"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-odisha-teal mb-4">Success: Your booking request is sent.</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Wait ~30 minutes for worker confirmation. You can check the status in your dashboard.
          </p>
          
          <div className="bg-gray-50 inline-block p-6 rounded-2xl mb-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Response In</p>
            <div className="text-4xl font-mono font-bold text-odisha-terracotta">
              {formatTime(countdown)}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate('/customer')} className="px-8 py-3 bg-odisha-teal text-white font-bold rounded-xl shadow-lg">Go to Dashboard</button>
            <button onClick={() => setBookingSent(false)} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Book Another</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Worker Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8 sticky top-24">
              <div className="relative inline-block mb-6">
                <img src={worker.avatar} className="w-40 h-40 rounded-[40px] object-cover mx-auto shadow-xl border-4 border-white" alt={worker.name} />
                {worker.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-odisha-terracotta text-white w-10 h-10 rounded-2xl shadow-md flex items-center justify-center border-4 border-white">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-black text-gray-800 mb-1">{worker.name}</h1>
              <p className="text-odisha-terracotta font-black uppercase text-xs tracking-widest mb-4">{t(getSkillKey(worker.skillId || ''))}</p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="text-center">
                  <div className="text-odisha-saffron font-black text-xl"><i className="fas fa-star mr-1"></i>{worker.rating}</div>
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Rating</div>
                </div>
                <div className="w-px h-10 bg-gray-100"></div>
                <div className="text-center">
                  <div className="text-gray-800 font-black text-xl">{worker.reviewCount}</div>
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Jobs Done</div>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center">
                  <i className="fas fa-map-marker-alt text-odisha-terracotta mr-4"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-gray-700">{worker.locality}, {t(getDistrictKey(worker.districtId || ''))}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center">
                  <i className="fas fa-language text-odisha-terracotta mr-4"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Worker Language</p>
                    <p className="text-sm font-bold text-gray-700">{worker.language === 'OR' ? 'Odia (ଓଡ଼ିଆ)' : worker.language === 'HI' ? 'Hindi (हिन्दी)' : 'English'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-8">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Standard Pricing</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                       <span className="text-xs font-bold text-orange-800">{t('full_day')}</span>
                       <span className="font-black text-orange-800">₹{availability.pricing.FULL_DAY}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                       <span className="text-xs font-bold text-blue-800">{t('morning')}</span>
                       <span className="font-black text-blue-800">₹{availability.pricing.MORNING}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                       <span className="text-xs font-bold text-indigo-800">{t('evening')}</span>
                       <span className="font-black text-indigo-800">₹{availability.pricing.EVENING}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Availability & Booking */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-black text-gray-800 mb-6">{t('availability')}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-10">
                {next14Days.map(date => {
                  const d = new Date(date);
                  const shift = availability.schedule[date] || 'REST';
                  const data = shiftLabels[shift as keyof typeof shiftLabels];
                  const isSelected = selectedDate === date;

                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShift(shift);
                      }}
                      className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all group ${
                        isSelected 
                          ? 'border-odisha-terracotta bg-odisha-terracotta/5 scale-105' 
                          : 'border-gray-50 hover:border-gray-200'
                      } ${shift === 'REST' ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <span className={`text-xl font-black ${isSelected ? 'text-odisha-terracotta' : 'text-gray-800'}`}>{d.getDate()}</span>
                      <div className={`mt-2 p-1 rounded-lg w-full flex flex-col items-center ${data.color}`}>
                        <i className={`fas ${data.icon} text-[10px]`}></i>
                        <span className="text-[7px] font-black uppercase mt-0.5">{data.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedDate && selectedShift && selectedShift !== 'REST' && (
                 <div className="bg-odisha-teal text-white p-6 rounded-3xl mb-10 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Selection Summary</p>
                          <h4 className="text-lg font-black">{new Date(selectedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })} • {shiftLabels[selectedShift].label}</h4>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimate</p>
                          <p className="text-2xl font-black">₹{availability.pricing[selectedShift as keyof Availability['pricing']]}</p>
                       </div>
                    </div>
                 </div>
              )}

              <button 
                onClick={handleBook}
                disabled={!selectedDate || !selectedShift || selectedShift === 'REST'}
                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 ${
                  selectedDate && selectedShift !== 'REST'
                    ? 'bg-odisha-terracotta text-white hover:opacity-90' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('book_now')}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-800">Public Reviews</h3>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                    <i className="fas fa-user text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-black text-gray-800 text-sm">Customer Review</p>
                      <div className="text-odisha-saffron text-xs"><i className="fas fa-star"></i> 5.0</div>
                    </div>
                    <p className="text-gray-500 text-sm italic">"Very reliable and punctual. The {t(getSkillKey(worker.skillId || ''))} work was handled perfectly. I booked for the morning shift and he arrived on time."</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
