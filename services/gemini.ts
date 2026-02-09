
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ScenarioUnderstanding, 
  GapDetection, 
  ClarifyingQuestion, 
  Synthesis, 
  ResolutionResponse,
  ChatMessage
} from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

// MODELS
// Using Flash Preview for both speed and reasoning stability in high-traffic scenarios
const MODEL_FAST = "gemini-3-flash-preview"; 
const MODEL_REASONING = "gemini-3-flash-preview"; 
const MODEL_IMAGE = "gemini-2.5-flash-image"; 

// --- UTILITY: CLEAN JSON ---
// Prevents "Unexpected token" errors when model returns Markdown (```json ... ```)
const cleanAndParseJSON = <T>(text: string): T => {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Occasionally models add text before/after the JSON, try to extract the array/object
    const firstBrace = cleanText.indexOf('{');
    const firstBracket = cleanText.indexOf('[');
    const lastBrace = cleanText.lastIndexOf('}');
    const lastBracket = cleanText.lastIndexOf(']');
    
    if (firstBrace === -1 && firstBracket === -1) return JSON.parse(cleanText); // Try raw

    const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
    const end = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;

    if (start !== -1 && end !== -1) {
      cleanText = cleanText.substring(start, end + 1);
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("AI response was not valid JSON. Please try again.");
  }
};

// Helper for Exponential Backoff
const retryOperation = async <T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const msg = error.message || '';
    const status = error.status;
    const isRateLimit = msg.includes('429') || status === 429 || msg.includes('quota');
    const isServerOverload = msg.includes('503') || status === 503 || msg.includes('overloaded');
    
    if (retries > 0 && (isRateLimit || isServerOverload)) {
      console.warn(`API Busy (Status ${status || 'Quota'}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

const handleGenAIError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  const msg = error.message || '';
  if (msg.includes('429') || msg.includes('quota')) return new Error("High traffic. Retrying didn't help, please wait a moment.");
  if (msg.includes('SAFETY')) return new Error("Content flagged by safety filters.");
  return new Error(`Failed to ${context}. Please try again.`);
};

// MODIFICATION: Persona updated for "First-time dispute holders"
const SYSTEM_INSTRUCTION = `
You are a Dispute Resolution Guide designed specifically for **first-time dispute holders**—people who have no legal knowledge, are scared of making mistakes, and are overwhelmed.

YOUR CORE MISSION:
1. **Calm the Anxiety:** Start by validating their stress. Use simple, reassuring language.
2. **Identify the Real Question:** Most people ask the wrong questions. You must find the *missing* information (The Fog of War) before offering solutions.
3. **De-escalate:** Pivot immediately from "fighting" to "solving".

TONE:
- Empathetic but Neutral: "It is completely understandable that you are worried about this..."
- Simple & Clear: Avoid legalese. Explain concepts as if to a friend.
- Objective: "While your feelings are valid, the resolution depends on these specific facts..."

RULES:
1. **Specific:** Never say "Check local laws." Say "In standard practice..."
2. **Decisive:** Use the user's answers to CLOSE gaps.
3. **Probability:** Estimate % chance of success based on general legal principles.
`;

// --- NEW: IMAGE ANALYSIS ---
export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_IMAGE, 
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: "Analyze this image for a legal dispute context. Extract dates, parties, key clauses, or evidence of damage. Summarize strictly what is visible." }
          ]
        },
        config: {
          systemInstruction: "You are an evidence analyst. Be dry, factual, and specific."
        }
      });
      return response.text || "No analysis generated.";
    });
  } catch (error) {
    throw handleGenAIError(error, "analyze image");
  }
};

// --- NEW: AUDIO TRANSCRIPTION ---
export const transcribeAudio = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: "Transcribe this audio recording exactly. If the speaker describes a dispute, capture the key details." }
          ]
        }
      });
      return response.text || "";
    });
  } catch (error) {
    throw handleGenAIError(error, "transcribe audio");
  }
};

// --- STEP 1: SCENARIO UNDERSTANDING ---
export const analyzeScenario = async (userText: string): Promise<ScenarioUnderstanding> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: `Analyze: "${userText}"
        Extract facts. Identify the specific domain (e.g., Residential Tenancy, IP Law, Employment).`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dispute_type: { type: Type.STRING },
              party_relationship: { type: Type.STRING },
              known_facts: { type: Type.ARRAY, items: { type: Type.STRING } },
              stated_claims: { type: Type.ARRAY, items: { type: Type.STRING } },
              emotional_context: { type: Type.ARRAY, items: { type: Type.STRING } },
              explicitly_unknown: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        }
      });
      return cleanAndParseJSON(response.text!);
    });
  } catch (error) { throw handleGenAIError(error, "analyze the scenario"); }
};

// --- STEP 2: GAP DETECTION (Thinking Removed for Speed) ---
export const detectGaps = async (userText: string, scenario: ScenarioUnderstanding): Promise<GapDetection> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_REASONING,
        contents: `Scenario: ${JSON.stringify(scenario)}. User Text: "${userText}".
        
        TASK:
        Identify exactly 3 missing facts.
        Most legal tools answer questions. You must first figure out what question should even be asked.
        Focus on uncertainty detection before advice.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // thinkingConfig removed to improve latency/stability for users experiencing timeouts
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              confirmed_landscape: { type: Type.STRING },
              critical_gaps: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { gap: { type: Type.STRING }, why_it_matters: { type: Type.STRING } } }
              }
            }
          }
        }
      });
      return cleanAndParseJSON(response.text!);
    });
  } catch (error) { throw handleGenAIError(error, "detect information gaps"); }
};

// --- STEP 3: QUESTIONS ---
export const generateQuestions = async (gaps: GapDetection): Promise<ClarifyingQuestion[]> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_FAST, 
        contents: `Gaps: ${JSON.stringify(gaps.critical_gaps)}. 
        Generate 3 direct questions to close these gaps definitively.
        
        IMPORTANT:
        - If a question can be answered with a set of options (e.g. Yes/No/Unsure, or A/B/C), YOU MUST use 'multiple_choice' or 'yes_no'.
        - DO NOT put options inside the 'question' text (e.g. "Did you sign it? (Yes/No)"). Put them in the 'options' array.
        - ALWAYS provide an 'Unsure' or 'I don't know' option for multiple choice.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer_type: { type: Type.STRING, enum: ["short_text", "yes_no", "multiple_choice"] },
                options: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      });
      return cleanAndParseJSON(response.text!);
    });
  } catch (error) { throw handleGenAIError(error, "generate questions"); }
};

// --- STEP 4: SYNTHESIS ---
export const synthesizeCase = async (text: string, scenario: ScenarioUnderstanding, qa: {q:string; a:string}[]): Promise<Synthesis> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_REASONING,
        contents: `Synthesize: "${text}". Facts: ${JSON.stringify(scenario.known_facts)}. Q&A: ${JSON.stringify(qa)}.
        
        CRITICAL INSTRUCTION:
        Treat the user's answers in Q&A as absolute fact. 
        Move items from "Uncertain" to "Clear".
        Aim for a Clarity Score of 90-100%. If they answered the questions, the fog of war should be gone.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              what_is_clear: { type: Type.ARRAY, items: { type: Type.STRING } },
              what_is_uncertain: { type: Type.ARRAY, items: { type: Type.STRING } },
              clarity_score: { type: Type.INTEGER },
              conflict_intensity: { type: Type.INTEGER },
              de_escalation_potential: { type: Type.INTEGER },
            }
          }
        }
      });
      return cleanAndParseJSON(response.text!);
    });
  } catch (error) { throw handleGenAIError(error, "synthesize case"); }
};

// --- STEP 5: PATHWAYS ---
export const suggestPathways = async (synthesis: Synthesis): Promise<ResolutionResponse> => {
  try {
    return await retryOperation(async () => {
      const response = await ai.models.generateContent({
        model: MODEL_REASONING,
        contents: `Context: ${JSON.stringify(synthesis)}.
        
        TASK:
        1. Create a "User Persona" (e.g., "Overwhelmed Freelancer").
        2. Identify "Primary Pain Points" & "Key Risks".
        3. Suggest 3 specific, feasible resolution paths.
        
        FOR EACH PATH:
        - **success_probability**: 0-100%.
        - **probability_reasoning**: 1-2 sentences explaining WHY this score is accurate based on facts vs ambiguity.
        - **estimated_timeframe**: e.g., "1 week", "3 months".
        - **financial_cost**: e.g., "Free", "Low (<$100)", "High".
        - **artifact_content**: The ACTUAL email/letter/script.
        `,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              user_persona: { type: Type.STRING },
              primary_pain_points: { type: Type.ARRAY, items: { type: Type.STRING } },
              key_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggested_tone: { type: Type.STRING },
              resolution_paths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    success_probability: { type: Type.INTEGER },
                    probability_reasoning: { type: Type.STRING },
                    estimated_timeframe: { type: Type.STRING },
                    financial_cost: { type: Type.STRING },
                    legal_basis: { type: Type.STRING },
                    psychological_strategy: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    artifact_type: { type: Type.STRING },
                    artifact_content: { type: Type.STRING },
                    de_escalation_benefit: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      return cleanAndParseJSON(response.text!);
    });
  } catch (error) { throw handleGenAIError(error, "suggest pathways"); }
};

// --- FEATURE: AI CHATBOT ---
export const chatWithAI = async (history: ChatMessage[], message: string): Promise<string> => {
  try {
    return await retryOperation(async () => {
      const chatContent = history.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n');
      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: `Conversation History:\n${chatContent}\n\nUser: ${message}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\nProvide a helpful, short, calming response."
        }
      });
      return response.text || "I'm listening.";
    });
  } catch (error) {
    throw handleGenAIError(error, "chat with AI");
  }
};
