import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * GET - Check if user has set a master password
 */
export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {

            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found. Please login again.' }, { status: 404 });
        }

        return NextResponse.json({
            hasMasterPassword: !!user.masterPasswordHash,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check master password' },
            { status: 500 }
        );
    }
}

/**
 * POST - Set or verify master password
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {

            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { masterPassword, action } = await request.json();

        if (!masterPassword) {
            return NextResponse.json(
                { error: 'Master password is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found. Please login again.' }, { status: 404 });
        }

        // Action: 'set' - Set master password for first time
        if (action === 'set') {
            if (user.masterPasswordHash) {

                return NextResponse.json(
                    { error: 'Master password already set' },
                    { status: 400 }
                );
            }

            // Hash the master password

            const hash = await bcrypt.hash(masterPassword, 10);

            user.masterPasswordHash = hash;

            const savedUser = await user.save();


            // Verify it was saved by re-querying
            const verifyUser = await User.findById(session.user.id);

            return NextResponse.json({
                success: true,
                message: 'Master password set successfully',
            });
        }

        // Action: 'verify' - Verify master password matches
        if (action === 'verify') {
            if (!user.masterPasswordHash) {
                return NextResponse.json(
                    { error: 'Master password not set yet' },
                    { status: 400 }
                );
            }

            // Verify the master password
            const isValid = await bcrypt.compare(masterPassword, user.masterPasswordHash);

            return NextResponse.json({
                valid: isValid,
                message: isValid
                    ? 'Master password verified'
                    : 'Invalid master password',
            });
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "set" or "verify"' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process master password' },
            { status: 500 }
        );
    }
}

/**
 * PUT - Change master password (requires old password)
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { oldMasterPassword, newMasterPassword } = await request.json();

        if (!oldMasterPassword || !newMasterPassword) {
            return NextResponse.json(
                { error: 'Both old and new master passwords are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.masterPasswordHash) {
            return NextResponse.json(
                { error: 'No master password set' },
                { status: 400 }
            );
        }

        // Verify old password
        const isValidOld = await bcrypt.compare(oldMasterPassword, user.masterPasswordHash);
        if (!isValidOld) {
            return NextResponse.json(
                { error: 'Old master password is incorrect' },
                { status: 401 }
            );
        }

        // Hash and save new password
        const newHash = await bcrypt.hash(newMasterPassword, 10);
        user.masterPasswordHash = newHash;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Master password changed successfully',
            warning: 'All existing vault items are encrypted with the old master password. You will need to re-encrypt them.',
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to change master password' },
            { status: 500 }
        );
    }
}
