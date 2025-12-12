import { GoogleGenerativeAI } from '@google/generative-ai';
import { serverSupabaseUser } from '#supabase/server';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const config = useRuntimeConfig();
  const adminSupabase = createClient(config.supabaseUrl, config.supabaseSecretKey);

  if (!user) {
    return {
      statusCode: 401,
      body: 'Unauthorized',
    };
  }

  const { prompt, generateGuide, idea, fetchIdeasByPrompt } = await readBody(event);
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Helper function to extract JSON from text
  const extractJson = (text) => {
    try {
      // First, try to parse the text directly
      return JSON.parse(text);
    } catch (e) {
      // If that fails, try to find a JSON block
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e2) {
          // Continue to next attempt
        }
      }

      // Try to find array or object start/end
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
  };

  if (generateGuide) {
    // Logic for generating the guide
    const guidePrompt = `You are a career advice expert. For the idea titled "${idea.title}" with the description "${idea.description}", provide a detailed guide. Your response must be a JSON object with the following structure: {"earnings_potential": "a string representing a range, e.g., $500-$2k", "competitive_score": a number from 0 to 10, "steps": [{"title": "Step 1 Title", "description": "Step 1 Description"}, ...]}. The guide should have between 5 and 10 steps. Do not include any other text or formatting in your response, just the JSON object.`;

    try {
      const result = await model.generateContent(guidePrompt);
      const response = await result.response;
      const text = response.text();

      let guideData;
      try {
        guideData = extractJson(text);
      } catch (parseError) {
        console.error('JSON Parse Error for Guide Generation:', parseError);
        console.error('Raw Text:', text);
        throw new Error('Failed to parse JSON response from Gemini.');
      }

      // Step 1: Create a new report
      const { data: report, error: reportError } = await adminSupabase
        .from('reports')
        .insert({
          idea_id: idea.id,
          earnings_potential: guideData.earnings_potential,
          competitive_score: guideData.competitive_score,
        })
        .select('id')
        .single();

      if (reportError) {
        console.error('Supabase report insert error:', reportError);
        throw new Error('Failed to create report.');
      }

      const reportId = report.id;

      // Step 2: Prepare and insert the steps
      const stepsToInsert = guideData.steps.map((step, index) => ({
        report_id: reportId,
        step_number: index + 1,
        title: step.title,
        description: step.description,
      }));

      const { error: stepsError } = await adminSupabase.from('steps').insert(stepsToInsert);

      if (stepsError) {
        console.error('Supabase steps insert error:', stepsError);
        throw new Error('Failed to save steps.');
      }

      // Step 3: Fetch the full report data to return
      const { data: finalReport, error: finalReportError } = await adminSupabase
        .from('reports')
        .select(`
          *,
          steps (
            *
          )
        `)
        .eq('id', reportId)
        .single();

      if (finalReportError) {
        console.error('Supabase final report fetch error:', finalReportError);
        throw new Error('Failed to fetch final report.');
      }

      return {
        guide: finalReport,
      };
    } catch (error) {
      console.error('Error processing guide generation request:', error);
      event.node.res.statusCode = 500;
      return {
        error: error.message || 'Failed to fetch from Gemini API or save data.',
      };
    }
  } else if (fetchIdeasByPrompt) {
    // Logic for fetching existing ideas by prompt
    try {
      // Find the prompt_id
      const { data: promptDataArray, error: promptError } = await adminSupabase
        .from('prompts')
        .select('id')
        .eq('prompt', prompt)
        .order('created_at', { ascending: false })
        .limit(1);

      if (promptError || !promptDataArray || promptDataArray.length === 0) {
        console.error('Supabase prompt fetch error or not found:', promptError);
        event.node.res.statusCode = 404;
        return {
          error: 'Prompt not found or no ideas associated with it.',
        };
      }

      const promptId = promptDataArray[0].id;

      // Fetch ideas associated with the prompt_id
      const { data: ideas, error: ideasError } = await adminSupabase
        .from('ideas')
        .select('*')
        .eq('prompt_id', promptId);

      if (ideasError) {
        console.error('Supabase ideas fetch error:', ideasError);
        throw new Error('Failed to fetch ideas.');
      }

      return {
        ideas: ideas,
      };
    } catch (error) {
      console.error('Error fetching ideas by prompt:', error);
      event.node.res.statusCode = 500;
      return {
        error: 'Failed to fetch existing ideas.',
      };
    }
  } else {
    // Check rate limit: 3 prompts per 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await adminSupabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.sub)
      .gte('created_at', oneDayAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
      // Fail open or closed? detailed error helps user understand
      throw new Error('Failed to verify usage limits.');
    }

    if (count !== null && count >= 3) {
      event.node.res.statusCode = 429;
      return {
        error: 'You have reached your daily limit of 3 ideas. Please try again tomorrow!',
      };
    }

    // Existing logic for generating ideas
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

      const ideasToInsert = ideas.map(idea => ({
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
        promptId: promptId,
      };
    } catch (error) {
      console.error('Error processing request:', error);
      if (error.message && error.message.includes('503')) {
        event.node.res.statusCode = 503;
        return {
          error: 'The model is currently overloaded. Please try again later.',
        };
      }
      event.node.res.statusCode = 500;
      return {
        error: error.message || 'Failed to fetch from Gemini API or save data.',
      };
    }
  }
});
