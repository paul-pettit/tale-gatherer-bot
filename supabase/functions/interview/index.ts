
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.24.1";
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
    if (!prompt || !userId || !storyId) {
      throw new Error('Missing required parameters');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile for context
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('first_name, age, hometown, gender')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    // Get system prompt
    const { data: systemPrompts, error: promptError } = await supabaseClient
      .from('system_prompts')
      .select('content')
      .eq('type', 'interview')
      .maybeSingle();

    if (promptError) {
      throw new Error(`Failed to fetch system prompt: ${promptError.message}`);
    }

    if (!systemPrompts?.content) {
      throw new Error('System prompt not found');
    }

    const openai = new OpenAI({ apiKey: openAiKey });

    // Format system prompt with user context
    const systemPrompt = systemPrompts.content
      .replace('${context}', context || '')
      .replace('${firstName}', profile?.first_name || '')
      .replace('${age}', profile?.age?.toString() || '')
      .replace('${hometown}', profile?.hometown || '')
      .replace('${gender}', profile?.gender || '');

    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const endTime = Date.now();
    const answer = response.choices[0]?.message?.content || 'I apologize, but I am unable to continue the conversation at this moment.';
    
    // Log the prompt usage with detailed timing
    await supabaseClient
      .from('prompt_logs')
      .insert({
        user_id: userId,
        story_id: storyId,
        prompt: JSON.stringify(messages),
        response: answer,
        model: 'gpt-4',
        tokens_used: response.usage?.total_tokens || 0,
        cost_usd: (response.usage?.total_tokens || 0) * 0.00003, // Updated cost for GPT-4
        status: 'success',
        request_timestamp: new Date(startTime).toISOString(),
        response_timestamp: new Date(endTime).toISOString()
      });

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in interview function:', error);

    // Log the error if we have user and story context
    try {
      const { userId, storyId } = await req.json();
      if (userId && storyId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabaseClient
          .from('prompt_logs')
          .insert({
            user_id: userId,
            story_id: storyId,
            status: 'error',
            error_message: error.message,
            request_timestamp: new Date().toISOString()
          });
      }
    } catch (logError) {
      console.error('Error logging failure:', logError);
    }

    return new Response(
      JSON.stringify({ 
        error: 'An error occurred processing your request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
