import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { OpenAI } from "openai";
import type { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from "openai/resources/chat";

type MessageRole = "user" | "assistant" | "system";

export const send = mutation({
  args: {
    sessionId: v.string(),
    message: v.string(),
    userId: v.string(),
    storyId: v.string(),
  },
  handler: async (ctx, { sessionId, message, userId, storyId }) => {
    // Initialize OpenAI with env var from Convex
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY ?? "" 
    });

    // Save user message
    const userMessageId = await ctx.db.insert("messages", {
      sessionId,
      role: "user",
      content: message,
      userId,
      storyId,
      createdAt: Date.now(),
    });

    // Get chat history
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_session_and_time", (q) =>
        q.eq("sessionId", sessionId)
      )
      .collect();

    // Get system prompt
    const systemPrompt = await ctx.db
      .query("systemPrompts")
      .withIndex("by_type_and_active", (q) =>
        q.eq("type", "interview").eq("isActive", true)
      )
      .first();

    if (!systemPrompt) {
      throw new Error("No active system prompt found");
    }

    // Format messages for OpenAI
    const formattedMessages: ChatCompletionMessageParam[] = [
      { 
        role: "system",
        content: systemPrompt.content 
      } as ChatCompletionSystemMessageParam,
      ...messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      } as ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)),
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Save AI message
    const aiMessageId = await ctx.db.insert("messages", {
      sessionId,
      role: "assistant",
      content: aiResponse,
      userId,
      storyId,
      createdAt: Date.now(),
    });

    return { userMessageId, aiMessageId };
  },
});

export const list = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_session_and_time", (q) =>
        q.eq("sessionId", sessionId)
      )
      .collect();
  },
});

export const finishStory = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
    storyId: v.string(),
  },
  handler: async (ctx, { sessionId, userId, storyId }) => {
    // Initialize OpenAI
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY ?? "" 
    });

    // Get session and update status
    const session = await ctx.db
      .query("chatSessions")
      .withIndex("by_story", (q) => q.eq("storyId", storyId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(session._id, {
      status: "finishing",
      updatedAt: Date.now(),
    });

    // Get chat history
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_session_and_time", (q) =>
        q.eq("sessionId", sessionId)
      )
      .collect();

    if (messages.length < 4) {
      throw new Error("Conversation too short to generate story");
    }

    // Get system prompt
    const systemPrompt = await ctx.db
      .query("systemPrompts")
      .withIndex("by_type_and_active", (q) =>
        q.eq("type", "interview").eq("isActive", true)
      )
      .first();

    // Generate story
    const formattedMessages: ChatCompletionMessageParam[] = [
      { 
        role: "system",
        content: systemPrompt?.content || "" 
      } as ChatCompletionSystemMessageParam,
      ...messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      } as ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)),
      {
        role: "user",
        content: "Please help me craft a coherent story from our conversation. Incorporate the details, emotions, and reflections we've discussed into a well-structured narrative."
      } as ChatCompletionUserMessageParam
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const storyContent = completion.choices[0]?.message?.content;
    if (!storyContent) {
      throw new Error("Failed to generate story");
    }

    // Update session status
    await ctx.db.patch(session._id, {
      status: "completed",
      updatedAt: Date.now(),
    });

    return {
      answer: "Story generated successfully",
      storyContent,
    };
  },
});