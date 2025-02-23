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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openai = new OpenAI({ apiKey: openAiKey });

    // 1. Fetch existing system prompts from Supabase
    const { data: existingPrompts, error: fetchError } = await supabaseClient
      .from('system_prompts')
      .select('*')
      .eq('type', 'interview');

    if (fetchError) {
      throw new Error(`Failed to fetch existing prompts: ${fetchError.message}`);
    }

    // 2. Generate new prompt variations using OpenAI
    const newPrompts: { type: string; content: string; is_active: boolean; ab_test_group: null }[] = [];
    for (const prompt of existingPrompts) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: 'system',
            content: `You are an expert prompt engineer. Generate 3 variations of the following prompt, keeping the same intent but using different wording and creative approaches: ${prompt.content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const variations = response.choices[0]?.message?.content?.split('\\n').map(v => v.trim()) || [];
      newPrompts.push(...variations.map(variation => ({
        type: 'interview',
        content: variation,
        is_active: false, // Initially set to inactive
        ab_test_group: null, // Not part of A/B test yet
      }) as { type: string; content: string; is_active: boolean; ab_test_group: null }));
    }

    // 3. Insert new prompt variations into Supabase
    const { error: insertError } = await supabaseClient
      .from('system_prompts')
      .insert(newPrompts);

    if (insertError) {
      throw new Error(`Failed to insert new prompts: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ message: 'Prompt optimizer function running', newPrompts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in prompt optimizer function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});