import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    masterPasswordHash?: string; // Hash to verify master password consistency
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        masterPasswordHash: {
            type: String,
            required: false, // Optional - set on first vault item creation
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation during hot reloading in development
// IMPORTANT: Delete cached model if schema changes to force re-registration
if (mongoose.models && mongoose.models.User) {
    delete mongoose.models.User;
}

const User: Model<IUser> = (mongoose.models?.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
