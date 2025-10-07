/**
 * Password Generator Utility
 * Generates secure random passwords with customizable options
 */

export interface PasswordOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean; // Exclude look-alike characters (0, O, 1, l, I)
}

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?~';

// Similar-looking characters to exclude
const SIMILAR_CHARS = /[0Ol1I]/g;

/**
 * Generate a secure random password
 * @param options - Password generation options
 * @returns Generated password string
 */
export function generatePassword(options: PasswordOptions): string {
    const {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
    } = options;

    // Validate: at least one character type must be selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        throw new Error('At least one character type must be selected');
    }

    // Build character set based on options
    let charset = '';
    const requiredChars: string[] = [];

    if (includeUppercase) {
        const chars = excludeSimilar ? UPPERCASE.replace(SIMILAR_CHARS, '') : UPPERCASE;
        charset += chars;
        requiredChars.push(getRandomChar(chars));
    }

    if (includeLowercase) {
        const chars = excludeSimilar ? LOWERCASE.replace(SIMILAR_CHARS, '') : LOWERCASE;
        charset += chars;
        requiredChars.push(getRandomChar(chars));
    }

    if (includeNumbers) {
        const chars = excludeSimilar ? NUMBERS.replace(SIMILAR_CHARS, '') : NUMBERS;
        charset += chars;
        requiredChars.push(getRandomChar(chars));
    }

    if (includeSymbols) {
        charset += SYMBOLS;
        requiredChars.push(getRandomChar(SYMBOLS));
    }

    // Ensure length is sufficient for required characters
    const minLength = requiredChars.length;
    if (length < minLength) {
        throw new Error(`Password length must be at least ${minLength} with current options`);
    }

    // Generate random password
    let password = '';

    // Use crypto.getRandomValues for secure random generation
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length - requiredChars.length; i++) {
        const randomIndex = randomValues[i] % charset.length;
        password += charset[randomIndex];
    }

    // Add required characters to ensure at least one from each selected type
    password += requiredChars.join('');

    // Shuffle the password to randomize required character positions
    password = shuffleString(password, randomValues.slice(length - requiredChars.length));

    return password;
}

/**
 * Get a random character from a string
 * @param str - String to pick from
 * @returns Random character
 */
function getRandomChar(str: string): string {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const randomIndex = randomValues[0] % str.length;
    return str[randomIndex];
}

/**
 * Shuffle a string using Fisher-Yates algorithm with crypto random values
 * @param str - String to shuffle
 * @param randomValues - Pre-generated random values
 * @returns Shuffled string
 */
function shuffleString(str: string, randomValues: Uint32Array): string {
    const arr = str.split('');

    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomValues[i] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join('');
}

/**
 * Calculate password strength score (0-5)
 * @param password - Password to evaluate
 * @returns Strength score and label
 */
export function calculatePasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;

    // Length scoring
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety scoring
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; // Mixed case
    if (/\d/.test(password)) score++; // Numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // Symbols

    // Determine label and color based on score
    let label = '';
    let color = '';

    if (score <= 1) {
        label = 'Very Weak';
        color = 'text-red-600';
    } else if (score === 2) {
        label = 'Weak';
        color = 'text-orange-600';
    } else if (score === 3) {
        label = 'Medium';
        color = 'text-yellow-600';
    } else if (score === 4) {
        label = 'Strong';
        color = 'text-lime-600';
    } else {
        label = 'Very Strong';
        color = 'text-green-600';
    }

    return { score: Math.min(score, 5), label, color };
}

/**
 * Get default password generation options
 * @returns Default options
 */
export function getDefaultOptions(): PasswordOptions {
    return {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
    };
}

/**
 * Validate password options
 * @param options - Options to validate
 * @returns Validation result
 */
export function validateOptions(options: PasswordOptions): { valid: boolean; error?: string } {
    if (options.length < 4) {
        return { valid: false, error: 'Password length must be at least 4 characters' };
    }

    if (options.length > 128) {
        return { valid: false, error: 'Password length cannot exceed 128 characters' };
    }

    if (
        !options.includeUppercase &&
        !options.includeLowercase &&
        !options.includeNumbers &&
        !options.includeSymbols
    ) {
        return { valid: false, error: 'At least one character type must be selected' };
    }

    return { valid: true };
}

/**
 * Generate multiple passwords at once
 * @param options - Password generation options
 * @param count - Number of passwords to generate
 * @returns Array of generated passwords
 */
export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
    const passwords: string[] = [];

    for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(options));
    }

    return passwords;
}
