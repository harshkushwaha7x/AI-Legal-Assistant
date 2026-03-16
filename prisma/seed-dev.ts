/**
 * Database seed script for development
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-dev.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('Starting development seed...');

    // Create demo user
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@legalai.app' },
        update: {},
        create: {
            email: 'demo@legalai.app',
            name: 'Demo User',
            image: null,
        },
    });
    console.log('Created demo user:', demoUser.email);

    // Create sample documents
    const sampleDocuments = [
        {
            title: 'Sample Non-Disclosure Agreement',
            content: 'This Non-Disclosure Agreement ("Agreement") is entered into by and between the parties identified below. The purpose of this Agreement is to protect confidential information shared between the parties during the course of their business relationship.\n\nSection 1: Definition of Confidential Information\nConfidential Information refers to any data or information that is proprietary to the Disclosing Party and not generally known to the public.\n\nSection 2: Obligations of Receiving Party\nThe Receiving Party agrees to hold and maintain the Confidential Information in strict confidence for the sole and exclusive benefit of the Disclosing Party.',
            type: 'NDA',
            status: 'FINAL',
        },
        {
            title: 'Employment Contract Draft',
            content: 'This Employment Agreement is made between [Employer] and [Employee]. The Employee agrees to perform the duties and responsibilities as outlined in the attached job description.\n\nCompensation: The Employee shall receive an annual salary of $[Amount], payable in accordance with the Employer standard payroll schedule.\n\nBenefits: The Employee shall be eligible for benefits as described in the Employee Handbook.',
            type: 'EMPLOYMENT',
            status: 'DRAFT',
        },
        {
            title: 'Service Level Agreement',
            content: 'This Service Level Agreement establishes the terms under which services will be provided. The Provider agrees to maintain a minimum uptime of 99.9% for all covered services.\n\nResponse Times:\n- Critical issues: 1 hour response\n- High priority: 4 hours response\n- Medium priority: 8 hours response\n- Low priority: 24 hours response',
            type: 'CONTRACT',
            status: 'REVIEW',
        },
    ];

    for (const doc of sampleDocuments) {
        await prisma.document.create({
            data: {
                ...doc,
                userId: demoUser.id,
            },
        });
    }
    console.log(`Created ${sampleDocuments.length} sample documents`);

    // Create sample chat session
    const chatSession = await prisma.chatSession.create({
        data: {
            title: 'Tenant Rights Discussion',
            userId: demoUser.id,
            messages: {
                create: [
                    {
                        role: 'user',
                        content: 'What are my rights as a tenant if my landlord refuses to return my security deposit?',
                    },
                    {
                        role: 'assistant',
                        content: 'As a tenant, you have several rights regarding your security deposit. Most jurisdictions require landlords to return the deposit within 14-30 days after move-out, provide an itemized list of any deductions, and only deduct for legitimate damages beyond normal wear and tear. If your landlord refuses, you can typically: 1) Send a formal demand letter, 2) File a complaint with your local tenant rights organization, 3) Pursue the matter in small claims court. Many states allow tenants to recover double or triple the deposit amount if the landlord acted in bad faith.',
                    },
                ],
            },
        },
    });
    console.log('Created sample chat session:', chatSession.title);

    // Create sample contract review
    await prisma.contractReview.create({
        data: {
            contractName: 'Freelance Service Agreement',
            contractText: 'Sample contract text for review purposes...',
            overallRisk: 'MEDIUM',
            riskScore: 55,
            summary: 'This freelance service agreement contains several common clauses but lacks important protections.',
            issues: JSON.stringify([
                {
                    type: 'missing_clause',
                    severity: 'high',
                    title: 'No Intellectual Property Assignment',
                    description: 'The contract does not specify who owns the intellectual property created during the engagement.',
                    suggestion: 'Add a clear IP assignment clause specifying ownership of work products.',
                },
                {
                    type: 'unfavorable_term',
                    severity: 'medium',
                    title: 'Unlimited Liability',
                    description: 'The contractor accepts unlimited liability without any cap on damages.',
                    suggestion: 'Add a liability cap, typically limited to the total fees paid under the agreement.',
                },
            ]),
            recommendations: JSON.stringify([
                'Add intellectual property assignment clause',
                'Include a limitation of liability',
                'Define payment terms more clearly',
                'Add a termination notice period',
            ]),
            userId: demoUser.id,
        },
    });
    console.log('Created sample contract review');

    console.log('Development seed completed successfully.');
}

seed()
    .catch((error) => {
        console.error('Seed error:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
