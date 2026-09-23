import { Citation, DocumentChunk, DocumentRecord } from "../types.js";

// In-memory document storage with persistent RAG capabilities
const documentDatabase: Map<string, DocumentRecord> = new Map();

// Seed initial knowledge base document so RAG works out of the box
const seedDocId = "doc_omni_guide";
const seedFilename = "OmniAgent_System_Architecture_Manual.md";
const seedContent = `
# OmniAgent Platform Technical Specification & Safety Protocols

## 1. Unified Multi-Agent Orchestrator
The OmniAgent AI platform routes incoming user queries across seven specialized intelligent agents:
1. General AI Assistant - Reasoning, software engineering, and analytical thinking.
2. College & Student Assistant - Spaced repetition, adaptive 30-day exam roadmaps, active recall flashcards.
3. Healthcare Information Assistant - Health literacy, medication information, doctor visit question prep with strict medical safety disclaimers.
4. Cybersecurity & Fraud Assistant - Real-time phishing inspection, SMS & URL triage, and multi-stage Fraud Journey Reconstruction.
5. Disaster & Emergency Assistant - Life-safety emergency checklists, FEMA-aligned 72-hour survival kits, and personalized household safety plans.
6. Career & Job Assistant - Resume vs. job description skill-gap matrix, STAR method interview coaching, and 30/60/90 career roadmaps.
7. Hackathon & Project Assistant - Idea differentiation scoring, end-to-end cloud architecture design, and 5-slide winning pitch deck outlines.

## 2. RAG Pipeline Standards
Every document uploaded to the platform is automatically chunked into overlapping passages of 400-600 characters.
Metadata tracking user ID, document ID, filename, chunk index, and timestamps are preserved.
During generation, retrieved passages must be cited with their originating document name and excerpt.

## 3. Safety and Prompt Injection Hardening
All external content retrieved from tools or user uploads is quarantined into an untrusted content partition.
The system instruction explicitly isolates user input and retrieved content from operational instructions to prevent instruction override attacks.
`;

export function chunkText(text: string, chunkSize: number = 450, overlap: number = 80): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentLength += word.length + 1;
    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(" "));
      const overlapWords = Math.floor(overlap / 6);
      currentChunk = currentChunk.slice(-overlapWords);
      currentLength = currentChunk.join(" ").length;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks.filter(c => c.trim().length > 0);
}

export function initializeSeedDocument() {
  if (documentDatabase.has(seedDocId)) return;
  const rawChunks = chunkText(seedContent);
  const chunks: DocumentChunk[] = rawChunks.map((content, idx) => ({
    id: `chunk_${seedDocId}_${idx}`,
    documentId: seedDocId,
    filename: seedFilename,
    chunkIndex: idx + 1,
    totalChunks: rawChunks.length,
    content,
    metadata: {
      section: idx === 0 ? "Orchestrator Specs" : idx === 1 ? "RAG Architecture" : "Security Protocols"
    }
  }));

  documentDatabase.set(seedDocId, {
    id: seedDocId,
    userId: "system",
    filename: seedFilename,
    fileSize: seedContent.length,
    mimeType: "text/markdown",
    uploadedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    chunks
  });
}

// Initialize on module load
initializeSeedDocument();

export function storeDocument(userId: string, filename: string, content: string, mimeType: string): DocumentRecord {
  const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const rawChunks = chunkText(content);
  const chunks: DocumentChunk[] = rawChunks.map((chunkContent, idx) => ({
    id: `chunk_${docId}_${idx}`,
    documentId: docId,
    filename,
    chunkIndex: idx + 1,
    totalChunks: rawChunks.length,
    content: chunkContent
  }));

  const doc: DocumentRecord = {
    id: docId,
    userId,
    filename,
    fileSize: content.length,
    mimeType,
    uploadedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    chunks
  };

  documentDatabase.set(docId, doc);
  return doc;
}

export function getAllDocuments(userId?: string): DocumentRecord[] {
  const docs: DocumentRecord[] = [];
  for (const doc of documentDatabase.values()) {
    if (!userId || doc.userId === userId || doc.userId === "system") {
      docs.push(doc);
    }
  }
  return docs;
}

export function deleteDocument(docId: string): boolean {
  return documentDatabase.delete(docId);
}

export function searchRAG(query: string, userId?: string, topK: number = 3): { chunks: DocumentChunk[]; citations: Citation[] } {
  const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  const scoredChunks: { chunk: DocumentChunk; score: number }[] = [];

  for (const doc of documentDatabase.values()) {
    if (userId && doc.userId !== userId && doc.userId !== "system") {
      continue;
    }

    for (const chunk of doc.chunks) {
      const chunkLower = chunk.content.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (chunkLower.includes(token)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const score = matchCount / (queryTokens.length || 1);
        scoredChunks.push({ chunk, score });
      }
    }
  }

  // Sort by score descending
  scoredChunks.sort((a, b) => b.score - a.score);
  const topMatches = scoredChunks.slice(0, topK);

  const chunks = topMatches.map(m => m.chunk);
  const citations: Citation[] = topMatches.map(m => ({
    documentId: m.chunk.documentId,
    filename: m.chunk.filename,
    chunkIndex: m.chunk.chunkIndex,
    snippet: m.chunk.content.substring(0, 160) + "...",
    score: Math.round(m.score * 100) / 100
  }));

  return { chunks, citations };
}
