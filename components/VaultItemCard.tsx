'use client';

import { useState } from 'react';
import { decryptVaultItem } from '@/lib/crypto';
import { useEncryption } from '@/contexts/EncryptionContext';
import { DecryptedVaultItem } from '@/types';

interface VaultItemCardProps {
    item: DecryptedVaultItem;
    onEdit: (item: DecryptedVaultItem) => void;
    onDelete: (id: string) => void;
}

export default function VaultItemCard({ item, onEdit, onDelete }: VaultItemCardProps) {
    const { getEncryptionKey } = useEncryption();
    const [decrypted, setDecrypted] = useState<DecryptedVaultItem | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDecrypt = async () => {
        try {
            setLoading(true);
            setError(null);

            const key = getEncryptionKey();
            if (!key) {
                setError('Encryption key not available');
                return;
            }

            const decryptedData = decryptVaultItem(item, key);
            setDecrypted(decryptedData);
        } catch {
            setError('Failed to decrypt. Wrong master password?');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(field);
            setTimeout(() => setCopied(null), 2000);
        } catch {
        }
    };

    const handleEdit = () => {
        if (decrypted) {
            onEdit({ ...item, ...decrypted });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            onDelete(item._id);
        }
    };

    if (!decrypted) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Encrypted Item
                            </h3>
                            <p className="text-sm text-gray-500">
                                Click to decrypt and view
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDecrypt}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                        {loading ? '⏳ Decrypting...' : '🔓 Decrypt'}
                    </button>
                </div>
                {error && (
                    <p className="mt-3 text-sm text-red-600">⚠️ {error}</p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {decrypted.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Updated {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                {/* Username */}
                {decrypted.username && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Username / Email
                        </label>
                        <div className="flex items-center space-x-2">
                            <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm text-gray-900 border border-gray-200">
                                {decrypted.username}
                            </code>
                            <button
                                onClick={() => handleCopy(decrypted.username || '', 'username')}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                            >
                                {copied === 'username' ? '✓' : '📋'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Password */}
                {decrypted.password && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Password
                        </label>
                        <div className="flex items-center space-x-2">
                            <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm text-gray-900 border border-gray-200 font-mono">
                                {showPassword ? decrypted.password : '••••••••••••'}
                            </code>
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                            >
                                {showPassword ? '👁️' : '👁️'}
                            </button>
                            <button
                                onClick={() => handleCopy(decrypted.password || '', 'password')}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                            >
                                {copied === 'password' ? '✓' : '📋'}
                            </button>
                        </div>
                    </div>
                )}

                {/* URL */}
                {decrypted.url && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Website URL
                        </label>
                        <div className="flex items-center space-x-2">
                            <a
                                href={decrypted.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm text-blue-600 hover:text-blue-700 border border-gray-200 truncate"
                            >
                                {decrypted.url}
                            </a>
                            <button
                                onClick={() => handleCopy(decrypted.url || '', 'url')}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                            >
                                {copied === 'url' ? '✓' : '📋'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {decrypted.notes && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Notes
                        </label>
                        <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-900 border border-gray-200 whitespace-pre-wrap">
                            {decrypted.notes}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Created {new Date(item.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
