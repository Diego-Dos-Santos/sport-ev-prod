import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from '@/lib/prismadb';
import bcrypt from 'bcrypt';

// Get the base URL for the current environment
const getBaseUrl = () => {
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3005';
};

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prismadb),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email y contraseña requeridos');
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error('El correo electrónico no existe');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error('Contraseña incorrecta');
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: '/start',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                // Don't store image in token to avoid cookie size issues
            }
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
                // Don't store image in token to avoid cookie size issues
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                // Don't set image from token to avoid cookie size issues
            }
            return session;
        },
    },
    // Add proper error handling
    logger: {
        error(code, ...message) {
            console.error(`[NextAuth] Error ${code}:`, ...message);
        },
        warn(code, ...message) {
            console.warn(`[NextAuth] Warning ${code}:`, ...message);
        },
        debug(code, ...message) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[NextAuth] Debug ${code}:`, ...message);
            }
        },
    },
    // Add better error handling for client fetch errors
    events: {
        async signIn(params) {
            console.log('[NextAuth] User signed in:', params.user.email);
        },
        async signOut() {
            console.log('[NextAuth] User signed out');
        },
    },
}; 