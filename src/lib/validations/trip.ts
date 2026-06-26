import { z } from 'zod';

export const activityTypeSchema = z.enum(['flight', 'transport', 'lodging', 'activity']);
export const expenseCategorySchema = z.enum([
  'food',
  'transport',
  'lodging',
  'activities',
  'shopping',
  'other',
]);
export const pinTypeSchema = z.enum(['image', 'link', 'note']);

export const createDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  date: z.string().datetime(),
  label: z.string().max(120).optional(),
});

export const updateDaySchema = createDaySchema.partial();

export const createActivitySchema = z.object({
  dayId: z.string().min(1),
  type: activityTypeSchema,
  title: z.string().min(1).max(200),
  startTime: z.string().datetime().optional().nullable(),
  duration: z.number().int().min(1).optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateActivitySchema = createActivitySchema.omit({ dayId: true }).partial();

export const createExpenseSchema = z.object({
  title: z.string().min(1).max(200),
  amount: z.number().positive(),
  category: expenseCategorySchema,
  linkedActivityId: z.string().optional().nullable(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const createPinSchema = z.object({
  type: pinTypeSchema,
  content: z.string().min(1),
  category: z.string().max(80).optional().nullable(),
});

export const createPollSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(200)).min(2).max(8),
  closesAt: z.string().datetime().optional().nullable(),
});

export const votePollSchema = z.object({
  pollOptionId: z.string().min(1),
});

export const settleSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  amount: z.number().positive(),
});
