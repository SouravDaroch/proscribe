import { z } from 'zod'; 

// 1. Login Schema
export const loginSchema = z.object({ 
  email: z.string() 
    .min(1, 'Email is required') 
    .email('Invalid email format'), // This belongs to 'email'
    
  password: z.string()
    .min(6, 'Password must be at least 6 characters'), 
});

// 2. Register Schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'), 
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

//  Types
export type LoginFormInputs = z.infer<typeof loginSchema>;
export type RegisterFormInputs = z.infer<typeof registerSchema>;

export const blockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['heading', 'text', 'code']),
  content: z.string().min(1, 'Block content cannot be empty'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  blocks: z.array(blockSchema).min(1, 'Post must have at least one block'),
});

export type PostFormInputs = z.infer<typeof postSchema>;