import CryptoJS from 'crypto-js';

/**
 * Client-Side Encryption Utilities
 * 
 * CRITICAL SECURITY NOTES:
 * - Master password is NEVER sent to the server
 * - Encryption key is derived on the client only
 * - All vault data is encrypted before API calls
 * - Server only stores ciphertext
 */

// Configuration
const PBKDF2_ITERATIONS = 100000; // Higher = more secure, but slower
const KEY_SIZE = 256 / 32; // 256-bit key

/**
 * Derive an encryption key from the master password using PBKDF2
 * @param masterPassword - User's master password (never stored)
 * @param email - User's email (used as salt)
 * @returns Derived encryption key
 */
export function deriveKey(masterPassword: string, email: string): string {
    // Use email as salt (unique per user)
    const salt = CryptoJS.SHA256(email).toString();

    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(masterPassword, salt, {
        keySize: KEY_SIZE,
        iterations: PBKDF2_ITERATIONS,
    });

    return key.toString();
}

/**
 * Encrypt a string using AES-256
 * @param plaintext - Data to encrypt
 * @param key - Encryption key (derived from master password)
 * @returns Encrypted ciphertext
 */
export function encrypt(plaintext: string, key: string): string {
    if (!plaintext) return '';

    try {
        const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
        return ciphertext;
    } catch (error) {
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt a string using AES-256
 * @param ciphertext - Encrypted data
 * @param key - Encryption key (derived from master password)
 * @returns Decrypted plaintext
 */
export function decrypt(ciphertext: string, key: string): string {
    if (!ciphertext) return '';

    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);

        if (!plaintext) {
            throw new Error('Decryption failed - invalid key or corrupted data');
        }

        return plaintext;
    } catch (error) {
        throw new Error('Failed to decrypt data - wrong master password?');
    }
}

/**
 * Encrypt multiple fields of a vault item
 * @param item - Vault item with plaintext fields
 * @param key - Encryption key
 * @returns Vault item with encrypted fields
 */
export function encryptVaultItem(
    item: {
        title: string;
        username?: string;
        password?: string;
        url?: string;
        notes?: string;
    },
    key: string
): {
    title: string;
    username?: string;
    password?: string;
    url?: string;
    notes?: string;
} {
    return {
        title: encrypt(item.title, key),
        username: item.username ? encrypt(item.username, key) : '',
        password: item.password ? encrypt(item.password, key) : '',
        url: item.url ? encrypt(item.url, key) : '',
        notes: item.notes ? encrypt(item.notes, key) : '',
    };
}

/**
 * Decrypt multiple fields of a vault item
 * @param item - Vault item with encrypted fields
 * @param key - Encryption key
 * @returns Vault item with plaintext fields
 */
export function decryptVaultItem(
    item: {
        _id: string;
        userId: string;
        title: string;
        username?: string;
        password?: string;
        url?: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
    },
    key: string
): {
    _id: string;
    userId: string;
    title: string;
    username?: string;
    password?: string;
    url?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
} {
    try {
        return {
            _id: item._id,
            userId: item.userId,
            title: decrypt(item.title, key),
            username: item.username ? decrypt(item.username, key) : '',
            password: item.password ? decrypt(item.password, key) : '',
            url: item.url ? decrypt(item.url, key) : '',
            notes: item.notes ? decrypt(item.notes, key) : '',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    } catch (error) {
        throw new Error('Decryption failed - wrong master password?');
    }
}

/**
 * Validate master password strength
 * @param password - Master password to validate
 * @returns Validation result
 */
export function validateMasterPassword(password: string): {
    isValid: boolean;
    message?: string;
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
} {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Master password must be at least 8 characters',
            strength: 'weak',
        };
    }

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score <= 1) strength = 'weak';
    else if (score === 2) strength = 'medium';
    else if (score === 3 || score === 4) strength = 'strong';
    else strength = 'very-strong';

    if (strength === 'weak') {
        return {
            isValid: true,
            message: 'Consider using a stronger master password',
            strength: 'weak',
        };
    }

    return {
        isValid: true,
        strength,
    };
}

/**
 * Generate a secure random salt
 * @returns Random salt string
 */
export function generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

/**
 * Hash a string using SHA-256
 * @param data - Data to hash
 * @returns Hash string
 */
export function hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
}

/**
 * Test if encryption/decryption is working correctly
 * @returns Test result
 */
export function testEncryption(): boolean {
    try {
        const testData = 'Test encryption string';
        const testKey = deriveKey('testPassword123', 'test@example.com');
        const encrypted = encrypt(testData, testKey);
        const decrypted = decrypt(encrypted, testKey);
        return decrypted === testData;
    } catch (error) {
        return false;
    }
}
