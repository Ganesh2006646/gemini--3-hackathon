
import React, { useState } from 'react';
import { ResolutionResponse } from '../types';
import { 
  Copy, Check, ArrowRightCircle, Scale, Shield, Zap, TrendingUp
} from 'lucide-react';

interface Props {
  resolutions: ResolutionResponse;
  onRestart: () => void;
}

export const Step5Pathways: React.FC<Props> = ({ resolutions, onRestart }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 animate-fade-in">
       
       <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Recommended Resolution Pathways</h2>
          <p className="text-slate-500">
            Based on the analysis, here are three strategic options tailored to your situation, ranked by success probability.
          </p>
       </div>

       <div className="space-y-12">
          {(resolutions.resolution_paths || []).map((path, idx) => (
             <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* CARD HEADER */}
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                            <Scale className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Option {idx + 1}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <span className="text-xs font-medium text-slate-500">{path.de_escalation_benefit}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 max-w-xl leading-tight">{path.title}</h3>
                   </div>

                   {/* SUCCESS PROBABILITY BADGE */}
                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 min-w-[160px]">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Success Probability</span>
                         <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-bold text-blue-700">{path.success_probability}%</span>
                      </div>
                      <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
                         <div className="bg-blue-600 h-full rounded-full" style={{ width: `${path.success_probability}%` }}></div>
                      </div>
                   </div>
                </div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                   
                   {/* LEFT COLUMN: LOGIC & GUIDE */}
                   <div className="p-6 md:p-8 bg-slate-50/50 border-r border-slate-100">
                      
                      {/* Strategic Logic Box */}
                      <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-5 mb-8">
                         <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-4">
                            <Shield className="w-4 h-4 text-blue-500" />
                            Strategic Logic
                         </h4>
                         
                         <div className="space-y-4">
                            <div>
                               <span className="text-xs font-semibold text-slate-500 block mb-1">Legal Basis</span>
                               <p className="text-sm text-slate-700 leading-relaxed">{path.legal_basis}</p>
                            </div>
                            <div>
                               <span className="text-xs font-semibold text-slate-500 block mb-1">Psychological Approach</span>
                               <p className="text-sm text-slate-700 leading-relaxed">{path.psychological_strategy}</p>
                            </div>
                         </div>
                      </div>

                      {/* Execution Guide */}
                      <div>
                         <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-4">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Execution Guide
                         </h4>
                         <ul className="space-y-3 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200"></div>
                            
                            {(path.steps || []).map((step, sIdx) => (
                               <li key={sIdx} className="flex gap-4 relative">
                                  <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 z-10 flex-shrink-0 mt-0.5"></div>
                                  <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {/* RIGHT COLUMN: ARTIFACT TEMPLATE */}
                   <div className="p-6 md:p-8">
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                            Draft Template: {path.artifact_type || 'Communication'}
                         </h4>
                         <button 
                           onClick={() => copyToClipboard(path.artifact_content || '', idx)}
                           className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                         >
                            {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedIndex === idx ? 'Copied' : 'Copy Text'}
                         </button>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-0 overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                         {/* Mock Browser/Doc Header */}
                         <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                         </div>
                         <div className="p-6 relative">
                            {/* Lined paper bg */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px)] bg-[length:100%_2rem] mt-6"></div>
                            <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-[2rem] font-medium font-sans">
                               {path.artifact_content || "Generating content..."}
                            </pre>
                         </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 mt-3 text-center italic">
                        *Always review generated templates with a qualified professional before sending.
                      </p>
                   </div>
                
                </div>
             </div>
          ))}
       </div>

       <div className="mt-16 text-center">
          <button
             onClick={onRestart}
             className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
          >
             <ArrowRightCircle className="w-5 h-5" />
             Start New Analysis
          </button>
       </div>
    </div>
  );
};
