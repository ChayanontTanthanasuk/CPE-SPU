import { z } from 'zod';

export const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
