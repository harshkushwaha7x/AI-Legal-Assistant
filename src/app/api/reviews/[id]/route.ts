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

        const review = await prisma.contractReview.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ review });
    } catch (error) {
        console.error('Review fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
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

        const existing = await prisma.contractReview.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        await prisma.contractReview.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Review delete error:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
