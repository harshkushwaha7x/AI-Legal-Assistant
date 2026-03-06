import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const start = Date.now();

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        database: { status: 'connected', latency: `${dbLatency}ms` },
        openai: {
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        },
        auth: {
          status: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
        },
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          database: { status: 'disconnected' },
        },
      },
      { status: 503 }
    );
  }
}
