
import React, { useState, useRef } from 'react';
import { UploadCloud, ArrowRight, FileText, Sparkles, Lock, Building, Briefcase, Home, Loader2, Mic, Image as ImageIcon, StopCircle } from 'lucide-react';
import { AppState } from '../types';
import { analyzeImage, transcribeAudio } from '../services/gemini';

interface Props {
  onComplete: (description: string, fileName?: string, fileSummary?: string) => void;
  onResume: (state: AppState) => void;
}

export const Step1Intake: React.FC<Props> = ({ onComplete }) => {
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string | undefined>();
  const [isScanning, setIsScanning] = useState(false);
  const [fileSummary, setFileSummary] = useState<string | null>(null);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioProcessing, setAudioProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsScanning(true);
      
      // Determine if image or doc
      if (file.type.startsWith('image/')) {
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
             const base64String = (reader.result as string).split(',')[1];
             const analysis = await analyzeImage(base64String, file.type);
             setFileSummary(`Image Analysis: ${analysis}`);
             setIsScanning(false);
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error(err);
          setFileSummary("Failed to analyze image.");
          setIsScanning(false);
        }
      } else {
        // Fallback for PDFs/Docs (Simulated for this demo as per original code logic, but preserving the structure)
        setTimeout(() => {
          setIsScanning(false);
          if (file.name.toLowerCase().includes('lease')) {
            setFileSummary("Detected: Standard Lease Agreement. Parties: 2. Security Deposit mentioned: Yes.");
          } else {
            setFileSummary("Detected: Document text. Extracted dates and entities for analysis.");
          }
        }, 1500);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        setAudioProcessing(true);
        const blob = new Blob(chunks, { type: 'audio/webm' }); // Use webm for browser compatibility
        const reader = new FileReader();
        reader.onloadend = async () => {
           const base64String = (reader.result as string).split(',')[1];
           try {
             const text = await transcribeAudio(base64String, 'audio/webm');
             setDescription(prev => prev + (prev ? '\n' : '') + text);
           } catch (err) {
             console.error(err);
             alert("Could not transcribe audio.");
           } finally {
             setAudioProcessing(false);
           }
        };
        reader.readAsDataURL(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const loadDemo = (type: 'tenant' | 'freelance' | 'employee') => {
    if (type === 'tenant') {
      setDescription("My landlord is keeping my $2000 deposit claiming I scratched the floors. I lived there for 4 years and have a move-in checklist showing the scratches were already there. He is ignoring my texts.");
      setFileName(undefined);
      setFileSummary(null);
    } else if (type === 'freelance') {
      setDescription("I delivered a website redesign for a client last week. They approved the Figma mocks, but now they hate the coded version and are refusing to pay the final 50% invoice ($1500). We have no formal contract, just emails.");
      setFileName(undefined);
      setFileSummary(null);
    } else {
      // Rahul - Employment Scenario (Demo)
      setDescription("I recently resigned from my job after completing my full notice period. I worked for three months during the notice period, but my employer has not paid my final salary and is refusing to issue my experience letter.\n\nThey are saying this is because of performance issues, but I was never given any written warnings. I don’t know if this is normal or what I should do next, and I don’t want to make the situation worse.");
      setFileName("Offer_Letter_Demo.txt (Sample)");
      setFileSummary("Document Type: Employment Offer Letter (Excerpt).\nRole: Software Engineer.\nWorking Hours: Monday to Friday, 9:00 AM – 5:00 PM.\nNotice Period: 3 months.\nSeverance / Final Pay: As per company policy.\nNote: No mention of performance-based salary withholding found.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in py-8">
      
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-xs uppercase tracking-wide mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Session</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Describe the Conflict</h1>
        <p className="text-slate-500 text-sm">
          This system is designed first for people facing a dispute for the very first time — before they understand the system, rules, or risks.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Secure & Private</span>
            </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">

          <div>
             <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-semibold text-slate-700">What happened?</label>
                <span className="text-xs text-slate-400 italic">Supports Voice & Text</span>
             </div>
            <div className="relative">
              <textarea
                className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 bg-slate-50 transition-all text-base leading-relaxed placeholder-slate-400"
                placeholder="Describe the dispute, or imagine explaining it verbally..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 {isRecording ? (
                   <button onClick={stopRecording} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 animate-pulse transition-colors" title="Stop Recording">
                      <StopCircle className="w-5 h-5" />
                   </button>
                 ) : (
                   <button onClick={startRecording} disabled={audioProcessing} className="p-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all" title="Record Audio">
                      {audioProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                   </button>
                 )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1 mt-1">Load Demo:</span>
               <button onClick={() => loadDemo('tenant')} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-2 py-1 rounded transition-colors">
                  <Home className="w-3 h-3"/> Landlord
               </button>
               <button onClick={() => loadDemo('freelance')} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 px-2 py-1 rounded transition-colors">
                  <Briefcase className="w-3 h-3"/> Freelancer
               </button>
               <button onClick={() => loadDemo('employee')} className="text-xs flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 px-2 py-1 rounded transition-colors font-medium border border-emerald-200">
                  <Building className="w-3 h-3"/> Employment (Rahul)
               </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                <span>Upload Evidence (Images, Contract, etc.)</span>
                <span className="text-xs text-slate-400">Gemini 3 Multimodal</span>
              </label>
              
              {!fileName ? (
                <div 
                  className="relative group cursor-pointer w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 py-6 flex flex-col items-center justify-center text-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept="image/*,application/pdf,.doc,.docx"
                    />
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                      <UploadCloud className="w-5 h-5" />
                      <span className="text-sm">Upload File or Photo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                      </div>
                      <button onClick={() => {setFileName(undefined); setFileSummary(null);}} className="text-xs text-slate-400 hover:text-red-500">Remove</button>
                   </div>
                   
                   {isScanning ? (
                     <div className="flex items-center gap-2 text-xs text-emerald-600 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Scanning document contents...
                     </div>
                   ) : fileSummary ? (
                     <div className="text-xs bg-white/60 p-2 rounded border border-emerald-100 text-emerald-800 flex gap-2 items-start whitespace-pre-wrap">
                        <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                        {fileSummary}
                     </div>
                   ) : null}
                </div>
              )}
          </div>

          <button
            onClick={() => onComplete(description, fileName, fileSummary || undefined)}
            disabled={description.length < 5}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
          >
            Start Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="text-center">
             <p className="text-xs text-slate-400">
               While this demo uses text, the reasoning pipeline supports voice & visual evidence via Gemini 3.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
