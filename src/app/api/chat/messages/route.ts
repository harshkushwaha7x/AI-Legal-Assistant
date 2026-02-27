import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendMessageSchema } from '@/lib/validations/chat';
import {
    buildChatMessages,
    getChatCompletion,
    generateFallbackResponse,
    generateSessionTitle,
} from '@/lib/ai/chat-engine';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = sendMessageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { content, sessionId } = validation.data;

        // Verify session ownership
        const chatSession = await prisma.chatSession.findFirst({
            where: { id: sessionId, userId: session.user.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    select: { role: true, content: true },
                },
            },
        });

        if (!chatSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Save user message
        const userMessage = await prisma.chatMessage.create({
            data: {
                role: 'user',
                content,
                sessionId,
            },
        });

        // Generate AI response
        let aiContent: string;

        if (process.env.OPENAI_API_KEY) {
            try {
                const messages = buildChatMessages(chatSession.messages, content);
                aiContent = await getChatCompletion(messages);
            } catch (aiError) {
                console.warn('OpenAI chat failed, using fallback:', aiError);
                aiContent = generateFallbackResponse(content);
            }
        } else {
            aiContent = generateFallbackResponse(content);
        }

        // Save assistant message
        const assistantMessage = await prisma.chatMessage.create({
            data: {
                role: 'assistant',
                content: aiContent,
                sessionId,
            },
        });

        // Auto-title on first message
        if (chatSession.messages.length === 0) {
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: { title: generateSessionTitle(content) },
            });
        }

        // Touch session updatedAt
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({
            userMessage,
            assistantMessage,
        }, { status: 201 });
    } catch (error) {
        console.error('Chat message error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
