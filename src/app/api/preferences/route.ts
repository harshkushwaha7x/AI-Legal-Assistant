import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/preferences - Get user preferences
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Default preferences (would be stored in DB in production)
    const defaults = {
        theme: 'dark',
        language: 'en',
        emailNotifications: true,
        pushNotifications: false,
        documentAutoSave: true,
        autoSaveInterval: 30,
        defaultDocumentType: 'CUSTOM',
        defaultJurisdiction: 'US',
        chatHistory: true,
        analyticsOptIn: true,
    };

    return NextResponse.json({ preferences: defaults });
}

/**
 * PATCH /api/preferences - Update user preferences
 */
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        const allowedKeys = [
            'theme',
            'language',
            'emailNotifications',
            'pushNotifications',
            'documentAutoSave',
            'autoSaveInterval',
            'defaultDocumentType',
            'defaultJurisdiction',
            'chatHistory',
            'analyticsOptIn',
        ];

        // Filter to only allowed keys
        const updates: Record<string, unknown> = {};
        for (const key of allowedKeys) {
            if (key in body) {
                updates[key] = body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No valid preferences to update' },
                { status: 400 }
            );
        }

        // In production, persist to user preferences table
        return NextResponse.json({
            message: 'Preferences updated',
            preferences: updates,
        });
    } catch (error) {
        console.error('Preferences update error:', error);
        return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
        );
    }
}
