import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import VaultItem from '@/models/VaultItem';

/**
 * GET /api/vault
 * Get all vault items for the authenticated user
 */
export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const items = await VaultItem.find({ userId: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vault items' }, { status: 500 });
    }
}

/**
 * POST /api/vault
 * Create a new vault item (encrypted data from client)
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, username, password, url, notes } = body;

        // Validate required fields
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        await dbConnect();

        // Create new vault item (data is already encrypted on client)
        const vaultItem = await VaultItem.create({
            userId: session.user.id,
            title,
            username: username || '',
            password: password || '',
            url: url || '',
            notes: notes || '',
        });

        return NextResponse.json({ item: vaultItem }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create vault item' }, { status: 500 });
    }
}
