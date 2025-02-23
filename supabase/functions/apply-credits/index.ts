import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { userId, credits } = await req.json();

    if (!userId || !credits) {
      throw new Error('Missing required parameters: userId and credits');
    }

    // Update user credits in the database
    const { error } = await supabaseClient
      .from('profiles')
      .update({
        monthly_story_tokens: credits,
        purchased_story_credits: credits
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update credits for user ${userId}: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ message: `Successfully applied ${credits} credits to user ${userId}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in apply credits function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});