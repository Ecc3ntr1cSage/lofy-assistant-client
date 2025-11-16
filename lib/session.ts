import jwt from 'jsonwebtoken';

const EXPIRES_IN = '24h';

export interface SessionPayload {
    userId: string;
    iat: number;
    exp: number;
}

export async function createSession(userId: string): Promise<string> {
    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN });
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const SECRET = process.env.JWT_SECRET;
        if (!SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return jwt.verify(token, SECRET) as SessionPayload;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}