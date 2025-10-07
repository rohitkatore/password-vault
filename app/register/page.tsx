'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    registerUser,
    signIn,
    validateEmail,
    validatePassword,
    getPasswordStrength,
} from '@/lib/auth-helpers';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{
        strength: 'weak' | 'medium' | 'strong' | 'very-strong';
        score: number;
    } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!validateEmail(formData.email)) {
            setError('Please provide a valid email address');
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message || 'Invalid password');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Register the user
            const registerResult = await registerUser(formData.email, formData.password);

            if (!registerResult.success) {
                setError(registerResult.message || 'Registration failed');
                setIsLoading(false);
                return;
            }

            // Auto-login after registration
            const loginResult = await signIn(formData.email, formData.password);

            if (loginResult.success) {
                router.push(loginResult.data?.url || '/vault');
            } else {
                // Registration succeeded but login failed - redirect to login page
                router.push('/login?message=Registration successful. Please sign in.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Update password strength indicator
        if (name === 'password') {
            if (value.length > 0) {
                setPasswordStrength(getPasswordStrength(value));
            } else {
                setPasswordStrength(null);
            }
        }
    };

    const getStrengthColor = () => {
        if (!passwordStrength) return '';
        switch (passwordStrength.strength) {
            case 'weak':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'strong':
                return 'bg-green-500';
            case 'very-strong':
                return 'bg-emerald-500';
        }
    };

    const getStrengthWidth = () => {
        if (!passwordStrength) return '0%';
        return `${(passwordStrength.score / 5) * 100}%`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-800">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password (min 6 characters)"
                                disabled={isLoading}
                            />
                            {passwordStrength && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-600">
                                            Password strength:
                                        </span>
                                        <span
                                            className={`font-medium ${passwordStrength.strength === 'weak'
                                                    ? 'text-red-600'
                                                    : passwordStrength.strength === 'medium'
                                                        ? 'text-yellow-600'
                                                        : passwordStrength.strength === 'strong'
                                                            ? 'text-green-600'
                                                            : 'text-emerald-600'
                                                }`}
                                        >
                                            {passwordStrength.strength}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                            style={{ width: getStrengthWidth() }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm password"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-xs text-gray-500">
                            🔒 Your data is encrypted with client-side encryption
                        </p>
                        <p className="text-xs text-gray-500">
                            We never have access to your unencrypted vault data
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
