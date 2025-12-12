import React, { useState } from 'react';
import { Upload, Music, Zap, AlertCircle, Play, Activity, Home, Plus, Clock, ChevronRight, BarChart3, Globe } from 'lucide-react';
import { AnalysisView } from './components/AnalysisView';
import { analyzeContent } from './services/geminiService';
import { ViralityResult, InputType, DemoExample, HistoryItem } from './types';
import { fileToBase64, getMimeType } from './utils/fileUtils';
import { DEFAULT_TREND_SNAPSHOT, DEMO_EXAMPLES, COUNTRIES } from './constants';

type ViewState = 'home' | 'upload' | 'result';

// Simple ID generator fallback for browsers that don't support crypto.randomUUID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

function App() {
  // Navigation State
  const [view, setView] = useState<ViewState>('upload');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [trendSnapshot, setTrendSnapshot] = useState(DEFAULT_TREND_SNAPSHOT);
  const [inputType, setInputType] = useState<InputType>('image');
  const [country, setCountry] = useState(COUNTRIES[0]);
  
  // App Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Navigation Handlers ---

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNewAnalysis = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaption('');
    setTrendSnapshot(DEFAULT_TREND_SNAPSHOT);
    setInputType('image');
    setError(null);
    setView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewResult = (item: HistoryItem) => {
    setCurrentItem(item);
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Input Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
      
      if (selected.type.startsWith('image')) setInputType('image');
      else if (selected.type.startsWith('video')) setInputType('video');
      else if (selected.type.startsWith('audio')) setInputType('audio');
    }
  };

  const loadDemo = (demo: DemoExample) => {
    // Create a history item from the demo and view it immediately
    const demoItem: HistoryItem = {
      id: demo.id,
      timestamp: Date.now(),
      previewUrl: demo.url,
      inputType: demo.type,
      caption: demo.caption,
      result: demo.result
    };
    
    // Check if not already in history to avoid dupes on multiple clicks
    if (!history.find(h => h.id === demo.id)) {
        setHistory(prev => [demoItem, ...prev]);
    }
    
    viewResult(demoItem);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);
      
      const analysis = await analyzeContent(
        base64,
        mimeType,
        caption,
        trendSnapshot,
        inputType,
        country
      );

      const newItem: HistoryItem = {
        id: generateId(),
        timestamp: Date.now(),
        previewUrl: previewUrl,
        inputType: inputType,
        caption: caption,
        result: analysis
      };

      setHistory(prev => [newItem, ...prev]);
      setCurrentItem(newItem);
      setView('result');

    } catch (err: any) {
      let errorMessage = "Analysis failed. ";
      const rawError = err.message || JSON.stringify(err);

      if (rawError.includes('MISSING_API_KEY')) {
        errorMessage = "API Key missing! If you built locally and dragged to Netlify, you MUST have a .env file locally with API_KEY=your_key during the build.";
      } else if (rawError.includes('503') || rawError.includes('overloaded') || rawError.includes('UNAVAILABLE')) {
        errorMessage = "The AI model is currently overloaded with high traffic. Please wait 10-20 seconds and try again.";
      } else if (rawError.includes('API Key') || rawError.includes('400')) {
        errorMessage = "Invalid API Key. Please check that your key is active and correct in your settings.";
      } else {
         errorMessage += rawError;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Views ---

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
            <p className="text-gray-400 mt-1">Your recent virality checks</p>
          </div>
          <button 
            onClick={startNewAnalysis}
            className="bg-neon-green text-charcoal-900 px-6 py-3 rounded-xl font-bold hover:bg-lime-400 transition-colors flex items-center gap-2 shadow-lg shadow-neon-green/20"
          >
            <Plus size={20} /> New Analysis
          </button>
       </div>

       {history.length === 0 ? (
         <div className="border border-dashed border-charcoal-700 rounded-3xl p-12 text-center bg-charcoal-800/30">
            <div className="w-16 h-16 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
               <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-300">No analyses yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6">Upload your content to get started with AI-powered viral prediction.</p>
            <button onClick={startNewAnalysis} className="text-neon-blue hover:underline">Start your first check</button>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* New Analysis Card (First in grid) */}
           <button 
              onClick={startNewAnalysis}
              className="group border-2 border-dashed border-charcoal-700 hover:border-neon-green rounded-2xl flex flex-col items-center justify-center p-6 transition-all bg-charcoal-800/20 hover:bg-charcoal-800/50 min-h-[300px]"
           >
              <div className="w-12 h-12 rounded-full bg-charcoal-800 group-hover:bg-neon-green/20 text-gray-400 group-hover:text-neon-green flex items-center justify-center transition-colors mb-3">
                 <Plus size={24} />
              </div>
              <span className="font-bold text-gray-300 group-hover:text-white">Run New Check</span>
           </button>

           {history.map((item) => (
             <div 
               key={item.id} 
               onClick={() => viewResult(item)}
               className="bg-charcoal-800 border border-charcoal-700 hover:border-gray-500 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-black/50 group relative"
             >
                {/* Image Preview */}
                <div className="h-40 w-full bg-charcoal-900 relative overflow-hidden">
                   {item.inputType === 'audio' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-charcoal-900">
                         <Music size={40} className="text-white/50" />
                      </div>
                   ) : item.previewUrl ? (
                      item.inputType === 'video' ? (
                        <video src={item.previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      )
                   ) : (
                      <div className="w-full h-full bg-charcoal-900" />
                   )}
                   
                   {/* Badge */}
                   <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                      {item.inputType}
                   </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black ${item.result.score >= 80 ? 'text-neon-green' : item.result.score >= 60 ? 'text-yellow-400' : 'text-red-500'}`}>
                               {item.result.score}
                            </span>
                            <span className="text-xs font-bold text-gray-500 uppercase mt-2">/ 100</span>
                         </div>
                         <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} /> {new Date(item.timestamp).toLocaleDateString()}
                         </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                         item.result.verdict === 'YES' ? 'bg-neon-green/10 text-neon-green' : 'bg-red-500/10 text-red-400'
                      }`}>
                         {item.result.verdict === 'YES' ? 'VIRAL' : 'FLOP'}
                      </div>
                   </div>

                   <div>
                      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                         {item.caption || "No caption provided..."}
                      </p>
                   </div>

                   <div className="pt-4 border-t border-charcoal-700 flex items-center justify-between text-xs font-medium text-neon-blue group-hover:translate-x-1 transition-transform">
                      View Analysis <ChevronRight size={14} />
                   </div>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );

  const renderUpload = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
        {/* Intro Text */}
        <div className="lg:col-span-12 text-center mb-4">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
                Analyze <span className="text-neon-green">Viral Potential</span>
             </h1>
             <p className="text-gray-400">Upload content to run Gemini 2.5 Pro analysis against current trends.</p>
        </div>

        {/* LEFT COLUMN: Input */}
        <div className="lg:col-span-6 lg:col-start-4 space-y-6">
          
          {/* Upload Zone */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Content Upload</label>
            <div className="relative group">
               <input 
                 type="file" 
                 onChange={handleFileChange}
                 accept="image/*,video/*,audio/*"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className={`
                  border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 transition-all
                  ${file ? 'border-neon-green bg-charcoal-800/50' : 'border-charcoal-700 bg-charcoal-800 hover:border-gray-500'}
               `}>
                  {previewUrl ? (
                     inputType === 'video' ? (
                       <video src={previewUrl} className="h-full w-full object-contain rounded-xl" controls />
                     ) : inputType === 'image' ? (
                       <img src={previewUrl} className="h-full w-full object-contain rounded-xl" alt="Preview" />
                     ) : (
                       <div className="text-center space-y-2">
                          <Music size={48} className="text-neon-pink mx-auto animate-bounce" />
                          <p className="text-sm font-mono">{file?.name || 'Audio Selected'}</p>
                       </div>
                     )
                  ) : (
                    <>
                      <div className="p-4 bg-charcoal-900 rounded-full">
                         <Upload size={24} className="text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Drop meme, video or audio</p>
                        <p className="text-xs text-gray-500 mt-1">Supports PNG, MP4, MP3 (Max 20MB)</p>
                      </div>
                    </>
                  )}
               </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
             {/* Country Selector */}
             <div>
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">Target Region</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 text-gray-500" size={16} />
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-charcoal-800 border border-charcoal-700 rounded-xl p-3 pl-10 text-sm focus:border-neon-green focus:outline-none appearance-none text-gray-200 cursor-pointer"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-3 top-4 pointer-events-none">
                     <ChevronRight size={14} className="text-gray-500 rotate-90" />
                  </div>
                </div>
             </div>

             <div>
               <label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">Caption Context</label>
               <textarea
                 value={caption}
                 onChange={(e) => setCaption(e.target.value)}
                 placeholder="e.g. 'POV: You forgot to defrost the chicken' or 'My new lofi track'"
                 className="w-full bg-charcoal-800 border border-charcoal-700 rounded-xl p-3 text-sm focus:border-neon-green focus:outline-none min-h-[80px]"
               />
             </div>

             <div>
               <label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block flex justify-between">
                 <span>Trend Snapshot</span>
                 <span className="text-neon-blue cursor-pointer hover:underline" onClick={() => setTrendSnapshot(DEFAULT_TREND_SNAPSHOT)}>Reset Default</span>
               </label>
               <textarea
                 value={trendSnapshot}
                 onChange={(e) => setTrendSnapshot(e.target.value)}
                 className="w-full bg-charcoal-800 border border-charcoal-700 rounded-xl p-3 text-xs font-mono text-gray-400 focus:border-neon-blue focus:outline-none min-h-[100px]"
               />
             </div>

             <button
               onClick={handleAnalyze}
               disabled={loading || !file} 
               className={`
                  w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg flex items-center justify-center gap-2
                  transition-all duration-200
                  ${loading 
                    ? 'bg-charcoal-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-neon-green text-charcoal-900 hover:bg-lime-400 hover:scale-[1.02]'}
               `}
             >
               {loading ? (
                 <>Analyzing...</>
               ) : (
                 <>
                   <Zap fill="currentColor" size={20} /> RUN HYPECHECK
                 </>
               )}
             </button>

             {error && (
               <div className="p-4 bg-red-900/20 border border-red-900 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                 <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                 {error}
               </div>
             )}
          </div>
          
          {/* Quick Demos */}
          <div className="pt-8 border-t border-charcoal-800">
             <p className="text-xs uppercase font-bold text-gray-600 mb-4 text-center">Or Try a Demo</p>
             <div className="grid grid-cols-3 gap-3">
                {DEMO_EXAMPLES.map((demo) => (
                  <button 
                    key={demo.id}
                    onClick={() => loadDemo(demo)}
                    className="text-center p-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 transition-all text-[10px] uppercase font-bold text-gray-400 hover:text-white"
                  >
                     {demo.title}
                  </button>
                ))}
             </div>
          </div>

        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal-900 text-gray-100 font-sans selection:bg-neon-green selection:text-charcoal-900">
      {/* Header */}
      <header className="border-b border-charcoal-800 bg-charcoal-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-neon-green rounded flex items-center justify-center text-charcoal-900 font-bold transform -rotate-3">
              H
            </div>
            <span className="font-bold text-xl tracking-tight">HypeCheck</span>
            <span className="text-xs bg-charcoal-800 px-2 py-0.5 rounded text-gray-400 border border-charcoal-700 ml-2 hidden sm:inline-block">PROTOTYPE</span>
          </button>
          <div className="flex items-center gap-4">
             {view !== 'home' && (
                <button 
                  onClick={goHome} 
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors hover:bg-charcoal-800 px-3 py-1.5 rounded-lg"
                >
                  <Home size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
             )}
             {view !== 'upload' && (
                <button 
                  onClick={startNewAnalysis} 
                  className="flex items-center gap-2 text-sm font-bold text-charcoal-900 bg-neon-green hover:bg-lime-400 transition-colors px-3 py-1.5 rounded-lg"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New Upload</span>
                </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {view === 'upload' && renderUpload()}
        {view === 'result' && currentItem && (
           <div className="space-y-6">
             <button onClick={goHome} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-4">
               <ChevronRight className="rotate-180" size={16} /> Back to Dashboard
             </button>
             <AnalysisView result={currentItem.result} />
           </div>
        )}
        {view === 'home' && renderHome()}
      </main>
    </div>
  );
}

export default App;