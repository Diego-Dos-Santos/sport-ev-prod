'use client';

import { useSession } from 'next-auth/react';

export default function DebugAuth() {
    const { data: session, status } = useSession();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>
            
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Environment Variables:</h2>
                    <p>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set'}</p>
                    <p>NODE_ENV: {process.env.NODE_ENV}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Session Status:</h2>
                    <p>Status: {status}</p>
                    <p>User: {session?.user?.email || 'Not logged in'}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Expected Redirect URIs:</h2>
                    <p>For development: http://localhost:3005/api/auth/callback/google</p>
                    <p>For production: https://your-domain.vercel.app/api/auth/callback/google</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Current URL:</h2>
                    <p>{typeof window !== 'undefined' ? window.location.origin : 'Server side'}</p>
                </div>
            </div>
        </div>
    );
} 