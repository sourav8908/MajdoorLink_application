import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from '../App';
import { SKILLS } from '../constants';
import { useNavigate } from 'react-router-dom';

const AIAssistant: React.FC = () => {
  const { t, language } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string; skillId?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleAskAI = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenerativeAI(process.env.VITE_API_KEY || '');
      const skillList = SKILLS.map(s => `${s.id}: ${s.key}`).join(', ');
      
      const prompt = `You are the MajdoorLink AI Assistant for Odisha, India. 
      A user is describing a household problem: "${userMsg}".
      Based on this description, identify which of these skills is most relevant: ${skillList}.
      If none are relevant, say "NONE".
      Respond in JSON format: {"reasoning": "brief explanation", "suggestedSkillId": "skill_id_here", "reply": "friendly response in ${language}"}`;

      const model = ai.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const data = JSON.parse(response.text() || '{}');
      
      setChat(prev => [...prev, { 
        role: 'bot', 
        text: data.reply || "I'm sorry, I couldn't quite understand that. Could you describe the problem differently?",
        skillId: data.suggestedSkillId !== 'NONE' ? data.suggestedSkillId : undefined
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChat(prev => [...prev, { role: 'bot', text: "Namaskar! I am having some technical trouble. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-odisha-teal text-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,77,64,0.4)] flex items-center justify-center text-xl md:text-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-in"
        >
          <i className="fas fa-robot"></i>
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-odisha-saffron opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-odisha-saffron"></span>
          </span>
        </button>
      ) : (
        <div className="bg-white w-[85vw] sm:w-[350px] md:w-[400px] h-[70vh] md:h-[500px] rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-bounce-in">
          <div className="bg-odisha-teal p-5 md:p-6 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                <i className="fas fa-robot text-lg md:text-xl text-odisha-saffron"></i>
              </div>
              <div>
                <h4 className="font-black text-xs md:text-sm uppercase tracking-widest">Sahayaka AI</h4>
                <p className="text-[8px] md:text-[9px] opacity-60">Smart Service Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-premium-sand scroll-smooth">
            {chat.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <i className="fas fa-comment-dots text-3xl md:text-4xl mb-4"></i>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">Describe your problem...<br/><span className="lowercase font-medium">e.g. "My fan is making a noise"</span></p>
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl md:rounded-3xl text-xs md:text-sm font-medium shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-odisha-teal text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 rounded-tl-none border border-gray-50'
                }`}>
                  {msg.text}
                  {msg.skillId && (
                    <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/customer', { state: { skillId: msg.skillId } });
                        }}
                        className="w-full py-2 bg-odisha-saffron text-white text-[9px] md:text-[10px] font-black rounded-lg md:rounded-xl uppercase tracking-widest hover:brightness-110 transition-all"
                      >
                        Hire a {SKILLS.find(s => s.id === msg.skillId)?.key}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 md:p-4 rounded-2xl rounded-tl-none border border-gray-50 shadow-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-odisha-teal rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-odisha-teal rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-odisha-teal rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-50">
            <div className="relative">
              <input 
                type="text" 
                className="w-full pl-4 md:pl-5 pr-12 py-3 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-odisha-teal/5 transition-all"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              />
              <button 
                onClick={handleAskAI}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-odisha-teal text-white rounded-lg md:rounded-xl flex items-center justify-center hover:bg-odisha-terracotta transition-colors shadow-lg"
              >
                <i className="fas fa-paper-plane text-[10px] md:text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;