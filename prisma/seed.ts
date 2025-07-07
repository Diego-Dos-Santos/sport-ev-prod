import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.favorite.deleteMany()
    await prisma.event.deleteMany()

    console.log('Creating sports events...')
    const eventos = [
      {
        name: "Real Madrid vs Real Sociedad",
        date: "2025-05-25",
        time: "21:00",
        location: "Estadio Santiago Bernabéu · Madrid",
        purchase_link: "https://seatpick.com/real-madrid-vs-real-sociedad-tickets/event/306224",
        category: "Fútbol",
        price: "Desde 197€",
        imageUrl: "/images/event-banners/RealMadridRealSociedad-banner.png",
        alt: "Partido Real Madrid vs Real Sociedad en el Bernabéu"
      },  
      {
        name: "Real Madrid vs RCD Mallorca",
        date: "2025-05-14",
        time: "21:30",
        location: "Estadio Santiago Bernabéu · Madrid",
        purchase_link: "https://seatpick.com/real-madrid-vs-rcd-mallorca-tickets/event/306284",
        category: "Fútbol",
        price: "desde 138€",
        imageUrl: "/images/event-banners/RealMadridRCDMallorca-banner.png",
        alt: "Partido Real Madrid vs RCD Mallorca"
      },
      {
        name: "FC Barcelona vs Villarreal CF",
        date: "2025-05-18",
        time: "17:00",
        location: "Estadi Olímpic Lluis Companys · Barcelona,Catalonia, España",
        purchase_link: "https://seatpick.com/fc-barcelona-vs-villarreal-cf-tickets/event/306241?quantity=2",
        category: "Fútbol",
        price: "desde 98€",
        imageUrl: "/images/event-banners/BarcelonaVillareal-banner.png",
        alt: "Partido FC Barcelona vs Villareal CF"
      },
      {
        name: "Athletic Club vs FC Barcelona",
        date: "2025-05-25",
        time: "17:00",
        location: "Estadio San Mames · Bilbao, Spain",
        purchase_link: "https://seatpick.com/athletic-bilbao-vs-fc-barcelona-tickets/event/306355?quantity=2",
        category: "Fútbol",
        price: "desde 299€",
        imageUrl: "/images/event-banners/AthleticClubBarcelona-banner.png",
        alt: "Partido AthleticClub vs FC Barcelona"
      },
      {
        name: "Atletico Madrid vs Real Betis Balompie",
        date: "2025-05-18",
        time: "17:00",
        location: "Riyadh Air Metropolitano · Madrid, Madrid, Spain",
        purchase_link: "https://seatpick.com/atletico-madrid-vs-real-betis-tickets/event/306352?quantity=2",
        category: "Fútbol",
        price: "desde 55€",
        imageUrl: "/images/event-banners/AtleticoBetis-banner.png",
        alt: "Partido Atletico Madrid vs Real Betis Balompié"
      },
      {
        name: "Girona vs Atletico Madrid",
        date: "2025-05-25",
        time: "17:00",
        location: "Estadi Montilivi · Girona, Catalonia, Spain",
        purchase_link: "https://seatpick.com/girona-vs-atletico-madrid-tickets/event/306454?quantity=2",
        category: "Fútbol",
        price: "desde 69€",
        imageUrl: "/images/event-banners/GironaAtletico-banner.png",
        alt: "Partido Girona vs Atletico Madrid"
      },
      {
        name: "Valencia CF vs Athletic Club Bilbao",
        date: "2025-05-18",
        time: "17:00",
        location: "Estadio Mestalla · Valencia, Valencian Community, Spain",
        purchase_link: "https://seatpick.com/valencia-cf-vs-athletic-bilbao-tickets/event/306142?quantity=2",
        category: "Fútbol",
        price: "desde 52€",
        imageUrl: "/images/event-banners/ValenciaAthletic-banner.png",
        alt: "Partido Valencia CF vs Athletic Club Bilbao"
      },
      {
        name: "Real Betis Balompie vs Valencia CF",
        date: "2025-05-25",
        time: "17:00",
        location: "Estadio Benito Villamarin · Seville, AND, Spain",
        purchase_link: "https://seatpick.com/real-betis-vs-valencia-cf-tickets/event/306324?quantity=2",
        category: "Fútbol",
        price: "desde 30€",
        imageUrl: "/images/event-banners/RealBetisValencia-banner.png",
        alt: "Partido Real Betis Balompie vs Valencia CF"
      },
      {
        name: "UD Las Palmas vs CD Leganes",
        date: "2025-05-18",
        time: "16:00",
        location: "Estadio de Gran Canaria · Las Palmas de Gran Canaria",
        purchase_link: "https://seatpick.com/las-palmas-vs-cd-leganes-tickets/event/306147?quantity=2",
        category: "Fútbol",
        price: "desde 29€",
        imageUrl: "/images/event-banners/LasPalmasLeganes-banner.png",
        alt: "Partido UD Las Palmas vs CD Leganes"
      },
      {
        name: "Rayo Vallecano vs RCD Mallorca",
        date: "2025-05-25",
        time: "17:00",
        location: "Campo de Futbol de Vallecas · Madrid, Spain",
        purchase_link: "https://seatpick.com/rayo-vallecano-vs-rcd-mallorca-tickets/event/306161?quantity=2",
        category: "Fútbol",
        price: "desde 111€",
        imageUrl: "/images/event-banners/RayoVallecanoMallorca-banner.png",
        alt: "Partido Rayo Vallecano vs RCD Mallorca"
      },
      {
        name: "WOW 19 - Eduardo Riego vs Renato Rangel",
        date: "2025-05-17",
        time: "18:30",
        location: "Centro de Tecnificación Deportiva de Alicante - Alicante",
        purchase_link: "https://www.entradas.com/event/wow-19-centro-de-tecnificacion-deportiva-de-alicante-20037457/?affiliate=ADE",
        category: "MMA",
        price: "desde 26,25€",
        imageUrl: "/images/event-banners/WOW19-banner.png",
        alt: "Combates WOW 19"
      },
      {
        name: "WOW 20 - La noche de los campeones",
        date: "2025-06-07",
        time: "18:30",
        location: "Madrid Arena (Casa de Campo), Madrid",
        purchase_link: "https://www.entradas.com/event/wow-20-la-noche-de-los-campeones-madrid-arena-casa-de-campo-20170748/?affiliate=ADE",
        category: "MMA",
        price: "desde 26,25€",
        imageUrl: "/images/event-banners/WOW20-banner.png",
        alt: "Combates MMA WOW 20"
      },
      {
        name: "BCN Boxing Nights - Rubí",
        date: "2025-05-17",
        time: "19:00",
        location: "Club Boxeo Vega Center, Rubí - Barcelona",
        purchase_link: "https://www.eventim-light.com/es/a/66508c0b14f4437072343ad8/e/680b66006447a751b10d1d64",
        category: "Boxeo",
        price: "desde 21,10€",
        imageUrl: "/images/event-banners/BCNBoxingNights-banner.png",
        alt: "Combates Boxeo BCN Rubí"
      },
      {
        name: "The Ring Boxing Series 1",
        date: "2025-05-31",
        time: "19:00",
        location: "Club Deportivo Bilbao - Bilbao",
        purchase_link: "https://www.eventim-light.com/es/a/66508c0b14f4437072343ad8/e/67fd11f78a98ed039c70be80",
        category: "Boxeo",
        price: "desde 26,28€",
        imageUrl: "/images/event-banners/TheRingBoxing-banner.png",
        alt: "Combates Boxeo The Ring Boxing Series 1"
      },
      {
        name: "WAR MMA 6",
        date: "2025-06-14",
        time: "19:30",
        location: "Plaza de toros de Alicante, Alicante",
        purchase_link: "https://www.entradas.com/event/war-mma-6-plaza-de-toros-de-alicante-20150889/",
        category: "MMA",
        price: "desde 19,25€",
        imageUrl: "/images/event-banners/WAR6-banner.png",
        alt: "Combates WAR MMA 6"
      },
      {
        name: "ATP Rolex Paris Masters 2025",
        date: "2025-10-27",
        time: "19:30",
        location: "París La Défense Arena, Nanterre, Francía",
        purchase_link: "https://www.tennisticketservice.com/es/ticket/gira-mundial-atp/paris-masters/",
        category: "Tenis",
        price: "desde 100€",
        imageUrl: "/images/event-banners/RolexParisMasters.jpg",
        alt: "Tenis Rolex Paris Masters 2025"
      },
      {
        name: "ATP Barcelona Open 2026",
        date: "2026-04-13",
        time: "13:00",
        location: "Real Club de Tennis Barcelona, Les Corts, Barcelona",
        purchase_link: "https://www.tennisticketservice.com/es/ticket/gira-mundial-atp/barcelona-open/",
        category: "Tenis",
        price: "desde 399€",
        imageUrl: "/images/event-banners/ATPTour-Banner.png",
        alt: "Tenis ATP Barcelona Open"
      },
      {
        name: "ATP 250 Mallorca Championships",
        date: "2025-06-21",
        time: "12:00",
        location: "Mallorca Country Club, Santa Poça, Illes Balears",
        purchase_link: "https://www.entradas.com/artist/atp-mallorca-champiosnhips/mallorca-championships-2025-3801390/",
        category: "Tenis",
        price: "desde 20€",
        imageUrl: "/images/event-banners/MallorcaChampionship-Banner.png",
        alt: "Tenis ATP 250 Mallorca Championships"
      },
      {
        name: "Real Madrid vs Covirán Granada",
        date: "2025-05-25",
        time: "17:00",
        location: "Movistar Arena",
        purchase_link: "https://www.movistararena.es/informacion?evento=real-madrid-vs-coviran-granada-jornada-33-liga-endesa-24-25",
        category: "Baloncesto",
        price: "desde 25€",
        imageUrl: "/images/event-banners/RealMadridCoviranGranada-banner.png",
        alt: "Partido Real Madrid vs Covirán Granada"
      },
      {
        name: "España vs Grecia",
        date: "2025-05-30",
        time: "19:00",
        location: "Palau Municipal d'Esports d'Inca, Inca, Illes Balears",
        purchase_link: "https://taquilla.entradas.plus/entradas/es/comprarEvento?idEvento=18704&idSesion=381337&affId=114187585",
        category: "Baloncesto",
        price: "desde 10€",
        imageUrl: "/images/event-banners/EspañaGrecia-banner.png",
        alt: "Partido España vs Grecia"
      },
      {
        name: "España vs Francia",
        date: "2025-08-14",
        time: "21:00",
        location: "Olimpic Arena (Badalona), Barcelona",
        purchase_link: "https://taquilla.entradas.plus/entradas/es/comprarEvento?idEvento=18492&idSesion=381039&affId=114204364",
        category: "Baloncesto",
        price: "desde 15€",
        imageUrl: "/images/event-banners/EspañaFrancia-banner.png",
        alt: "Partido España vs Francia"
      },
      {
        name: "España vs Alemania",
        date: "2025-06-21",
        time: "21:00",
        location: "Movistar Arena, Madrid",
        purchase_link: "https://taquilla.entradas.plus/entradas/es/comprarEvento?idEvento=18607&idSesion=381066&affId=114204383",
        category: "Baloncesto",
        price: "desde 15€",
        imageUrl: "/images/event-banners/EspañaAlemania-banner.png",
        alt: "Partido España vs Alemania"
      },
    ]

    for (const evento of eventos) {
      await prisma.event.create({
        data: evento
      })
    }

    console.log('Events created successfully!')
  } catch (error) {
    console.error('Error during seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error in main script:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 