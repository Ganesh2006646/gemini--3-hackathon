
import React, { useState } from 'react';
import { ClarifyingQuestion, UserAnswers } from '../types';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface Props {
  questions: ClarifyingQuestion[];
  onComplete: (answers: UserAnswers) => void;
}

export const Step3Questions: React.FC<Props> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const isComplete = questions.every((_, idx) => answers[idx] && answers[idx].trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in pb-32 relative">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Let's clarify the details</h2>
        <p className="text-slate-500 text-sm font-medium">
          We found a few gaps in your story. Answering these 3 questions will help us separate fact from emotion.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex gap-5">
               {/* Number Circle */}
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm mt-1 shadow-sm">
                 {idx + 1}
               </div>
               
               {/* Content */}
               <div className="flex-grow space-y-4">
                 <h3 className="font-medium text-slate-700 text-lg leading-relaxed">{q.question}</h3>
                 
                 {/* Input Area */}
                 <div className="relative group">
                    {(q.answer_type === 'yes_no' || q.answer_type === 'multiple_choice') && q.options && q.options.length > 0 ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {q.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleAnswerChange(idx, opt)}
                              className={`text-left px-5 py-3.5 rounded-xl text-sm transition-all border flex items-center justify-between group ${
                                answers[idx] === opt 
                                  ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className="font-medium">{opt}</span>
                              {answers[idx] === opt && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            </button>
                          ))}
                       </div>
                    ) : (
                      // Default to Text Area
                      <div className="relative">
                        <textarea
                          value={answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Type your answer here..."
                          rows={3}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder-slate-400 text-base resize-none"
                        />
                        {answers[idx] && (
                          <div className="absolute bottom-3 right-3 text-emerald-500 animate-in fade-in zoom-in duration-300">
                             <CheckCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    )}
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent flex justify-center z-20 pointer-events-none">
        <button
          onClick={() => onComplete(answers)}
          disabled={!isComplete}
          className="pointer-events-auto px-8 py-3.5 bg-slate-300 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-base transform active:scale-95 data-[enabled=true]:bg-slate-900"
          data-enabled={isComplete}
        >
          Generate Case Analysis
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
