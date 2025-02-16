
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, sessionId, context } = await req.json()

    // Validate inputs
    if (!message || !sessionId) {
      throw new Error('Message and sessionId are required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get session details and previous messages
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*, stories(*)')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Session not found')
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

    // Save user message
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message
      })

    if (saveError) {
      throw new Error('Failed to save message')
    }

    // Prepare conversation history for OpenAI
    const conversationHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Prepare system message with context
    const systemMessage = {
      role: 'system',
      content: `You are an empathetic interviewer helping someone tell their life story. 
      Your goal is to help them explore and elaborate on their memories and experiences.
      The main question being discussed is: "${context}".
      
      Guidelines:
      1. Ask follow-up questions that encourage detailed responses
      2. Show empathy and understanding in your responses
      3. Keep responses concise (max 2-3 sentences) to maintain conversation flow
      4. Focus on emotional aspects and personal significance
      5. Avoid making assumptions or judgments
      6. Use the information shared to ask more specific questions`
    }

    // Make OpenAI API call
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...conversationHistory, { role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    if (!openAIResponse.ok) {
      throw new Error('Failed to get AI response')
    }

    const aiData = await openAIResponse.json()
    const aiMessage = aiData.choices[0].message.content

    // Save AI response
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
        user_id: session.user_id,
        story_id: session.story_id,
        prompt: message,
        response: aiMessage,
        status: 'success',
        model: 'gpt-4o-mini',
        tokens_used: aiData.usage.total_tokens,
        cost_usd: (aiData.usage.total_tokens * 0.00001), // Approximate cost
      })
      .throwOnError()

    return new Response(
      JSON.stringify({ message: aiMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
