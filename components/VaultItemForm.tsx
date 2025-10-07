'use client';

import { useState } from 'react';
import { encryptVaultItem } from '@/lib/crypto';
import { useEncryption } from '@/contexts/EncryptionContext';
import PasswordGenerator from './PasswordGenerator';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface VaultItemFormProps {
    onSubmit: (encryptedData: any) => Promise<void>;
    onCancel: () => void;
    initialData?: {
        title: string;
        username: string;
        password: string;
        url: string;
        notes: string;
    };
    isEdit?: boolean;
}

export default function VaultItemForm({
    onSubmit,
    onCancel,
    initialData,
    isEdit = false,
}: VaultItemFormProps) {
    const { getEncryptionKey } = useEncryption();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGenerator, setShowGenerator] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        username: initialData?.username || '',
        password: initialData?.password || '',
        url: initialData?.url || '',
        notes: initialData?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleGeneratedPassword = (password: string) => {
        setFormData((prev) => ({
            ...prev,
            password,
        }));
        setShowGenerator(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            setLoading(true);

            // Get encryption key
            const key = getEncryptionKey();
            if (!key) {
                setError('Encryption key not available. Please unlock vault first.');
                return;
            }

            // Encrypt data
            const encryptedData = encryptVaultItem(formData, key);

            // Submit
            await onSubmit(encryptedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save vault item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEdit ? '✏️ Edit Vault Item' : '➕ Add New Vault Item'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">⚠️ {error}</p>
                </div>
            )}

            {showGenerator ? (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Generate Password
                        </h3>
                        <button
                            onClick={() => setShowGenerator(false)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ✕ Close
                        </button>
                    </div>
                    <PasswordGenerator onSaveToVault={handleGeneratedPassword} />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Gmail Account"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username / Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="e.g., user@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowGenerator(true)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                            🎲 Generate Strong Password
                        </button>
                        {formData.password && (
                            <PasswordStrengthMeter password={formData.password} showDetails={true} />
                        )}
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="e.g., https://example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional notes (optional)"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-300"
                        >
                            {loading ? '⏳ Saving...' : isEdit ? '💾 Update Item' : '➕ Add Item'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                    <span className="text-blue-600 text-xl">🔐</span>
                    <div className="flex-1">
                        <p className="text-sm text-blue-800">
                            <strong>End-to-End Encrypted:</strong> Your data is encrypted on your device before
                            being sent to the server. The server never sees your plaintext passwords.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
