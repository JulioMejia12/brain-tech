'use client'
import React, { useState } from 'react'
type Props = {
    primary: string;
    whatsappNumber?: string;
    title?: string;
}
const MobileMenu = ({ primary, whatsappNumber, title }: Props) => {
    const [activeNav, setActiveNav] = useState<'home' | 'menu' | 'promos' | 'contact'>('home')
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
    return (
        <nav aria-label="Mobile navigation" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[94%] max-w-3xl sm:hidden bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2">
            <div className="flex items-center justify-between">
                <button onClick={() => { setActiveNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`flex flex-col items-center text-sm px-2 py-1 rounded ${activeNav === 'home' ? '' : ''}`} style={activeNav === 'home' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6H9v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-8z" />
                    </svg>
                    <span>Productos</span>
                </button>

                <button onClick={() => { setActiveNav('menu'); const el = document.querySelector('#info'); el && (el as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'menu' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>nosotros</span>
                </button>

                <button onClick={() => { setActiveNav('promos'); const el = document.querySelector('#promos'); el && (el as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'promos' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-current" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
                    </svg>
                    <span>Promos</span>
                </button>

                <button onClick={() => { setActiveNav('contact'); openWhatsApp() }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'contact' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <div className="mb-1 rounded-full p-1" style={activeNav === 'contact' ? { background: 'transparent' } : { background: '#25D366' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" strokeWidth={2} stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.83.31 1.64.57 2.42a2 2 0 0 1-.45 2.11L8.09 9.91c1.28 2.56 3.48 4.76 6.04 6.04l1.66-1.66a2 2 0 0 1 2.11-.45c.78.26 1.59.45 2.42.57A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </div>
                    <span>Contacto</span>
                    {/* WhatsApp small badge */}

                </button>
            </div>
        </nav>
    )
}

export default MobileMenu