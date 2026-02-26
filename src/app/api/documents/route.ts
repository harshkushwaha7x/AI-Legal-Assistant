import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateDocumentSchema } from '@/lib/validations/document';
import { buildDocumentPrompt, generateFallbackDocument } from '@/lib/ai/document-generator';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = generateDocumentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { type, title, fields, additionalInstructions } = validation.data;

        let content: string;

        // Try OpenAI first, fall back to templates
        if (process.env.OPENAI_API_KEY) {
            try {
                const { system, user } = buildDocumentPrompt(
                    type,
                    fields as Record<string, string>,
                    additionalInstructions
                );

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: system },
                            { role: 'user', content: user },
                        ],
                        temperature: 0.3,
                        max_tokens: 4000,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`OpenAI API error: ${response.status}`);
                }

                const data = await response.json();
                content = data.choices[0]?.message?.content || '';
            } catch (aiError) {
                console.warn('OpenAI generation failed, using fallback templates:', aiError);
                content = generateFallbackDocument(type, fields as Record<string, string>);
            }
        } else {
            // No API key — use local templates
            content = generateFallbackDocument(type, fields as Record<string, string>);
        }

        // Save to database
        const document = await prisma.document.create({
            data: {
                title,
                type,
                status: 'DRAFT',
                content,
                metadata: {
                    fields,
                    additionalInstructions,
                    generatedAt: new Date().toISOString(),
                    aiGenerated: !!process.env.OPENAI_API_KEY,
                },
                userId: session.user.id,
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                type: document.type,
                status: document.status,
                createdAt: document.createdAt,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Document generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate document' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: Record<string, unknown> = { userId: session.user.id };
        if (type) where.type = type;
        if (status) where.status = status;

        const [documents, total] = await Promise.all([
            prisma.document.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    type: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.document.count({ where }),
        ]);

        return NextResponse.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Document fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}
