'use client';

import React, { useState } from 'react';
import Input from '../components/Input';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | React.ReactNode>('');
    
    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate form data
        if (!email || !name || !lastname || !password) {
            setError('Por favor completa todos los campos requeridos');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        // Combine name and apellido for the full name
        const fullName = `${name} ${lastname}`.trim();

        try {
            let response;
            
            if (profileImage) {
                // Create FormData to handle file upload
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', fullName);
                formData.append('password', password);
                formData.append('profileImage', profileImage);

                console.log('Sending FormData registration with image');
                response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // Send JSON for registration without image
                console.log('Sending JSON registration without image');
                response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullName, email, password })
                });
            }

            console.log('Registration response status:', response.status);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('Registration successful:', responseData);
                
                // Send welcome email
                try {
                    await fetch('/api/welcome-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, name: fullName })
                    });
                } catch (emailError) {
                    console.error('Welcome email error:', emailError);
                    // Don't fail registration if email fails
                }

                // After successful registration, log in automatically
                const signInResult = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });
                
                console.log('Sign in result:', signInResult);
                
                if (signInResult?.error) {
                    setError('Registro exitoso pero el inicio de sesión falló. Por favor intenta iniciar sesión manualmente.');
                } else {
                    router.push('/');
                }
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                setError(errorData.error || `El registro falló con estado ${response.status}`);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message || 'Ocurrió un error durante el registro');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            setError('Error al iniciar sesión con Google');
        }
    };

    return (
        <div className="relative h-full w-full">
            <div className="loginContainer text-2xl text-red-500">
                <nav className="loginNav px-12 py-5 sm:px-16 sm:py-5 flex justify-center sm:justify-start">
                    <Image 
                        src="/images/sport.ev-red-letters (1).png" 
                        alt="sportEv-logo" 
                        width={240} 
                        height={96}
                        className="h-[6rem] cursor-pointer"
                        onClick={() => router.push('/')}
                    />
                </nav>
                <div className="loginPage flex justify-center pb-[20rem]">
                    <div className="loginBox bg-gray-400 bg-opacity-20 px-16 py-16 self-center lg:w-2/5 lg:max-w-md rounded-md sm:m-4 border border-solid border-red-500 neon-effect">
                        <h3 className="loginTitle text-red-500 mb-8 font-semibold text-center">Crear Cuenta</h3>
                        
                        {/* Google Sign In Button */}
                        <button 
                            onClick={handleGoogleSignIn}
                            className="w-full bg-white text-gray-800 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-xs md:text-lg">Continuar con Google</span>
                        </button>

                        {/* Divider */}
                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">o</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                        
                        {/* Profile Image Upload */}
                        <div className="mb-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 relative">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Vista previa del perfil"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                        <span className="text-gray-600 text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800">
                                Subir Foto
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        <div className="inputContainer flex flex-col gap-4">
                            <Input 
                                label='Nombre'
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setName(ev.target.value)}
                                id='name'
                                type='text'
                                value={name}
                            />

                            <Input 
                                label='Apellido'
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setLastName(ev.target.value)}
                                id='apellido'
                                type='text'
                                value={lastname}
                            />

                            <Input 
                                label='Correo electrónico'
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)}
                                id='email'
                                type='email'
                                value={email}
                            />
                            <Input 
                                label='Contraseña'
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)}
                                id='password'
                                type='password'
                                value={password}
                            />
                            
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                        </div>

                        <button 
                            onClick={handleRegister}
                            disabled={isLoading}
                            className='loginButton bg-red-700 py-3 text-white rounded-md w-full mt-10 hover:bg-red-800 hover:shadow-neon transition flex items-center justify-center gap-2'
                        >
                            {isLoading ? (
                                <div className="loader"></div>
                            ) : 'Crear Cuenta'}
                        </button>

                        <div className="flex justify-center items-center mt-4">
                            <Link 
                                href="/start" 
                                className="text-sm text-white hover:underline cursor-pointer"
                            >
                                ¿Ya tienes una cuenta? Inicia sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;