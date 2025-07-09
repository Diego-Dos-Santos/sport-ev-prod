import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Image file size must be less than 5MB' },
                { status: 400 }
            );
        }

        let imageUrl;
        
        // Check if Cloudinary is configured
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
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

            imageUrl = (result as any).secure_url;
        } else {
            // In production, require Cloudinary to be configured
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'Image upload service not configured' },
                    { status: 500 }
                );
            }
            
            // Only allow base64 in development
            const base64 = buffer.toString('base64');
            const mimeType = file.type;
            imageUrl = `data:${mimeType};base64,${base64}`;
        }

        return NextResponse.json({ 
            success: true,
            imageUrl: imageUrl
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
} 