
import React from 'react';
import { Synthesis, ResolutionResponse, ScenarioUnderstanding } from '../types';
import { Check, ArrowRight, Shield, AlertTriangle, Search, User, FileText, ScanEye, BrainCircuit, Activity } from 'lucide-react';

interface Props {
  synthesis: Synthesis;
  resolutions: ResolutionResponse;
  scenario?: ScenarioUnderstanding;
  fileAnalysisSummary?: string;
  onNext: () => void;
}

export const Step4Summary: React.FC<Props> = ({ synthesis, resolutions, scenario, fileAnalysisSummary, onNext }) => {
  
  // Helper to draw progress bars
  const ProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
    <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-fade-in w-full max-w-6xl mx-auto">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Case Intelligence Report</h2>
           <p className="text-slate-500 mt-1">AI-driven analysis of facts, risks, and resolution potential.</p>
        </div>
        <div className="text-right hidden md:block">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100">
              <Activity className="w-3.5 h-3.5" />
              Analysis Complete
           </span>
        </div>
      </div>

      {/* TOP ROW: 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1: Conflict Level */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conflict Level</span>
              <AlertTriangle className="w-5 h-5 text-red-400 opacity-80" />
           </div>
           <div className="flex items-end gap-1 mb-1">
             <span className="text-4xl font-bold text-slate-900">{synthesis.conflict_intensity}%</span>
           </div>
           <ProgressBar value={synthesis.conflict_intensity} colorClass="bg-red-500" />
        </div>

        {/* Metric 2: Resolution Potential */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolution</span>
              <Shield className="w-5 h-5 text-emerald-400 opacity-80" />
           </div>
           <div className="flex items-end gap-1 mb-1">
             <span className="text-4xl font-bold text-slate-900">{synthesis.de_escalation_potential}%</span>
           </div>
           <ProgressBar value={synthesis.de_escalation_potential} colorClass="bg-emerald-500" />
        </div>

        {/* Metric 3: Fact Clarity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fact Clarity</span>
              <Search className="w-5 h-5 text-blue-400 opacity-80" />
           </div>
           <div className="flex items-end gap-1 mb-1">
             <span className="text-4xl font-bold text-slate-900">{synthesis.clarity_score}%</span>
           </div>
           <ProgressBar value={synthesis.clarity_score} colorClass="bg-blue-500" />
        </div>
      </div>

      {/* MIDDLE ROW: PERSONA & EVIDENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
         
         {/* ACTIVE PERSONA CARD (Dark) */}
         <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

            <div>
               <div className="flex items-center gap-2 text-blue-400 mb-6">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Active Persona</span>
               </div>
               
               <h3 className="text-2xl font-bold mb-3 leading-tight">{resolutions.user_persona}</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 Profiled based on communication style, stated anxieties, and dispute context.
               </p>
               
               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 block">Detected Pain Points</span>
                  <div className="space-y-2">
                    {(resolutions.primary_pain_points || []).slice(0, 3).map((pt, i) => (
                      <div key={i} className="flex items-start gap-2">
                         <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                         <p className="text-xs text-slate-300">{pt}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
         </div>

         {/* EVIDENCE ANALYSIS CARD */}
         <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Evidence Analysis
               </div>
               {fileAnalysisSummary && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                     <ScanEye className="w-3 h-3" />
                     Vision Processed
                  </span>
               )}
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6 flex-grow">
               <p className="text-sm text-slate-600 leading-relaxed">
                  {fileAnalysisSummary || "No physical evidence uploaded. Analysis is based purely on the provided narrative and subsequent clarification answers."}
               </p>
               {fileAnalysisSummary && (
                 <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500">Key Extraction:</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Gemini 3 identified key entities and dates consistent with the user's narrative.
                    </p>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-3 border border-blue-100 bg-blue-50/30 rounded-lg">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Dispute Type</span>
                  <p className="text-sm font-semibold text-slate-800">{scenario?.dispute_type || "General Dispute"}</p>
               </div>
               <div className="p-3 border border-purple-100 bg-purple-50/30 rounded-lg">
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-1">Parties Involved</span>
                  <p className="text-sm font-semibold text-slate-800">{scenario?.party_relationship || "Two Parties"}</p>
               </div>
            </div>
         </div>
      </div>

      {/* BOTTOM ROW: FACTS vs AMBIGUITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Verified Facts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800">Verified Facts</h3>
             </div>
             <ul className="space-y-4">
                {(synthesis.what_is_clear || []).map((fact, i) => (
                   <li key={i} className="flex gap-3 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{fact}</span>
                   </li>
                ))}
             </ul>
          </div>

          {/* Remaining Ambiguities */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800">Remaining Ambiguities</h3>
             </div>
             <ul className="space-y-4">
                {(synthesis.what_is_uncertain || []).length > 0 ? (
                   (synthesis.what_is_uncertain || []).map((ambiguity, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600">
                         <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">?</div>
                         <span className="leading-relaxed">{ambiguity}</span>
                      </li>
                   ))
                ) : (
                   <li className="flex gap-3 text-sm text-slate-400 italic">
                      No major ambiguities remaining.
                   </li>
                )}
             </ul>
          </div>
      </div>

      <div className="flex justify-center pb-8">
        <button
          onClick={onNext}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-xl shadow-xl shadow-slate-900/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          View Resolution Pathways
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
