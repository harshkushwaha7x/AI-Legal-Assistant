import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';

    const now = new Date();
    const start = new Date();

    switch (range) {
        case '7d':
            start.setDate(start.getDate() - 7);
            break;
        case '30d':
            start.setDate(start.getDate() - 30);
            break;
        case '90d':
            start.setDate(start.getDate() - 90);
            break;
        default:
            start.setDate(start.getDate() - 30);
    }

    try {
        const [
            totalDocuments,
            totalReviews,
            totalChats,
            totalEscalations,
            recentDocuments,
            recentReviews,
        ] = await Promise.all([
            prisma.document.count({
                where: { userId: session.user.id },
            }),
            prisma.contractReview.count({
                where: { userId: session.user.id },
            }),
            prisma.chatSession.count({
                where: { userId: session.user.id },
            }),
            prisma.lawyerEscalation.count({
                where: { userId: session.user.id },
            }),
            prisma.document.count({
                where: {
                    userId: session.user.id,
                    createdAt: { gte: start, lte: now },
                },
            }),
            prisma.contractReview.count({
                where: {
                    userId: session.user.id,
                    createdAt: { gte: start, lte: now },
                },
            }),
        ]);

        return NextResponse.json({
            overview: {
                totalDocuments,
                totalReviews,
                totalChats,
                totalEscalations,
            },
            period: {
                range,
                documentsCreated: recentDocuments,
                reviewsCompleted: recentReviews,
            },
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
