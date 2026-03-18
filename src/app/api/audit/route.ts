import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/audit - Fetch user activity audit log
 * Query params: ?type=document|chat|review|escalation&limit=20&offset=0
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const offset = parseInt(searchParams.get('offset') || '0');

    try {
        const entries: {
            id: string;
            type: string;
            action: string;
            title: string;
            timestamp: Date;
        }[] = [];

        // Gather audit entries from various models
        if (!type || type === 'document') {
            const docs = await prisma.document.findMany({
                where: { userId: session.user.id },
                select: { id: true, title: true, createdAt: true, status: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
            docs.forEach((d) =>
                entries.push({
                    id: d.id,
                    type: 'document',
                    action: d.status === 'DRAFT' ? 'created_draft' : 'created',
                    title: d.title,
                    timestamp: d.createdAt,
                })
            );
        }

        if (!type || type === 'chat') {
            const sessions = await prisma.chatSession.findMany({
                where: { userId: session.user.id },
                select: { id: true, title: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
            sessions.forEach((s) =>
                entries.push({
                    id: s.id,
                    type: 'chat',
                    action: 'started',
                    title: s.title,
                    timestamp: s.createdAt,
                })
            );
        }

        if (!type || type === 'review') {
            const reviews = await prisma.contractReview.findMany({
                where: { userId: session.user.id },
                select: { id: true, contractName: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
            reviews.forEach((r) =>
                entries.push({
                    id: r.id,
                    type: 'review',
                    action: 'completed',
                    title: r.contractName,
                    timestamp: r.createdAt,
                })
            );
        }

        if (!type || type === 'escalation') {
            const escalations = await prisma.escalation.findMany({
                where: { userId: session.user.id },
                select: { id: true, subject: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
            escalations.forEach((e) =>
                entries.push({
                    id: e.id,
                    type: 'escalation',
                    action: 'opened',
                    title: e.subject,
                    timestamp: e.createdAt,
                })
            );
        }

        // Sort by timestamp descending, apply offset/limit
        entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const paginated = entries.slice(offset, offset + limit);

        return NextResponse.json({
            entries: paginated.map((e) => ({
                ...e,
                timestamp: e.timestamp.toISOString(),
            })),
            total: entries.length,
            limit,
            offset,
        });
    } catch (error) {
        console.error('Audit log error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch audit log' },
            { status: 500 }
        );
    }
}
