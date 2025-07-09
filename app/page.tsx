import Navbar from '@/app/components/Navbar';
import Slideshow from '@/app/components/Slideshow';
import EventList from '@/app/components/EventList';
import PubliBanner from '@/app/components/PubliBanner';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { formatEvent } from '@/app/utils/formatEvent';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import prisma from '@/lib/prismadb';

async function getEvents() {
  try {
    return await prisma.event.findMany({ orderBy: { date: 'asc' } });
  } catch (err) {
    console.error('DB error:', err);
    return [];
  }
}

export default async function Home() {
    const session = await getServerSession();
    if (!session) {
      redirect('/start');              // redireciona se não logado
    }
    const rawEvents = await getEvents();
    const events = rawEvents.map(formatEvent);

    if (!Array.isArray(events)) {
        console.error('Events is not an array:', events);
        return <div>Error loading events</div>;
    }

    const categories = [...new Set(events.map((event: { category: string }) => event.category))];
    console.log('Available categories:', categories);
    console.log('All events:', events);

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <Slideshow />
            {events.length > 0 ? (
                <>
                    {categories.includes('Fútbol') && (
                        <div className="px-4 md:px-12">
                            <EventList 
                                data={events.filter(event => event.category === 'Fútbol')} 
                                category="Fútbol" 
                            />
                        </div>
                    )}
                    {categories.includes('MMA') && (
                        <div className="px-4 md:px-12">
                            <EventList 
                                data={events.filter(event => event.category === 'MMA')} 
                                category="MMA" 
                            />
                        </div>
                    )}
                    <PubliBanner bannerNumber={1} link='https://www.pentafightwear.com/es'/>
                    {categories.includes('Tenis') && (
                        <div className="px-4 md:px-12">
                            <EventList 
                                data={events.filter(event => event.category === 'Tenis')}
                                category="Tenis"
                            />
                        </div>
                    )}
                    {categories.includes('Boxeo') && (
                        <div className="px-4 md:px-12">
                            <EventList 
                                data={events.filter(event => event.category === 'Boxeo')}
                                category="Boxeo" 
                            />
                        </div>
                    )}
                    <PubliBanner bannerNumber={2} link='https://spainbjjtour.smoothcomp.com/en/event/23909' />
                    {categories.includes('Baloncesto') && (
                        <div className="px-4 md:px-12">
                            <EventList 
                                data={events.filter(event => event.category === 'Baloncesto')}
                                category="Baloncesto"
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-white py-10">No events available</div>
            )}
            <Footer />
        </main>
    );
}