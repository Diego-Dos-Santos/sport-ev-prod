import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        await resend.emails.send({
            from: 'Sport.ev <onboarding@resend.dev>',
            to: email,
            subject: '¡Bienvenido a Sport.ev!',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; text-align: center;">
                    <h2 style="color: #e11d48; margin-bottom: 20px;">¡Bienvenido a Sport.ev!</h2>
                    <p style="color: #4b5563; margin-bottom: 24px;">Hola ${name},</p>
                    <p style="color: #4b5563; margin-bottom: 24px;">
                        Gracias por registrarte en Sport.ev. Estamos emocionados de tenerte como parte de nuestra comunidad.
                    </p>
                    <p style="color: #4b5563; margin-bottom: 24px;">
                        Ahora puedes acceder a todos nuestros eventos deportivos y comprar tus entradas favoritas.
                    </p>
                    <a 
                        href="${process.env.NEXT_PUBLIC_BASE_URL}/events" 
                        style="display: inline-block; background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-bottom: 24px;"
                    >
                        Explorar Eventos
                    </a>
                    <p style="color: #6b7280; font-size: 14px;">
                        Si tienes alguna pregunta, no dudes en contactarnos.
                    </p>
                </div>
            `
        });

        return NextResponse.json({ message: 'Welcome email sent successfully' });
    } catch (error) {
        console.error('Welcome email error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
} 