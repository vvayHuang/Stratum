export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.geminiApiKey;

  if (!prompt) {
    return { error: 'Prompt is required' };
  }

  if (!apiKey) {
    return { error: 'Gemini API key is not configured on the server.' };
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are a career advisor. Based on the user's interests, you will suggest 8 to 12 potential job titles with a brief description for each. The response should only contain the list of job titles and descriptions. User's interest: "${prompt}"`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Gemini API:', errorData);
      return { error: `Failed to fetch response from Gemini: ${errorData.error.message}` };
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return {
      response: text,
    };
  } catch (error) {
    console.error('Error fetching from Gemini:', error);
    return { error: 'Failed to fetch response from Gemini' };
  }
});
