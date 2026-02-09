
export enum AppStep {
  INTAKE = 1,
  PROCESSING_SCENARIO = 2,
  QUESTIONS = 3,
  PROCESSING_SYNTHESIS = 4, // Intermediate loading state
  SUMMARY = 5,
  PATHWAYS = 6
}

export interface ScenarioUnderstanding {
  dispute_type: string;
  party_relationship: string;
  known_facts: string[];
  stated_claims: string[];
  emotional_context: string[];
  explicitly_unknown: string[];
}

export interface GapDetection {
  confirmed_landscape: string;
  critical_gaps: {
    gap: string;
    why_it_matters: string;
  }[];
}

export interface ClarifyingQuestion {
  question: string;
  answer_type: 'short_text' | 'yes_no' | 'multiple_choice';
  options?: string[];
}

export interface Synthesis {
  what_is_clear: string[];
  what_is_uncertain: string[];
  clarity_score: number; // 0-100
  conflict_intensity: number; // 0-100
  de_escalation_potential: number; // 0-100
}

export interface ResolutionPath {
  title: string;
  success_probability: number; // 0-100
  probability_reasoning: string; // "Why 85%?" - Statistical/Logical backing
  estimated_timeframe: string; // e.g. "3-5 Business Days"
  financial_cost: string; // e.g. "Free" or "$50 filing fee"
  legal_basis: string; 
  psychological_strategy: string; 
  steps: string[];
  artifact_type?: 'email' | 'letter' | 'script' | 'checklist';
  artifact_content?: string; 
  de_escalation_benefit: string;
}

export interface ResolutionResponse {
  user_persona: string; // e.g. "Anxious First-Time Tenant"
  primary_pain_points: string[]; // e.g. ["Fear of Eviction", "Financial Loss"]
  key_risks: string[]; // e.g. ["Retaliation", "Legal Fees"]
  suggested_tone: string;
  resolution_paths: ResolutionPath[];
}

export interface UserAnswers {
  [questionIndex: number]: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppState {
  step: AppStep;
  userDescription: string;
  userFileName?: string;
  fileAnalysisSummary?: string; // New: Summary of what was found in the file
  
  // Data from Phase 1 (Initial Understanding)
  scenario?: ScenarioUnderstanding;
  gaps?: GapDetection;
  questions?: ClarifyingQuestion[];
  
  // Data from Phase 2 (After Answers)
  userAnswers: UserAnswers;
  synthesis?: Synthesis;
  resolutions?: ResolutionResponse;

  error?: string;
  
  // Chatbot state
  isChatOpen: boolean;
  chatHistory: ChatMessage[];
}
