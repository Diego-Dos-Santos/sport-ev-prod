import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
        environment: process.env.NODE_ENV,
        baseUrl,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        expectedRedirectUri: `${baseUrl}/api/auth/callback/google`,
        googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        timestamp: new Date().toISOString()
    });
} 