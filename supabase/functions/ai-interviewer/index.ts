
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

  const startTime = Date.now();
  let supabaseClient: any;

  try {
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, context, messages, userId, storyId, isFinishing } = await req.json();
    if (!message || !userId || !storyId) {
      throw new Error('Missing required parameters');
    }

    // Create Supabase client
    supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user has enough credits only when it's their first message
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('monthly_story_tokens, purchased_story_credits')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }

      const totalCredits = (profile.monthly_story_tokens || 0) + (profile.purchased_story_credits || 0);
      
      if (totalCredits <= 0) {
        throw new Error('Insufficient credits to continue the conversation');
      }
    }

    const { data: systemPrompts, error: promptError } = await supabaseClient
      .from('system_prompts')
      .select('content, ab_test_group')
      .eq('type', 'interview');

    if (promptError || !systemPrompts?.length) {
      throw new Error('Failed to fetch system prompt');
    }

    // Select a prompt based on A/B test group
    const activePrompts = systemPrompts.filter(prompt => prompt.ab_test_group === null || prompt.ab_test_group === 'A'); // Example: Use group A or prompts with no group
    const systemPrompt = activePrompts[Math.floor(Math.random() * activePrompts.length)]?.content;

    if (!systemPrompt) {
      throw new Error('No active system prompts found');
    }

    // Get user profile for system prompt context
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Format system prompt with user context
    const formattedSystemPrompt = systemPrompt
      ?.replace('${context}', context || '')
      .replace('${firstName}', profile?.first_name || '')
      .replace('${age}', profile?.age?.toString() || '')
      .replace('${hometown}', profile?.hometown || '')
      .replace('${gender}', profile?.gender || '');
      
    const openai = new OpenAI({ apiKey: openAiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: 'system', content: formattedSystemPrompt },
        ...messages,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: isFinishing ? 2000 : 500,
    });

    const endTime = Date.now();
    const answer = response.choices[0]?.message?.content;
    
    if (!answer) {
      throw new Error('No response received from AI');
    }

    // Only deduct credits on first message
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const { error: creditError } = await supabaseClient
        .from('profiles')
        .update({
          monthly_story_tokens: profile.monthly_story_tokens > 0 
            ? profile.monthly_story_tokens - 1 
            : profile.monthly_story_tokens,
          purchased_story_credits: profile.monthly_story_tokens > 0 
            ? profile.purchased_story_credits 
            : profile.purchased_story_credits - 1
        })
        .eq('id', userId);

      if (creditError) {
        throw new Error('Failed to update credits');
      }
    }

    // Log successful prompt usage
    await supabaseClient
      .from('prompt_logs')
      .insert({
        user_id: userId,
        story_id: storyId,
        prompt: JSON.stringify(messages),
        response: answer,
        model: 'gpt-4o',
        tokens_used: response.usage?.total_tokens || 0,
        cost_usd: (response.usage?.total_tokens || 0) * 0.00003,
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

    // Log error without consuming credits
    if (supabaseClient) {
      try {
        const { userId, storyId } = await req.json();
        if (userId && storyId) {
          await supabaseClient
            .from('prompt_logs')
            .insert({
              user_id: userId,
              story_id: storyId,
              status: 'error',
              error_message: error.message,
              request_timestamp: new Date(startTime).toISOString(),
              response_timestamp: new Date().toISOString(),
              cost_usd: 0,
              tokens_used: 0
            });
        }
      } catch (logError) {
        console.error('Error logging failure:', logError);
      }
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
