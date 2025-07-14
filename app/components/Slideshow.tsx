'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

interface Event {
    imageDesktop: string;
    imageMobile: string;
    title: string;
    venue: string;
    date: string;
    purchase_link: string;
}

const defaultImage = '/images/default-event.jpg';

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [eventIds, setEventIds] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const isMobile = useIsMobile();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchEventIds = async () => {
            try {
                // Fetch events from multiple categories
                const [futbolResponse, mmaResponse] = await Promise.all([
                    fetch(`/api/events?category=Fútbol`),
                    fetch(`/api/events?category=MMA`)
                ]);
                
                const futbolEvents = futbolResponse.ok ? await futbolResponse.json() : [];
                const mmaEvents = mmaResponse.ok ? await mmaResponse.json() : [];
                
                // Combine all events
                const allEvents = [...futbolEvents, ...mmaEvents];
                
                // Find the specific events we need
                const realMadridEvent = allEvents.find((event: any) => 
                    event.name && event.name.includes('Real Madrid vs Osasuna')
                );
                const barcelonaEvent = allEvents.find((event: any) => 
                    event.name && event.name.includes('Levante UD vs FC Barcelona')
                );
                const wowEvent = allEvents.find((event: any) => 
                    event.name && event.name.includes('WOW 21 - Marbella')
                );
                
                setEventIds({
                    'Real Madrid vs Osasuna': realMadridEvent?.id || '',
                    'Levante UD vs FC Barcelona': barcelonaEvent?.id || '',
                    'WOW 21 - Marbella': wowEvent?.id || ''
                });
                setIsLoading(false);
            } catch (error) {
                console.warn('Error fetching event IDs, using fallback links:', error);
                setHasError(true);
                setIsLoading(false);
            }
        };
        fetchEventIds();
    }, []);

    // Update the events array to use the fetched IDs or fallback links
    const events: Event[] = [
        {
            imageDesktop: '/images/slide-banners/RealMadridOsasuna-sliderBannerDesktop.png',
            imageMobile: '/images/slide-banners/RealMadridOsasuna-sliderBannerMobile.png',
            title: 'Real Madrid vs Osasuna',
            venue: 'Estadio Santiago Bernabéu',
            date: '19 de Agosto de 2025 - 21:00',
            purchase_link: isLoading ? '#' : (hasError || !eventIds['Real Madrid vs Osasuna'] ? '#' : `/event/${eventIds['Real Madrid vs Osasuna']}?category=Fútbol`)
        },
        {
            imageDesktop: '/images/slide-banners/LevanteBarcelona-sliderBannerDesktop.png',
            imageMobile: '/images/slide-banners/LevanteBarcelona-sliderBannerMobile.png',
            title: 'Levante UD vs FC Barcelona',
            venue: 'Estadi Ciutat de Valencia · Valencia',
            date: '24 de Agosto 2025 - 17:00',
            purchase_link: isLoading ? '#' : (hasError || !eventIds['Levante UD vs FC Barcelona'] ? '#' : `/event/${eventIds['Levante UD vs FC Barcelona']}?category=Fútbol`)
        },
        {
            imageDesktop: '/images/slide-banners/WOW21-slideBannerDesktop.png',
            imageMobile: '/images/slide-banners/WOW21-slideBannerMobile.png',
            title: 'WOW 21 - Marbella',
            venue: 'Starlite Marbella - Marbella',
            date: '09 de Agosto 2025 - 21:00',
            purchase_link: isLoading ? '#' : (hasError || !eventIds['WOW 21 - Marbella'] ? '#' : `/event/${eventIds['WOW 21 - Marbella']}?category=MMA`)
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === events.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [events.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? events.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePurchaseClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isLoading || hasError || events[currentIndex].purchase_link === '#') {
            e.preventDefault();
            return;
        }
    };

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src={isMobile 
                            ? (events[currentIndex].imageMobile || defaultImage)
                            : (events[currentIndex].imageDesktop || defaultImage)
                        }
                        alt={events[currentIndex].title}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover transition-opacity duration-500"
                        style={{ objectPosition: 'center center' }}
                    />
                </div>

                {/* Event Information */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 z-20">
                    <div className="bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg max-w-2xl w-11/12 md:w-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-neon text-center">
                            {events[currentIndex].title}
                        </h2>
                        <div className="text-center mt-4">
                            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 text-shadow-neon">
                                {events[currentIndex].venue}
                            </h3>
                            <p className="text-lg md:text-xl text-white mb-6 text-shadow-neon">
                                {events[currentIndex].date}
                            </p>
                            {session?.user ? (
                                // Show purchase button for logged users
                                <a
                                    href={events[currentIndex].purchase_link}
                                    onClick={handlePurchaseClick}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-8 py-3 rounded-[10px] border-2 border-red-500 transition-all duration-300 inline-block ${
                                        isLoading || hasError || events[currentIndex].purchase_link === '#'
                                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-red-500 hover:shadow-neon'
                                    }`}
                                >
                                    {isLoading ? 'Cargando...' : 'Comprar Entradas'}
                                </a>
                            ) : (
                                // Show login prompt for non-logged users
                                <Link
                                    href="/start"
                                    className="bg-red-700 text-white px-8 py-3 rounded-[10px] border-2 border-red-500 hover:bg-red-800 hover:shadow-neon transition-all duration-300 inline-block"
                                >
                                    Inicia Sesión para Comprar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 
                           flex items-center justify-center rounded-full hover:bg-red-500 
                           transition z-30 cursor-pointer"
            >
                <i className="fa-solid fa-chevron-left text-white text-xl" />
            </button>
            <button 
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 
                           flex items-center justify-center rounded-full hover:bg-red-500 
                           transition z-30 cursor-pointer"
            >
                <i className="fa-solid fa-chevron-right text-white text-xl" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {events.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            currentIndex === index 
                                ? 'bg-red-500 w-6' 
                                : 'bg-white/50 hover:bg-white'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow; 