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

        const document = await prisma.document.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ document });
    } catch (error) {
        console.error('Document fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
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

        // Verify ownership
        const existing = await prisma.document.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const document = await prisma.document.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.content && { content: body.content }),
                ...(body.status && { status: body.status }),
            },
        });

        return NextResponse.json({ document });
    } catch (error) {
        console.error('Document update error:', error);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
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

        const existing = await prisma.document.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        await prisma.document.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Document delete error:', error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
