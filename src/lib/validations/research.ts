import { z } from 'zod';

export const searchResearchSchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters').max(500),
  category: z.string().optional(),
  jurisdiction: z.string().optional(),
});

export const createKnowledgeSchema = z.object({
  title: z.string().min(3).max(300),
  category: z.string().min(1).max(100),
  content: z.string().min(10).max(50000),
  source: z.string().max(500).optional(),
  jurisdiction: z.string().max(100).optional(),
});

export type SearchResearchInput = z.infer<typeof searchResearchSchema>;
export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;

export const LEGAL_CATEGORIES = [
  'Contract Law',
  'Employment Law',
  'Business Formation',
  'Intellectual Property',
  'Real Estate',
  'Family Law',
  'Criminal Law',
  'Tax Law',
  'Immigration',
  'Consumer Protection',
  'Privacy & Data',
  'Dispute Resolution',
] as const;

export const JURISDICTIONS = [
  'Federal (US)',
  'California',
  'New York',
  'Texas',
  'Florida',
  'Illinois',
  'International',
  'European Union',
  'United Kingdom',
] as const;
