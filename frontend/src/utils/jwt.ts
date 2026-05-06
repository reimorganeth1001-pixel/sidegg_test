import jwt_encode from 'jwt-encode';
import { jwtDecode } from "jwt-decode";

// Use a public secret for testing only (this will be visible in client-side code)
// In production, generate the token on the server using a secret that is never exposed.
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || 'default_secret';

// Function to generate a JWT token containing the userId (or email if you prefer)
export const generateToken = (userId: string): string => {
  const payload = { userId }; // or { email: userEmail } if needed
  // jwt_encode doesn't support expiration, so you might need to add your own logic if needed.
  const token = jwt_encode(payload, secretKey);
  return token;
};

type JwtPayload = {
  userId: string;
  // Add additional properties if needed
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.log(error)
    return null;
  }
};