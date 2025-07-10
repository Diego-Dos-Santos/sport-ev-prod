'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export const ProfileMenu = () => {
    const { data: session, update } = useSession();

    // Force rerender when session changes
    useEffect(() => {
        if (session?.user) {
            update();
        }
    }, [session?.user, update]);

    // Extract first name from full name
    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0] || fullName;
    };

    // If user is not authenticated, show login/register options
    if (!session?.user) {
        return (
            <div className="flex flex-row items-center gap-4">
                <Link 
                    href="/start" 
                    className="text-white text-sm hover:text-red-500 transition-colors"
                >
                    Iniciar Sesión
                </Link>
                <Link 
                    href="/register" 
                    className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors"
                >
                    Registrarse
                </Link>
            </div>
        );
    }

    // If user is authenticated, show profile menu
    return (
        <Link href="/profile" className="flex flex-row items-center gap-2 cursor-pointer">
            <p className="text-white text-sm">Hola, {session?.user?.name ? getFirstName(session.user.name) : 'Usuario'}</p>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 flex items-center justify-center bg-zinc-800">
                {session?.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt="Perfil"
                        width={40}
                        height={40}
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                ) : (
                    <i className="fa-regular fa-user text-red-500 text-xl"></i>
                )}
            </div>
        </Link>
    );
}; 