import EventList from '@/app/components/EventList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Session } from 'next-auth';
import { formatEvent } from '@/app/utils/formatEvent';

export default async function MyEventsPage() {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
        return null;
    }

    const user = await prismadb.user.findUnique({
        where: { email: session.user.email },
        include: {
            favorites: true
        }
    });

    if (!user || !user.favorites.length) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow mt-20 mb-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <h1 className="text-3xl font-bold text-white mb-8">Mis Eventos</h1>
                        <p className="text-gray-300 text-lg">No tienes eventos favoritos aún.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Get all favorite event IDs
    const favoriteEventIds = user.favorites.map((fav: { eventId: string }) => fav.eventId);

    // Fetch all events at once and filter for favorites
    const allEvents = await prismadb.event.findMany({
        where: {
            id: {
                in: favoriteEventIds
            }
        }
    });

    const events = allEvents.map(formatEvent);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow mt-20 mb-20">
                <EventList 
                    data={events} 
                    category="Mis Eventos" 
                    isMyEvents={true} 
                />
            </main>
            <Footer />
        </div>
    );
} 