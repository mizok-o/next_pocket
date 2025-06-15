import { SignJWT, jwtVerify } from 'jose';
import { JWT_EXPIRATION } from './constants';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function generateJWT(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);

  return token;
}

export async function verifyJWT(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}
