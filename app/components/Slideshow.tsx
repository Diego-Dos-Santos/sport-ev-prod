'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import React from 'react';

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
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchEventIds = async () => {
            try {
                const response = await fetch(`/api/events?category=Fútbol`);
                if (!response.ok) throw new Error('Failed to fetch events');
                const events = await response.json();
                
                // Find the specific events we need
                const realMadridEvent = events.find((event: any) => 
                    event.name.includes('Real Madrid vs Real Sociedad')
                );
                const barcelonaEvent = events.find((event: any) => 
                    event.name.includes('Athletic Club vs FC Barcelona')
                );
                
                setEventIds({
                    'Real Madrid vs Real Sociedad': realMadridEvent?.id || '',
                    'Athletic Club vs FC Barcelona': barcelonaEvent?.id || ''
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching event IDs:', error);
                setIsLoading(false);
            }
        };
        fetchEventIds();
    }, []);

    // Update the events array to use the fetched IDs
    const events: Event[] = [
        {
            imageDesktop: '/images/slide-banners/RealMadridRealSociedad-sliderBannerDesktop.png',
            imageMobile: '/images/slide-banners/RealMadridRealSociedad-sliderBannerMobile.png',
            title: 'Real Madrid vs Real Sociedad',
            venue: 'Estadio Santiago Bernabéu',
            date: '25 de Mayo 2025 - 21:00',
            purchase_link: isLoading ? '#' : `/event/${eventIds['Real Madrid vs Real Sociedad']}?category=Fútbol`
        },
        {
            imageDesktop: '/images/slide-banners/AthleticBarcelona-sliderBannerDesktop.png',
            imageMobile: '/images/slide-banners/AthleticBarcelona-sliderBannerMobile.png',
            title: 'Athletic Club vs FC Barcelona',
            venue: 'Estadio San Mames · Bilbao, Spain',
            date: '25 de Mayo 2025 - 17:00',
            purchase_link: isLoading ? '#' : `/event/${eventIds['Athletic Club vs FC Barcelona']}?category=Fútbol`
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
                        className="object-contain md:object-cover transition-opacity duration-500"
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
                            <a
                                href={events[currentIndex].purchase_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black text-white px-8 py-3 rounded-[10px] border-2 border-red-500 hover:bg-red-500 hover:shadow-neon transition-all duration-300 inline-block"
                            >
                                Comprar Entradas
                            </a>
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