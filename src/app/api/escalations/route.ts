import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createEscalationSchema } from '@/lib/validations/escalation';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = createEscalationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const escalation = await prisma.lawyerEscalation.create({
            data: {
                subject: validation.data.subject,
                description: validation.data.description,
                priority: validation.data.priority,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ escalation }, { status: 201 });
    } catch (error) {
        console.error('Escalation creation error:', error);
        return NextResponse.json({ error: 'Failed to create escalation' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: Record<string, unknown> = { userId: session.user.id };
        if (status) where.status = status;

        const [escalations, total] = await Promise.all([
            prisma.lawyerEscalation.findMany({
                where,
                orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.lawyerEscalation.count({ where }),
        ]);

        return NextResponse.json({
            escalations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Escalations fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch escalations' }, { status: 500 });
    }
}
