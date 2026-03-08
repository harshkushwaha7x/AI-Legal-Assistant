import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.trim();

        if (!query || query.length < 2) {
            return NextResponse.json(
                { error: 'Query must be at least 2 characters' },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // Search across multiple entities in parallel
        const [documents, reviews, escalations, knowledge] = await Promise.all([
            prisma.document.findMany({
                where: {
                    userId,
                    title: { contains: query, mode: 'insensitive' },
                },
                select: { id: true, title: true, type: true, status: true, createdAt: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.contractReview.findMany({
                where: {
                    userId,
                    contractTitle: { contains: query, mode: 'insensitive' },
                },
                select: { id: true, contractTitle: true, status: true, riskLevel: true, createdAt: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.lawyerEscalation.findMany({
                where: {
                    userId,
                    subject: { contains: query, mode: 'insensitive' },
                },
                select: { id: true, subject: true, status: true, priority: true, createdAt: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.legalKnowledge.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' },
                },
                select: { id: true, title: true, category: true, source: true, createdAt: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        const results = {
            documents: documents.map((d) => ({ ...d, _type: 'document' })),
            reviews: reviews.map((r) => ({ ...r, _type: 'review' })),
            escalations: escalations.map((e) => ({ ...e, _type: 'escalation' })),
            knowledge: knowledge.map((k) => ({ ...k, _type: 'knowledge' })),
            total: documents.length + reviews.length + escalations.length + knowledge.length,
        };

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
