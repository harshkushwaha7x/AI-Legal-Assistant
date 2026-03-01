import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const [
            documentCount,
            reviewCount,
            chatSessionCount,
            escalationCount,
            recentDocuments,
            recentReviews,
            recentEscalations,
        ] = await Promise.all([
            prisma.document.count({ where: { userId } }),
            prisma.contractReview.count({ where: { userId } }),
            prisma.chatSession.count({ where: { userId } }),
            prisma.lawyerEscalation.count({ where: { userId } }),
            prisma.document.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    type: true,
                    status: true,
                    createdAt: true,
                },
            }),
            prisma.contractReview.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    fileName: true,
                    status: true,
                    riskScore: true,
                    riskLevel: true,
                    createdAt: true,
                },
            }),
            prisma.lawyerEscalation.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    subject: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                },
            }),
        ]);

        return NextResponse.json({
            stats: {
                documents: documentCount,
                reviews: reviewCount,
                chatSessions: chatSessionCount,
                escalations: escalationCount,
            },
            recent: {
                documents: recentDocuments,
                reviews: recentReviews,
                escalations: recentEscalations,
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
