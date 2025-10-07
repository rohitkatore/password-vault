import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: 'Email and password are required',
                },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: 'Please provide a valid email address',
                },
                { status: 400 }
            );
        }

        // Password validation
        if (password.length < 6) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: 'Password must be at least 6 characters long',
                },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: 'User with this email already exists',
                },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Return success response (without password)
        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: 'User registered successfully',
                data: {
                    id: newUser._id.toString(),
                    email: newUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: 'Registration failed',
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
