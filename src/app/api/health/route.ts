import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;
    const mem = process.memoryUsage();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      responseTime: Date.now() - start,
      services: {
        database: { status: 'connected', latency: `${dbLatency}ms` },
        openai: {
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        },
        auth: {
          status: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
        },
      },
      memory: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        rssMB: Math.round(mem.rss / 1024 / 1024),
      },
      uptime: Math.floor(process.uptime()),
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
