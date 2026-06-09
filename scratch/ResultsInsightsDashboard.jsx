import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Dna, 
  Settings, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle, 
  Apple, 
  Pill, 
  Zap, 
  FileText,
  UserCheck,
  HeartCrack,
  ActivityIcon
} from 'lucide-react';

export default function ResultsInsightsDashboard() {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'supplements' | 'lifestyle'
  const [hoveredCard, setHoveredCard] = useState(null);

  // 1. Slide-in animation presets for panels
  const panelVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (customDelay) => ({
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: customDelay 
      }
    })
  };

  // 2. Mock recommendations data depending on selected care strategy tab
  const recommendations = {
    plan: [
      {
        id: 1,
        title: "Aerobic Cardio Protocol",
        icon: <Activity className="w-5 h-5 text-blue-500" />,
        desc: "Engage in 40 minutes of zone-2 cardiovascular training (e.g. incline brisk walk) 4 times weekly. Promotes arterial compliance and lowers systolic tension.",
        impact: "Reduces absolute risk by 12.4%"
      },
      {
        id: 2,
        title: "High-Soluble Fiber Diet",
        icon: <Apple className="w-5 h-5 text-emerald-500" />,
        desc: "Incorporate 15g of oat bran, beans, or organic psyllium husk daily. Soluble fiber actively binds bile acids in the gut, lowering LDL particle count.",
        impact: "Target: -30 mg/dL Cholesterol"
      },
      {
        id: 3,
        title: "Angiotensin Regulation",
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        desc: "Consistently monitor blood pressure daily at 08:00. Limit dietary sodium to 1,500mg daily to prevent arterial wall stiffness.",
        impact: "Systolic Limit: < 130 mmHg"
      }
    ],
    supplements: [
      {
        id: 1,
        title: "Omega-3 Ethyl Esters (EPA/DHA)",
        icon: <Pill className="w-5 h-5 text-cyan-500" />,
        desc: "High-dose pharmaceutical grade Omega-3 fatty acids (2g daily). Minimizes serum triglycerides, reduces plaque inflammation, and stabilizes endothelial membranes.",
        impact: "Highly recommended for high lipid counts"
      },
      {
        id: 2,
        title: "Coenzyme Q10 (Ubiquinol)",
        icon: <Pill className="w-5 h-5 text-rose-500" />,
        desc: "100mg ubiquinol daily. Optimizes mitochondrial bioenergetics in cardiac cells and counteracts statin-induced muscle fatigue.",
        impact: "Supports cellular energy output"
      },
      {
        id: 3,
        title: "Magnesium L-Threonate",
        icon: <Pill className="w-5 h-5 text-indigo-500" />,
        desc: "400mg before sleep. Promotes smooth muscle relaxation in arterioles, aiding blood pressure reduction and improving sleep quality indices.",
        impact: "Reduces systemic vascular resistance"
      }
    ],
    lifestyle: [
      {
        id: 1,
        title: "Circadian Sleep Alignments",
        icon: <Zap className="w-5 h-5 text-violet-500" />,
        desc: "Establish a strict 8-hour sleep schedule, sleeping before 22:30. Reduces night-time cortisol secretion and regulates vascular tone parameters.",
        impact: "Vitals Recovery: 98% efficiency"
      },
      {
        id: 2,
        title: "Mindfulness HRV Exercises",
        icon: <Activity className="w-5 h-5 text-teal-500" />,
        desc: "Utilize resonant breathing (5 seconds inhale, 5 seconds exhale) for 10 minutes twice daily. Direct stimulation of vagal tone lowers resting heart rate.",
        impact: "HRV target: +15 ms improvement"
      },
      {
        id: 3,
        title: "Heat Exposure Therapy",
        icon: <Zap className="w-5 h-5 text-orange-500" />,
        desc: "Sauna sessions at 80°C for 15-20 minutes 3 times weekly. Triggers heat-shock proteins, improving endothelial function and expanding microvessel volume.",
        impact: "Optimizes capillary elasticity"
      }
    ]
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#E3F2FD] via-[#F3E5F5] to-[#E8EAF6] p-4 lg:p-8 flex items-center justify-center font-sans">
      
      {/* BACKGROUND GLOWING 3D BLOBS */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-400/25 blur-[120px] pointer-events-none animate-pulse duration-5000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-purple-400/20 blur-[130px] pointer-events-none animate-pulse duration-7000"></div>
      <div className="absolute top-10 right-10 w-[20rem] h-[20rem] rounded-full bg-teal-300/15 blur-[90px] pointer-events-none"></div>

      {/* DASHBOARD CARD WRAPPER */}
      <div className="relative w-full max-w-[1450px] min-h-[85vh] lg:h-[90vh] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[45px] shadow-2xl p-6 flex flex-col lg:flex-row gap-6">
        
        {/* COLUMN 1: SIDEBAR NAVIGATION (5% Width on Desktop) */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={panelVariants}
          className="w-full lg:w-[70px] bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl p-4 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-8 shadow-sm"
        >
          {/* Logo Badge */}
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-lg">M+</span>
          </div>

          {/* Navigation Options */}
          <div className="flex flex-row lg:flex-col items-center gap-6 my-auto lg:my-0 lg:mt-8">
            <button className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all shadow-sm" aria-label="Dashboard">
              <ActivityIcon className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 flex items-center justify-center transition-all" aria-label="Cardiovascular System">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 flex items-center justify-center transition-all" aria-label="DNA & Genomics">
              <Dna className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Button */}
          <button className="w-12 h-12 lg:mt-auto rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 flex items-center justify-center transition-all" aria-label="System Settings">
            <Settings className="w-5 h-5" />
          </button>
        </motion.div>

        {/* COLUMN 2: 3D CARDIOVASCULAR MODEL SCREEN (40% Width on Desktop) */}
        <motion.div 
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={panelVariants}
          className="relative flex-1 lg:flex-[0_0_40%] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[35px] border border-white/10 p-8 flex flex-col justify-between overflow-hidden shadow-xl"
        >
          {/* Grid Background Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          {/* CENTRAL BEATING HOLOGRAM HEART */}
          <div className="relative flex-1 flex items-center justify-center my-6">
            <video 
              src="/static/cly-health-2-animation.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full max-w-[320px] h-auto object-contain rounded-2xl opacity-90"
            />
          </div>

          {/* FLOATING OVERLAY INSIGHTS CARD */}
          <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/15 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-white text-[14px] font-bold">Discover new health insights</h5>
                <p className="text-slate-400 text-[11.5px] mt-0.5">Generate daily AI-synthesized cardio reports.</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10">
              Analyze
            </button>
          </div>

        </motion.div>

        {/* COLUMN 3: DIAGNOSTIC ANALYTICS PANEL (55% Width on Desktop) */}
        <motion.div 
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={panelVariants}
          className="flex-1 lg:flex-[0_0_55%] flex flex-col justify-between gap-6"
        >
          {/* A. Top Header Area */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-3xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">System Module</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Cardiovascular Analytics</h2>
            </div>

            {/* Risk Badge */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2 text-right">
              <span className="text-[10px] font-bold text-rose-500 block uppercase tracking-wider">Accumulated Risk</span>
              <span className="text-lg font-extrabold text-rose-600">High 85.4%</span>
            </div>
          </div>

          {/* B. Heart Age vs Chronological Age Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Age box */}
            <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Target Heart Age</span>
                <h4 className="text-4xl font-black text-slate-900">46 <span className="text-sm font-semibold text-rose-500 align-super">+4 yrs</span></h4>
                <p className="text-[12px] text-slate-400 mt-2">Arterial stiffening matches 46-yr demographic profile.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
                <HeartCrack className="w-6 h-6" />
              </div>
            </div>

            {/* Chronological Age box */}
            <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Chronological Age</span>
                <h4 className="text-4xl font-black text-slate-900">42 <span className="text-sm font-semibold text-emerald-500 align-super">Base</span></h4>
                <p className="text-[12px] text-slate-400 mt-2">Active biological base age recorded from system data.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* C. Key Areas of Concern (3 Metric cards with animated gauge bars) */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Key Clinical Concerns
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Cholesterol */}
              <div className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500 font-semibold">Cholesterol</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Critical</span>
                </div>
                <h5 className="text-lg font-black text-slate-900 mb-3">270 mg/dL</h5>
                
                {/* Horizontal Gauge */}
                <div className="relative pt-3">
                  <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 relative">
                    {/* Animate indicator arrow on load */}
                    <motion.div 
                      initial={{ left: '0%' }}
                      animate={{ left: '85%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute -top-1 w-3.5 h-3.5 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-md -translate-x-1/2 cursor-pointer"
                      title="Current value"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-bold">
                    <span>150</span>
                    <span>200</span>
                    <span>300</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Blood Pressure */}
              <div className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500 font-semibold">Blood Pressure</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Suboptimal</span>
                </div>
                <h5 className="text-lg font-black text-slate-900 mb-3">140/90 mmHg</h5>
                
                {/* Horizontal Gauge */}
                <div className="relative pt-3">
                  <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 relative">
                    <motion.div 
                      initial={{ left: '0%' }}
                      animate={{ left: '60%' }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                      className="absolute -top-1 w-3.5 h-3.5 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-md -translate-x-1/2 cursor-pointer"
                      title="Current value"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-bold">
                    <span>110</span>
                    <span>120</span>
                    <span>160</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Max Heart Rate */}
              <div className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500 font-semibold">Max Heart Rate</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                </div>
                <h5 className="text-lg font-black text-slate-900 mb-3">154 bpm</h5>
                
                {/* Horizontal Gauge */}
                <div className="relative pt-3">
                  <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 relative">
                    <motion.div 
                      initial={{ left: '0%' }}
                      animate={{ left: '35%' }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="absolute -top-1 w-3.5 h-3.5 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-md -translate-x-1/2 cursor-pointer"
                      title="Current value"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-bold">
                    <span>110</span>
                    <span>140</span>
                    <span>180</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* D. Customized Care Strategy Section */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-3xl flex-1 flex flex-col justify-between shadow-sm min-h-[300px]">
            {/* Header + Tabs Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Care Strategy Protocols</h4>
              
              {/* Tabs */}
              <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/40">
                <button 
                  onClick={() => setActiveTab('plan')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'plan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  Action Plan
                </button>
                <button 
                  onClick={() => setActiveTab('supplements')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'supplements' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  Supplements
                </button>
                <button 
                  onClick={() => setActiveTab('lifestyle')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'lifestyle' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  Lifestyle
                </button>
              </div>
            </div>

            {/* Scrollable list of recommendation cards */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[170px] lg:max-h-[190px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {recommendations[activeTab].map((rec) => (
                    <motion.div
                      key={rec.id}
                      onMouseEnter={() => setHoveredCard(rec.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      whileHover={{ y: -3 }}
                      className="bg-white/60 hover:bg-white border border-slate-100/80 hover:border-slate-200 p-4 rounded-2xl flex items-start justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                          {rec.icon}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{rec.title}</h5>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{rec.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-full whitespace-nowrap align-self-start">
                        {rec.impact}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
