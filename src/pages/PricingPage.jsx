import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, X, Zap, Crown, Building2, Scale, 
  ArrowRight, ShieldCheck, Globe, Star, Sparkles, PlusCircle, Bookmark
} from 'lucide-react';

const PricingCard = ({ tier, price, priceAnnual, isAnnual, features, highlight, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`bg-white p-12 rounded-[3.5rem] border ${highlight ? 'border-lime ring-4 ring-lime/20 shadow-3xl shadow-lime/20' : 'border-gray-100 shadow-2xl shadow-gray-200/50'} relative flex flex-col h-full overflow-hidden`}
  >
    {highlight && (
      <div className="absolute top-0 right-0 p-4">
         <div className="bg-lime text-forest text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transform rotate-12 shadow-lg">Most Popular</div>
      </div>
    )}

    <div className={`w-20 h-20 rounded-3xl mb-10 flex items-center justify-center ${highlight ? 'bg-forest text-lime' : 'bg-gray-50 text-gray-400'}`}>
       <Icon size={40} />
    </div>

    <h3 className={`text-3xl font-black mb-4 heading-display lowercase tracking-tighter ${highlight ? 'text-forest' : 'text-gray-900'}`}>{tier}</h3>
    
    <div className="flex items-baseline gap-2 mb-10">
       <span className="text-6xl font-black text-gray-900 heading-display tracking-tight">₹{isAnnual ? priceAnnual : price}</span>
       <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">/ month</span>
    </div>

    <div className="space-y-6 flex-1 mb-12">
       {features.map((f, i) => (
         <div key={i} className="flex items-start gap-4">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${f.included ? 'bg-lime text-forest' : 'bg-gray-100 text-gray-300'}`}>
               {f.included ? <Check size={12} /> : <X size={12} />}
            </div>
            <p className={`text-sm font-bold ${f.included ? 'text-gray-800' : 'text-gray-300 italic line-through'}`}>{f.label}</p>
         </div>
       ))}
    </div>

    <button className={`w-full py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all shadow-2xl ${highlight ? 'bg-forest text-offwhite shadow-forest/20 hover:bg-forest-light' : 'bg-white border-2 border-forest text-forest hover:bg-forest/5'}`}>
       {tier === 'Free' ? 'Start Free' : 'Get Started'} <PlusCircle size={20} className="inline ml-2" />
    </button>
  </motion.div>
);

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const features = {
    free: [
      { label: "AI Legal Chatbot (Unlimited)", included: true },
      { label: "Legal Glossary & Citations", included: true },
      { label: "Emergency SOS Connect", included: true },
      { label: "Location-based guidance", included: true },
      { label: "1 Document Generation / Mo", included: true },
      { label: "Document Analyzer", included: false },
      { label: "Legal Health Dashboard", included: false }
    ],
    pro: [
      { label: "Everything in Free", included: true },
      { label: "Unlimited Doc Generation", included: true },
      { label: "Document Analyzer (Full)", included: true },
      { label: "Legal Health Dashboard", included: true },
      { label: "Case Outcome Predictor (Beta)", included: true },
      { label: "Priority SOS Connect", included: true },
      { label: "10% Off Lawyer Fees", included: true }
    ],
    firm: [
      { label: "Everything in Pro", included: true },
      { label: "Up to 10 Team Seats", included: true },
      { label: "Bulk Document Processing", included: true },
      { label: "API Access (REST SDK)", included: true },
      { label: "White-label Output", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "Priority Support (<4hr)", included: true }
    ]
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-offwhite">
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 bg-forest/5 border border-forest/10 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
                <span className="text-forest text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Transparent Pricing for Bharat</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-bold text-gray-900 heading-display lowercase tracking-tighter mb-8 leading-[0.9]">justice <br/><span className="text-forest italic underline decoration-lime decoration-8 underline-offset-8">for everyone.</span></h1>
             <p className="text-2xl text-gray-500 max-w-2xl mx-auto italic leading-relaxed">Free for citizens. Affordable for individuals. Powerful for firms.</p>

             <div className="mt-16 flex items-center justify-center gap-6">
                <span className={`text-sm font-black uppercase tracking-widest ${!isAnnual ? 'text-forest' : 'text-gray-300'}`}>Monthly</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-16 h-8 bg-forest rounded-full p-1 relative flex items-center"
                >
                   <motion.div 
                    animate={{ x: isAnnual ? 32 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-lime rounded-full shadow-lg"
                   />
                </button>
                <div className="flex items-center gap-3">
                   <span className={`text-sm font-black uppercase tracking-widest ${isAnnual ? 'text-forest' : 'text-gray-300'}`}>Annual</span>
                   <span className="bg-lime text-forest text-[9px] font-black px-2 py-1 rounded-full animate-bounce">2 Months Free</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32 items-center">
             <PricingCard tier="Free" price={0} priceAnnual={0} isAnnual={isAnnual} features={features.free} icon={Scale} />
             <PricingCard tier="Pro" price={299} priceAnnual={208} isAnnual={isAnnual} features={features.pro} highlight={true} icon={Crown} />
             <PricingCard tier="Firm" price={2999} priceAnnual={2083} isAnnual={isAnnual} features={features.firm} icon={Building2} />
          </div>

          {/* Trusted Badges */}
          <div className="flex flex-col items-center border-t border-gray-100 pt-32">
             <div className="bg-white px-8 py-4 rounded-full border border-gray-100 flex items-center gap-12 shadow-xl shadow-gray-200/40">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={20} className="text-lime" />
                   <p className="text-[10px] font-black uppercase text-gray-400">Verified Advocates</p>
                </div>
                <div className="h-6 w-px bg-gray-100"></div>
                <div className="flex items-center gap-2">
                   <Bookmark size={20} className="text-lime" />
                   <p className="text-[10px] font-black uppercase text-gray-400">Razorpay Protected</p>
                </div>
                <div className="h-6 w-px bg-gray-100"></div>
                <div className="flex items-center gap-2">
                   <Globe size={20} className="text-lime" />
                   <p className="text-[10px] font-black uppercase text-gray-400">50+ Language Support</p>
                </div>
             </div>
             <p className="text-gray-400 text-xs font-bold mt-12 mb-12 max-w-sm text-center leading-relaxed italic">"Secure payment processing via Razorpay. Subscriptions can be cancelled at any time from your dashboard."</p>
          </div>
       </div>
    </div>
  );
};

export default PricingPage;
