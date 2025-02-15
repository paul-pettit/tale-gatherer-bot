
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const { prompt, context, messages, userId, storyId } = await req.json();

    // Create Supabase client to fetch system prompt
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the interview system prompt
    const { data: systemPrompts, error: promptError } = await supabaseClient
      .from('system_prompts')
      .select('content')
      .eq('type', 'interview')
      .limit(1)
      .single();

    if (promptError) {
      throw new Error('Failed to fetch system prompt');
    }

    const configuration = new Configuration({
      apiKey: openAiKey,
    });

    const openai = new OpenAIApi(configuration);
    const model = 'gpt-4';

    // Replace ${context} in the system prompt with the actual context
    const systemPrompt = systemPrompts.content.replace('${context}', context);

    const response = await openai.createChatCompletion({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = response.data.choices[0]?.message?.content || 'I apologize, but I am unable to continue the conversation at this moment.';
    
    // Calculate approximate token usage and cost
    const promptTokens = JSON.stringify(messages).length / 4;
    const responseTokens = answer.length / 4;
    const totalTokens = Math.ceil(promptTokens + responseTokens);
    const costUsd = totalTokens * 0.00001;

    // Log the prompt usage
    await supabaseClient
      .from('prompt_logs')
      .insert({
        user_id: userId,
        story_id: storyId,
        prompt: JSON.stringify(messages),
        response: answer,
        model,
        tokens_used: totalTokens,
        cost_usd: costUsd,
        status: 'success'
      });

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
