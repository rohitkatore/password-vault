import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IVaultItem extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | IUser;
    title: string; // Encrypted
    username: string; // Encrypted
    password: string; // Encrypted
    url: string; // Encrypted
    notes: string; // Encrypted
    createdAt: Date;
    updatedAt: Date;
}

const VaultItemSchema = new Schema<IVaultItem>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            // This will store encrypted ciphertext
        },
        username: {
            type: String,
            required: false,
            // This will store encrypted ciphertext
        },
        password: {
            type: String,
            required: false,
            // This will store encrypted ciphertext
        },
        url: {
            type: String,
            required: false,
            // This will store encrypted ciphertext
        },
        notes: {
            type: String,
            required: false,
            // This will store encrypted ciphertext
        },
    },
    {
        timestamps: true,
    }
);

// Add compound index for better query performance
VaultItemSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation during hot reloading in development
const VaultItem: Model<IVaultItem> =
    (mongoose.models && mongoose.models.VaultItem) ||
    mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);

export default VaultItem;
