import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    userId: v.string(),
    storyId: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("complete"))),
    createdAt: v.number(),
  }).index("by_session_and_time", ["sessionId", "createdAt"]),
  
  chatSessions: defineTable({
    storyId: v.string(),
    userId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("finishing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    question: v.string(),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_story", ["storyId"]),

  systemPrompts: defineTable({
    type: v.string(),
    content: v.string(),
    abTestGroup: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_type_and_active", ["type", "isActive"])
});