import { z } from 'zod';

export const productAddSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Product title must be at least 3 characters long')
    .max(160, 'Product title cannot exceed 160 characters'),
  category: z
    .string()
    .trim()
    .min(1, 'Please select a product category'),
  subCategory: z
    .string()
    .trim()
    .optional(),
  price: z.coerce
    .number({ message: 'Price must be a valid number' })
    .positive('Price must be greater than 0'),
  discountPrice: z.coerce
    .number()
    .nonnegative('Discount price cannot be negative')
    .optional()
    .or(z.literal(''))
    .or(z.undefined()),
  stock: z.coerce
    .number({ message: 'Stock quantity must be a number' })
    .int('Stock must be an integer')
    .min(1, 'Stock quantity must be at least 1 unit'),
  vendorName: z
    .string()
    .trim()
    .min(2, 'Artisan or workshop name is required'),
  description: z
    .string()
    .trim()
    .min(10, 'Please write a brief description (at least 10 characters) about the craft materials or technique'),
  imageUrl: z
    .string()
    .min(1, 'Please upload a photo of the handcrafted product')
});

export type ProductAddInput = z.infer<typeof productAddSchema>;

