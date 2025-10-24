import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

/**
 * Hash a plaintext password using scrypt.
 * Returns a string containing the salt and derived key separated by a colon.
 */
export function hashPassword(password) {
    if (typeof password !== "string" || password.length === 0) {
        throw new Error("Password must be a non-empty string");
    }

    const salt = randomBytes(16).toString("hex");
    const derivedKey = scryptSync(password, salt, KEY_LENGTH);

    return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Validate a plaintext password against the stored hash.
 */
export function verifyPassword(password, storedValue) {
    if (typeof storedValue !== "string" || !storedValue.includes(":")) {
        return false;
    }

    const [salt, key] = storedValue.split(":");

    if (!salt || !key) {
        return false;
    }

    const derivedKey = scryptSync(password, salt, KEY_LENGTH);
    const storedKey = Buffer.from(key, "hex");

    if (storedKey.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
}
