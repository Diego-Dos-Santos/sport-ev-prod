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
        } else {
            return NextResponse.json(
                { error: 'Tipo de contenido no soportado' }, 
                { status: 415 }
            );
        }

        // Validate required fields
        if (!email || !name || !password) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: email, nombre y contraseña son obligatorios' }, 
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Formato de email inválido' }, 
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' }, 
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'El correo electrónico ya está en uso' }, 
                { status: 422 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let imageUrl = null;
        if (profileImage) {
            try {
                // Validate file type
                if (!profileImage.type.startsWith('image/')) {
                    return NextResponse.json(
                        { error: 'El archivo debe ser una imagen' }, 
                        { status: 400 }
                    );
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (profileImage.size > maxSize) {
                    return NextResponse.json(
                        { error: 'El tamaño del archivo de imagen debe ser menor a 5MB' }, 
                        { status: 400 }
                    );
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
                    // In production, require Cloudinary to be configured
                    if (process.env.NODE_ENV === 'production') {
                        return NextResponse.json(
                            { error: 'Servicio de carga de imágenes no configurado' }, 
                            { status: 500 }
                        );
                    }
                    
                    // Only allow base64 in development
                    const bytes = await profileImage.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const base64 = buffer.toString('base64');
                    const mimeType = profileImage.type;
                    imageUrl = `data:${mimeType};base64,${base64}`;
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json(
                    { error: 'Error al cargar la imagen' }, 
                    { status: 500 }
                );
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

        // Return minimal response to avoid HTTP/2 protocol errors
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image
            }
        }, { 
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'El correo electrónico ya existe' }, 
                { status: 422 }
            );
        }
         
        return NextResponse.json(
            { error: 'Ocurrió un error durante el registro' }, 
            { status: 500 }
        );
    }
} 