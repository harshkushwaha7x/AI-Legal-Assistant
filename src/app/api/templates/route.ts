import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DEFAULT_TEMPLATES = [
    {
        id: 'tpl-nda',
        title: 'Non-Disclosure Agreement',
        category: 'contract',
        description: 'Standard mutual or one-way NDA for protecting confidential information.',
        isDefault: true,
    },
    {
        id: 'tpl-lease',
        title: 'Residential Lease Agreement',
        category: 'real-estate',
        description: 'Standard lease agreement for residential property rentals.',
        isDefault: true,
    },
    {
        id: 'tpl-employment',
        title: 'Employment Contract',
        category: 'employment',
        description: 'At-will or fixed-term employment agreement with standard clauses.',
        isDefault: true,
    },
    {
        id: 'tpl-service',
        title: 'Service Agreement',
        category: 'contract',
        description: 'General service agreement for freelancers and contractors.',
        isDefault: true,
    },
    {
        id: 'tpl-partnership',
        title: 'Partnership Agreement',
        category: 'business',
        description: 'Agreement outlining partnership terms, profit sharing, and responsibilities.',
        isDefault: true,
    },
    {
        id: 'tpl-privacy',
        title: 'Privacy Policy',
        category: 'compliance',
        description: 'GDPR and CCPA compliant privacy policy template for websites and apps.',
        isDefault: true,
    },
    {
        id: 'tpl-terms',
        title: 'Terms of Service',
        category: 'compliance',
        description: 'Terms and conditions template for digital products and services.',
        isDefault: true,
    },
    {
        id: 'tpl-cease',
        title: 'Cease and Desist Letter',
        category: 'dispute',
        description: 'Formal letter demanding cessation of infringing or harmful activity.',
        isDefault: true,
    },
];

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let templates = [...DEFAULT_TEMPLATES];

    // Filter by category if specified
    if (category) {
        templates = templates.filter((t) => t.category === category);
    }

    // Get unique categories for filter UI
    const categories = [...new Set(DEFAULT_TEMPLATES.map((t) => t.category))];

    return NextResponse.json({
        templates,
        categories,
        total: templates.length,
    });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, content, category } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Store as a document with template type
        const template = await prisma.document.create({
            data: {
                title: title.trim(),
                content,
                type: 'TEMPLATE',
                status: 'FINAL',
                userId: session.user.id,
            },
        });

        return NextResponse.json({ template }, { status: 201 });
    } catch (error) {
        console.error('Template creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create template' },
            { status: 500 }
        );
    }
}
