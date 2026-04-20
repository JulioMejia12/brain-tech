"use client"

import React, { useState, useRef, useEffect } from "react"
import FloatingWhatsApp from '../../../components/FloatingWhatsApp'
import Map from '../../../components/Map'
import { text } from "stream/consumers"

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
    images?: (string | { name: string; image: string })[]
}

const Barberias: React.FC<BarberiasProps> = ({
    primary = '#0f172a',
    secondary = '#6b7280',
    background = '#f8fafc',
    textColor = '',
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
    images = [],
}) => {
    // normalize images to objects { name, image }
    const normalizedImages: { name: string; image: string }[] = Array.isArray(images)
        ? images.map((it) => (typeof it === 'string' ? { name: '', image: it } : it))
        : []
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

    // Booking form state
    const [bookingName, setBookingName] = useState('')
    const [bookingDate, setBookingDate] = useState('')
    const [bookingService, setBookingService] = useState<string>(services && services.length > 0 ? services[0].name : 'General')
    const [sending, setSending] = useState(false)

    const formatBookingDate = (iso: string) => {
        if (!iso) return ''
        const d = new Date(iso)
        if (isNaN(d.getTime())) return iso
        const day = d.getDate()
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const month = months[d.getMonth()] || ''
        const year = d.getFullYear()
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `${day} ${month} ${year} ${hours}:${minutes}`
    }

    const sendBookingWhatsApp = () => {
        const raw = whatsappNumber || ''
        const digits = raw.replace(/[^0-9]/g, '')
        if (!digits) {
            alert('No hay número de WhatsApp configurado.')
            return
        }
        if (!bookingName || !bookingDate || !bookingService) {
            alert('Por favor completa nombre, fecha y servicio.')
            return
        }

        setSending(true)
        const formattedDate = formatBookingDate(bookingDate)
        const messageText = `Reserva\nNegocio: ${title}\nNombre: ${bookingName}\nServicio: ${bookingService}\nFecha: ${formattedDate}`
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(messageText)}`
        window.open(url, '_blank')
        // small delay to show sending state
        setTimeout(() => setSending(false), 800)
    }
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeNav, setActiveNav] = useState<'home' | 'menu' | 'promos' | 'contact'>('home')
    const heroRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        let rafId = 0
        const speed = 0.12

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                if (!heroRef.current) return
                const rect = heroRef.current.getBoundingClientRect()
                const offset = -rect.top * speed
                // avoid scaling to prevent visible edges/artifacts on small screens
                heroRef.current.style.transform = `translateY(${offset}px)`
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

                        {/* <button
                            className="sm:hidden p-2 rounded"
                            style={{ backgroundColor: secondary, color: '#fff' }}
                            onClick={() => setMenuOpen((s) => !s)}
                            aria-label="Abrir menú"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button> */}
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden px-6 pb-4" style={{ background: primary }}>
                        <nav className="flex flex-col gap-3" style={{ color: textColor }}>
                            <a className="block py-2" style={{ color: primary }}>Inicio</a>
                            <a className="block py-2" style={{ color: secondary }}>Servicios</a>
                            <a className="block py-2" style={{ color: secondary }}>Contacto</a>
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
                    <div className="absolute inset-0 bg-black/40 flex items-center z-10">
                        <div className="max-w-2xl md:max-w-3xl mx-auto px-6 text-white z-20">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">{title}</h1>
                            <p className="mt-4 text-base sm:text-lg text-gray-100">Bienvenido a {title}. Reserva tu corte, consulta servicios y descubre nuestras reseñas.</p>
                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                                <button className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 rounded mr-0 sm:mr-3" style={{ backgroundColor: primary, color: '#fff', zIndex: 20 }} onClick={() => openWhatsApp()}>
                                    Reservar cita ahora
                                </button>
                                <a href="#info" className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 rounded border text-white mt-2 sm:mt-0" style={{ zIndex: 20 }}>
                                    Más información
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="info">
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

                {/* FORMULARIO DE RESERVA */}
                <section className="max-w-4xl mx-auto px-4 lg:px-0 mt-12 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: primary }}>Reservar cita</h2>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <label className="block mb-3">
                            <span className="text-sm font-medium text-gray-900">Nombre</span>
                            <input
                                type="text"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                placeholder="Tu nombre"
                                className="mt-1 block w-full rounded border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400"
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-sm font-medium text-gray-900">Fecha y hora</span>
                            <input
                                type="datetime-local"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300 px-3 py-2 text-gray-900"
                            />
                            {bookingDate && (
                                <p className="mt-2 text-sm text-gray-700">Fecha seleccionada: {formatBookingDate(bookingDate)}</p>
                            )}
                        </label>

                        <label className="block mb-4">
                            <span className="text-sm font-medium text-gray-900">Servicio</span>
                            <select
                                value={bookingService}
                                onChange={(e) => setBookingService(e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300 px-3 py-2 text-gray-900"
                            >
                                {services && services.length > 0 ? (
                                    services.map((s) => (
                                        <option key={s.name} value={s.name}>{`${s.name} ${s.price ? '- ' + s.price : ''}`}</option>
                                    ))
                                ) : (
                                    <option value="General">General</option>
                                )}
                            </select>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={sendBookingWhatsApp}
                                className="flex-1 px-4 py-2 rounded text-white"
                                style={{ backgroundColor: primary }}
                                disabled={sending}
                            >
                                {sending ? 'Enviando...' : 'Enviar por WhatsApp'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setBookingName(''); setBookingDate(''); setBookingService(services && services.length > 0 ? services[0].name : 'General') }}
                                className="px-4 py-2 rounded border text-gray-700"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sobre nosotros */}
                <section className="text-gray-900 text-3xl font-bold text-center mt-12 mb-6">
                    <div className="max-w-4xl mx-auto px-4 lg:px-0">
                        <h2 className="text-3xl font-bold mb-6" style={{ color: primary }}>Sobre nosotros</h2>
                        <div className="bg-white rounded-lg shadow p-8">
                            <p className="text-lg mb-4 text-gray-900">{about ? about : `En ${title} nos apasiona ofrecer cortes y servicios de barbería con atención personalizada. Nuestro equipo está formado por profesionales con experiencia, comprometidos con la calidad y la satisfacción del cliente.`}</p>
                            <p className="text-lg text-gray-900">Buscamos crear un espacio cómodo, moderno y confiable donde te sientas bienvenido en cada visita.</p>
                        </div>
                    </div>
                </section>
                <div>
                    <h2 className="text-3xl font-bold text-center mt-12 mb-6" style={{ color: primary }}>Nuestros cortes mas pedidos</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 lg:px-0">
                        {normalizedImages && normalizedImages.length > 0 ? normalizedImages.map((img, idx) => (
                            <img key={idx} src={img.image || ''} alt={img.name || ''} className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        )) : null}
                    </div>
                </div>

                {/* Mapa */}
                <section className="text-3xl font-bold text-center mt-12 mb-6">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>Encuéntranos</h2>
                    <Map query={effectiveMapQuery} lat={mapLat} lng={mapLng} zoom={mapZoom} height={mapHeight} />
                </section>
            </main>

            {/* Contenido principal debajo del hero */}
            <div className="max-w-7xl mx-auto px-6 py-8 w-full">
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
            {/* Botón flotante de WhatsApp (lado superior derecho) */}
            <FloatingWhatsApp whatsappNumber={whatsappNumber} message={`Hola, quiero reservar en ${title}`} className="top-6 right-6 md:top-auto md:bottom-6 md:right-6 lg:bottom-8" />
            {/* Bottom mobile navigation */}
            <nav aria-label="Mobile navigation" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[94%] max-w-3xl sm:hidden bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2">
                <div className="flex items-center justify-between">
                    <button onClick={() => { setActiveNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`flex flex-col items-center text-sm px-2 py-1 rounded ${activeNav === 'home' ? '' : ''}`} style={activeNav === 'home' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6H9v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-8z" />
                        </svg>
                        <span>Inicio</span>
                    </button>

                    <button onClick={() => { setActiveNav('menu'); const el = document.querySelector('#info'); el && (el as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'menu' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Servicios</span>
                    </button>

                    <button onClick={() => { setActiveNav('promos'); alert('Promociones no disponibles aún') }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'promos' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
                        </svg>
                        <span>Promos</span>
                    </button>

                    <button onClick={() => { setActiveNav('contact'); openWhatsApp() }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'contact' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.4l.95 3.32a2 2 0 01-.45 1.9L8.7 12.7a11 11 0 005.6 5.6l1.08-1.08a2 2 0 011.9-.45l3.32.95A2 2 0 0121 18.72V22a2 2 0 01-2 2A19 19 0 013 5z" />
                        </svg>
                        <span>Contacto</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Barberias
