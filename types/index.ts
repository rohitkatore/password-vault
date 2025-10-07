import { IUser } from '@/models/User';
import { IVaultItem } from '@/models/VaultItem';

// User Types
export type UserType = IUser;

export interface UserRegistrationData {
    email: string;
    password: string;
}

export interface UserLoginData {
    email: string;
    password: string;
}

// Vault Item Types
export type VaultItemType = IVaultItem;

export interface VaultItemCreateData {
    title: string; // Will be encrypted on client-side
    username?: string; // Will be encrypted on client-side
    password?: string; // Will be encrypted on client-side
    url?: string; // Will be encrypted on client-side
    notes?: string; // Will be encrypted on client-side
}

export interface VaultItemUpdateData extends VaultItemCreateData {
    _id: string;
}

// Decrypted Vault Item (for client-side use only)
export interface DecryptedVaultItem {
    _id: string;
    userId: string;
    title: string;
    username?: string;
    password?: string;
    url?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
}
