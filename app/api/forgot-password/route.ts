import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        const user = await prismadb.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: 'Reset instructions sent if email exists' });
        }

        const resetToken = uuidv4();
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        const updateData: Prisma.UserUpdateInput = {
            resetToken,
            resetTokenExpiry
        };

        await prismadb.user.update({
            where: { email },
            data: updateData
        });

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: 'Sport.ev <onboarding@resend.dev>',
            to: email,
            subject: 'Restablecer tu contraseña de Sport.ev',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; text-align: center;">
                    <h2 style="color: #e11d48; margin-bottom: 20px;">Restablecer Contraseña</h2>
                    <p style="color: #4b5563; margin-bottom: 24px;">Haz clic en el botón de abajo para restablecer tu contraseña:</p>
                    <a 
                        href="${resetUrl}" 
                        style="display: inline-block; background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-bottom: 24px;"
                    >
                        Restablecer Contraseña
                    </a>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">
                        Si no has solicitado este cambio, puedes ignorar este correo electrónico.
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        Este enlace caducará en 1 hora.
                    </p>
                </div>
            `
        });

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive reset instructions'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
} 