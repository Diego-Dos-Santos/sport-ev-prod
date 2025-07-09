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
        if (!email || !name || !password) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            let response;
            
            if (profileImage) {
                // Create FormData to handle file upload
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
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
                    body: JSON.stringify({ name, email, password })
                });
            }

            console.log('Registration response status:', response.status);
            
            if (response.ok) {
                const userData = await response.json();
                console.log('Registration successful:', userData);
                
                // Send welcome email
                try {
                    await fetch('/api/welcome-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, name })
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
                    setError('Registration successful but login failed. Please try logging in manually.');
                } else {
                    router.push('/');
                }
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                setError(errorData.error || `Registration failed with status ${response.status}`);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
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
                        className="h-[6rem]"
                    />
                </nav>
                <div className="loginPage flex justify-center pb-[20rem]">
                    <div className="loginBox bg-gray-400 bg-opacity-20 px-16 py-16 self-center lg:w-2/5 lg:max-w-md rounded-md sm:m-4 border border-solid border-red-500 neon-effect">
                        <h3 className="loginTitle text-red-500 mb-8 font-semibold text-center">Crear Cuenta</h3>
                        
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