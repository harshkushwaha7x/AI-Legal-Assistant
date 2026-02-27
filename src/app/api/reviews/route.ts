import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { submitReviewSchema } from '@/lib/validations/review';
import {
    analyzeContractWithAI,
    analyzeContractFallback,
} from '@/lib/ai/contract-analyzer';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = submitReviewSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { fileName, contractText } = validation.data;

        // Create review record in ANALYZING status
        const review = await prisma.contractReview.create({
            data: {
                fileName,
                fileUrl: contractText, // store raw text (no cloud storage yet)
                fileSize: new TextEncoder().encode(contractText).length,
                status: 'ANALYZING',
                userId: session.user.id,
            },
        });

        // Run analysis (AI or fallback)
        try {
            let result;

            if (process.env.OPENAI_API_KEY) {
                try {
                    result = await analyzeContractWithAI(contractText);
                } catch (aiError) {
                    console.warn('OpenAI analysis failed, using fallback:', aiError);
                    result = analyzeContractFallback(contractText);
                }
            } else {
                result = analyzeContractFallback(contractText);
            }

            // Update with results
            await prisma.contractReview.update({
                where: { id: review.id },
                data: {
                    status: 'COMPLETED',
                    riskScore: result.riskScore,
                    riskLevel: result.riskLevel,
                    summary: result.summary,
                    findings: result.findings as unknown as Record<string, unknown>[],
                    clauses: result.clauses as unknown as Record<string, unknown>[],
                },
            });

            return NextResponse.json(
                {
                    success: true,
                    review: {
                        id: review.id,
                        fileName: review.fileName,
                        status: 'COMPLETED',
                        riskScore: result.riskScore,
                        riskLevel: result.riskLevel,
                    },
                },
                { status: 201 }
            );
        } catch (analysisError) {
            // Mark as failed
            await prisma.contractReview.update({
                where: { id: review.id },
                data: { status: 'FAILED' },
            });

            console.error('Contract analysis failed:', analysisError);
            return NextResponse.json(
                { error: 'Analysis failed', reviewId: review.id },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Review submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit review' },
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
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: Record<string, unknown> = { userId: session.user.id };
        if (status) where.status = status;

        const [reviews, total] = await Promise.all([
            prisma.contractReview.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    fileName: true,
                    fileSize: true,
                    status: true,
                    riskScore: true,
                    riskLevel: true,
                    summary: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.contractReview.count({ where }),
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Reviews fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
