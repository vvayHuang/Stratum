import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverSupabaseUser } from '#supabase/server';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.geminiApiKey;

  const user = await serverSupabaseUser(event);

  if (!user) {
    event.node.res.statusCode = 401;
    return { error: 'Unauthorized: User must be logged in.' };
  }

  // Create an admin client to bypass RLS
  const supabaseAdmin = createClient(
    runtimeConfig.supabaseUrl, // Corrected access to Supabase URL
    runtimeConfig.supabaseServiceKey
  );

  if (!prompt) {
    event.node.res.statusCode = 400;
    return { error: 'Prompt is required' };
  }

  if (!apiKey) {
    event.node.res.statusCode = 500;
    return { error: 'Gemini API key is not configured on the server.' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `You are a career advisor. Your response MUST be only a numbered list of 8 to 12 potential job titles with a brief description for each, based on the user's interest. Do NOT include any introductory or concluding sentences. The format for each item must be exactly: a number, a period, a space, the job title in double asterisks, a colon, a space, and then the description. User's interest: "${prompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Save the interaction to Supabase using the admin client
    const { error: insertError } = await supabaseAdmin.from('user_interactions').insert({
      user_id: user.sub, // Corrected: Use user.sub instead of user.id
      prompt: prompt,
      response: { text: text } // Store as a JSON object
    });

    if (insertError) {
      console.error('Error saving to Supabase:', insertError.message);
      // Don't block the user, just log the error
    }
    
    return { text };

  } catch (error) {
    event.node.res.statusCode = 500;
    let errorMessage = 'Failed to fetch response from Gemini due to a server error.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('Error from Gemini API:', error);
    return { error: errorMessage };
  }
});
