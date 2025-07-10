import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prismadb from '@/lib/prismadb';
import bcrypt from 'bcrypt';

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
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.name = user.name;
                // Don't store image in token to avoid cookie size issues
            }
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
                // Don't store image in token to avoid cookie size issues
            }
            return token;
        },
        async session({ session, token }) {
            session.user.name = token.name as string;
            // Don't set image from token to avoid cookie size issues
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
        async signIn({ user, ..._ }) {
            console.log('[NextAuth] User signed in:', user.email);
        },
        async signOut({ ..._ }) {
            console.log('[NextAuth] User signed out');
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 