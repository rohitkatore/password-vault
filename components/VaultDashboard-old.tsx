'use client';

import { useState, useEffect } from 'react';
import { useEncryption } from '@/contexts/EncryptionContext';
import { signOut } from '@/lib/auth-helpers';
import MasterPasswordPrompt from './MasterPasswordPrompt';

interface VaultDashboardProps {
    user: {
        id: string;
        email: string;
        name?: string | null;
    };
}

export default function VaultDashboard({ user }: VaultDashboardProps) {
    const { hasKey, setupEncryptionKey, clearEncryptionKey, isLocked } = useEncryption();
    const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] = useState(false);

    useEffect(() => {
        // Show master password prompt if no encryption key is set
        if (!hasKey) {
            setShowMasterPasswordPrompt(true);
        }
    }, [hasKey]);

    const handleMasterPasswordSubmit = (masterPassword: string) => {
        const success = setupEncryptionKey(masterPassword, user.email);
        if (success) {
            setShowMasterPasswordPrompt(false);
        } else {
            alert('Failed to setup encryption key. Please try again.');
        }
    };

    const handleSignOut = async () => {
        clearEncryptionKey();
        await signOut();
    };

    const handleLockVault = () => {
        clearEncryptionKey();
        setShowMasterPasswordPrompt(true);
    };

    return (
        <div className="min-h-screen">
            {/* Master Password Prompt */}
            {showMasterPasswordPrompt && (
                <MasterPasswordPrompt
                    email={user.email}
                    onSubmit={handleMasterPasswordSubmit}
                    title="Unlock Your Vault"
                    subtitle="Enter your master password to decrypt your vault data."
                />
            )}

            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                🔐 Password Vault
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Logged in as: {user.email}
                                {hasKey && <span className="ml-2 text-green-600">● Unlocked</span>}
                                {isLocked && <span className="ml-2 text-red-600">● Locked</span>}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {hasKey && (
                                <button
                                    onClick={handleLockVault}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    🔒 Lock Vault
                                </button>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Client-Side Encryption Ready!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Step C is complete. Your vault is protected with client-side encryption.
                        </p>
                        <div className="inline-block bg-blue-50 rounded-lg p-6 text-left">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                ✅ Working Features:
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>✅ User Registration with bcrypt hashing</li>
                                <li>✅ User Login with NextAuth.js</li>
                                <li>✅ Protected Routes (middleware)</li>
                                <li>✅ Master Password System</li>
                                <li>✅ PBKDF2 Key Derivation (100,000 iterations)</li>
                                <li>✅ AES-256 Encryption/Decryption</li>
                                <li>✅ Client-Side Key Management</li>
                                <li>✅ Lock/Unlock Vault Functionality</li>
                            </ul>
                            <p className="mt-4 text-xs text-blue-700">
                                🚀 Ready for Step D: Password Generator Component
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

