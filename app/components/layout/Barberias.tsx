"use client"

import React, { useState, useRef, useEffect } from "react"
import FloatingWhatsApp from '../../../components/FloatingWhatsApp'
import Map from '../../../components/Map'

interface BarberiasProps {
    primary?: string
    secondary?: string
    background?: string
    title?: string
    logo?: string
    textColor?: string
    children?: React.ReactNode
    heroImage: string
    whatsappNumber?: string
    mapQuery?: string
    mapLat?: number
    mapLng?: number
    mapZoom?: number
    mapHeight?: string
    about?: string
    services?: { name: string; price: string }[]
}

const Barberias: React.FC<BarberiasProps> = ({
    primary = '#0f172a',
    secondary = '#6b7280',
    background = '#f8fafc',
    textColor = '#000',
    title = 'MiBarber',
    heroImage = '/images/hero-barber.jpg',
    logo,
    children,
    whatsappNumber = '',
    mapQuery,
    mapLat,
    mapLng,
    mapZoom = 15,
    mapHeight = '420px',
    about,
    services = [],
}) => {
    const openWhatsApp = (service?: string) => {
        const raw = whatsappNumber || ''
        const digits = raw.replace(/[^0-9]/g, '')
        if (!digits) {
            // graceful fallback: do nothing if no number configured
            // you may replace this with an alert or other UX
            return
        }

        const message = service ? `Hola, quiero reservar: ${service}` : `Hola, quiero reservar un servicio en ${title}`
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }
    const [menuOpen, setMenuOpen] = useState(false)
    const heroRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        let rafId = 0
        const speed = 0.2

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                if (!heroRef.current) return
                const rect = heroRef.current.getBoundingClientRect()
                const offset = -rect.top * speed
                heroRef.current.style.transform = `translateY(${offset}px) scale(1.05)`
            })
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        // initial position
        onScroll()

        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])
    const effectiveMapQuery = mapQuery || title

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: background }}>
            <header className="shadow" style={{ background: primary }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logo} alt={title} className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full" />
                        ) : (
                            <div className="text-2xl font-bold" style={{ color: textColor }}>{title}</div>
                        )}

                        <nav className="hidden sm:flex gap-4 text-md" style={{ color: textColor }}>
                            <a style={{ color: textColor }}>Inicio</a>
                            <a style={{ color: textColor }}>Servicios</a>
                            <a style={{ color: textColor }}>Nosotros</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button
                            className="inline-block px-3 py-1.5 rounded"
                            style={{ backgroundColor: primary, color: '#fff' }}
                            onClick={() => openWhatsApp()}
                        >
                            Reservar
                        </button> */}

                        <button
                            className="sm:hidden p-2 rounded"
                            style={{ backgroundColor: secondary, color: '#fff' }}
                            onClick={() => setMenuOpen((s) => !s)}
                            aria-label="Abrir menú"
                        >
                            {/* simple hamburger */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden px-6 pb-4" style={{ background: primary }}>
                        <nav className="flex flex-col gap-3" style={{ color: textColor }}>
                            <a className="block py-2">Inicio</a>
                            <a className="block py-2">Servicios</a>
                            <a className="block py-2">Contacto</a>
                            <button className="mt-2 px-4 py-2 rounded" style={{ backgroundColor: secondary, color: '#fff' }} onClick={() => { openWhatsApp(); setMenuOpen(false); }}>
                                Reservar
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1 w-full">
                {/* Hero: imagen de bienvenida full-width */}
                <div className="w-full h-[60vh] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img ref={heroRef} src={heroImage} alt="Barbería hero" className="absolute inset-0 w-full h-full object-cover transform-gpu" style={{ transform: 'translateY(0px)' }} />
                    <div className="absolute inset-0 bg-black/40 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 text-white">
                            <h1 className="text-4xl md:text-6xl font-extrabold">{title}</h1>
                            <p className="mt-4 max-w-2xl text-lg text-gray-100">Bienvenido a {title}. Reserva tu corte, consulta servicios y descubre nuestras reseñas.</p>
                            <div className="mt-6">
                                <button className="px-4 py-2 rounded mr-3" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp()}>
                                    Reservar cita ahora
                                </button>
                                <a href="#info" className="px-4 py-2 rounded border text-white">Más información</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-center mt-12 mb-6" style={{ color: primary }}>Nuestros Servicios</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 lg:px-0">
                        {services.length > 0 ? services.map((service, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow p-6 text-center">
                                <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>{service.name}</h3>
                                <p className="text-gray-600 mb-4">{service.price}</p>
                                <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp(service.name)}>Reservar</button>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 col-span-full">No hay servicios disponibles en este momento.</p>
                        )}
                        {/* <div className="bg-white rounded-lg shadow p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>Afeitado Clásico</h3>
                            <p className="text-gray-600 mb-4">Desde $10.000</p>
                            <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp('Afeitado Clásico')}>Reservar</button>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>Corte de Barba</h3>
                            <p className="text-gray-600 mb-4">Desde $12.000</p>
                            <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp('Corte de Barba')}>Reservar</button>
                        </div> */}
                    </div>
                </div>

                {/* Sobre nosotros */}
                <section className="text-gray-600 text-3xl font-bold text-center mt-12 mb-6">
                    <div className="max-w-4xl mx-auto px-4 lg:px-0">
                        <h2 className="text-3xl font-bold mb-6" style={{ color: primary }}>Sobre nosotros</h2>
                        <div className="bg-white rounded-lg shadow p-8">
                            <p className="text-lg mb-4">{about ? about : `En ${title} nos apasiona ofrecer cortes y servicios de barbería con atención personalizada. Nuestro equipo está formado por profesionales con experiencia, comprometidos con la calidad y la satisfacción del cliente.`}</p>
                            <p className="text-lg">Buscamos crear un espacio cómodo, moderno y confiable donde te sientas bienvenido en cada visita.</p>
                        </div>
                    </div>
                </section>

                {/* Mapa */}
                <section className="text-3xl font-bold text-center mt-12 mb-6">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>Encuéntranos</h2>
                    <Map query={effectiveMapQuery} lat={mapLat} lng={mapLng} zoom={mapZoom} height={mapHeight} />
                </section>
            </main>

            {/* Contenido principal debajo del hero */}
            <div id="info" className="max-w-7xl mx-auto px-6 py-8 w-full">
                {children}
            </div>
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                    <div>© {new Date().getFullYear()} Brain Tech. Todos los derechos reservados.</div>
                    <div className="flex gap-4 mt-3 md:mt-0">
                        <a style={{ color: primary }} className="hover:opacity-90">Términos</a>
                        <a style={{ color: primary }} className="hover:opacity-90">Privacidad</a>
                    </div>
                </div>
            </footer>
            {/* Botón flotante de WhatsApp */}
            <FloatingWhatsApp whatsappNumber={whatsappNumber} message={`Hola, quiero reservar en ${title}`} />
        </div>
    )
}

export default Barberias
