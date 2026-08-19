import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export function getAdminSupabase() {
  const config = useRuntimeConfig();
  return createClient(config.supabaseUrl, config.supabaseSecretKey);
}

export function getGeminiModel() {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

// Gemini doesn't reliably return bare JSON - this pulls it out of code fences or
// surrounding prose regardless of which shape the response comes back in.
export function extractJson(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        // Continue to next attempt
      }
    }

    const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch (e3) {
        // Continue
      }
    }

    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (e4) {
        // Continue
      }
    }

    throw new Error('Could not extract valid JSON from response');
  }
}
