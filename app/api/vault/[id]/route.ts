import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import VaultItem from '@/models/VaultItem';

/**
 * GET /api/vault/:id
 * Get a specific vault item
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const item = await VaultItem.findOne({
            _id: params.id,
            userId: session.user.id,
        });

        if (!item) {
            return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
        }

        return NextResponse.json({ item }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vault item' }, { status: 500 });
    }
}

/**
 * PUT /api/vault/:id
 * Update a vault item (encrypted data from client)
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Find and update (data is already encrypted on client)
        const item = await VaultItem.findOneAndUpdate(
            { _id: params.id, userId: session.user.id },
            {
                title,
                username: username || '',
                password: password || '',
                url: url || '',
                notes: notes || '',
            },
            { new: true }
        );

        if (!item) {
            return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
        }

        return NextResponse.json({ item }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update vault item' }, { status: 500 });
    }
}

/**
 * DELETE /api/vault/:id
 * Delete a vault item
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const item = await VaultItem.findOneAndDelete({
            _id: params.id,
            userId: session.user.id,
        });

        if (!item) {
            return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Vault item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete vault item' }, { status: 500 });
    }
}
