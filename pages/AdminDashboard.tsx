import React, { useState } from 'react';
import { useAuth } from '../App';
import { db } from '../db';
import { User, Booking, BookingStatus, VerificationStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, AreaChart, Area, PieChart, Pie 
} from 'recharts';
import { ODISHA_DISTRICTS, SKILLS, DECLINE_REASONS } from '../constants';

const AdminDashboard: React.FC = () => {
  const { t } = useAuth();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'BOOKINGS' | 'VERIFICATION'>('METRICS');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  
  const users = db.getUsers();
  const bookings = db.getBookings();

  const getDistrictKey = (id: string) => ODISHA_DISTRICTS.find(d => d.id === id)?.key || '';
  const getSkillKey = (id: string) => SKILLS.find(s => s.id === id)?.key || '';

  const handleBanUser = (id: string) => {
    const user = db.getUser(id);
    db.updateUser(id, { isBanned: !user?.isBanned });
    window.location.reload(); 
  };

  const handleVerifyWorker = (id: string) => {
    db.updateUser(id, { 
        isVerified: true, 
        verificationStatus: 'VERIFIED',
        adminNotes: adminNotes || 'Verified by Admin' 
    });
    setSelectedWorker(null);
    setViewingUser(null);
    setAdminNotes('');
    alert("Worker verified successfully!");
    window.location.reload();
  };

  const handleDeclineWorker = () => {
    if (!selectedWorker || !declineReason) {
        alert("Please select a reason for declining.");
        return;
    }
    db.updateUser(selectedWorker.id, { 
        isVerified: false, 
        verificationStatus: 'DECLINED',
        declineReason,
        adminNotes: adminNotes || 'Documents did not meet criteria'
    });
    setSelectedWorker(null);
    setShowDeclineModal(false);
    setDeclineReason('');
    setAdminNotes('');
    alert("Worker application declined.");
    window.location.reload();
  };

  const handleUpdateBookingStatus = (id: string, status: BookingStatus) => {
    db.updateBooking(id, { status });
    window.location.reload();
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("CRITICAL ACTION: Permanently delete this user and all associated data?")) {
      db.deleteUser(id);
      setViewingUser(null);
      window.location.reload();
    }
  };

  const pendingWorkers = users.filter(u => u.role === 'WORKER' && u.verificationStatus === 'PENDING');
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Investor Growth Analytics
  const growthData = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 145 },
    { month: 'Mar', revenue: 61000, bookings: 178 },
    { month: 'Apr', revenue: 89000, bookings: 240 },
    { month: 'May', revenue: 105000, bookings: 310 },
    { month: 'Jun', revenue: 142000, bookings: 395 },
  ];

  const categoryData = SKILLS.map(s => ({
    name: t(s.key),
    value: bookings.filter(b => b.skillId === s.id).length || Math.floor(Math.random() * 50) + 10
  })).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-blue-100 text-blue-700';
      case 'ACCEPTED': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      case 'DECLINED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderDocumentPreview = (data?: string) => {
    if (!data) return (
        <div className="text-center text-gray-300">
            <i className="fas fa-file-invoice text-3xl mb-2"></i>
            <p className="text-[10px] font-bold">No Document</p>
        </div>
    );
    const isPdf = data.startsWith('data:application/pdf');
    if (isPdf) {
        return (
            <div className="flex flex-col items-center">
                <i className="fas fa-file-pdf text-4xl text-red-500 mb-3"></i>
                <a href={data} target="_blank" rel="noreferrer" className="text-[10px] font-black text-odisha-teal underline uppercase tracking-widest text-center">Open PDF Viewer</a>
            </div>
        );
    }
    return <img src={data} className="w-full h-full object-cover" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <span className="px-3 py-1 bg-odisha-terracotta text-white text-[9px] md:text-[10px] font-black rounded-full mr-3 tracking-widest uppercase animate-pulse">Management Hub</span>
            <h1 className="text-3xl md:text-4xl font-black text-odisha-teal">Control Center</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base">State-wide oversight of MajdoorLink operations</p>
        </div>
        
        <div className="flex flex-wrap bg-white p-1 rounded-xl md:rounded-[20px] shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
          {['METRICS', 'USERS', 'BOOKINGS', 'VERIFICATION'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 text-[9px] md:text-xs font-black rounded-lg md:rounded-[15px] transition-all whitespace-nowrap active:scale-95 ${
                activeTab === tab ? 'bg-odisha-teal text-white shadow-lg translate-y-[-1px]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab === 'VERIFICATION' ? (
                 <span className="flex items-center justify-center">
                    {tab} 
                    {pendingWorkers.length > 0 && (
                        <span className="ml-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-odisha-terracotta text-white text-[8px] rounded-full flex items-center justify-center animate-pulse">{pendingWorkers.length}</span>
                    )}
                 </span>
              ) : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'METRICS' && (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Workers</span>
              <div className="flex items-end justify-between mt-2 md:mt-3">
                <span className="text-2xl md:text-4xl font-black text-gray-800">{users.filter(u => u.role === 'WORKER' && u.isVerified).length}</span>
                <span className="text-green-500 text-[10px] font-black"><i className="fas fa-check-double mr-1"></i> VALID</span>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</span>
              <div className="flex items-end justify-between mt-2 md:mt-3">
                <span className="text-2xl md:text-4xl font-black text-orange-500">{pendingWorkers.length}</span>
                <span className="text-orange-300 text-[9px] font-black uppercase">NEW</span>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform GMV</span>
              <div className="flex items-end justify-between mt-2 md:mt-3">
                <span className="text-2xl md:text-4xl font-black text-gray-800">₹{(bookings.length * 500) + 142000}</span>
                <span className="text-green-500 text-[10px] font-black"><i className="fas fa-chart-line mr-1"></i> +14%</span>
              </div>
            </div>
            <div className="bg-odisha-terracotta p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-2xl text-white transition-all duration-300 hover:brightness-110 hover:-translate-y-2">
              <span className="text-[9px] md:text-[10px] font-black opacity-60 uppercase tracking-widest">Investor Trust</span>
              <div className="flex items-end justify-between mt-2 md:mt-3">
                <span className="text-xl md:text-2xl font-black uppercase">A+ RATED</span>
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-10 gap-3">
                <h3 className="font-black text-lg md:text-xl text-gray-800">Revenue Velocity</h3>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-odisha-teal"></div>
                        <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase">Gross Revenue</span>
                    </div>
                </div>
              </div>
              <div className="h-[250px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#004d40" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#004d40" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" fontSize={9} tickLine={false} axisLine={false} stroke="#CBD5E1" />
                    <YAxis fontSize={9} tickLine={false} axisLine={false} stroke="#CBD5E1" />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#004d40" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="lg:col-span-4 bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="font-black text-lg md:text-xl text-gray-800 mb-6 w-full text-center">Service Demand</h3>
                <div className="flex-1 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#C04000' : '#FF9933'} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-3 w-full pt-4">
                    {categoryData.map((cat, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-odisha-terracotta' : 'bg-odisha-saffron'}`}></div>
                                <span className="text-[10px] font-bold text-gray-500">{cat.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-gray-800">{cat.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'VERIFICATION' && (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {pendingWorkers.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                    {pendingWorkers.map(worker => (
                        <div key={worker.id} className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row cursor-pointer hover:border-odisha-teal/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={() => setViewingUser(worker)}>
                            <div className="md:w-1/3 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-r">
                                <img src={worker.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl shadow-lg border-4 border-white mb-4 object-cover" alt={worker.name} />
                                <h4 className="font-black text-base md:text-lg text-center text-gray-800">{worker.name}</h4>
                                <p className="text-odisha-terracotta text-[10px] font-black uppercase mb-4">{t(getSkillKey(worker.skillId || ''))}</p>
                                <div className="space-y-1.5 w-full">
                                    <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase"><span>District:</span> <span className="text-gray-700">{t(getDistrictKey(worker.districtId || ''))}</span></div>
                                    <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase"><span>Mobile:</span> <span className="text-odisha-teal font-black">{worker.phone}</span></div>
                                </div>
                            </div>
                            <div className="md:w-2/3 p-6 md:p-8">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center md:text-left">Verification Documents</h5>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {['aadhaar', 'pan'].map(docKey => (
                                        <div key={docKey} className="group relative">
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center hover:bg-white hover:shadow-md transition-all">
                                                <i className="fas fa-file-image text-xl text-gray-300 group-hover:text-odisha-terracotta mb-1"></i>
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">{docKey}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedWorker(worker); setShowDeclineModal(true); }}
                                        className="flex-1 py-3 bg-red-50 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-100 active:scale-95 transition-all uppercase tracking-widest"
                                    >
                                        DECLINE
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleVerifyWorker(worker.id); }}
                                        className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 shadow-lg active:scale-95 transition-all uppercase tracking-widest"
                                    >
                                        APPROVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[30px] md:rounded-[40px] p-16 md:p-20 text-center border-2 border-dashed border-gray-100">
                    <i className="fas fa-clipboard-check text-4xl md:text-5xl text-gray-100 mb-4"></i>
                    <h3 className="text-lg md:text-xl font-black text-gray-400 uppercase">Verification Queue Empty</h3>
                    <p className="text-gray-300 text-xs md:text-sm mt-2">All worker applications have been processed.</p>
                </div>
            )}
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-5 md:p-8 border-b border-gray-50">
            <div className="relative max-w-md group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-odisha-teal transition-colors"></i>
              <input 
                type="text" 
                placeholder="Search by name..."
                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border-none rounded-xl md:rounded-2xl text-sm outline-none focus:ring-4 focus:ring-odisha-teal/5 transition-all font-bold text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead className="bg-gray-50/50 font-black text-gray-400 uppercase text-[9px] md:text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 md:px-8 py-5 md:py-6">Identity</th>
                  <th className="px-6 md:px-8 py-5 md:py-6">Contact</th>
                  <th className="px-6 md:px-8 py-5 md:py-6">Role</th>
                  <th className="px-6 md:px-8 py-5 md:py-6">Status</th>
                  <th className="px-6 md:px-8 py-5 md:py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-odisha-teal/[0.02] transition-colors cursor-pointer group" onClick={() => setViewingUser(u)}>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <img src={u.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white transition-transform group-hover:scale-110 shadow-sm" alt={u.name} />
                        <div>
                          <p className="font-black text-gray-800 text-xs md:text-sm group-hover:text-odisha-teal transition-colors">{u.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold truncate max-w-[120px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                        <span className="text-[10px] md:text-xs font-black text-gray-600 font-mono tracking-tight">{u.phone}</span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <span className={`text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'WORKER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex flex-col">
                        {u.role === 'WORKER' && (
                          <span className={`text-[9px] md:text-[10px] font-black ${u.verificationStatus === 'VERIFIED' ? 'text-green-600' : u.verificationStatus === 'PENDING' ? 'text-orange-500' : 'text-red-500'}`}>
                            {u.verificationStatus}
                          </span>
                        )}
                        {u.isBanned && <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mt-0.5">BANNED</span>}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                        <button className="px-3 md:px-4 py-2 bg-gray-50 text-gray-400 text-[9px] md:text-[10px] font-black rounded-lg group-hover:bg-odisha-teal group-hover:text-white transition-all">
                            VIEW
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'BOOKINGS' && (
        <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[850px]">
              <thead className="bg-gray-50/50 font-black text-gray-400 uppercase text-[9px] md:text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 md:px-8 py-5 md:py-6">Service</th>
                  <th className="px-6 md:px-8 py-5 md:py-6">Details</th>
                  <th className="px-6 md:px-8 py-5 md:py-6">Live Status</th>
                  <th className="px-6 md:px-8 py-5 md:py-6 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-odisha-teal/[0.02] transition-colors group">
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <p className="font-black text-gray-800 text-xs md:text-sm group-hover:text-odisha-teal transition-colors">{t(getSkillKey(b.skillId || ''))}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">₹{b.price || '500'}</p>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                        <div className="flex flex-col text-[10px] font-bold text-gray-500">
                            <span>Cust: {db.getUser(b.customerId)?.name}</span>
                            <span>Work: {db.getUser(b.workerId)?.name}</span>
                        </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <span className={`px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${getStatusColor(b.status)} border`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-right space-x-2">
                      {['REQUESTED', 'ACCEPTED'].includes(b.status) && (
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'DECLINED')} className="px-3 md:px-4 py-2 bg-red-50 text-red-600 text-[9px] md:text-[10px] font-black rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">CANCEL</button>
                      )}
                      {b.status === 'ACCEPTED' && (
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')} className="px-3 md:px-4 py-2 bg-green-50 text-green-700 text-[9px] md:text-[10px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all uppercase tracking-widest">COMPLETE</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {showDeclineModal && (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-bounce-in">
                <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Decline Application</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8">Inform worker about the reason for declining verification.</p>
                <div className="space-y-5 md:space-y-6">
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Reason</label>
                        <select 
                            className="w-full p-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-red-100 transition-all"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                        >
                            <option value="">Select Reason...</option>
                            {DECLINE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Feedback</label>
                        <textarea 
                            className="w-full p-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium outline-none h-24 resize-none focus:ring-4 focus:ring-red-100 transition-all"
                            placeholder="Add specific details..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button 
                            onClick={() => { setShowDeclineModal(false); setSelectedWorker(null); }}
                            className="flex-1 py-3.5 md:py-4 text-gray-500 text-[10px] md:text-xs font-bold hover:bg-gray-50 rounded-xl md:rounded-2xl active:scale-95 transition-all uppercase tracking-widest"
                        >
                            CANCEL
                        </button>
                        <button 
                            onClick={handleDeclineWorker}
                            className="flex-1 py-3.5 md:py-4 bg-red-600 text-white text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl shadow-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
              </div>
          </div>
      )}

      {/* Detailed User Information Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-[999] bg-odisha-deep/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-bounce-in my-8">
                <div className="bg-odisha-teal h-3 w-full" />
                <div className="p-6 sm:p-12 relative">
                    <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all z-10"><i className="fas fa-times"></i></button>
                    
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-6 lg:pt-0">
                        <div className="lg:w-1/3 text-center border-b lg:border-b-0 lg:border-r pb-8 lg:pb-0 lg:pr-12">
                            <div className="relative inline-block mb-6 group/avatar">
                                <img src={viewingUser.avatar} className="w-32 h-32 md:w-48 md:h-48 rounded-[30px] md:rounded-[40px] shadow-2xl border-4 border-white object-cover" alt={viewingUser.name} />
                                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black text-white shadow-lg ${viewingUser.isBanned ? 'bg-red-600' : viewingUser.isVerified ? 'bg-green-600' : 'bg-orange-500'}`}>
                                    {viewingUser.isBanned ? 'BANNED' : viewingUser.verificationStatus}
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-1">{viewingUser.name}</h2>
                            <p className="text-odisha-terracotta font-black uppercase text-[10px] md:text-xs tracking-widest mb-6">{viewingUser.role}</p>
                            
                            <div className="space-y-3 md:space-y-4 text-left">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Contact</p>
                                    <p className="text-xs font-bold text-gray-700 truncate mb-1"><i className="fas fa-envelope w-5 text-odisha-teal"></i> {viewingUser.email}</p>
                                    <p className="text-xs font-black text-odisha-terracotta flex items-center"><i className="fas fa-phone w-5 text-odisha-teal"></i> {viewingUser.phone}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Regional Location</p>
                                    <p className="text-xs font-bold text-gray-800"><i className="fas fa-map-marker-alt mr-2 text-odisha-terracotta"></i>{viewingUser.locality}, {t(getDistrictKey(viewingUser.districtId || ''))}</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex flex-col gap-3">
                                <button onClick={() => handleBanUser(viewingUser.id)} className={`py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${viewingUser.isBanned ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {viewingUser.isBanned ? 'Unlock Account' : 'Ban Account'}
                                </button>
                                <button onClick={() => handleDeleteUser(viewingUser.id)} className="py-3.5 md:py-4 bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
                                    Permanent Delete
                                </button>
                            </div>
                        </div>
                        
                        <div className="lg:w-2/3">
                            <h3 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-widest border-b-2 border-odisha-terracotta pb-2 inline-block mb-8">Data Profile</h3>
                            {viewingUser.role === 'WORKER' ? (
                                <div className="space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        {['aadhaar', 'pan', 'bank'].map(docKey => (
                                            <div key={docKey} className="bg-gray-50 rounded-3xl p-5 md:p-6 border border-gray-100 flex flex-col items-center">
                                                <div className="w-full flex justify-between items-center mb-4">
                                                    <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{docKey}</span>
                                                    {viewingUser.documents?.[docKey as keyof typeof viewingUser.documents] && (
                                                        <a href={viewingUser.documents[docKey as keyof typeof viewingUser.documents]} download className="text-[9px] font-black text-odisha-teal uppercase tracking-widest underline">SAVE</a>
                                                    )}
                                                </div>
                                                <div className="relative aspect-[16/10] bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden w-full">
                                                    {renderDocumentPreview(viewingUser.documents?.[docKey as keyof typeof viewingUser.documents])}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-gray-800 rounded-3xl p-6 text-white text-center flex flex-col justify-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Verification Console</h4>
                                            {viewingUser.verificationStatus === 'PENDING' ? (
                                                <div className="flex flex-col gap-3">
                                                    <button onClick={() => { setSelectedWorker(viewingUser); setShowDeclineModal(true); }} className="py-3 bg-white/10 hover:bg-red-600 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all">DECLINE</button>
                                                    <button onClick={() => handleVerifyWorker(viewingUser.id)} className="py-3 bg-green-600 hover:bg-green-700 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all">APPROVE</button>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-white/10 rounded-xl">
                                                    <p className={`font-black uppercase tracking-widest text-xs ${viewingUser.verificationStatus === 'VERIFIED' ? 'text-green-400' : 'text-red-400'}`}>{viewingUser.verificationStatus}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[24px] md:rounded-[32px] border border-gray-100 text-center">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Internal Audit Notes</h4>
                                        <p className="text-xs md:text-sm font-medium text-gray-600 leading-relaxed italic">"{viewingUser.adminNotes || 'No notes recorded.'}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-8 animate-fade-in text-center">
                                    <div className="bg-blue-50 p-8 md:p-10 rounded-[30px] md:rounded-[40px] text-center border-2 border-dashed border-blue-100">
                                        <i className="fas fa-user-check text-4xl md:text-5xl text-blue-200 mb-6"></i>
                                        <h3 className="text-lg md:text-xl font-black text-blue-800 uppercase tracking-widest">Customer Profile</h3>
                                        <p className="text-blue-600 text-xs md:text-sm font-medium max-w-xs mx-auto mt-2">Validated via phone number and email.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                                        <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Requests</p>
                                            <p className="text-2xl md:text-3xl font-black text-gray-800">{bookings.filter(b => b.customerId === viewingUser.id).length}</p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Spend</p>
                                            <p className="text-2xl md:text-3xl font-black text-odisha-teal">₹{bookings.filter(b => b.customerId === viewingUser.id).length * 500}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;