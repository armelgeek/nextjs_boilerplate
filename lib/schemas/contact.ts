import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ContactForm = z.infer<typeof contactFormSchema>;
export type Subscribe = z.infer<typeof subscribeSchema>;
