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

// 3. Types
export type LoginFormInputs = z.infer<typeof loginSchema>;
export type RegisterFormInputs = z.infer<typeof registerSchema>;