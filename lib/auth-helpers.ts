import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { ApiResponse } from '@/types';

/**
 * Register a new user
 */
export async function registerUser(
    email: string,
    password: string
): Promise<ApiResponse> {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Registration failed',
                error: data.error,
            };
        }

        return data;
    } catch (error: any) {
        return {
            success: false,
            message: 'Network error',
            error: error.message,
        };
    }
}

/**
 * Sign in a user
 */
export async function signIn(
    email: string,
    password: string,
    callbackUrl: string = '/vault'
): Promise<ApiResponse> {
    try {
        const result = await nextAuthSignIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        if (result?.error) {
            return {
                success: false,
                message: result.error,
            };
        }

        if (result?.ok) {
            return {
                success: true,
                message: 'Login successful',
                data: { url: result.url || callbackUrl },
            };
        }

        return {
            success: false,
            message: 'Login failed',
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Authentication error',
            error: error.message,
        };
    }
}

/**
 * Sign out the current user
 */
export async function signOut(callbackUrl: string = '/login'): Promise<void> {
    await nextAuthSignOut({ callbackUrl, redirect: true });
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
    isValid: boolean;
    message?: string;
} {
    if (password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long',
        };
    }

    if (password.length < 8) {
        return {
            isValid: true,
            message: 'Consider using a longer password for better security',
        };
    }

    return { isValid: true };
}

/**
 * Get password strength level
 */
export function getPasswordStrength(password: string): {
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
} {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: 'weak', score };
    if (score === 2) return { strength: 'medium', score };
    if (score === 3 || score === 4) return { strength: 'strong', score };
    return { strength: 'very-strong', score };
}
