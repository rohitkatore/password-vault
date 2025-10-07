'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { deriveKey, validateMasterPassword } from '@/lib/crypto';

interface EncryptionContextType {
    hasKey: boolean;
    setupEncryptionKey: (masterPassword: string, email: string) => boolean;
    getEncryptionKey: () => string | null;
    clearEncryptionKey: () => void;
    isLocked: boolean;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
    // Store encryption key in memory only (never persisted)
    const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState<boolean>(true);

    /**
     * Derive and store encryption key from master password
     * CRITICAL: This key only exists in memory during the session
     */
    const setupEncryptionKey = useCallback((masterPassword: string, email: string): boolean => {
        try {
            // Validate master password
            const validation = validateMasterPassword(masterPassword);
            if (!validation.isValid) {
                return false;
            }

            // Derive encryption key
            const key = deriveKey(masterPassword, email);

            // Store in memory
            setEncryptionKey(key);
            setIsLocked(false);

            return true;
        } catch (error) {
            return false;
        }
    }, []);

    /**
     * Get the current encryption key
     */
    const getEncryptionKey = useCallback((): string | null => {
        return encryptionKey;
    }, [encryptionKey]);

    /**
     * Clear encryption key from memory (on logout or timeout)
     */
    const clearEncryptionKey = useCallback(() => {
        setEncryptionKey(null);
        setIsLocked(true);

    }, []);

    const value: EncryptionContextType = {
        hasKey: encryptionKey !== null,
        setupEncryptionKey,
        getEncryptionKey,
        clearEncryptionKey,
        isLocked,
    };

    return (
        <EncryptionContext.Provider value={value}>
            {children}
        </EncryptionContext.Provider>
    );
}

/**
 * Hook to use encryption context
 */
export function useEncryption() {
    const context = useContext(EncryptionContext);
    if (context === undefined) {
        throw new Error('useEncryption must be used within an EncryptionProvider');
    }
    return context;
}
