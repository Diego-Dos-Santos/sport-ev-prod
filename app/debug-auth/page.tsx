'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
    const { data: session, status } = useSession();
    const [envInfo, setEnvInfo] = useState<any>({});

    useEffect(() => {
        // Get environment variables that are available on client side
        setEnvInfo({
            NODE_ENV: process.env.NODE_ENV,
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
            // Note: Server-side env vars won't be available here
        });
    }, []);

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth Debug Info</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Environment Variables (Client-side)</h2>
                    <div className="bg-gray-50 p-4 rounded">
                        <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(envInfo, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Session Status</h2>
                    <div className="space-y-2">
                        <p><strong>Status:</strong> {status}</p>
                        <p><strong>User Email:</strong> {session?.user?.email || 'Not logged in'}</p>
                        <p><strong>User Name:</strong> {session?.user?.name || 'Not logged in'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current URL Info</h2>
                    <div className="space-y-2">
                        <p><strong>Origin:</strong> {currentOrigin}</p>
                        <p><strong>Path:</strong> {currentPath}</p>
                        <p><strong>Full URL:</strong> {fullUrl}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Expected Google OAuth Redirect URIs</h2>
                    <div className="space-y-2">
                        <p><strong>Development:</strong> http://localhost:3005/api/auth/callback/google</p>
                        <p><strong>Production:</strong> https://sport-ev-prod.vercel.app/api/auth/callback/google</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">NextAuth Configuration Check</h2>
                    <div className="space-y-2">
                        <p><strong>NEXTAUTH_URL (should be set in production):</strong> Check Vercel environment variables</p>
                        <p><strong>NEXTAUTH_SECRET:</strong> Should be set in Vercel environment variables</p>
                        <p><strong>GOOGLE_CLIENT_ID:</strong> Should be set in Vercel environment variables</p>
                        <p><strong>GOOGLE_CLIENT_SECRET:</strong> Should be set in Vercel environment variables</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-red-600">1. Check Vercel Environment Variables</h3>
                            <p className="text-sm text-gray-600">Go to your Vercel dashboard → Project Settings → Environment Variables</p>
                            <p className="text-sm text-gray-600">Make sure these are set:</p>
                            <ul className="text-sm text-gray-600 ml-4 list-disc">
                                <li>NEXTAUTH_URL = https://sport-ev-prod.vercel.app</li>
                                <li>NEXTAUTH_SECRET = (your secret)</li>
                                <li>GOOGLE_CLIENT_ID = (your Google client ID)</li>
                                <li>GOOGLE_CLIENT_SECRET = (your Google client secret)</li>
                                <li>NEXT_PUBLIC_BASE_URL = https://sport-ev-prod.vercel.app</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-red-600">2. Verify Google Cloud Console</h3>
                            <p className="text-sm text-gray-600">Make sure this exact URI is in your Google Cloud Console:</p>
                            <p className="text-sm bg-yellow-100 p-2 rounded font-mono">https://sport-ev-prod.vercel.app/api/auth/callback/google</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-red-600">3. Clear Browser Cache</h3>
                            <p className="text-sm text-gray-600">Clear your browser cache and cookies for the domain</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-red-600">4. Redeploy on Vercel</h3>
                            <p className="text-sm text-gray-600">After updating environment variables, redeploy your app</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Most Common Issue:</h3>
                    <p className="text-yellow-700 text-sm">
                        The <strong>NEXTAUTH_URL</strong> environment variable is missing or incorrect in Vercel. 
                        This is required for NextAuth to generate the correct redirect URIs in production.
                    </p>
                </div>
            </div>
        </div>
    );
} 