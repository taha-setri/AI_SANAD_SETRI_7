/**
 * Sanad setri - Zero-Knowledge Client-Side Encryption Engine
 * Uses Web Crypto API (SubtleCrypto) with PBKDF2 + AES-GCM (256-bit)
 * Data is encrypted locally before storage or cloud sync.
 */

export interface EncryptedPayload {
  version: string;
  cipherText: string; // Base64
  iv: string;         // Base64
  salt: string;       // Base64
  timestamp: string;
  platform: string;
}

// Convert BufferSource to Base64
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey from a passphrase and salt
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    rawKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary text or JSON using a passphrase
 */
export async function encryptData(plainText: string, passphrase: string): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const data = enc.encode(plainText);

  // Generate 16-byte random salt and 12-byte IV for AES-GCM
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  return {
    version: 'sanad-aes-gcm-v1',
    cipherText: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
    timestamp: new Date().toISOString(),
    platform: 'Sanad setri Vault',
  };
}

/**
 * Decrypts an EncryptedPayload using the user's passphrase
 */
export async function decryptData(payload: EncryptedPayload, passphrase: string): Promise<string> {
  const salt = base64ToBuffer(payload.salt);
  const iv = base64ToBuffer(payload.iv);
  const cipherBuffer = base64ToBuffer(payload.cipherText);

  const key = await deriveKey(passphrase, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as any,
      },
      key,
      cipherBuffer as any
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('فشل فك التشفير: كلمة المرور غير صحيحة أو البيانات تالفة.');
  }
}

/**
 * Generates a high-entropy 24-character recovery passkey for cross-device sync
 */
export function generateSyncRecoveryKey(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = '';
  const randomValues = window.crypto.getRandomValues(new Uint8Array(20));
  for (let i = 0; i < 20; i++) {
    if (i > 0 && i % 5 === 0) key += '-';
    key += alphabet[randomValues[i] % alphabet.length];
  }
  return `SANAD-${key}`;
}
