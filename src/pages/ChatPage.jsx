import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, Mic, Globe, History, PlusCircle, 
  Trash2, Download, Copy, Info, Scale, Clock, 
  ChevronRight, MoreVertical, Search, Zap, CheckCircle2,
  AlertCircle, ExternalLink, X, Settings, ShieldCheck
} from 'lucide-react';

const ChatMessage = ({ message, isAi, citations = [], suggestions = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-6 mb-8 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${isAi ? 'bg-forest text-lime' : 'bg-lime text-forest shadow-lime/20'}`}>
        {isAi ? <Scale size={24} /> : <div className="font-bold text-lg">YS</div>}
      </div>

      <div className={`max-w-[75%] ${isAi ? '' : 'text-right'}`}>
        <div className={`p-6 rounded-3xl overflow-hidden relative shadow-md ${isAi ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-forest text-offwhite rounded-tr-none'}`}>
          {isAi && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black tracking-widest text-lime uppercase animate-pulse">AI Verified</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
          )}
          <p className="leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {isAi && suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} className="text-xs bg-lime/10 text-forest font-bold px-3 py-1.5 rounded-full border border-lime/20 hover:bg-lime/20 transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {isAi && citations.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Citations & Law References</p>
            {citations.map((c, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-start gap-4 hover:border-lime/30 group transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-lime group-hover:scale-110">
                  <Scale size={16} />
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-gray-900 mb-1">{c.title}</h5>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{c.source}</p>
                </div>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-lime" />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 px-4">
          <button className="text-gray-400 hover:text-gray-600 transition-all active:scale-90"><Copy size={14} /></button>
          <button className="text-gray-400 hover:text-gray-600 transition-all active:scale-90"><Download size={14} /></button>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-auto">12:45 PM • Session Encrypted</span>
        </div>
      </div>
    </motion.div>
  );
};

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isAi: true,
      text: "नमस्ते! I'm nyAI, your legal companion. I can help you understand Indian laws, rights, and the constitution in your language.\n\nWhat can I clarify for you today?",
      suggestions: [
        "What are my rights as a tenant in Maharashtra?",
        "How to file a consumer complaint against Zomato?",
        "Explain Section 498A in simple Hindi.",
        "Need a rental agreement draft."
      ]
    },
    {
      id: 2,
      isAi: false,
      text: "My landlord is refusing to return my security deposit because he wants to paint the walls.",
    },
    {
      id: 3,
      isAi: true,
      text: "Under the Model Tenancy Act (and Section 108 of the Transfer of Property Act), a landlord CANNOT deduct from your security deposit for 'ordinary wear and tear', which includes standard wall painting.\n\nDeductions are only allowed for actual damages beyond normal use. Since painting is a maintenance cost for the landlord, this deduction is likely illegal.\n\nHere are some steps you can take:\n1. Send a formal legal notice via nyAI.\n2. Request proof of damages.\n3. File a complaint in the Rent Tribunal if not resolved.",
      citations: [
        { title: "The Model Tenancy Act, 2021", source: "Chapter VI - Security Deposit and Maintenance" },
        { title: "Transfer of Property Act, 1882", source: "Section 108 - Rights and liabilities of lessor and lessee" }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("English");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      isAi: false,
      text: inputMessage
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isAi: true,
        text: "I understand the situation. Accessing legal statutes and past judgments... Based on your location (Mumbai), the Maharashtra Rent Control Act also applies here. Would you like me to draft a preliminary legal notice for your landlord?",
        suggestions: ["Yes, draft the notice.", "No, just explain the law further.", "Connect me to a lawyer."]
      }]);
    }, 2000);
  };

  const languages = ["English", "Hindi (हिन्दी)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Marathi (मराठी)"];

  return (
    <div className="flex h-screen bg-offwhite pt-20 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <button className="w-full bg-forest text-offwhite font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-forest-light transition-all shadow-xl shadow-forest/10 active:scale-95">
            <PlusCircle size={20} className="text-lime" /> New Consultation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2 flex justify-between items-center">
              Active Session <Clock size={12} />
            </h5>
            <div className="space-y-1">
              <div className="bg-lime/10 border border-lime/20 p-4 rounded-2xl cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-lime animate-pulse"></div>
                  <p className="text-[10px] font-bold text-lime uppercase tracking-widest italic">Security Deposit Issue</p>
                </div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-forest transition-colors">Case ID: #77123</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Knowledge Base</h5>
            <nav className="space-y-4 px-2">
              <button className="flex items-center gap-4 text-gray-500 font-bold text-sm hover:text-forest transition-all w-full">
                <History size={18} /> Past Cases
              </button>
              <button className="flex items-center gap-4 text-gray-500 font-bold text-sm hover:text-forest transition-all w-full">
                <Download size={18} /> Export History
              </button>
              <button className="flex items-center gap-4 text-red-500 font-bold text-sm hover:text-red-700 transition-all w-full">
                <Trash2 size={18} /> Clear Session
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-lime font-bold">YS</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate">Yogesh Sharma</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Plan • Upgrade</p>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><Settings size={18} /></button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black uppercase text-gray-400 hover:bg-white hover:text-forest transition-all">Support</button>
            <button className="flex-1 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black uppercase text-gray-400 hover:bg-white hover:text-forest transition-all">Privacy</button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#FAFAFA]">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-lime shadow-lg">
                <Scale size={20} />
             </div>
             <div>
               <h1 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                 ny<span className="text-lime">AI</span> Legal Intelligence
               </h1>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">State-of-the-Art Legal Model Active</p>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-100 hover:bg-white transition-all">
                <Globe size={14} className="text-forest" />
                {activeLanguage}
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                 {languages.map(lang => (
                   <button 
                    key={lang} 
                    onClick={() => setActiveLanguage(lang)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeLanguage === lang ? 'bg-lime/10 text-forest' : 'text-gray-500 hover:bg-gray-50 hover:text-forest'}`}
                   >
                     {lang}
                   </button>
                 ))}
                 <div className="mt-2 pt-2 border-t border-gray-50 text-center">
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">50+ More via Pro</p>
                 </div>
              </div>
            </div>
            <button className="bg-forest text-offwhite px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-forest-light transition-all shadow-xl shadow-forest/10">
              <Download size={14} /> Export session
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-2">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              isAi={msg.isAi} 
              message={msg.text} 
              citations={msg.citations} 
              suggestions={msg.suggestions}
            />
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 mb-8">
              <div className="w-12 h-12 rounded-xl bg-forest text-lime flex items-center justify-center shadow-lg">
                <Scale size={24} className="animate-bounce" />
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-3xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-lime rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-lime rounded-full animate-bounce delay-150"></div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 italic">Analyzing legal data...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-8 lg:px-12 pb-10 bg-gradient-to-t from-offwhite via-offwhite to-transparent">
          <div className="max-w-4xl mx-auto relative group">
             <form onSubmit={handleSendMessage} className="relative z-10 shadow-2xl shadow-forest/5 bg-white border border-gray-100 rounded-[2.5rem] p-2 pr-4 flex items-center gap-2 focus-within:border-lime/50 transition-all">
                <div className="flex items-center gap-1 pl-4">
                  <button type="button" className="p-3 text-gray-400 hover:text-forest transition-colors rounded-full hover:bg-gray-50 active:scale-95"><Paperclip size={20} /></button>
                  <button type="button" className="p-3 text-gray-400 hover:text-forest transition-colors rounded-full hover:bg-gray-50 active:scale-95"><Mic size={20} /></button>
                </div>
                
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask nyAI anything about Indian law..."
                  className="flex-1 py-4 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-300 font-medium"
                />

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase">
                    <Zap size={12} className="text-lime" /> mBart-50 AI Enabled
                  </div>
                  <button 
                    type="submit" 
                    disabled={!inputMessage.trim()}
                    className="w-14 h-14 bg-forest text-lime rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-forest/20 hover:bg-forest-light transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    <Send size={24} />
                  </button>
                </div>
             </form>
             
             <div className="mt-4 flex flex-wrap justify-between items-center px-6 text-[10px] font-bold uppercase tracking-widest text-gray-300">
               <div className="flex gap-6">
                 <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> End-to-end Encrypted</span>
                 <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-green-500" /> Legal Literacy SDK v2.0</span>
               </div>
               <p className="italic">Powered by Zephyr-7B-Beta</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
