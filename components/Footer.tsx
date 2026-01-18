
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Footer: React.FC = () => {
  const { t } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'how_it_works':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-odisha-teal mb-4">How it Works</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600 font-medium">
              <li><span className="font-bold text-odisha-terracotta">Search:</span> Choose a skill and your district in Odisha.</li>
              <li><span className="font-bold text-odisha-terracotta">Compare:</span> Browse verified worker profiles, check their ratings, shift availability, and pricing.</li>
              <li><span className="font-bold text-odisha-terracotta">Book:</span> Send a booking request for a specific date and shift (Morning/Evening/Full Day).</li>
              <li><span className="font-bold text-odisha-terracotta">Verify:</span> Once accepted, verify worker ID at your doorstep and get the job done.</li>
              <li><span className="font-bold text-odisha-terracotta">Rate:</span> Complete the booking and provide feedback to help the community.</li>
            </ol>
          </div>
        );
      case 'safety_tips':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-odisha-teal mb-4">Safety Tips for Odisha Residents</h3>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i> Only hire workers with the "Verified" badge (KYC completed).</li>
              <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i> Check the worker's recent ratings and reviews before booking.</li>
              <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i> Confirm the specific tools required for the job during the initial call.</li>
              <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i> <span className="text-red-600 font-bold">Important:</span> Avoid paying the full amount upfront. Pay after work completion.</li>
              <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i> Verify the worker's face against their profile photo upon arrival.</li>
            </ul>
          </div>
        );
      case 'price_guidelines':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-odisha-teal mb-4">Odisha Labor Price Guidelines (Demo)</h3>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 font-bold text-gray-500 uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-4 py-3">Skill Type</th>
                    <th className="px-4 py-3">Expected Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 font-bold text-gray-700">Plumber</td><td className="px-4 py-3">₹500 – ₹1500 / day</td></tr>
                  <tr><td className="px-4 py-3 font-bold text-gray-700">Electrician</td><td className="px-4 py-3">₹400 – ₹1200 / day</td></tr>
                  <tr><td className="px-4 py-3 font-bold text-gray-700">Carpenter</td><td className="px-4 py-3">₹500 – ₹1400 / day</td></tr>
                  <tr><td className="px-4 py-3 font-bold text-gray-700">Mason</td><td className="px-4 py-3">₹600 – ₹1600 / day</td></tr>
                  <tr><td className="px-4 py-3 font-bold text-gray-700">Painter</td><td className="px-4 py-3">₹400 – ₹1000 / day</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-400 italic mt-2">Note: Actual prices depend on the district (e.g., Khordha/Cuttack vs. rural areas) and complexity of work.</p>
          </div>
        );
      case 'success_stories':
        return (
          <div className="space-y-4 text-center">
            <i className="fas fa-quote-left text-4xl text-odisha-saffron opacity-20"></i>
            <h3 className="text-2xl font-black text-odisha-teal mb-4">Worker Success Stories</h3>
            <div className="bg-gray-50 p-6 rounded-3xl italic text-gray-600">
              "MajdoorLink helped me find 3 times more work in Bhubaneswar compared to waiting at the labor junction. My family is now more secure."
              <p className="not-italic font-black text-gray-800 mt-3 text-sm">— Sushant N., Electrician</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl italic text-gray-600">
              "The digital identity and ratings help customers trust me immediately. I don't have to bargain for hours anymore."
              <p className="not-italic font-black text-gray-800 mt-3 text-sm">— Bijay P., Plumber</p>
            </div>
          </div>
        );
      case 'training':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-odisha-teal mb-4">Training & Resources</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all text-left group">
                <i className="fas fa-mobile-alt text-odisha-terracotta mr-4 text-xl group-hover:rotate-12 transition-transform"></i>
                <div>
                  <p className="font-bold text-sm">App Usage Guide</p>
                  <p className="text-[10px] text-gray-400">Learn how to manage availability and pricing.</p>
                </div>
              </button>
              <button className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all text-left group">
                <i className="fas fa-hard-hat text-odisha-terracotta mr-4 text-xl group-hover:rotate-12 transition-transform"></i>
                <div>
                  <p className="font-bold text-sm">Safety Protocols</p>
                  <p className="text-[10px] text-gray-400">Standard safety measures for on-site labor in Odisha.</p>
                </div>
              </button>
            </div>
          </div>
        );
      case 'insurance':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-odisha-teal mb-4">Worker Insurance</h3>
            <div className="p-6 bg-odisha-teal/5 rounded-3xl border border-odisha-teal/10">
              <p className="text-gray-700 font-medium leading-relaxed">
                MajdoorLink partners with local agencies to provide <span className="font-bold text-odisha-teal">Jiban Suraksha</span> plans for active workers. 
                Benefits include accidental coverage up to ₹2 Lakhs and hospitalization support.
              </p>
              <button className="mt-4 px-6 py-2 bg-odisha-teal text-white text-xs font-bold rounded-xl hover:scale-105 transition-transform">View Plan Details</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-odisha-deep text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6 group cursor-pointer">
              <div className="w-8 h-8 bg-odisha-terracotta rounded-lg flex items-center justify-center font-black text-white shadow-lg group-hover:rotate-6 transition-transform">ML</div>
              <span className="text-xl font-black tracking-tight">{t('app_name')}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Bridging the gap between skilled labor and residents across all 30 districts of Odisha. 
              Trust, transparency, and technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-odisha-terracotta hover:text-white hover:-translate-y-1 transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:-translate-y-1 transition-all">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white hover:-translate-y-1 transition-all">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-gray-200 uppercase text-xs tracking-widest">For Customers</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-odisha-saffron transition-colors">Find Workers</Link></li>
              <li><button onClick={() => setActiveModal('how_it_works')} className="hover:text-odisha-saffron transition-colors text-left">How it Works</button></li>
              <li><button onClick={() => setActiveModal('safety_tips')} className="hover:text-odisha-saffron transition-colors text-left">Safety Tips</button></li>
              <li><button onClick={() => setActiveModal('price_guidelines')} className="hover:text-odisha-saffron transition-colors text-left">Price Guidelines</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 text-gray-200 uppercase text-xs tracking-widest">For Workers</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link to="/register" className="hover:text-odisha-saffron transition-colors">Join the Network</Link></li>
              <li><button onClick={() => setActiveModal('success_stories')} className="hover:text-odisha-saffron transition-colors text-left">Success Stories</button></li>
              <li><button onClick={() => setActiveModal('training')} className="hover:text-odisha-saffron transition-colors text-left">Training Resources</button></li>
              <li><button onClick={() => setActiveModal('insurance')} className="hover:text-odisha-saffron transition-colors text-left">Worker Insurance</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 text-gray-200 uppercase text-xs tracking-widest">Contact Center</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li className="flex items-center group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-odisha-terracotta transition-all group-hover:scale-110">
                  <i className="fas fa-phone-alt text-xs"></i>
                </div>
                +91 1800-ODISHA-ML
              </li>
              <li className="flex items-center group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-odisha-terracotta transition-all group-hover:scale-110">
                  <i className="fas fa-envelope text-xs"></i>
                </div>
                support@majdoorlink.com
              </li>
              <li className="flex items-center group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-odisha-terracotta transition-all group-hover:scale-110">
                  <i className="fas fa-map-marker-alt text-xs"></i>
                </div>
                Bhubaneswar, Odisha
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
          <p>© 2024 MajdoorLink Prototype. Empowering Odisha's Workforce.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Regional Support</a>
          </div>
        </div>
      </div>

      {/* Info Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-bounce-in">
            <div className="p-8 sm:p-12">
              <button 
                onClick={closeModal}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
              {renderModalContent()}
              <div className="mt-10">
                <button 
                  onClick={closeModal}
                  className="w-full py-4 bg-gray-800 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all"
                >
                  Close Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
