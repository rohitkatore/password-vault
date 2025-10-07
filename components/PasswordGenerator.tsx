'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    generatePassword,
    calculatePasswordStrength,
    getDefaultOptions,
    validateOptions,
    type PasswordOptions,
} from '@/lib/password-generator';

interface PasswordGeneratorProps {
    onSaveToVault?: (password: string) => void;
}

export default function PasswordGenerator({ onSaveToVault }: PasswordGeneratorProps) {
    const [password, setPassword] = useState('');
    const [options, setOptions] = useState<PasswordOptions>(getDefaultOptions());
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

    const handleGenerate = useCallback(() => {
        try {
            const validation = validateOptions(options);
            if (!validation.valid) {
                setError(validation.error || 'Invalid password options');
                return;
            }

            const newPassword = generatePassword(options);
            setPassword(newPassword);
            setStrength(calculatePasswordStrength(newPassword));
            setError(null);
            setCopied(false);
        } catch {
            setError('Failed to generate password. Please try again.');
        }
    }, [options]);

    // Generate initial password on mount
    useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    // Update strength when password changes
    useEffect(() => {
        if (password) {
            setStrength(calculatePasswordStrength(password));
        }
    }, [password]);

    // Clear copied state after 15 seconds
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 15000); // 15 seconds

            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
        } catch {
            setError('Failed to copy to clipboard');
        }
    };

    const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
        setOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const length = parseInt(e.target.value, 10);
        handleOptionChange('length', length);
    };

    const handleSaveToVault = () => {
        if (onSaveToVault && password) {
            onSaveToVault(password);
        }
    };

    // Calculate strength bar width
    const strengthBarWidth = `${(strength.score / 5) * 100}%`;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎲 Password Generator
                </h2>
                <p className="text-gray-600 text-sm">
                    Generate strong, secure passwords with customizable options
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">⚠️ {error}</p>
                </div>
            )}

            {/* Generated Password Display */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Password
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={password}
                        readOnly
                        className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleCopy}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md font-medium transition-colors ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                </div>

                {/* Copied Notice */}
                {copied && (
                    <p className="mt-2 text-sm text-green-600">
                        ✓ Copied! Will auto-clear in 15 seconds for security
                    </p>
                )}

                {/* Password Strength */}
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Password Strength:</span>
                        <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${strength.score <= 1
                                    ? 'bg-red-500'
                                    : strength.score === 2
                                        ? 'bg-orange-500'
                                        : strength.score === 3
                                            ? 'bg-yellow-500'
                                            : strength.score === 4
                                                ? 'bg-lime-500'
                                                : 'bg-green-500'
                                }`}
                            style={{ width: strengthBarWidth }}
                        />
                    </div>
                </div>
            </div>

            {/* Password Length Slider */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Password Length
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                        {options.length} characters
                    </span>
                </div>
                <input
                    type="range"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={handleLengthChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>64</span>
                    <span>128</span>
                </div>
            </div>

            {/* Character Type Options */}
            <div className="mb-6 space-y-3">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                    Character Types
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={options.includeUppercase}
                        onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                        Uppercase Letters (A-Z)
                    </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={options.includeLowercase}
                        onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                        Lowercase Letters (a-z)
                    </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={options.includeNumbers}
                        onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                        Numbers (0-9)
                    </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={options.includeSymbols}
                        onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                        Symbols (!@#$%^&*)
                    </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={options.excludeSimilar}
                        onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                        <span className="text-gray-700 group-hover:text-gray-900">
                            Exclude Similar Characters
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Excludes: 0 (zero), O (letter O), 1 (one), l (letter l), I (letter I)
                        </p>
                    </div>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleGenerate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-300"
                >
                    🎲 Generate New Password
                </button>

                {onSaveToVault && (
                    <button
                        onClick={handleSaveToVault}
                        disabled={!password}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-green-300"
                    >
                        💾 Save to Vault
                    </button>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                    <span className="text-blue-600 text-xl">💡</span>
                    <div className="flex-1">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                            Password Security Tips:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use at least 12 characters for better security</li>
                            <li>• Include multiple character types (uppercase, lowercase, numbers, symbols)</li>
                            <li>• Avoid using personal information or common words</li>
                            <li>• Use unique passwords for each account</li>
                            <li>• Consider enabling &quot;Exclude Similar Characters&quot; to avoid confusion</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
        }

        .slider::-moz-range-thumb:hover {
          background: #2563eb;
        }
      `}</style>
        </div>
    );
}
