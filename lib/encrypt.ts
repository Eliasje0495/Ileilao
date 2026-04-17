import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM
const TAG_LENGTH = 16; // 128-bit auth tag
const ENCODING = "hex";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  // Accept either a 64-char hex string (32 bytes) or a raw 32-byte string
  if (key.length === 64) {
    return Buffer.from(key, "hex");
  }
  const buf = Buffer.from(key, "utf8");
  if (buf.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be a 32-byte string or a 64-char hex string"
    );
  }
  return buf;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: iv:authTag:ciphertext (all hex-encoded).
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString(ENCODING),
    authTag.toString(ENCODING),
    encrypted.toString(ENCODING),
  ].join(":");
}

/**
 * Decrypts a string produced by `encrypt`.
 * Expects the format: iv:authTag:ciphertext (all hex-encoded).
 */
export function decrypt(encryptedData: string): string {
  const key = getKey();
  const [ivHex, authTagHex, ciphertextHex] = encryptedData.split(":");
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Invalid encrypted data format");
  }
  const iv = Buffer.from(ivHex, ENCODING);
  const authTag = Buffer.from(authTagHex, ENCODING);
  const ciphertext = Buffer.from(ciphertextHex, ENCODING);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/**
 * Safely decrypts a value that may be null/undefined.
 * Returns null if the input is null/undefined.
 */
export function safeDecrypt(value: string | null | undefined): string | null {
  if (value == null) return null;
  try {
    return decrypt(value);
  } catch {
    return null;
  }
}

/**
 * Hashes a string with SHA-256 and returns the hex digest.
 */
export function sha256(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}
