import React, { useState } from 'react';
import { ViralityResult } from '../types';
import { Gauge } from './Gauge';
import { 
  CheckCircle, 
  XCircle, 
  Share2, 
  Clock, 
  Hash, 
  Edit3, 
  Type, 
  Image as ImageIcon,
  Activity,
  Code,
  TrendingUp,
  AlertTriangle,
  Play
} from 'lucide-react';

interface AnalysisViewProps {
  result: ViralityResult;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Header Card */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Activity size={120} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0">
             <Gauge score={result.score} label="Viral Score" />
          </div>

          <div className="flex-grow space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Verdict</h2>
              <div className={`text-4xl font-black italic tracking-tighter ${result.verdict === 'YES' ? 'text-neon-green' : 'text-red-500'}`}>
                {result.verdict === 'YES' ? 'VIRAL POTENTIAL' : 'FLOP RISK'}
              </div>
            </div>
            
            <div className="bg-charcoal-900/50 p-4 rounded-lg border-l-4 border-neon-purple">
              <p className="text-gray-200 leading-relaxed font-light">
                {result.rationale}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-charcoal-900 rounded-full text-xs font-mono text-neon-blue border border-charcoal-700">
                Confidence: {(result.confidence * 100).toFixed(0)}%
              </span>
              <span className="px-3 py-1 bg-charcoal-900 rounded-full text-xs font-mono text-yellow-400 border border-charcoal-700">
                Hook: {result.hook_line}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Viral Forecast (New Platform Predictions) */}
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5 md:col-span-2">
            <h3 className="flex items-center gap-2 text-neon-green font-bold text-lg mb-4">
              <TrendingUp size={20} /> 
              Viral Forecast
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {result.platform_predictions?.map((pred, i) => (
                  <div key={i} className="bg-charcoal-900/50 rounded-lg p-3 border border-charcoal-700">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-300">{pred.platformName}</span>
                        <span className={`text-xs font-mono font-bold ${pred.probability > 70 ? 'text-neon-green' : 'text-gray-500'}`}>
                           {pred.probability}%
                        </span>
                     </div>
                     <div className="w-full bg-charcoal-700 rounded-full h-2 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${pred.probability > 75 ? 'bg-neon-green' : pred.probability > 45 ? 'bg-yellow-400' : 'bg-charcoal-500'}`} 
                           style={{ width: `${pred.probability}%` }}
                        />
                     </div>
                  </div>
               ))}
            </div>
        </div>
        
        {/* Retention Analysis (Conditional for Video) */}
        {result.video_analysis && (result.video_analysis.attention_drops.length > 0 || result.video_analysis.rewritten_hook) && (
           <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                 
                 {/* Timeline */}
                 <div className="flex-1">
                    <h3 className="flex items-center gap-2 text-red-400 font-bold text-lg mb-4">
                       <AlertTriangle size={20} /> Retention Killers
                    </h3>
                    <div className="space-y-3">
                       {result.video_analysis.attention_drops.map((drop, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-charcoal-900/50 rounded-lg border border-charcoal-700 items-start">
                             <div className="bg-charcoal-800 text-gray-300 px-2 py-1 rounded text-xs font-mono border border-charcoal-600 flex-shrink-0">
                                {drop.timestamp}
                             </div>
                             <div className="space-y-1">
                                <p className="text-red-300 text-sm font-medium">{drop.reason}</p>
                                <p className="text-neon-green text-xs flex items-center gap-1">
                                   <Edit3 size={10} /> Fix: {drop.fix}
                                </p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Script Rewrite */}
                 <div className="flex-1">
                    <h3 className="flex items-center gap-2 text-blue-400 font-bold text-lg mb-4">
                       <Play size={20} /> 
                       Rewritten Opening Hook
                    </h3>
                    <div className="bg-charcoal-900/80 p-5 rounded-xl border border-blue-500/30 text-blue-100 italic font-medium leading-relaxed shadow-lg shadow-blue-900/10">
                       "{result.video_analysis.rewritten_hook || "No rewrite needed."}"
                    </div>
                 </div>

              </div>
           </div>
        )}

        {/* Fixes & Recipes */}
        <div className="space-y-6">
          <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-neon-green font-bold text-lg mb-4">
              <Edit3 size={20} /> 
              {result.score < 70 ? 'Critical Fixes' : 'Optimization Plan'}
            </h3>
            <ul className="space-y-3">
              {result.top_fixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 text-neon-green flex-shrink-0">•</span>
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5">
             <h3 className="flex items-center gap-2 text-blue-400 font-bold text-lg mb-4">
              <Edit3 size={20} /> 
              Edit Recipes
            </h3>
             <ul className="space-y-3">
              {result.edit_recipes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {i+1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Captions & Metadata */}
        <div className="space-y-6">
           <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-neon-purple font-bold text-lg mb-4">
              <Type size={20} /> 
              Caption Variants
            </h3>
            <div className="space-y-3">
              {result.caption_variants.map((cap, i) => (
                <div key={i} className="p-3 bg-charcoal-900/80 rounded border border-charcoal-700 text-sm text-gray-300 font-mono hover:border-neon-purple transition-colors cursor-copy group relative">
                   {cap}
                </div>
              ))}
            </div>
          </div>

           <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-pink-400 font-bold text-lg mb-4">
              <ImageIcon size={20} /> 
              Thumbnail Ideas
            </h3>
            <ul className="space-y-2">
              {result.thumbnail_suggestions.map((thumb, i) => (
                <li key={i} className="text-sm text-gray-300 border-b border-charcoal-700 last:border-0 pb-2 last:pb-0">
                  {thumb}
                </li>
              ))}
            </ul>
          </div>

          {/* Posting Details */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-4">
                <h4 className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-1"><Hash size={12}/> Hashtags</h4>
                <div className="flex flex-wrap gap-1">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-blue-400">{tag}</span>
                  ))}
                </div>
             </div>
             <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-4">
                <h4 className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-1"><Clock size={12}/> Post Times</h4>
                <div className="flex flex-col gap-1">
                   {result.post_times.map((time, i) => (
                    <span key={i} className="text-xs text-gray-300 font-mono">{time}</span>
                  ))}
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* JSON Toggle */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
        >
          <Code size={14} /> {showJson ? 'Hide Raw Data' : 'Show Raw Data'}
        </button>
      </div>
      
      {showJson && (
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-neon-green font-mono border border-charcoal-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  );
};