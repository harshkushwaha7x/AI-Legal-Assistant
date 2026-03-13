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
    const format = searchParams.get('format') || 'json';
    const type = searchParams.get('type') || 'documents';

    try {
        let data: unknown[] = [];

        switch (type) {
            case 'documents':
                data = await prisma.document.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });
                break;
            case 'reviews':
                data = await prisma.contractReview.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        contractName: true,
                        overallRisk: true,
                        createdAt: true,
                    },
                });
                break;
            default:
                return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
        }

        if (format === 'csv') {
            if (data.length === 0) {
                return new NextResponse('No data to export', { status: 200 });
            }

            const headers = Object.keys(data[0] as Record<string, unknown>);
            const csvRows = [
                headers.join(','),
                ...data.map((row) =>
                    headers
                        .map((h) => {
                            const val = (row as Record<string, unknown>)[h];
                            const str = val instanceof Date ? val.toISOString() : String(val ?? '');
                            return `"${str.replace(/"/g, '""')}"`;
                        })
                        .join(',')
                ),
            ];

            return new NextResponse(csvRows.join('\n'), {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${type}-export.csv"`,
                },
            });
        }

        return NextResponse.json({ data, count: data.length });
    } catch (error) {
        console.error('Export API error:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
