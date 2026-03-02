import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { searchResearchSchema } from '@/lib/validations/research';
import { conductResearch, conductFallbackResearch } from '@/lib/ai/research-engine';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = searchResearchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { query, category, jurisdiction } = validation.data;

        let result;

        if (process.env.OPENAI_API_KEY) {
            try {
                result = await conductResearch(query, category, jurisdiction);
            } catch (aiError) {
                console.warn('OpenAI research failed, using fallback:', aiError);
                result = conductFallbackResearch(query, category, jurisdiction);
            }
        } else {
            result = conductFallbackResearch(query, category, jurisdiction);
        }

        return NextResponse.json({
            query,
            category: category || 'All',
            jurisdiction: jurisdiction || 'Federal (US)',
            answer: result.answer,
            results: result.results,
            source: process.env.OPENAI_API_KEY ? 'ai' : 'fallback',
        });
    } catch (error) {
        console.error('Research error:', error);
        return NextResponse.json({ error: 'Research failed' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (category) where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        const knowledge = await prisma.legalKnowledge.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                title: true,
                category: true,
                content: true,
                source: true,
                jurisdiction: true,
                createdAt: true,
            },
        });

        const categories = await prisma.legalKnowledge.groupBy({
            by: ['category'],
            _count: { category: true },
        });

        return NextResponse.json({ knowledge, categories });
    } catch (error) {
        console.error('Knowledge fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
    }
}
