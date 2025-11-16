import { SignJWT, jwtVerify } from 'jose';

const EXPIRES_IN = '24h';

export interface SessionPayload {
    userId: string;
}

export async function createSession(userId: string): Promise<string> {
    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const secret = new TextEncoder().encode(SECRET);

    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(EXPIRES_IN)
        .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const SECRET = process.env.JWT_SECRET;
        if (!SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const secret = new TextEncoder().encode(SECRET);
        const { payload } = await jwtVerify(token, secret);

        return {
            userId: payload.userId as string,
        };
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}