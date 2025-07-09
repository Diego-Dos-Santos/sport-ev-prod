import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prismadb';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let email = '', name = '', password = '', profileImage = null as File | null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            email = formData.get('email') as string;
            name = formData.get('name') as string;
            password = formData.get('password') as string;
            profileImage = formData.get('profileImage') as File | null;
        } else if (contentType.includes('application/json')) {
            const body = await request.json();
            email = body.email;
            name = body.name;
            password = body.password;
            // For JSON requests, profileImage would be base64 string
        } else {
            return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
        }

        if (!email || !name || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already taken' }, { status: 422 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let imageUrl = null;
        if (profileImage) {
            try {
                // Validate file type
                if (!profileImage.type.startsWith('image/')) {
                    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
                }

                // Check if Cloudinary is configured
                if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                    // Convert file to buffer
                    const bytes = await profileImage.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    // Upload to Cloudinary
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                folder: 'sport-ev-profiles',
                                resource_type: 'image',
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        ).end(buffer);
                    });

                    // Set the image URL
                    imageUrl = (result as any).secure_url;
                } else {
                    // Fallback: store as base64 for local development
                    const bytes = await profileImage.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const base64 = buffer.toString('base64');
                    const mimeType = profileImage.type;
                    imageUrl = `data:${mimeType};base64,${base64}`;
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
            }
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: imageUrl,
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                createdAt: true
            }
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 422 });
        }
        
        if (error.code === 'P2021') {
            return NextResponse.json({ error: 'Database table does not exist' }, { status: 500 });
        }
        
        if (error.code === 'P2022') {
            return NextResponse.json({ error: 'Database column does not exist' }, { status: 500 });
        }
        
        return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
    }
} 