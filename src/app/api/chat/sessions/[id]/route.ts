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

        const chatSession = await prisma.chatSession.findFirst({
            where: { id, userId: session.user.id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
            },
        });

        if (!chatSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json({ session: chatSession });
    } catch (error) {
        console.error('Session fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
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

        const existing = await prisma.chatSession.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const updated = await prisma.chatSession.update({
            where: { id },
            data: { ...(body.title && { title: body.title }) },
        });

        return NextResponse.json({ session: updated });
    } catch (error) {
        console.error('Session update error:', error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
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

        const existing = await prisma.chatSession.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        await prisma.chatSession.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Session delete error:', error);
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}
