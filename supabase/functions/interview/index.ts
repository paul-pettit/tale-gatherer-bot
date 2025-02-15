
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, context, messages } = await req.json();

    const configuration = new Configuration({
      apiKey: openAiKey,
    });

    const openai = new OpenAIApi(configuration);

    const systemPrompt = `You are a compassionate and skilled interviewer helping someone write their life story. 
    You are currently discussing: "${context}"
    Your goal is to:
    1. Ask thoughtful follow-up questions
    2. Show genuine interest in their experiences
    3. Help them recall specific details and emotions
    4. Keep responses focused but encouraging
    5. Guide them toward meaningful reflections`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = response.data.choices[0]?.message?.content || 'I apologize, but I am unable to continue the conversation at this moment.';

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in interview function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
