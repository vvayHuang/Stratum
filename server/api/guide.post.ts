import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    event.node.res.statusCode = 401;
    return { error: 'Unauthorized' };
  }

  const { ideaId } = await readBody(event);
  const adminSupabase = getAdminSupabase();

  // Verify the idea exists, belongs to the requesting user, and doesn't already have a report.
  const { data: ideaRecord, error: ideaError } = await adminSupabase
    .from('ideas')
    .select('id, title, description, has_report, prompts!inner(user_id)')
    .eq('id', ideaId)
    .single();

  if (ideaError || !ideaRecord) {
    event.node.res.statusCode = 404;
    return { error: 'Idea not found.' };
  }

  if (ideaRecord.prompts.user_id !== user.sub) {
    event.node.res.statusCode = 403;
    return { error: 'You do not have permission to access this idea.' };
  }

  if (ideaRecord.has_report) {
    event.node.res.statusCode = 409;
    return { error: 'A guide has already been generated for this idea.' };
  }

  const guidePrompt = `You are a career advice expert. For the idea titled "${ideaRecord.title}" with the description "${ideaRecord.description}", provide a detailed guide. Your response must be a JSON object with the following structure: {"earnings_potential": "a string representing a range, e.g., $500-$2k", "competitive_score": a number from 0 to 10, "steps": [{"title": "Step 1 Title", "description": "Step 1 Description"}, ...]}. The guide should have between 5 and 10 steps. Do not include any other text or formatting in your response, just the JSON object.`;

  const model = getGeminiModel();

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
        idea_id: ideaRecord.id,
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
    const stepsToInsert = guideData.steps.map((step: { title: string; description: string }, index: number) => ({
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

    // Mark the idea as having a report so it can't be regenerated.
    const { error: markReportedError } = await adminSupabase
      .from('ideas')
      .update({ has_report: true })
      .eq('id', ideaRecord.id);

    if (markReportedError) {
      console.error('Supabase idea update error:', markReportedError);
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
    return { error: 'Failed to generate guide. Please try again later.' };
  }
});
