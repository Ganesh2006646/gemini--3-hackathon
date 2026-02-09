
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Circle, Terminal, Scale } from 'lucide-react';
import { AppStep } from '../types';

interface Props {
  message: string;
  step: AppStep;
}

const THOUGHTS_PHASE_1 = [
  "Initializing legal context parser...",
  "Parsing narrative structure...",
  "Identifying key entities: Plaintiff vs Defendant...",
  "Extracting temporal sequence of events...",
  "Detecting emotional polarity in statements...",
  "Cross-referencing factual claims against common patterns...",
  "Scanning for missing critical information...",
  "Evaluating jurisdiction hints (ignoring specific laws)...",
  "Filtering subjective noise from objective facts...",
  "Constructing gap analysis matrix..."
];

const THOUGHTS_PHASE_2 = [
  "Integrating new user responses into context...",
  "Re-evaluating conflict intensity score...",
  "Mapping potential resolution nodes...",
  "Calculating clarity score based on new inputs...",
  "Synthesizing safe de-escalation pathways...",
  "Drafting communication templates...",
  "Optimizing for neutral, non-accusatory tone...",
  "Checking for high-risk indicators...",
  "Finalizing summary report and visual metrics..."
];

export const Step2Processing: React.FC<Props> = ({ message, step }) => {
  const [thoughtHistory, setThoughtHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Define phases based on AppStep
  const steps = useMemo(() => {
    if (step === AppStep.PROCESSING_SCENARIO) {
      return [
        { label: "Analyzing Narrative", match: "identifying facts" },
        { label: "Deep Reasoning", match: "Thinking Mode" },
        { label: "Drafting Clarifications", match: "Formulating" },
      ];
    } else {
      return [
        { label: "Integrating Facts", match: "Synthesizing" },
        { label: "Evaluating Options", match: "Generating" },
        { label: "Finalizing Pathways", match: "Finalizing" },
      ];
    }
  }, [step]);

  const activeIndex = steps.findIndex(s => message.includes(s.match));
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  // Thought Stream Effect
  useEffect(() => {
    const thoughts = step === AppStep.PROCESSING_SCENARIO ? THOUGHTS_PHASE_1 : THOUGHTS_PHASE_2;
    let index = 0;
    
    // Reset history on step change
    setThoughtHistory([]);

    const interval = setInterval(() => {
      setThoughtHistory(prev => {
        const nextThought = thoughts[index % thoughts.length];
        // Keep only the last 12 items to look like a rolling terminal, 
        // preventing the "index 50" visual stacking issue.
        const newHistory = [...prev, nextThought];
        return newHistory.slice(-12);
      });
      index++;
    }, 800); 

    return () => clearInterval(interval);
  }, [step]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thoughtHistory]);

  return (
    <div className="flex-grow flex flex-col items-center justify-start pt-8 pb-6 px-6 text-center max-w-4xl mx-auto w-full h-full animate-fade-in">
      
      {/* Court Balance Image */}
      <div className="relative mb-8 w-48 h-48 flex items-center justify-center animate-float-bob">
         <div className="relative z-10 p-6 bg-white/50 rounded-full backdrop-blur-sm shadow-sm border border-slate-100">
            {/* Using a clear SVG representation of Scales of Justice */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-800">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
         </div>
         {/* Background glow */}
         <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl -z-0"></div>
        
        <div className="absolute -bottom-6 bg-white px-4 py-1.5 rounded-full shadow-md border border-blue-100 text-xs font-semibold text-blue-600 flex items-center gap-2 animate-pulse-subtle z-20">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Thinking...
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Most legal tools answer questions.
      </h2>
      <p className="text-slate-600 font-medium mb-6 max-w-md mx-auto">
        Our system first figures out what question should even be asked.
      </p>

      {/* Progress Steps */}
      <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-left grid grid-cols-3 gap-2 mb-6">
        {steps.map((s, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          
          return (
            <div key={idx} className={`flex flex-col items-center text-center gap-2 p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-50' : ''}`}>
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isActive ? (
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping absolute inset-0 m-auto"></div>
                    <Circle className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Expanded Thought Stream Terminal */}
      <div className="w-full flex-grow h-96 bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col text-left mb-8 transition-all hover:shadow-blue-900/20">
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-slate-300 tracking-wider">GEMINI_3_REASONING_CORE</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-red-500 transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-amber-500 transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-emerald-500 transition-colors"></div>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="p-6 overflow-y-auto flex-grow font-mono text-xs space-y-2 scroll-smooth custom-scrollbar"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {thoughtHistory.map((thought, i) => (
            <div key={i} className="flex gap-3 animate-fade-in group hover:bg-white/5 p-0.5 rounded">
              <span className="text-slate-600 select-none w-6 text-right font-light">
                 <span className="opacity-50">&gt;</span>
              </span>
              <span className={i === thoughtHistory.length - 1 ? "text-emerald-400 font-bold" : "text-slate-300 group-hover:text-slate-100"}>
                {thought}
                {i === thoughtHistory.length - 1 && <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-emerald-400 align-middle"></span>}
              </span>
            </div>
          ))}
        </div>
        
        <div className="px-4 py-2 bg-slate-800/80 border-t border-slate-700 text-[10px] text-slate-400 flex justify-between shrink-0">
            <span className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               Status: Processing
            </span>
            <span className="font-mono">model: gemini-3-flash-preview</span>
        </div>
      </div>
    </div>
  );
};
