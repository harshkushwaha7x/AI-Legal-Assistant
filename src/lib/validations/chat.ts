import { z } from 'zod';

export const createSessionSchema = z.object({
    title: z.string().max(200).optional(),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(10000),
    sessionId: z.string().min(1, 'Session ID is required'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
