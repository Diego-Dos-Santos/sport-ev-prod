'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NavbarItem from './NavbarItem';
import { ProfileMenu } from './ProfileMenu';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled ? 'bg-zinc-900/95 border-b border-red-500 neon-effect-bottom' : 'bg-transparent'
        }`}>
            <div className="px-4 md:px-16 py-6 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <Image 
                        src="/images/sport.ev-red-letters (1).png" 
                        alt="sportEv-logo" 
                        width={140} 
                        height={40}
                        className="logo-home h-[6rem] cursor-pointer"
                        style={{ height: 'auto' }}
                        onClick={() => router.push('/')}
                    />
                    
                    {/* Desktop Menu */}
                    <div className="flex-row ml-8 gap-7 hidden lg:flex">
                        <NavbarItem label="Sobre nosotros" />
                        {session?.user && <NavbarItem label="Mis eventos" />}
                        <NavbarItem label="Próximos eventos" />
                        <NavbarItem label="Cerrar sesión" />
                    </div>
                    <div className="flex items-center ml-8 gap-7">
                        <Link href="/search" className="text-gray-200 hover:text-white cursor-pointer mr-4">
                            <FaSearch className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
                
                {/* Profile Menu */}
                <div className="flex-row gap-7 hidden lg:flex">
                    <ProfileMenu />
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex flex-row items-center gap-2 ml-auto relative">
                    <div onClick={() => setShowMobileMenu(!showMobileMenu)} className="cursor-pointer">
                        <i className="fas fa-bars text-white text-2xl"></i>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {showMobileMenu && (
                    <div className="absolute top-full right-0 w-full bg-black lg:hidden">
                        <MobileMenu />
                    </div>
                )}
            </div>
        </nav>
    );
};

const MobileMenu = () => {
    const { data: session } = useSession();
    
    // Extract first name from full name
    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0] || fullName;
    };
    
    return (
        <div className="bg-zinc-900 bg-opacity-90 w-full p-4">
            {/* Profile Section or Login/Register */}
            <div className="flex justify-center mb-6 border-b border-gray-700 pb-4">
                {session?.user ? (
                    // Show profile for authenticated users
                    <div className="scale-125">
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
                    </div>
                ) : (
                    // Show login/register for non-authenticated users
                    <div className="flex flex-col items-center gap-3">
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
                )}
            </div>

            {/* Navigation Items */}
            <div className="space-y-4">
                <NavbarItem label="Sobre nosotros" />
                {session?.user && <NavbarItem label="Mis eventos" />}
                <NavbarItem label="Próximos eventos" />
                <NavbarItem label="Cerrar sesión" />
            </div>
        </div>
    );
};

export default Navbar;