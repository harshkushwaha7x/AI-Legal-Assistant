import { z } from 'zod';

export const submitReviewSchema = z.object({
    fileName: z.string().min(1, 'File name is required').max(200),
    contractText: z.string().min(50, 'Contract text must be at least 50 characters').max(100000, 'Contract text exceeds maximum length'),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
