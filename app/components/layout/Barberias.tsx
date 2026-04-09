"use client"

import React, { useState } from "react"

interface BarberiasProps {
    primary?: string
    secondary?: string
    background?: string
    title?: string
    logo?: string
    textColor?: string
    children?: React.ReactNode
    heroImage?: string
    whatsappNumber?: string
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

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: background }}>
            <header className="shadow" style={{ background: primary }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logo} alt={title} className="w-10 h-10 object-contain rounded-full" />
                        ) : (
                            <div className="text-2xl font-bold" style={{ color: textColor }}>{title}</div>
                        )}

                        <nav className="hidden sm:flex gap-4 text-md" style={{ color: textColor }}>
                            <a style={{ color: textColor }}>Inicio</a>
                            <a style={{ color: textColor }}>Servicios</a>
                            <a style={{ color: textColor }}>Contacto</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="inline-block px-3 py-1.5 rounded"
                            style={{ backgroundColor: primary, color: '#fff' }}
                            onClick={() => openWhatsApp()}
                        >
                            Reservar
                        </button>

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
                    <img src={heroImage} alt="Barbería hero" className="absolute inset-0 w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-black/40 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 text-white">
                            <h1 className="text-4xl md:text-6xl font-extrabold">{title}</h1>
                            <p className="mt-4 max-w-2xl text-lg text-gray-100">Bienvenido a {title}. Reserva tu corte, consulta servicios y descubre nuestras reseñas.</p>
                            <div className="mt-6">
                                <button className="px-4 py-2 rounded mr-3" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp()}>
                                    Reservar
                                </button>
                                <a href="#info" className="px-4 py-2 rounded border text-white">Más información</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-center mt-12 mb-6">Nuestros Servicios</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 lg:px-0">
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>Corte de Cabello</h3>
                            <p className="text-gray-600 mb-4">Desde $15.000</p>
                            <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp('Corte de Cabello')}>Reservar</button>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>Afeitado Clásico</h3>
                            <p className="text-gray-600 mb-4">Desde $10.000</p>
                            <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp('Afeitado Clásico')}>Reservar</button>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2" style={{ color: secondary }}>Corte de Barba</h3>
                            <p className="text-gray-600 mb-4">Desde $12.000</p>
                            <button className="px-4 py-2 rounded w-full sm:inline-block" style={{ backgroundColor: primary, color: '#fff' }} onClick={() => openWhatsApp('Corte de Barba')}>Reservar</button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center mt-12 mb-6">Reseñas de Clientes</h2>
                    <div className="max-w-4xl mx-auto space-y-6 px-4 lg:px-0">
                        <div className="bg-white rounded-lg shadow p-6 overflow-hidden">
                            <p className="text-gray-600 mb-4 whitespace-normal break-words">"Excelente servicio, el mejor corte que he tenido. El personal es muy amable y profesional."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: primary, color: '#fff' }}>
                                    JP
                                </div>
                                <div>
                                    <p className="font-semibold text-lg" style={{ color: secondary }}>Juan Pérez</p>
                                    <p className="text-sm text-gray-500">Cliente desde 2022</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 overflow-hidden">
                            <p className="text-gray-600 mb-4 whitespace-normal break-words">"Me encanta venir aquí, siempre salgo satisfecho con mi corte. El ambiente es genial y los precios son justos."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: primary, color: '#fff' }}>
                                    MG
                                </div>
                                <div>
                                    <p className="font-semibold text-lg" style={{ color: secondary }}>María Gómez</p>
                                    <p className="text-sm text-gray-500">Cliente desde 2021</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards de imágenes de nuestros cortes, servicios, precios, etc */}
                <div>
                    <h2 className="text-3xl font-bold text-center mt-12 mb-6">Nuestros cortes mas pedidos</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 lg:px-0">
                        <img src="/image.jpeg" alt="Corte 1" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        <img src="/image2.jpeg" alt="Corte 2" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        <img src="/image3.jpeg" alt="Corte 3" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        <img src="/hero-barber.jpeg" alt="Corte 4" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        <img src="/image2.jpeg" alt="Corte 2" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                        <img src="/image3.jpeg" alt="Corte 3" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    </div>
                </div>

                {/* Contenido principal debajo del hero */}
                <div id="info" className="max-w-7xl mx-auto px-6 py-8 w-full">
                    {children}
                </div>
            </main>

            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                    <div>© {new Date().getFullYear()} Brain Tech. Todos los derechos reservados.</div>
                    <div className="flex gap-4 mt-3 md:mt-0">
                        <a style={{ color: primary }} className="hover:opacity-90">Términos</a>
                        <a style={{ color: primary }} className="hover:opacity-90">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Barberias
