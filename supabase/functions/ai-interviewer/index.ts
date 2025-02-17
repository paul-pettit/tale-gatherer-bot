
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, sessionId, context, isFinishing } = await req.json()

    // Validate inputs
    if (!message || !sessionId) {
      throw new Error('Message and sessionId are required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get session details and system prompt
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*, stories(*)')
      .eq('id', sessionId)
      .single()

    if (sessionError || !sessionData) {
      throw new Error('Session not found')
    }

    // Get system prompt based on whether we're finishing or interviewing
    const { data: systemPrompts, error: promptError } = await supabase
      .from('system_prompts')
      .select('content')
      .eq('type', isFinishing ? 'story_generation' : 'interview')
      .single()

    if (promptError || !systemPrompts?.content) {
      throw new Error('System prompt not found')
    }

    // Get previous messages for context
    const { data: previousMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw new Error('Failed to fetch messages')
    }

    // Prepare conversation history for OpenAI
    const conversationHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Make OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts.content
              .replace('${context}', context || '')
          },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: isFinishing ? 0.7 : 0.5,
        max_tokens: isFinishing ? 1000 : 150,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const aiData = await response.json()
    const aiMessage = aiData.choices[0].message.content

    // Save AI response to chat_messages
    const { error: aiSaveError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: aiMessage
      })

    if (aiSaveError) {
      throw new Error('Failed to save AI response')
    }

    // Log the interaction
    await supabase
      .from('prompt_logs')
      .insert({
        user_id: sessionData.user_id,
        story_id: sessionData.story_id,
        prompt: message,
        response: aiMessage,
        model: 'gpt-4o-mini',
        tokens_used: aiData.usage.total_tokens,
        cost_usd: (aiData.usage.total_tokens * 0.00001),
        status: 'success'
      })

    return new Response(
      JSON.stringify({ message: aiMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
