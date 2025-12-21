import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  getUserConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
  archiveConversation,
  unarchiveConversation,
} from "./db";

// Zod schemas for validation
const conversationInputSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.string(), // JSON stringified
  models: z.string(), // JSON stringified
  tags: z.string().optional(),
  isArchived: z.boolean().optional(),
});

const updateConversationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  messages: z.string().optional(),
  models: z.string().optional(),
  tags: z.string().optional(),
  isArchived: z.boolean().optional(),
});

export const conversationsRouter = router({
  // Get all recent (non-archived) conversations
  listRecent: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await getUserConversations(ctx.user.id, false);
    return conversations;
  }),

  // Get all archived conversations
  listArchived: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await getUserConversations(ctx.user.id, true);
    return conversations;
  }),

  // Get a single conversation by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await getConversationById(input.id, ctx.user.id);
      return conversation;
    }),

  // Create a new conversation
  create: protectedProcedure
    .input(conversationInputSchema)
    .mutation(async ({ ctx, input }) => {
      await createConversation({
        id: input.id,
        userId: ctx.user.id,
        title: input.title,
        messages: input.messages,
        models: input.models,
        tags: input.tags || null,
        isArchived: input.isArchived ? 1 : 0,
      });
      return { success: true };
    }),

  // Update an existing conversation
  update: protectedProcedure
    .input(updateConversationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.messages !== undefined) updateData.messages = data.messages;
      if (data.models !== undefined) updateData.models = data.models;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.isArchived !== undefined) updateData.isArchived = data.isArchived ? 1 : 0;

      await updateConversation(id, ctx.user.id, updateData);
      return { success: true };
    }),

  // Delete a conversation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteConversation(input.id, ctx.user.id);
      return { success: true };
    }),

  // Archive a conversation
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await archiveConversation(input.id, ctx.user.id);
      return { success: true };
    }),

  // Unarchive a conversation
  unarchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await unarchiveConversation(input.id, ctx.user.id);
      return { success: true };
    }),

  // Sync all conversations (bulk upsert)
  sync: protectedProcedure
    .input(z.object({
      conversations: z.array(conversationInputSchema),
    }))
    .mutation(async ({ ctx, input }) => {
      for (const convo of input.conversations) {
        const existing = await getConversationById(convo.id, ctx.user.id);
        if (existing) {
          await updateConversation(convo.id, ctx.user.id, {
            title: convo.title,
            messages: convo.messages,
            models: convo.models,
            tags: convo.tags || null,
            isArchived: convo.isArchived ? 1 : 0,
          });
        } else {
          await createConversation({
            id: convo.id,
            userId: ctx.user.id,
            title: convo.title,
            messages: convo.messages,
            models: convo.models,
            tags: convo.tags || null,
            isArchived: convo.isArchived ? 1 : 0,
          });
        }
      }
      return { success: true };
    }),
});
