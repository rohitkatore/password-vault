'use client';

import { useState, FormEvent, useEffect } from 'react';
import { validateMasterPassword } from '@/lib/crypto';

interface MasterPasswordPromptProps {
    email: string;
    onSubmit: (masterPassword: string) => void;
    onCancel?: () => void;
    showCancel?: boolean;
    title?: string;
    subtitle?: string;
}

export default function MasterPasswordPrompt({
    email,
    onSubmit,
    onCancel,
    showCancel = false,
    title = 'Enter Master Password',
    subtitle = 'Your master password is required to encrypt and decrypt your vault data.',
}: MasterPasswordPromptProps) {
    const [masterPassword, setMasterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(false);

    useEffect(() => {
        // Check if user has already set a master password
        checkMasterPassword();
    }, []);

    const checkMasterPassword = async () => {
        try {

            const response = await fetch('/api/master-password');
            const data = await response.json();

            // If user not found, redirect to login
            if (response.status === 404) {
                alert('Your session is invalid. Please login again.');
                window.location.href = '/login';
                return;
            }

            setIsFirstTime(!data.hasMasterPassword);

        } catch {
            alert('Error checking master password. Please refresh and try again.');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsValidating(true);

        // Validate master password
        const validation = validateMasterPassword(masterPassword);

        if (!validation.isValid) {
            setError(validation.message || 'Invalid master password');
            setIsValidating(false);
            return;
        }

        if (validation.strength === 'weak') {
            setError(validation.message || 'Master password is too weak');
            setIsValidating(false);
            return;
        }

        try {
            if (isFirstTime) {
                // First time: Set the master password

                const response = await fetch('/api/master-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        masterPassword,
                        action: 'set'
                    })
                });

                const data = await response.json();

                // If user not found, redirect to login
                if (response.status === 404) {
                    alert('Your session is invalid. Please login again.');
                    window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    setError(data.error || 'Failed to set master password');
                    setIsValidating(false);
                    return;
                }

                // Success - proceed with encryption
                onSubmit(masterPassword);
            } else {
                // Verify the master password matches

                const response = await fetch('/api/master-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        masterPassword,
                        action: 'verify'
                    })
                });

                const data = await response.json();

                if (!data.valid) {
                    setError('Ã¢ÂÅ’ Wrong master password! Please enter the correct master password you set initially.');
                    setIsValidating(false);
                    return;
                }

                // Success - proceed with decryption
                onSubmit(masterPassword);
            }
        } catch {
            setError('Failed to verify master password');
        } finally {
            setIsValidating(false);
        }
    };

    const getStrengthColor = () => {
        if (!masterPassword) return '';
        const validation = validateMasterPassword(masterPassword);

        switch (validation.strength) {
            case 'weak': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'strong': return 'text-green-600';
            case 'very-strong': return 'text-emerald-600';
            default: return '';
        }
    };

    const getStrengthText = () => {
        if (!masterPassword) return '';
        const validation = validateMasterPassword(masterPassword);
        return validation.strength;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">Ã°Å¸â€Â</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                        {isFirstTime ? 'Ã°Å¸Å½â€° Create Your Master Password' : title}
                    </h2>
                    <p className="text-sm text-gray-600 text-center">
                        {isFirstTime
                            ? 'This password will encrypt ALL your vault items. Choose a strong password and remember it!'
                            : subtitle
                        }
                    </p>
                    <div className="mt-3 bg-blue-50 rounded-md p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Account:</strong> {email}
                        </p>
                        {isFirstTime && (
                            <p className="text-xs text-blue-800 mt-2">
                                <strong>Ã¢Å¡Â Ã¯Â¸Â This is your FIRST TIME setting a master password.</strong> Make it strong!
                            </p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 rounded-md">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="masterPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Master Password
                        </label>
                        <div className="relative">
                            <input
                                id="masterPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={masterPassword}
                                onChange={(e) => setMasterPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-900 bg-white"
                                placeholder="Enter your master password"
                                autoFocus
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Ã°Å¸â„¢Ë†' : 'Ã°Å¸â€˜ÂÃ¯Â¸Â'}
                            </button>
                        </div>
                        {masterPassword && (
                            <div className="mt-2">
                                <p className={`text-xs font-medium ${getStrengthColor()}`}>
                                    Strength: {getStrengthText()}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-yellow-50 rounded-md p-3 mb-4">
                        <p className="text-xs text-yellow-800">
                            Ã¢Å¡Â Ã¯Â¸Â <strong>Important:</strong> Your master password is never sent to the server.
                            If you forget it, your vault data cannot be recovered.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {showCancel && onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isValidating || masterPassword.length < 8}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isValidating ? 'Validating...' : 'Unlock Vault'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

