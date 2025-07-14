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
        name: "Real Madrid vs Osasuna",
        date: "2025-08-19",
        time: "21:00",
        location: "Estadio Santiago Bernabéu · Madrid",
        purchase_link: "https://seatpick.com/real-madrid-vs-osasuna-santiago-bernabeu-tickets/event/380958",
        category: "Fútbol",
        price: "Desde 155€",
        imageUrl: "/images/event-banners/RealMadridOsasuna-banner.png",
        alt: "Partido Real Madrid vs Osasuna en el Bernabéu"
      },  
      {
        name: "Real Madrid vs RCD Mallorca",
        date: "2025-08-31",
        time: "17:00",
        location: "Estadio Santiago Bernabéu · Madrid",
        purchase_link: "https://seatpick.com/real-madrid-vs-rcd-mallorca-santiago-bernabeu-tickets/event/380922",
        category: "Fútbol",
        price: "desde 160€",
        imageUrl: "/images/event-banners/RealMadridRCDMallorca-banner.png",
        alt: "Partido Real Madrid vs RCD Mallorca"
      },
      {
        name: "Real Oviedo vs Real Madrid",
        date: "2025-08-24",
        time: "17:00",
        location: "Estadio Carlos Tartiere · Oviedo",
        purchase_link: "https://seatpick.com/real-oviedo-vs-real-madrid-estadio-carlos-tartiere-tickets/event/384018",
        category: "Fútbol",
        price: "Desde 325€",
        imageUrl: "/images/event-banners/RealOviedoRealMadrid-banner.png",
        alt: "Partido Real Oviedo vs Real Madrid en el Tartiere"
      }, 
      {
        name: "Levante UD vs FC Barcelona",
        date: "2025-08-24",
        time: "17:00",
        location: "Estadi Ciutat de Valencia · Valencia",
        purchase_link: "https://seatpick.com/levante-ud-vs-fc-barcelona-estadi-ciutat-de-valencia-tickets/event/381036",
        category: "Fútbol",
        price: "desde 290€",
        imageUrl: "/images/event-banners/LevanteBarcelona-banner.png",
        alt: "Partido Levante UD vs FC Barcelona"
      },
      {
        name: "RCD Mallorca vs FC Barcelona",
        date: "2025-08-16",
        time: "19:30",
        location: "Estadio Son Moix · Mallorca",
        purchase_link: "https://seatpick.com/rcd-mallorca-vs-fc-barcelona-estadio-son-moix-tickets/event/381032",
        category: "Fútbol",
        price: "desde 268€",
        imageUrl: "/images/event-banners/RCDMallorcaBarcelona-banner.png",
        alt: "Partido RCD Mallorca vs FC Barcelona"
      },
      {
        name: "Rayo Vallecano vs FC Barcelona",
        date: "2025-08-31",
        time: "17:00",
        location: "Campo de Futbol de Vallecas · Madrid",
        purchase_link: "https://seatpick.com/rayo-vallecano-vs-fc-barcelona-campo-de-futbol-de-vallecas-tickets/event/381034",
        category: "Fútbol",
        price: "desde 200€",
        imageUrl: "/images/event-banners/RayoVallecanoBarcelona-banner.png",
        alt: "Partido Rayo Vallecano vs FC Barcelona"
      },
      {
        name: "Espanyol vs Atletico Madrid",
        date: "2025-08-17",
        time: "21:30",
        location: "RCDE Stadium · Barcelona",
        purchase_link: "https://seatpick.com/espanyol-vs-atletico-madrid-rcde-stadium-tickets/event/381123",
        category: "Fútbol",
        price: "desde 105€",
        imageUrl: "/images/event-banners/EspanyolAtletico-banner.png",
        alt: "Partido Espanyol vs Atletico Madrid"
      },
      {
        name: "Atletico Madrid vs Elche CF",
        date: "2025-08-24",
        time: "17:00",
        location: "Riyadh Air Metropolitano · Madrid",
        purchase_link: "https://seatpick.com/atletico-madrid-vs-elche-cf-riyadh-air-metropolitano-tickets/event/381078",
        category: "Fútbol",
        price: "desde 40€",
        imageUrl: "/images/event-banners/AtleticoMadridElche-banner.png",
        alt: "Partido Atletico Madrid vs Elche CF"
      },
      {
        name: "Deportivo Alaves vs Atletico Madrid",
        date: "2025-08-31",
        time: "17:00",
        location: "Mendizorrotza Stadium · Vitoria-Gasteiz",
        purchase_link: "https://seatpick.com/deportivo-alaves-vs-atletico-madrid-mendizorrotza-stadium-tickets/event/381131",
        category: "Fútbol",
        price: "desde 240€",
        imageUrl: "/images/event-banners/DeportivoAlavesAtleticoMadrid-banner.png",
        alt: "Partido Deportivo Alaves vs Atletico Madrid"
      },
      {
        name: "Levante UD vs Real Betis Balompie",
        date: "2025-09-14",
        time: "17:00",
        location: "Estadi Ciutat de Valencia · Valencia",
        purchase_link: "https://seatpick.com/levante-ud-vs-real-betis-balompie-estadi-ciutat-de-valencia-tickets/event/380909",
        category: "Fútbol",
        price: "desde 150€",
        imageUrl: "/images/event-banners/LevanteRealBetis-banner.png",
        alt: "Partido Levante UD vs Real Betis Balompie"
      },
      {
        name: "WOW 21 - Marbella",
        date: "2025-08-09",
        time: "21:00",
        location: "Starlite Marbella - Marbella",
        purchase_link: "https://www.entradas.com/event/wow-mma-wow-21-starlite-festival-2025-starlite-marbella-20301016/",
        category: "MMA",
        price: "desde 47,25€",
        imageUrl: "/images/event-banners/WOW21-banner.png",
        alt: "Combates WOW 21"
      },
      {
        name: "WOW 22 - Madrid",
        date: "2025-09-13",
        time: "19:00",
        location: "Madrid Arena (Casa de Campo), Madrid",
        purchase_link: "https://www.entradas.com/artist/wow-mma/wow-22-3914821/",
        category: "MMA",
        price: "desde 18,50€",
        imageUrl: "/images/event-banners/WOW22-banner.png",
        alt: "Combates MMA WOW 20"
      },
      {
        name: "Fórmula 1 - Gran Premio de Hungría - Pase de 3 días",
        date: "2025-08-01",
        time: "07:59",
        location: "Club Boxeo Vega Center, Rubí - Barcelona",
        purchase_link: "https://seatpick.com/es/hungarian-f1-gp-2025-3-day-pass-august-1-3-hungaroring-01-08-2025/evento/314783",
        category: "F1",
        price: "desde 244€",
        imageUrl: "/images/event-banners/f1-GpHUN-banner.png",
        alt: "Fórmula 1 - Gran Premio de Hungría"
      },
      {
        name: "Fórmula 1 - Gran Premio de Estados Unidos - Pase de 3 días",
        date: "2025-10-17",
        time: "10:59",
        location: "Circuit of the Americas · Austin, TX, Estados Unidos",
        purchase_link: "https://seatpick.com/es/entradas-2025-formula-1-gran-premio-de-estados-unidos-pase-de-3-dias-17-101910-circuit-of-the-americas-17-10-2025/evento/370936",
        category: "F1",
        price: "desde 351€",
        imageUrl: "/images/event-banners/f1-GpEEUU-banner.png",
        alt: "Fórmula 1 - Gran Premio de Estados Unidos"
      },
      {
        name: "WAR MMA 7",
        date: "2025-08-23",
        time: "20:30",
        location: "Palacio de Deportes de la Guía, Gijón",
        purchase_link: "https://www.entradas.com/event/war-mma-7-palacio-de-los-deportes-de-la-guia-presidente-adolfo-suarez-20437984/?affiliate=AWI&utm_campaign=awin&utm_medium=affiliate&utm_source=awin",
        category: "MMA",
        price: "desde 22,00€",
        imageUrl: "/images/event-banners/WAR7-banner.png",
        alt: "Combates WAR MMA 7"
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