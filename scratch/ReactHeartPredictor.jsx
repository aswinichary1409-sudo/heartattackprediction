import React, { useState, useEffect } from 'react';
// Note: If using charts, import from 'recharts' or 'react-chartjs-2'
// For this example, we showcase a pure modern React structure using Lucide icons

export default function HeartPredictor() {
  // 1. Form Inputs State (13 features of the UCI dataset)
  const [inputs, setInputs] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalch: '',
    exang: '0',
    oldpeak: '',
    slope: '0',
    ca: '0',
    thal: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [activeTab, setActiveTab] = useState('predict'); // 'predict' | 'shap' | 'recommendations'

  const loaderSteps = [
    'Initializing neural diagnostic pipeline...',
    'Evaluating cardiovascular biomarker signals...',
    'Running XGBoost & Random Forest risk classifiers...',
    'Calculating game-theoretic SHAP impact vectors...',
    'Compiling diagnostic report parameters...'
  ];

  // Sync animation simulation for loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loaderSteps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to Flask server
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(inputs).toString()
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      // Delay slightly for smooth transition animation
      setTimeout(() => {
        setPrediction(data);
        setLoading(false);
        setActiveTab('shap'); // Switch to results/explainability tab automatically
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Error fetching prediction. Please ensure the Flask backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 1. Futuristic Rounded Header */}
      <header className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between bg-white h-20 px-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">M</span>
            <span className="text-blue-600 text-lg font-bold align-super">+</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-500">
            <a href="#tech" className="hover:text-blue-600 transition-colors">Technology</a>
            <a href="#prediction" className="hover:text-blue-600 transition-colors">Prediction</a>
            <a href="#shap" className="hover:text-blue-600 transition-colors">SHAP AI</a>
            <a href="#recommendations" className="hover:text-blue-600 transition-colors">Analytics</a>
          </nav>
          <button 
            onClick={() => setActiveTab('predict')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-100 hover:-translate-y-0.5"
          >
            New Analysis
          </button>
        </div>
      </header>

      {/* 2. Hero Component with Premium Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {['predict', 'shap', 'recommendations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {tab === 'predict' && '1. Diagnostic Form'}
              {tab === 'shap' && '2. AI Explainability'}
              {tab === 'recommendations' && '3. Health Protocols'}
            </button>
          ))}
        </div>

        {/* Tab 1: Diagnostic Predictor Form */}
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Input Columns */}
            <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 lg:p-12">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Predict Cardiac Risk</h2>
              <p className="text-slate-400 mb-8">Input patient bio-data and clinical indicators to generate SHAP explanation models.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Group 1: Patient Demographics */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">1. Patient Demographics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">Age (years)</label>
                      <input 
                        type="number" name="age" value={inputs.age} onChange={handleInputChange} required placeholder="e.g. 52"
                        className="h-14 rounded-2xl border border-slate-200 px-4 font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">Biological Gender</label>
                      <select 
                        name="sex" value={inputs.sex} onChange={handleInputChange} required
                        className="h-14 rounded-2xl border border-slate-200 px-4 font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Group 2: Vitals & Lab Measurements */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">2. Clinical Vitals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">Resting Blood Pressure (mmHg)</label>
                      <input 
                        type="number" name="trestbps" value={inputs.trestbps} onChange={handleInputChange} required placeholder="e.g. 125"
                        className="h-14 rounded-2xl border border-slate-200 px-4 font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">Serum Cholesterol (mg/dL)</label>
                      <input 
                        type="number" name="chol" value={inputs.chol} onChange={handleInputChange} required placeholder="e.g. 230"
                        className="h-14 rounded-2xl border border-slate-200 px-4 font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg h-16 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-100 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Processing Neural Assets...' : 'Run Neural Diagnostics'}
                </button>
              </form>
            </div>

            {/* Sidebar Telemetry (Real-time dynamic display) */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="bg-blue-500/20 text-blue-400 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">Telemetry Link</span>
                <h3 className="text-2xl font-bold mt-4 mb-2">Live Cardiac Vitals</h3>
                <p className="text-slate-400 text-sm mb-6">Patient indicators mapped onto real-time sensor array.</p>
                
                {/* Pulse Rate Display */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs">Heart Rate (thalch)</span>
                    <h5 className="text-2xl font-extrabold mt-1">{inputs.thalch ? `${inputs.thalch} bpm` : '-- bpm'}</h5>
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-rose-500 ${inputs.thalch ? 'animate-ping' : ''}`}></div>
                </div>

                {/* BP Display */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs">Arterial Tension (trestbps)</span>
                    <h5 className="text-2xl font-extrabold mt-1">{inputs.trestbps ? `${inputs.trestbps} mmHg` : '-- mmHg'}</h5>
                  </div>
                  <div className="text-blue-400 text-sm font-semibold">Active</div>
                </div>
              </div>

              {/* Decorative anatomical heart representation */}
              <div className="mt-8 flex justify-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-pulse"></div>
                  <div className="absolute w-28 h-28 bg-blue-500/20 rounded-full animate-ping"></div>
                  {/* Mock heart icon */}
                  <span className="text-5xl z-10">❤️</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SHAP Explainability Dashboard */}
        {activeTab === 'shap' && (
          <div className="space-y-8">
            {prediction ? (
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 lg:p-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-6 mb-6">
                  <div>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      prediction.category === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {prediction.category} Risk Level
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-tight mt-2">{prediction.prediction_text}</h3>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <span className="text-xs text-slate-400 block">estimated risk percentage</span>
                    <h4 className="text-4xl font-black text-blue-600">{prediction.probability}%</h4>
                  </div>
                </div>

                {/* Explanation text box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 text-sm font-medium mb-8">
                  {prediction.tips}
                </div>

                {/* Mock SHAP plots display grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-bold text-slate-800">SHAP Waterfall Chart</h5>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Risk Accumulation</span>
                    </div>
                    {/* Placeholder for interactive React-ChartJS component */}
                    <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 text-xs">
                      [ Interactive Bar Chart Component // Waterfall Plot ]
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-bold text-slate-800">Feature Importance</h5>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Global Impact</span>
                    </div>
                    {/* Placeholder for Recharts horizontal bar chart */}
                    <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 text-xs">
                      [ Interactive Recharts Horizontal Bar Chart ]
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-12 text-center">
                <span className="text-4xl">📊</span>
                <h3 className="text-2xl font-bold mt-4 mb-2">No Prediction Data Available</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">Please fill out the diagnostic form and submit it to see our neural network predictions.</p>
                <button 
                  onClick={() => setActiveTab('predict')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
                >
                  Go to Form
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personalized Recovery Protocols */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight">Cardiovascular Recovery Protocols</h2>
              <p className="text-slate-400 mt-2">Customized daily limits and active recommendations generated directly from clinical inputs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Diet */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl mb-4">🍏</div>
                <h5 className="font-bold text-lg text-slate-900 mb-2">Cardio-Protective Diet</h5>
                <p className="text-slate-500 text-sm leading-relaxed">Follow Mediterranean patterns. Limit sodium intake below 1,500mg daily. Boost soluble fiber with oats and beans.</p>
              </div>

              {/* Card 2: Exercise */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl mb-4">🏃‍♂️</div>
                <h5 className="font-bold text-lg text-slate-900 mb-2">Moderate Exercise</h5>
                <p className="text-slate-500 text-sm leading-relaxed">Aim for 150 minutes of light cardiovascular walking weekly. Avoid heavy weight lifting to control BP spikes.</p>
              </div>

              {/* Card 3: Sleep */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl mb-4">🛌</div>
                <h5 className="font-bold text-lg text-slate-900 mb-2">Sleep Hygiene</h5>
                <p className="text-slate-500 text-sm leading-relaxed">Ensure 7.5 to 8.5 hours of sleep. Keep screen devices completely away from bed space 1 hour prior to sleep.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. ECG Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <span className="text-rose-500 text-4xl animate-bounce inline-block">❤️</span>
            <h4 className="text-xl font-bold mt-4 mb-2">Neural Prediction Active</h4>
            <p className="text-slate-400 text-xs mb-4">{loaderSteps[loadingStep]}</p>
            {/* Simple CSS ECG anim */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${(loadingStep + 1) * 20}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
