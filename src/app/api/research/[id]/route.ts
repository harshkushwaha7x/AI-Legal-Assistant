import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const item = await prisma.legalKnowledge.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ item });
    } catch (error) {
        console.error('Knowledge item fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.legalKnowledge.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Knowledge item delete error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
