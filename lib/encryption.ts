import { createHash } from 'crypto';

/**
 * Hash sensitive data (like a phone number) using SHA-256 to check for existence.
 * @param data The string data to hash (e.g., plain phone number).
 * @returns The SHA-256 hex digest string.
 */
export function hash(data: string): string {
    return createHash("sha256").update(data, "utf8").digest("hex");
}