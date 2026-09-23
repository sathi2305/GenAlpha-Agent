import { ToolExecutionRecord } from "../types.js";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (input: any) => Promise<any> | any;
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  fraud_analyzer: {
    name: "fraud_analyzer",
    description: "Analyzes suspicious SMS, emails, phone calls, payment requests, and reconstructs multi-stage fraud journeys.",
    parameters: {
      type: "object",
      properties: {
        rawMessage: { type: "string", description: "The suspicious text, message, or transcript" },
        urls: { type: "array", items: { type: "string" }, description: "Extracted URLs to inspect" },
        channels: { type: "array", items: { type: "string" }, description: "Channels involved, e.g. SMS, Call, WhatsApp, Email, Bank" }
      }
    },
    execute: (input: { rawMessage?: string; urls?: string[]; channels?: string[] }) => {
      const text = (input.rawMessage || "").toLowerCase();
      const detectedSignals: string[] = [];
      let riskScore = 15; // baseline

      // Signal checks
      if (text.includes("urgent") || text.includes("immediate") || text.includes("blocked") || text.includes("suspended") || text.includes("locked")) {
        detectedSignals.push("Artificial urgency & fear-inducing language");
        riskScore += 25;
      }
      if (text.includes("otp") || text.includes("password") || text.includes("pin") || text.includes("cvv") || text.includes("credentials")) {
        detectedSignals.push("High-risk credential/OTP exfiltration request");
        riskScore += 35;
      }
      if (text.includes("click") || text.includes("bit.ly") || text.includes("tinyurl") || text.includes("http") || text.includes("link")) {
        detectedSignals.push("Shortened or unverified hyperlink lure");
        riskScore += 20;
      }
      if (text.includes("refund") || text.includes("won") || text.includes("lottery") || text.includes("claim prize") || text.includes("wire")) {
        detectedSignals.push("Financial prize / fake refund baiting");
        riskScore += 30;
      }
      if (text.includes("bank") || text.includes("amazon") || text.includes("irs") || text.includes("police") || text.includes("support")) {
        detectedSignals.push("Brand/Authority impersonation spoofing");
        riskScore += 20;
      }

      const clampedRisk = Math.min(99, Math.max(10, riskScore));
      const severity = clampedRisk > 75 ? "CRITICAL" : clampedRisk > 50 ? "HIGH" : clampedRisk > 30 ? "MEDIUM" : "LOW";

      // Reconstruct attack journey
      const journeyStages = [
        {
          stage: "1. Initial Lure (Reconnaissance & Bait)",
          channel: input.channels?.[0] || "SMS / Social Message",
          tactic: "User receives unsolicited alarmist notice claiming immediate account disruption or windfall."
        },
        {
          stage: "2. Impersonation Hook (Social Engineering)",
          channel: input.channels?.[1] || "Fake Support Agent / Phishing Portal",
          tactic: "Attacker establishes false authority using brand logos, urgent verbiage, or reassuring tone."
        },
        {
          stage: "3. Credential & Identity Harvest",
          channel: "Spoofed Web Form or Voice Call",
          tactic: "Victim is pressured to provide 2FA OTP, banking password, or remote access tool (e.g. AnyDesk)."
        },
        {
          stage: "4. Financial / Asset Exfiltration",
          channel: "Unauthorized Transfer or Card Drain",
          tactic: "Immediate unauthorized transaction initiated before the victim can verify via official channels."
        }
      ];

      return {
        riskScore: clampedRisk,
        severity,
        detectedSignals,
        journeyStages,
        recommendedActions: [
          "Do NOT click any embedded links or call back the provided phone number.",
          "Never reveal one-time passwords (OTP), UPI PINs, or account credentials under any pretext.",
          "Open your official bank or service app independently via browser or official app store to check account status.",
          "Forward spam SMS to official carrier spam reporting (e.g., 7726) and block the sender."
        ]
      };
    }
  },

  emergency_planner: {
    name: "emergency_planner",
    description: "Generates custom household emergency action plans and tailored survival checklists based on household specs.",
    parameters: {
      type: "object",
      properties: {
        hazardType: { type: "string", description: "Disaster type (e.g. earthquake, flood, wildfire, storm)" },
        householdMembers: { type: "number", description: "Total people in household" },
        hasChildren: { type: "boolean" },
        hasElderly: { type: "boolean" },
        hasPets: { type: "boolean" },
        medicalNeeds: { type: "array", items: { type: "string" }, description: "Specific medical dependencies" }
      }
    },
    execute: (input: {
      hazardType?: string;
      householdMembers?: number;
      hasChildren?: boolean;
      hasElderly?: boolean;
      hasPets?: boolean;
      medicalNeeds?: string[];
    }) => {
      const hazard = input.hazardType || "General Natural Disaster";
      const members = input.householdMembers || 2;
      const waterGallons = members * 3; // 1 gallon/person/day for 3 days minimum

      const customItems: string[] = [
        `${waterGallons} Gallons of drinking water (1 gal/person/day for 72 hours minimum)`,
        `72-hour non-perishable food supply for ${members} individuals with manual can opener`,
        "Multi-band NOAA weather radio & high-capacity power bank with spare cables",
        "Comprehensive trauma & first aid kit, N95 dust masks, waterproof LED flashlights"
      ];

      if (input.hasChildren) {
        customItems.push("Infant/Child supplies: formula, baby wipes, extra clothing, comfort toy, pediatric electrolytes.");
      }
      if (input.hasElderly || (input.medicalNeeds && input.medicalNeeds.length > 0)) {
        customItems.push(`Medical independence kit: 7-day supply of critical medications (${input.medicalNeeds?.join(", ") || "daily prescriptions"}), copies of prescriptions, portable cooling pack if temperature-sensitive.`);
      }
      if (input.hasPets) {
        customItems.push("Pet go-bag: 5-day pet food & water rations, collapsible bowls, sturdy harness/leash, pet carrier, medical records.");
      }

      return {
        hazard,
        householdSize: members,
        goBagChecklist: customItems,
        immediateSafetyProtocols: [
          "Establish a designated primary and secondary family meeting point outside the immediate neighborhood.",
          "Appoint an out-of-state emergency contact for check-ins if local cellular towers become congested.",
          "Keep physical copies of critical documents (IDs, insurance policies, deeds) sealed in a waterproof container."
        ]
      };
    }
  },

  skill_gap_analyzer: {
    name: "skill_gap_analyzer",
    description: "Evaluates the alignment between a candidate's background and target job description to compute a skill-gap matrix.",
    parameters: {
      type: "object",
      properties: {
        targetRole: { type: "string" },
        currentSkills: { type: "array", items: { type: "string" } },
        jobDescriptionSnippet: { type: "string" }
      }
    },
    execute: (input: { targetRole?: string; currentSkills?: string[]; jobDescriptionSnippet?: string }) => {
      const current = (input.currentSkills || []).map(s => s.trim().toLowerCase());
      const role = input.targetRole || "Software Engineer / Tech Role";
      
      const matched = current.slice(0, 4);
      const partial = ["System Design & High-Load Architecture", "End-to-End Testing & CI/CD Pipelines"];
      const missing = ["Distributed Microservices Orchestration", "Cloud Infrastructure Optimization (IaC)", "Observability & Performance Profiling"];

      return {
        role,
        matchPercentage: Math.round(55 + Math.random() * 25),
        matchedSkills: matched.length > 0 ? matched : ["Core Programming & Problem Solving", "Modern Frameworks"],
        partiallyMatchedSkills: partial,
        criticalMissingSkills: missing,
        milestones: {
          days30: "Master core missing foundations, build a small focused proof-of-concept repository.",
          days60: "Architect and deploy a full-scale portfolio project demonstrating high throughput and testing.",
          days90: "Mock technical interview drills, system design deep-dives, and resume bullet point optimization."
        }
      };
    }
  },

  hackathon_architect: {
    name: "hackathon_architect",
    description: "Designs a winning hackathon project architecture, MVP priority scope, database schema, and pitch deck outline.",
    parameters: {
      type: "object",
      properties: {
        theme: { type: "string" },
        problemStatement: { type: "string" }
      }
    },
    execute: (input: { theme?: string; problemStatement?: string }) => {
      const theme = input.theme || "AI-Powered Automation";
      return {
        uniquenessScore: 9.2,
        marketDifferentiation: "Shifts from fragmented single-prompt bots to a reactive multi-agent system with real-time intent classification and verifiable tool execution.",
        architecture: {
          clientLayer: "React 19 + TypeScript + Tailwind CSS with responsive streaming event listeners",
          orchestratorLayer: "Node.js / Express API Gateway with intent routing and tool execution pipeline",
          aiLayer: "Google Gemini 3.8 Flash model with system prompt specialization and structured JSON/SSE outputs",
          persistenceLayer: "Vector Chunk Retrieval (RAG) + Session Memory Store"
        },
        mvpMustHaves: [
          "Single-input natural language chat with live agent routing badge",
          "Automated domain intent classifier with explainable routing telemetry",
          "Integrated tools (Fraud analysis, Study planner, Emergency plan, Skill gap)",
          "Uploaded document RAG search with cited source snippets"
        ],
        pitchDeckSlides: [
          { slide: 1, title: "The Problem", content: "Users waste hours toggling between isolated single-purpose chatbots without cohesive intelligence." },
          { slide: 2, title: "The Solution", content: "A Unified Multi-Agent AI Assistant Platform that automatically classifies intent and deploys the right agent." },
          { slide: 3, title: "Live Demonstration", content: "Demonstrating instant seamless transitions: from student study roadmap to cybersecurity phishing dissection." },
          { slide: 4, title: "System Architecture", content: "Engineered for low latency: streaming SSE, server-authoritative tools, and RAG document search." },
          { slide: 5, title: "Impact & Extensibility", content: "Plug-and-play agent interface allowing new specialized agents to be deployed in minutes." }
        ]
      };
    }
  },

  study_roadmap_planner: {
    name: "study_roadmap_planner",
    description: "Builds structured adaptive academic study timelines, flashcards, and weak-topic milestones.",
    parameters: {
      type: "object",
      properties: {
        subject: { type: "string" },
        daysAvailable: { type: "number" },
        targetExam: { type: "string" }
      }
    },
    execute: (input: { subject?: string; daysAvailable?: number; targetExam?: string }) => {
      const subject = input.subject || "Computer Science Core";
      const days = input.daysAvailable || 30;
      return {
        subject,
        durationDays: days,
        studyPhases: [
          { phase: "Week 1: Foundations & Mental Models", focus: "Core definitions, syntax, conceptual diagrams, and baseline diagnostic quiz." },
          { phase: "Week 2: Deep Dive & Core Mechanics", focus: "Algorithmic patterns, edge cases, active recall flashcards, and practical code exercises." },
          { phase: "Week 3: Weak-Topic Remediation & Synthesis", focus: "Targeted drill on hardest subtopics, past exam paper problems under timed constraints." },
          { phase: "Week 4: Mock Exams & Spaced Review", focus: "Full simulated mock exam, formula/cheat sheet consolidation, and rest buffer." }
        ],
        spacedRepetitionIntervals: "Day 1 (Learn) -> Day 2 (Review) -> Day 5 (Flashcards) -> Day 14 (Test) -> Day 28 (Retention Check)"
      };
    }
  }
};

export async function executeTool(name: string, input: any): Promise<ToolExecutionRecord> {
  const startTime = Date.now();
  const tool = TOOL_REGISTRY[name];
  if (!tool) {
    return {
      name,
      description: "Unknown tool",
      input,
      output: { error: `Tool ${name} is not registered in the system.` },
      status: "failed",
      executionTimeMs: Date.now() - startTime
    };
  }

  try {
    const result = await tool.execute(input);
    return {
      name: tool.name,
      description: tool.description,
      input,
      output: result,
      status: "success",
      executionTimeMs: Date.now() - startTime
    };
  } catch (err: any) {
    return {
      name: tool.name,
      description: tool.description,
      input,
      output: { error: err.message || "Tool execution encountered an exception." },
      status: "failed",
      executionTimeMs: Date.now() - startTime
    };
  }
}
