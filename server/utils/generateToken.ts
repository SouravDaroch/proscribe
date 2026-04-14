import jwt from 'jsonwebtoken';

// Helper to create the JWT (We'll move this to a utility later)
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '30d',
  });
};

export default generateToken;