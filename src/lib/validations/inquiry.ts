import { z } from 'zod';

export const customerInquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters')
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address')
});

export type CustomerInquiryInput = z.infer<typeof customerInquirySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

