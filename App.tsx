
import React, { useState } from 'react';
import { 
  AppState, 
  AppStep, 
  UserAnswers, 
  ResolutionResponse,
  ChatMessage
} from './types';
import { Step1Intake } from './components/Step1Intake';
import { Step2Processing } from './components/Step2Processing';
import { Step3Questions } from './components/Step3Questions';
import { Step4Summary } from './components/Step4Summary';
import { Step5Pathways } from './components/Step5Pathways';
import { ErrorMessage } from './components/ErrorMessage';
import { Disclaimer } from './components/Disclaimer';
import { ChatBot } from './components/ChatBot';
import { Scale, RefreshCw } from 'lucide-react';

import { 
  analyzeScenario, 
  detectGaps, 
  generateQuestions, 
  synthesizeCase, 
  suggestPathways 
} from './services/gemini';

const INITIAL_STATE: AppState = {
  step: AppStep.INTAKE,
  userDescription: '',
  userAnswers: {},
  isChatOpen: false,
  chatHistory: []
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleError = (error: unknown, context: string) => {
    console.error(error);
    const msg = error instanceof Error ? error.message : `An unexpected error occurred while ${context}.`;
    setState(prev => ({ ...prev, error: msg }));
  };

  const handleIntakeComplete = async (description: string, fileName?: string, fileSummary?: string) => {
    const fullDescription = fileSummary 
      ? `${description}\n\n[System Extracted File Data: ${fileSummary}]` 
      : description;

    setState(prev => ({ 
      ...prev, 
      userDescription: fullDescription, 
      userFileName: fileName, 
      fileAnalysisSummary: fileSummary,
      step: AppStep.PROCESSING_SCENARIO,
      error: undefined 
    }));
    setLoadingMsg("Gemini 3 is identifying what information actually matters before asking any questions.");

    try {
      // Chain 1: Scenario -> Gaps -> Questions
      const scenario = await analyzeScenario(fullDescription);
      
      setLoadingMsg("Gemini 3 is entering Thinking Mode to find gaps...");
      const gaps = await detectGaps(fullDescription, scenario);
      
      setLoadingMsg("Formulating clarifying questions...");
      const questions = await generateQuestions(gaps);

      setState(prev => ({
        ...prev,
        scenario,
        gaps,
        questions,
        step: AppStep.QUESTIONS
      }));
    } catch (error) {
      handleError(error, "analyzing the scenario");
      setState(prev => ({ ...prev, step: AppStep.INTAKE }));
    }
  };

  const handleQuestionsComplete = async (answers: UserAnswers) => {
    if (!state.scenario || !state.questions) return;
    
    setState(prev => ({ ...prev, userAnswers: answers, step: AppStep.PROCESSING_SYNTHESIS, error: undefined }));
    setLoadingMsg("Synthesizing your case details...");

    try {
      // Prepare QA pairs
      const qaPairs = state.questions.map((q, idx) => ({
        q: q.question,
        a: answers[idx]
      }));

      // Chain 2: Synthesis -> Pathways
      const synthesis = await synthesizeCase(state.userDescription, state.scenario, qaPairs);
      
      setLoadingMsg("Drafting consultation-level strategies & legal artifacts...");
      const resolutions = await suggestPathways(synthesis);

      setState(prev => ({
        ...prev,
        synthesis,
        resolutions,
        step: AppStep.SUMMARY
      }));
    } catch (error) {
      handleError(error, "synthesizing results");
      // Go back to questions so user doesn't lose progress
      setState(prev => ({ ...prev, step: AppStep.QUESTIONS }));
    }
  };

  const handleRestart = () => {
    if (confirm("Are you sure you want to start over? Current progress will be lost.")) {
      setState(INITIAL_STATE);
    }
  };

  const dismissError = () => {
    setState(prev => ({ ...prev, error: undefined }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Global Error Overlay */}
      {state.error && (
        <ErrorMessage 
          message={state.error} 
          onDismiss={dismissError} 
        />
      )}

      {/* App Header */}
      <header className="bg-white border-b border-slate-200 h-16 shrink-0 z-10 px-6 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => {
            if (state.step !== AppStep.INTAKE) {
              handleRestart();
            }
          }}
        >
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Dispute De-Escalator</span>
        </div>

        <div className="flex items-center gap-4">
          {state.step > AppStep.INTAKE && (
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleRestart}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
                  title="Start Over"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
             </div>
          )}
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-slate-200">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             Gemini 3 Powered
          </div>
        </div>
      </header>

      {/* Main Content Area - Centered App Container */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-100 overflow-y-auto custom-scrollbar">
           <div className="min-h-full flex flex-col">
              
              {/* Content Wrapper */}
              <div className="flex-grow flex flex-col py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
                  {state.step === AppStep.INTAKE && (
                    <Step1Intake 
                      onComplete={handleIntakeComplete} 
                      onResume={() => {}} 
                    />
                  )}

                  {(state.step === AppStep.PROCESSING_SCENARIO || state.step === AppStep.PROCESSING_SYNTHESIS) && (
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <Step2Processing message={loadingMsg} step={state.step} />
                    </div>
                  )}

                  {state.step === AppStep.QUESTIONS && state.questions && (
                     <Step3Questions 
                       questions={state.questions} 
                       onComplete={handleQuestionsComplete} 
                     />
                  )}

                  {state.step === AppStep.SUMMARY && state.synthesis && state.resolutions && (
                     <Step4Summary 
                       synthesis={state.synthesis} 
                       resolutions={state.resolutions}
                       scenario={state.scenario}
                       fileAnalysisSummary={state.fileAnalysisSummary}
                       onNext={() => setState(prev => ({ ...prev, step: AppStep.PATHWAYS }))} 
                     />
                  )}

                  {state.step === AppStep.PATHWAYS && state.resolutions && (
                     <Step5Pathways 
                       resolutions={state.resolutions}
                       onRestart={handleRestart}
                     />
                  )}
              </div>

              {/* Simple Disclaimer Footer */}
              <div className="pb-8 px-6 max-w-5xl mx-auto w-full">
                <Disclaimer />
              </div>
           </div>
        </div>
      </main>
      
      {/* Floating Chatbot */}
      <ChatBot 
        isOpen={state.isChatOpen} 
        onToggle={() => setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }))}
        history={state.chatHistory}
        setHistory={(history) => setState(prev => ({ ...prev, chatHistory: typeof history === 'function' ? history(prev.chatHistory) : history }))}
      />
    </div>
  );
}
