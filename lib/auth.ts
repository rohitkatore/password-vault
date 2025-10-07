import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Extend the built-in session types
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Please provide email and password');
                    }

                    await connectDB();

                    // Find user by email
                    const user = await User.findOne({
                        email: (credentials.email as string).toLowerCase(),
                    });

                    if (!user) {
                        throw new Error('Invalid email or password');
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error('Invalid email or password');
                    }

                    // Return user object
                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
});
