import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateEscalationSchema } from '@/lib/validations/escalation';

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

        const escalation = await prisma.lawyerEscalation.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!escalation) {
            return NextResponse.json({ error: 'Escalation not found' }, { status: 404 });
        }

        return NextResponse.json({ escalation });
    } catch (error) {
        console.error('Escalation fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch escalation' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const validation = updateEscalationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const existing = await prisma.lawyerEscalation.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Escalation not found' }, { status: 404 });
        }

        const updated = await prisma.lawyerEscalation.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json({ escalation: updated });
    } catch (error) {
        console.error('Escalation update error:', error);
        return NextResponse.json({ error: 'Failed to update escalation' }, { status: 500 });
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

        const existing = await prisma.lawyerEscalation.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Escalation not found' }, { status: 404 });
        }

        await prisma.lawyerEscalation.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Escalation delete error:', error);
        return NextResponse.json({ error: 'Failed to delete escalation' }, { status: 500 });
    }
}
