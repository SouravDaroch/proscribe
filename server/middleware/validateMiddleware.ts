import { type Request, type Response, type NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // We use parseAsync in case we eventually add 
      // async validation (like checking if a username exists)
      await schema.parseAsync(req.body);
      next(); // Success! Move to the Controller
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation Failed",
          // Send back a clean array of errors for the frontend
          errors: error.issues.map((err) => ({
            path: err.path[0],
            message: err.message,
          })),
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
};