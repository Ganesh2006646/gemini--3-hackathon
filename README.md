# ⚖️ Dispute De-Escalator (Gemini 3 Hackathon)

[![Vite](https://img.shields.github.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React 19](https://img.shields.github.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.github.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google GenAI SDK](https://img.shields.github.io/badge/Google_Gen_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://github.com/google/generative-ai-js)

Developed for the **Gemini 3 Hackathon**, **Dispute De-Escalator** is a highly empathetic, AI-first guided web application designed to help **first-time dispute holders** navigate legal, financial, or personal conflicts without getting overwhelmed. The app focuses on resolving ambiguity, calming anxiety, and providing constructive, structured paths to resolution before conflicts escalate into costly legal battles.

🖥️ **Live App Workspace on AI Studio**: [View App in AI Studio](https://ai.studio/apps/drive/1zNVHdZrOBbHuE0dAx3frdYfMzAzR_ZHz)

---

## 💡 The Problem & The Mission
Most people facing their first dispute (such as a tenant conflict, freelance invoice issue, or employment disagreement) are highly anxious, unfamiliar with legal terms, and frequently ask the wrong questions. Standard legal tools jump straight to filing claims, which escalates tension. 

**Dispute De-Escalator** acts as a neutral, calming buffer. It prioritizes **Active Gap Detection** (clearing the "Fog of War") before suggesting action, ensuring the user gathers critical facts first, then equips them with de-escalation strategies and drafts tailored communication templates.

---

## ✨ Core Features

### 1. 📝 Multimodal Dispute Intake
Users can input their dispute in multiple formats:
*   **Detailed Text Account**: Describe what happened in plain language.
*   **Document & Damage Analysis (Image Upload)**: Upload letters, text messages, receipts, or photos of physical damage. Gemini (`gemini-2.5-flash-image`) automatically extracts dates, parties, clauses, and damage details.
*   **Verbal Accounts (Audio Upload)**: Upload voice memos or phone recordings. Gemini transcribes and extracts key points automatically.

### 2. 🔍 AI-Driven Gap Detection & Clarifying Questions
Unlike tools that give immediate (and often inaccurate) advice based on incomplete details, this app:
*   Builds a structured `ScenarioUnderstanding` (party relationships, stated claims, emotional context).
*   Identifies exactly **3 critical missing gaps** (e.g., missing lease dates, contract signatures).
*   Generates **3 interactive clarifying questions** (Yes/No, multiple-choice, or text) to help users fill these gaps before moving forward.

### 3. 📊 Conflict Metrics & Case Synthesis
Once the gaps are filled, the engine:
*   Computes case statistics, including:
    *   **Clarity Score**: Measures how much of the case is verified (displayed via Recharts gauges).
    *   **Conflict Intensity**: Rates the emotional/actionable friction.
    *   **De-Escalation Potential**: Estimates how easily the dispute can be settled out-of-court.
*   Presents a synthesized summary of what is solid vs. what remains uncertain.

### 4. 🗺️ Custom Resolution Pathways
For every scenario, the app outlines **3 customized pathways** detailing:
*   **Success Probability**: With a statistical/logical rationale.
*   **Timeframes & Costs**: E.g., "3-5 Business Days", "Free" vs. "Filing Fee".
*   **Strategy**: Actionable steps, legal basis (simplified), and psychological strategies.
*   **Actionable Artifacts**: Directly copyable and editable templates (e.g., formal negotiation email, demand letter, or conversation script).

### 5. 💬 Real-Time De-Escalation Chatbot
An inline chat interface powered by a custom-prompted Gemini agent allowing users to:
*   Ask follow-up questions.
*   Roleplay difficult conversations with the opposing party.
*   Edit and refine the generated letters and emails.

---

## 🛠️ Technology Stack & API Architecture

*   **Framework**: React 19 (Web client) served via Vite.
*   **Language**: TypeScript (Type-safe models for API payloads).
*   **AI Integration**: `@google/genai` (The official Google Gen AI SDK).
*   **Models Configured (`services/gemini.ts`)**:
    *   `gemini-3-flash-preview`: Used for schema generation, intake parsing, gap detection, synthesis, and pathways.
    *   `gemini-2.5-flash-image`: Used for image analysis and text extraction.
*   **UI Components**: Lucide React (Iconography), Recharts (Progress & Metric Gauges).

---

## 📁 Repository Structure
```markdown
gemini--3-hackathon/
│
├── components/
│   ├── ChatBot.tsx              # Interactive resolution chat widget
│   ├── Disclaimer.tsx           # Safety & legal disclaimer
│   ├── ErrorMessage.tsx         # Error handlers
│   ├── Footer.tsx               # Application footer
│   ├── Step1Intake.tsx          # Text, Audio & Image upload interfaces
│   ├── Step2Processing.tsx      # Multi-modal analysis loader
│   ├── Step3Questions.tsx       # Dynamic clarifying questions view
│   ├── Step4Summary.tsx         # Case synthesis, stats & recharts indicators
│   └── Step5Pathways.tsx        # Structured resolution paths & drafts
│
├── services/
│   ├── gemini.ts                # Gemini API integration using @google/genai
│   └── storage.ts               # LocalStorage helpers for session state
│
├── App.tsx                      # Core step router and application state
├── index.html                   # HTML entrypoint
├── index.tsx                    # React application mounting
├── types.ts                     # TypeScript declarations for schemas
├── tsconfig.json                # TS config
└── package.json                 # Project dependencies
```

---

## 🏁 How to Run Locally

### Prerequisites
*   Node.js (v18 or higher)
*   A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ganesh2006646/gemini--3-hackathon.git
   cd gemini--3-hackathon
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
4. Start the local Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---
*Developed for the Gemini 3 Hackathon. Designed to make conflict resolution clear, approachable, and stress-free.*
