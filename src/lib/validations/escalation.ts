import { z } from 'zod';

export const createEscalationSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  priority: z.number().int().min(0).max(3).default(0),
});

export const updateEscalationSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.number().int().min(0).max(3).optional(),
  assignedTo: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateEscalationInput = z.infer<typeof createEscalationSchema>;
export type UpdateEscalationInput = z.infer<typeof updateEscalationSchema>;

export const PRIORITY_LABELS: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Urgent',
};

export const PRIORITY_COLORS: Record<number, { text: string; bg: string }> = {
  0: { text: 'text-surface-400', bg: 'bg-surface-500/15' },
  1: { text: 'text-amber-400', bg: 'bg-amber-500/15' },
  2: { text: 'text-orange-400', bg: 'bg-orange-500/15' },
  3: { text: 'text-red-400', bg: 'bg-red-500/15' },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  PENDING: { label: 'Pending', color: 'text-surface-400', step: 0 },
  ASSIGNED: { label: 'Assigned', color: 'text-blue-400', step: 1 },
  IN_PROGRESS: { label: 'In Progress', color: 'text-violet-400', step: 2 },
  RESOLVED: { label: 'Resolved', color: 'text-emerald-400', step: 3 },
  CLOSED: { label: 'Closed', color: 'text-surface-500', step: 4 },
};
