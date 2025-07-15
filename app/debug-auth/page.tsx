'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
    const { data: session, status } = useSession();
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.origin);
    }, []);

    return (
        <div className="p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-red-500">Auth Debug Info</h1>
            
            <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Environment Variables:</h2>
                    <p className="mb-2"><span className="font-mono text-yellow-400">NODE_ENV:</span> {process.env.NODE_ENV}</p>
                    <p className="mb-2"><span className="font-mono text-yellow-400">NEXT_PUBLIC_BASE_URL:</span> {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Session Status:</h2>
                    <p className="mb-2"><span className="font-mono text-yellow-400">Status:</span> <span className={status === 'loading' ? 'text-yellow-400' : status === 'authenticated' ? 'text-green-400' : 'text-red-400'}>{status}</span></p>
                    <p className="mb-2"><span className="font-mono text-yellow-400">User Email:</span> {session?.user?.email || 'Not logged in'}</p>
                    <p className="mb-2"><span className="font-mono text-yellow-400">User Name:</span> {session?.user?.name || 'Not logged in'}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Current URL Info:</h2>
                    <p className="mb-2"><span className="font-mono text-yellow-400">Origin:</span> {currentUrl}</p>
                    <p className="mb-2"><span className="font-mono text-yellow-400">Full URL:</span> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Expected Google OAuth Redirect URIs:</h2>
                    <div className="space-y-2">
                        <p className="font-mono text-sm text-green-400">Development: http://localhost:3005/api/auth/callback/google</p>
                        <p className="font-mono text-sm text-green-400">Production: {currentUrl}/api/auth/callback/google</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Troubleshooting Steps:</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Copy the production redirect URI above</li>
                        <li>Go to Google Cloud Console → APIs &amp; Services → Credentials</li>
                        <li>Edit your OAuth 2.0 Client ID</li>
                        <li>Add the production redirect URI to &quot;Authorized redirect URIs&quot;</li>
                        <li>Save and redeploy your app</li>
                    </ol>
                </div>

                <div className="bg-blue-900 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 text-blue-300">Production Redirect URI to Add:</h2>
                    <p className="font-mono text-sm bg-gray-700 p-2 rounded break-all">
                        {currentUrl}/api/auth/callback/google
                    </p>
                </div>
            </div>
        </div>
    );
} 