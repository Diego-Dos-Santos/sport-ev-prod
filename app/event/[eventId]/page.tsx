import ClientEventPage from './ClientEventPage';

export default async function EventPage({ 
  params, 
  searchParams 
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const eventId = resolvedParams.eventId;
  const category = Array.isArray(resolvedSearchParams?.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams?.category || '';

  return <ClientEventPage eventId={eventId} category={category} />;
}
