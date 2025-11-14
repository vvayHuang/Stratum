import { GoogleGenerativeAI } from '@google/generative-ai';
import { serverSupabaseUser } from '#supabase/server';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const config = useRuntimeConfig();

  // Create an admin client to bypass RLS
  const adminSupabase = createClient(config.supabaseUrl, config.supabaseSecretKey);

  if (!user) {
    return {
      statusCode: 401,
      body: 'Unauthorized',
    };
  }

  const { prompt } = await readBody(event);
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'You are a career advice expert. Your goal is to give the user 3 ideas on how they can progress in their career based on their interests. The user will provide you with their interests. You must provide 3 ideas in a JSON array format. Each object in the array should have a "title" and a "description". Do not include any other text or formatting in your response, just the JSON array.' }],
      },
      {
        role: 'model',
        parts: [{ text: '[{"title": "Idea 1 Title", "description": "Idea 1 Description."}, {"title": "Idea 2 Title", "description": "Idea 2 Description."}, {"title": "Idea 3 Title", "description": "Idea 3 Description."}]' }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 8192,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response to ensure it's valid JSON
    if (text.startsWith('```json')) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('```')) {
      text = text.substring(3, text.length - 3).trim();
    }

    // The response from Gemini should be a JSON string of ideas
    const ideas = JSON.parse(text);

    // Save the prompt to the 'prompts' table
    const { data: promptData, error: promptError } = await adminSupabase
      .from('prompts')
      .insert({
        user_id: user.sub,
        prompt,
        response: text, // Save the raw response as well
      })
      .select('id')
      .single();

    if (promptError) {
      console.error('Supabase prompt insert error:', promptError);
      throw new Error('Failed to save prompt.');
    }

    const promptId = promptData.id;

    // Prepare ideas for insertion
    const ideasToInsert = ideas.map(idea => ({
      prompt_id: promptId,
      title: idea.title,
      description: idea.description,
    }));

    // Save the ideas to the 'ideas' table
    const { error: ideasError } = await adminSupabase
      .from('ideas')
      .insert(ideasToInsert);

    if (ideasError) {
      console.error('Supabase ideas insert error:', ideasError);
      // Here I might need to decide on a rollback strategy, but for now, just log it.
      throw new Error('Failed to save ideas.');
    }

    return {
      text, // The frontend still expects the text response to display it.
    };
  } catch (error) {
    console.error('Error processing request:', error);

    // Check if the error is a 503 overload error
    if (error.message && error.message.includes('503')) {
      event.node.res.statusCode = 503;
      return {
        error: 'The model is currently overloaded. Please try again later.',
      };
    }

    // For other errors
    event.node.res.statusCode = 500;
    return {
      error: 'Failed to fetch from Gemini API or save data.',
    };
  }
});
