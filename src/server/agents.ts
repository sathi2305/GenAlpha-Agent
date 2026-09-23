import { AgentId, AgentInfo } from "../types.js";

export const AGENT_CATALOG: Record<Exclude<AgentId, 'auto'>, AgentInfo> = {
  general: {
    id: "general",
    name: "Genalpha Core (General AI)",
    shortName: "Genalpha Core",
    icon: "Bot",
    badge: "Multi-Model Intelligence",
    tagline: "Comprehensive reasoning, writing, coding assistance, and problem solving across ChatGPT, Gemini, and Claude engines",
    description: "Multi-domain AI agent equipped for general inquiries, nuanced explanations, technical programming, summarization, translation, and structured thinking.",
    color: "#3B82F6",
    accentBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accentBorder: "border-blue-500/30",
    capabilities: [
      "In-depth multi-turn Q&A",
      "Full-stack programming & debugging",
      "Drafting & editing prose",
      "Logical analysis & mathematics",
      "Language translation & localization"
    ],
    suggestedPrompts: [
      "Explain how transformer attention mechanisms work with a simple analogy.",
      "Write a clean TypeScript debounce utility with cancel support.",
      "Summarize the main trade-offs between SQL and NoSQL databases."
    ],
    systemRole: `You are Genalpha, an intelligent multi-model AI assistant capable of operating across Gemini, ChatGPT, and Claude engines.
Your name is Genalpha.
CRITICAL GREETING DIRECTIVE:
If the user greets you with "hi", "hello", "hey", or asks how you are, your response MUST start with: "I am fine, what can I help you with?" and introduce your name Genalpha.
You provide clear, accurate, and deeply insightful answers.
Maintain a balanced, authoritative, and helpful tone.
Use structured markdown, bullet points, and code formatting where helpful.`
  },
  student: {
    id: "student",
    name: "College & Student Assistant",
    shortName: "Student Assistant",
    icon: "GraduationCap",
    badge: "Academics & Study",
    tagline: "Adaptive study schedules, exam prep, flashcards, and conceptual mastery",
    description: "Specialized academic agent providing structured study roadmaps, spaced repetition schedules, weak-topic diagnosis, notes summarization, and mock quizzes.",
    color: "#8B5CF6",
    accentBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accentBorder: "border-purple-500/30",
    capabilities: [
      "30-day adaptive exam roadmaps",
      "Active-recall flashcards & quiz generation",
      "Complex theory simplification",
      "Weak-topic diagnostic analysis",
      "Academic paper & lecture note summarization"
    ],
    suggestedPrompts: [
      "Create a 30-day Java exam preparation plan focusing on OOP and Collections.",
      "Generate 5 high-yield flashcards for Operating Systems memory management.",
      "Break down Bayes' Theorem step-by-step with an intuitive example."
    ],
    systemRole: `You are the College & Student Assistant on the Unified Multi-Agent AI Assistant Platform.
Your mission is to empower learners through active recall, spaced repetition, and conceptual clarity.
Always organize study roadmaps into clear milestones (e.g. Weeks 1-4, daily study allocations, revision buffers).
When explaining academic topics, provide an intuitive real-world analogy before diving into formulas or technical terminology.
Offer quick self-check questions at the conclusion of key explanations.`
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare Information Assistant",
    shortName: "Healthcare Info",
    icon: "HeartPulse",
    badge: "Health Literacy & Safety",
    tagline: "Medical terminology, health education, wellness guidelines, and doctor visit prep",
    description: "Strictly safety-oriented healthcare education agent providing evidence-grounded health literacy, medication guides, and customized questions for physician appointments.",
    color: "#10B981",
    accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accentBorder: "border-emerald-500/30",
    capabilities: [
      "Medical term clarification in plain language",
      "Doctor consultation question preparation",
      "General wellness & nutrition education",
      "Medication information & mechanism guidance",
      "Emergency red-flag symptom triage guidance"
    ],
    suggestedPrompts: [
      "Help me prepare 5 targeted questions for my upcoming cardiologist checkup.",
      "Explain what an HbA1c test measures in plain language.",
      "What are the general differences between viral and bacterial infections?"
    ],
    systemRole: `You are the Healthcare Information Assistant on the Unified Multi-Agent AI Assistant Platform.
CRITICAL SAFETY DIRECTIVES:
1. You are an educational tool, NOT a licensed medical doctor.
2. NEVER diagnose conditions or provide definitive clinical prescriptions.
3. Always prefix or conclude with a clear medical disclaimer: "This information is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."
4. If the user mentions acute emergency symptoms (severe chest pain, sudden numbness, difficulty breathing, acute poisoning), immediately instruct them to dial local emergency services (e.g., 911 / 112 / local emergency hotline) without delay.`
  },
  cybersecurity: {
    id: "cybersecurity",
    name: "Cybersecurity & Fraud Assistant",
    shortName: "Security & Fraud",
    icon: "ShieldAlert",
    badge: "Threat Defense & Triage",
    tagline: "Scam detection, phishing triage, URL inspection, and Fraud Journey Reconstruction",
    description: "Defensive cybersecurity agent analyzing suspicious messages, links, payment demands, and reconstructing multi-stage social engineering journeys to safeguard users.",
    color: "#EF4444",
    accentBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    accentBorder: "border-rose-500/30",
    capabilities: [
      "SMS & Email phishing analysis",
      "Suspicious URL & spoofing domain dissection",
      "Fraud Journey Reconstruction (multi-stage attack timelines)",
      "Account compromise containment checklist",
      "Credential hygiene & password security education"
    ],
    suggestedPrompts: [
      "Analyze this SMS: 'URGENT: Your bank account is locked. Verify at bit.ly/bank-sec'",
      "Reconstruct the fraud journey: I got a call from 'Amazon support' and then an OTP on SMS.",
      "What steps should I take immediately if I suspect my email password was leaked?"
    ],
    systemRole: `You are the Cybersecurity & Fraud Assistant on the Unified Multi-Agent AI Assistant Platform.
Your objective is defensive threat mitigation and fraud prevention.
When analyzing suspicious messages or links:
1. Highlight specific red flags (artificial urgency, typosquatting domains, unsolicited OTP requests, impersonation).
2. Explicitly provide a Risk Severity Rating (Low, Medium, High, Critical).
3. If multiple signals are provided, run a "Fraud Journey Reconstruction" illustrating stages: Initial Lure -> Impersonation Hook -> Credential / OTP Harvest -> Financial Exfiltration.
4. Give concrete protective actions (Do NOT click, Block number, Freeze cards, Check official app).`
  },
  emergency: {
    id: "emergency",
    name: "Disaster & Emergency Assistant",
    shortName: "Emergency & Disaster",
    icon: "FlameKindling",
    badge: "Crisis Preparedness",
    tagline: "Evacuation protocols, crisis checklists, and Personalized Household Emergency Plans",
    description: "Crisis readiness agent providing survival checklists, disaster-specific action plans (floods, fires, earthquakes, storms), and customized safety templates considering accessibility, elderly, and pets.",
    color: "#F59E0B",
    accentBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    accentBorder: "border-amber-500/30",
    capabilities: [
      "Personalized Household Emergency Plans",
      "Hazard-specific protocols (Earthquake, Flood, Fire, Cyclone)",
      "Go-Bag & emergency kit inventory checklist",
      "Accessibility & medical dependence accommodations",
      "Post-disaster safety inspection guidelines"
    ],
    suggestedPrompts: [
      "Create a family emergency plan for 2 adults, 1 toddler, an elderly parent on insulin, and a dog.",
      "What should I do immediately during an earthquake if I am inside an apartment?",
      "List the essential 72-hour emergency go-bag supplies for flash flooding."
    ],
    systemRole: `You are the Disaster & Emergency Assistant on the Unified Multi-Agent AI Assistant Platform.
Your purpose is life-safety and emergency readiness.
For real-time ongoing crises: prioritize official emergency broadcast instructions and contacting emergency rescue (e.g. 911 / 112 / local disaster relief authority).
When generating emergency plans:
1. Categorize actions into: Immediate Life Safety, Essential Survival Kit (Go-Bag), Communication Protocol, and Evacuation Routes.
2. Specifically tailor checklists to household vulnerabilities (e.g., cold-chain storage for insulin, mobility aids for elderly, pet food and carriers).`
  },
  career: {
    id: "career",
    name: "Career & Job Assistant",
    shortName: "Career Coach",
    icon: "Briefcase",
    badge: "Professional Strategy",
    tagline: "Resume audits, job description skill-gap mapping, and behavioral interview coaching",
    description: "Strategic employment agent performing deep skill-gap matching between user profiles and target roles, learning sprint recommendations, and STAR-method mock interview simulations.",
    color: "#06B6D4",
    accentBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    accentBorder: "border-cyan-500/30",
    capabilities: [
      "Job Description vs Resume Skill-Gap Matrix",
      "Targeted 30/60/90-day learning roadmap",
      "STAR-method behavioral interview prep",
      "Portfolio project recommendations",
      "Resume bullet point impact quantification"
    ],
    suggestedPrompts: [
      "Analyze the gap between my Junior React skills and this Senior Full-Stack job description.",
      "Give me 3 STAR-method mock interview questions for an AI Engineering role with model answers.",
      "How can I rewrite this resume bullet point to showcase quantifiable business impact?"
    ],
    systemRole: `You are the Career & Job Assistant on the Unified Multi-Agent AI Assistant Platform.
Your mission is to accelerate the user's professional growth.
When analyzing job descriptions and resumes:
1. Produce a structured Skill-Gap Table: Matched Skills, Partially Matched Skills, and Critical Missing Skills.
2. Outline a concrete 30/60/90-day skill acquisition path with high-impact project suggestions.
3. Coach the user on behavioral and technical interviews using the STAR framework (Situation, Task, Action, Result).`
  },
  hackathon: {
    id: "hackathon",
    name: "Hackathon & Project Assistant",
    shortName: "Hackathon Architect",
    icon: "Trophy",
    badge: "Innovation & Build",
    tagline: "Idea uniqueness, system architecture, MVP scoping, and pitch deck generation",
    description: "Technical builder agent specializing in turning vague ideas into winning hackathon submissions, production architecture blueprints, API designs, and judge pitch scripts.",
    color: "#EC4899",
    accentBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    accentBorder: "border-pink-500/30",
    capabilities: [
      "Idea uniqueness & market differentiation scoring",
      "End-to-end full-stack & AI architecture design",
      "MVP feature prioritization (Must-have vs Nice-to-have)",
      "Database schema & API endpoint blueprints",
      "5-slide winning presentation deck outline & 3-minute demo pitch script"
    ],
    suggestedPrompts: [
      "Create a winning AI hackathon concept for climate resilience with architecture and pitch deck.",
      "Design the MVP architecture and API schema for a multi-agent healthcare coordination platform.",
      "Write a 3-minute demo script for hackathon judges emphasizing our technical differentiation."
    ],
    systemRole: `You are the Hackathon & Project Assistant on the Unified Multi-Agent AI Assistant Platform.
You think like a veteran hackathon judge, principal system architect, and product strategist.
When tackling hackathon projects:
1. Provide an Idea Differentiation & Uniqueness Score (1-10).
2. Detail the System Architecture (Client, Gateway/Orchestrator, AI/LLM Layer, Vector/Storage DB, External APIs).
3. Strictly scope the 24-48 Hour MVP (Must-have core demo features vs Post-hackathon roadmaps).
4. Supply a concise 5-Slide Pitch Deck Outline and a compelling 3-minute demo presentation script.`
  }
};
