import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    event.node.res.statusCode = 401;
    return { error: 'Unauthorized' };
  }

  const { prompt } = await readBody(event);
  const adminSupabase = getAdminSupabase();

  // Check rate limit: 3 prompts per 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await adminSupabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.sub)
    .gte('created_at', oneDayAgo);

  if (countError) {
    console.error('Error checking rate limit:', countError);
    event.node.res.statusCode = 500;
    return { error: 'Failed to verify usage limits.' };
  }

  if (count !== null && count >= 3) {
    event.node.res.statusCode = 429;
    return { error: 'You have reached your daily limit of 3 ideas. Please try again tomorrow!' };
  }

  const model = getGeminiModel();
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
      maxOutputTokens: 2048,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    let ideas;
    try {
      ideas = extractJson(text);
    } catch (parseError) {
      console.error('JSON Parse Error for Ideas Generation:', parseError);
      console.error('Raw Text:', text);
      throw new Error('Failed to parse JSON response from Gemini.');
    }

    const { data: promptData, error: promptError } = await adminSupabase
      .from('prompts')
      .insert({
        user_id: user.sub,
        prompt,
        response: text,
      })
      .select('id')
      .single();

    if (promptError) {
      console.error('Supabase prompt insert error:', promptError);
      throw new Error('Failed to save prompt.');
    }

    const promptId = promptData.id;

    const ideasToInsert = ideas.map((idea: { title: string; description: string }) => ({
      prompt_id: promptId,
      title: idea.title,
      description: idea.description,
    }));

    const { data: insertedIdeas, error: ideasError } = await adminSupabase
      .from('ideas')
      .insert(ideasToInsert)
      .select();

    if (ideasError) {
      console.error('Supabase ideas insert error:', ideasError);
      throw new Error('Failed to save ideas.');
    }

    return {
      ideas: insertedIdeas,
      promptId,
    };
  } catch (error: any) {
    console.error('Error processing request:', error);
    if (error.message && error.message.includes('503')) {
      event.node.res.statusCode = 503;
      return { error: 'The model is currently overloaded. Please try again later.' };
    }
    event.node.res.statusCode = 500;
    return { error: 'Failed to generate ideas. Please try again later.' };
  }
});
