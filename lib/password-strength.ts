/**
 * Password Strength Analyzer
 * Evaluates password strength based on multiple criteria
 */

export interface PasswordStrength {
  score: number; // 0-4 (very weak to very strong)
  label: string;
  color: string;
  suggestions: string[];
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noCommon: boolean;
  };
}

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
  'letmein', 'dragon', '111111', 'baseball', 'iloveyou', 'trustno1',
  'sunshine', 'master', 'welcome', 'shadow', 'ashley', 'football',
  'jesus', 'michael', 'ninja', 'mustang', 'password1'
];

/**
 * Analyze password strength
 */
export function analyzePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    noCommon: !COMMON_PASSWORDS.includes(password.toLowerCase())
  };

  const suggestions: string[] = [];
  let score = 0;

  // Calculate score based on checks
  if (checks.length) score++;
  if (checks.lowercase && checks.uppercase) score++;
  if (checks.numbers) score++;
  if (checks.symbols) score++;
  if (checks.noCommon) score++;

  // Bonus for extra length
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;

  // Cap score at 4
  score = Math.min(score, 4);

  // Generate suggestions
  if (!checks.length) {
    suggestions.push('Use at least 12 characters');
  }
  if (!checks.lowercase || !checks.uppercase) {
    suggestions.push('Mix uppercase and lowercase letters');
  }
  if (!checks.numbers) {
    suggestions.push('Add numbers');
  }
  if (!checks.symbols) {
    suggestions.push('Include special symbols (!@#$%^&*)');
  }
  if (!checks.noCommon) {
    suggestions.push('Avoid common passwords');
  }

  // Determine label and color
  let label: string;
  let color: string;

  switch (score) {
    case 0:
    case 1:
      label = 'Very Weak';
      color = 'red';
      break;
    case 2:
      label = 'Weak';
      color = 'orange';
      break;
    case 3:
      label = 'Good';
      color = 'yellow';
      break;
    case 4:
      label = 'Strong';
      color = 'green';
      break;
    default:
      label = 'Very Weak';
      color = 'red';
  }

  return {
    score,
    label,
    color,
    suggestions,
    checks
  };
}

/**
 * Check if password has been reused (compare with other passwords)
 */
export function checkPasswordReuse(
  password: string,
  existingPasswords: string[]
): boolean {
  return existingPasswords.includes(password);
}

/**
 * Calculate password entropy (bits)
 */
export function calculateEntropy(password: string): number {
  const charset = new Set(password).size;
  const length = password.length;
  return Math.log2(Math.pow(charset, length));
}

/**
 * Estimate time to crack password
 */
export function estimateCrackTime(password: string): string {
  const entropy = calculateEntropy(password);
  const guessesPerSecond = 1e10; // 10 billion guesses/second (powerful attacker)

  const possibleCombinations = Math.pow(2, entropy);
  const seconds = possibleCombinations / (2 * guessesPerSecond); // Average case

  if (seconds < 1) return 'Instant';
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.ceil(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.ceil(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1000) return `${Math.ceil(seconds / 31536000 / 100)} centuries`;
  return 'Millions of years';
}
