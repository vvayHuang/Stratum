import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.geminiApiKey;

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
