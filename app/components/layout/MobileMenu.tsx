'use client'
import React, { useState } from 'react'
import { FiHome, FiMenu, FiPhone, FiStar } from 'react-icons/fi'
type Props = {
    primary: string;
    whatsappNumber?: string;
    title?: string;
}
const MobileMenu = ({ primary, whatsappNumber, title }: Props) => {
    const [activeNav, setActiveNav] = useState<'home' | 'menu' | 'promos' | 'contact'>('home')
    // const [dotsOpen, setDotsOpen] = useState<boolean>(false)

    const openWhatsApp = (service?: string) => {
        const raw = whatsappNumber || ''
        const digits = raw.replace(/[^0-9]/g, '')
        if (!digits) {
            // graceful fallback: do nothing if no number configured
            // you may replace this with an alert or other UX
            return
        }

        const message = service
            ? `Hola, quiero comprar el producto: ${service}`
            : `Hola, me interesa comprar productos. ¿Me pueden ayudar con más información?`
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }
    return (
        <nav aria-label="Mobile navigation" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[94%] max-w-3xl sm:hidden bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2">
            <div className="flex items-center justify-between">
                <button onClick={() => { setActiveNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`flex flex-col items-center text-sm px-2 py-1 rounded ${activeNav === 'home' ? '' : ''}`} style={activeNav === 'home' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <FiHome className="h-6 w-6 mb-1 text-current" />
                    <span>Productos</span>
                </button>

                <button onClick={() => { setActiveNav('menu'); const el = document.querySelector('#info'); el && (el as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'menu' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <FiMenu className="h-6 w-6 mb-1 text-current" />
                    <span>nosotros</span>
                </button>

                <button onClick={() => { setActiveNav('promos'); const el = document.querySelector('#promos'); el && (el as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'promos' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                    <FiStar className="h-6 w-6 mb-1 text-current" />
                    <span>Promos</span>
                </button>

                <div className="relative flex flex-col items-center text-sm px-2 py-1 rounded">
                    <button onClick={() => { setActiveNav('contact'); openWhatsApp() }} className={`flex flex-col items-center text-sm px-2 py-1 rounded`} style={activeNav === 'contact' ? { backgroundColor: primary, color: '#fff' } : { color: '#374151' }}>
                        <div className="mb-1 rounded-full p-1" style={activeNav === 'contact' ? { background: 'transparent' } : { background: '#25D366' }}>
                            <FiPhone className="h-4 w-4" color="white" />
                        </div>
                        <span>Contactame</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default MobileMenu