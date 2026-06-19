# Dispute De-Escalator ⚖️

<p align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Dispute De-Escalator Banner" width="100%" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"/>
</p>

## 📖 Story
Created for the **Gemini 3 Hackathon**, **Dispute De-Escalator** is a highly empathetic, AI-first guided web application built using **Google AI Studio**. The project aims to assist first-time dispute holders (such as tenants, freelancers, or employees) in resolving small-scale conflicts before they escalate into costly and stressful legal proceedings. 

During the hackathon, we focused on building a tool that calms the user's anxiety, guides them through structured fact-gathering, and generates professional, de-escalating correspondence. By introducing an "AI buffer" into high-friction situations, the application facilitates out-of-court resolutions through objective, clear-headed communication.

---

## ⚡ Features
*   **Multimodal Intake Processing**: Users can submit their conflict narrative via text, upload evidence images (parsed for text, dates, and damage descriptions), or upload audio recordings (transcribed directly into structured facts).
*   **Active Gap Detection**: Gemini analyzes the initial conflict context, identifies exactly **3 missing critical pieces of information** (the "Fog of War"), and generates interactive clarifying questions to fill these gaps.
*   **Conflict Metrics & Case Synthesis**: After gathering all details, the app computes a case synthesis, showing a Clarity Score, Conflict Intensity, and De-Escalation Potential using interactive Recharts gauges.
*   **Resolution Pathways**: Generates 3 specialized resolution strategies showing estimated success probabilities, costs, timeframes, and psychological strategies.
*   **Artifact Drafting**: Instantly creates copyable templates (formal demand letters, negotiation emails, or verbal conversation scripts) tailored to the case facts.
*   **Interactive De-escalation Chatbot**: Allows users to chat directly with a virtual dispute counselor to practice hard conversations, ask questions, or refine generated letters.

---

## 🛠️ Tech Stack
*   **Frontend Framework**: React 19 & Vite
*   **Programming Language**: TypeScript
*   **AI Integration**: `@google/genai` (Official Google Gen AI SDK)
*   **AI Models**: 
    *   `gemini-3-flash-preview` (Reasoning and structured JSON output)
    *   `gemini-2.5-flash-image` (Multimodal analysis and transcription)
*   **UI Components**: Lucide React (Icons) & Recharts (Visualized metrics)

---

## 🚀 How to Run

### Prerequisites
*   Node.js (v18 or higher)
*   A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/Ganesh2006646/gemini--3-hackathon.git
   cd gemini--3-hackathon
   ```
2. Install the node dependencies:
   ```bash
   npm install
   ```
3. Add your API key to environment variables in a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Start the Vite local server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🎯 Conclusion
Dispute De-Escalator showcases the power of the Gemini 3 model family in handling high-context, emotionally charged real-world scenarios. By leveraging structured JSON schemas and multimodal APIs, the application effectively turns raw, unstructured arguments into clear, logical paths forward, illustrating how AI can act as a constructive mediator in everyday life.

---

<div align="center">
  <sub>Developed with 💖 by</sub>
  <br/>
  <b><a href="https://github.com/Ganesh2006646">K Ganesh Giridhar</a></b>
  <br/>
  <sub>Amrita Vishwa Vidyapeetham</sub>
</div>
