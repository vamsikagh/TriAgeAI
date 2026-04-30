import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TriageInput, TriageResult } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

function getModel() {
  if (!model && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Try multiple models in order of preference
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    } catch {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      }
    }
  }
  return model;
}

// Retry helper for 429 rate limit errors
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED');
      if (is429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1500; // 1.5s, 3s, 6s
        console.warn(`Gemini rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function buildTriagePrompt(input: TriageInput): string {
  return `You are an expert emergency medical triage AI assistant used during mass casualty events.

Analyze the following patient information and provide a triage classification.

Patient Details:
- Name: ${input.patientDetails.name}
- Age: ${input.patientDetails.age}
- Gender: ${input.patientDetails.gender}

Clinical Description:
${input.description}

${input.imageBase64 ? '[A patient photo has been provided for visual assessment]' : ''}

Respond in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{
  "severityLevel": "RED" | "YELLOW" | "GREEN" | "BLACK",
  "confidenceScore": 85,
  "injurySummary": "Brief 2-sentence medical assessment",
  "recommendedActions": ["action1", "action2", "action3"],
  "requiresSurgery": true,
  "requiresBlood": false
}

Severity Classification Rules (START protocol):
- RED (Immediate): Life-threatening, needs immediate intervention. Airway compromise, severe hemorrhage, tension pneumothorax, shock.
- YELLOW (Delayed): Serious but stable for now. Fractures, moderate burns, abdominal injuries without shock.
- GREEN (Minor): Walking wounded. Minor cuts, sprains, psychological distress, minor burns.
- BLACK (Deceased/Expectant): No signs of life or injuries incompatible with survival given available resources.`;
}

export async function analyzePatient(input: TriageInput): Promise<TriageResult> {
  const m = getModel();
  if (!m) {
    throw new ConfigError('VITE_GEMINI_API_KEY is not configured');
  }

  const prompt = buildTriagePrompt(input);

  try {
    let result;
    
    if (input.imageBase64 && input.imageMimeType) {
      // Multimodal request with image
      const imagePart = {
        inlineData: {
          data: input.imageBase64,
          mimeType: input.imageMimeType,
        },
      };
      result = await withRetry(() => m.generateContent([prompt, imagePart]));
    } else {
      // Text-only request
      result = await withRetry(() => m.generateContent(prompt));
    }

    const text = result.response.text();
    
    // Clean up response — remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (!parsed.severityLevel || parsed.confidenceScore === undefined || !parsed.injurySummary) {
      throw new Error('Missing required fields in Gemini response');
    }

    return {
      severityLevel: parsed.severityLevel,
      confidenceScore: parsed.confidenceScore,
      injurySummary: parsed.injurySummary,
      recommendedActions: parsed.recommendedActions || [],
      requiresSurgery: parsed.requiresSurgery || false,
      requiresBlood: parsed.requiresBlood || false,
      assessedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Gemini API error:', err);
    throw new Error(`Gemini API error: ${err.message || 'Unknown error'}`);
  }
}

export function isGeminiConfigured(): boolean {
  return !!API_KEY;
}
