'use client'
import React, { useMemo, useState } from 'react'
import NavBar from "./NavBar"
import AdsCarousel from '../../../components/AdsCarousel'
import Image from 'next/image'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import MobileMenu from './MobileMenu'
type Props = {
    logo?: string
    title?: string
    primary: string
    secondary: string
    textColor: string
    textColorLogo?: string
}

const ProductsSell = ({ logo, title = 'Bazarcito online', primary, secondary, textColor, textColorLogo }: Props) => {
    const demo = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80&auto=format&fit=crop',
    ]

    // Move products, selectedCategory, setSelectedCategory, and categories to component scope
    const products = [
        { id: 'p1', name: 'Cera modeladora', price: '$8.000', image: demo[0], description: 'Fijación media, acabado natural.', category: 'Estilizado' },
        { id: 'p2', name: 'Shampoo premium', price: '$12.000', image: demo[1], description: 'Limpieza profunda y brillo.', category: 'Cuidado' },
        { id: 'p3', name: 'Aceite para barba', price: '$9.500', image: demo[2], description: 'Hidratación y fragancia suave.', category: 'Cuidado' },
        { id: 'p4', name: 'Cera modeladora', price: '$8.000', image: demo[0], description: 'Fijación media, acabado natural.', category: 'Estilizado' },
        { id: 'p5', name: 'Shampoo premium', price: '$12.000', image: demo[1], description: 'Limpieza profunda y brillo.', category: 'Cuidado' },
        { id: 'p6', name: 'Aceite para barba', price: '$9.500', image: demo[2], description: 'Hidratación y fragancia suave.', category: 'Cuidado' },
        { id: 'p7', name: 'Cera modeladora', price: '$8.000', image: demo[0], description: 'Fijación media, acabado natural.', category: 'Estilizado' },
        { id: 'p8', name: 'Shampoo premium', price: '$12.000', image: demo[1], description: 'Limpieza profunda y brillo.', category: 'Cuidado' },
        { id: 'p9', name: 'Aceite para barba', price: '$9.500', image: demo[2], description: 'Hidratación y fragancia suave.', category: 'Cuidado' },
    ]

    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

    const categories = useMemo(() => {
        const set = new Set<string>(products.map((p) => p.category || 'Otros'))
        return ['Todos', ...Array.from(set)]
    }, [products])

    const visible = products.filter((p) => selectedCategory === 'Todos' || p.category === selectedCategory)

    return (
        <div style={{ background: '#ffe7fa' }}>
            <NavBar title="Bazarcito online" primary="#ff81e3" textColor="#160612" logo="" textColorLogo="#ffe7fa" />
            <section className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                {/* filtros por categoria */}
                <h2 className="text-xl font-bold mb-4" style={{ color: primary }}>Nuestros Productos</h2>

                {/* demo product cards with category filters */}
                <>
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedCategory(c)}
                                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === c ? 'text-white' : 'text-gray-800'}`}
                                style={selectedCategory === c ? { background: primary } : { background: 'white' }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {visible.map((p) => (
                            <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="relative w-full h-40">
                                    <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-lg font-bold text-gray-900">{p.price}</div>
                                        <button
                                            className="px-3 py-1 rounded text-white"
                                            style={{ background: primary }}
                                        >Pedir por WhatsApp</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            </section>

            <div className="hidden md:block">
                <FloatingWhatsApp whatsappNumber={'5571906152'} message={`Hola, quiero reservar en ${title}`} className="top-6 right-6 md:top-auto md:bottom-6 md:right-6 lg:bottom-8" />
            </div>
            <section id='info'>
                <div className="max-w-3xl mx-auto py-8 px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>¿Quiénes somos?</h2>
                    <p className="text-gray-700 text-base mb-2">
                        Somos un equipo apasionado por ofrecer productos de calidad para el cuidado personal y el estilizado. Nuestro objetivo es brindar a nuestros clientes una experiencia de compra sencilla, segura y cercana, con atención personalizada y productos seleccionados cuidadosamente.
                    </p>
                    <p className="text-gray-700 text-base">
                        Creemos en la importancia de sentirte bien contigo mismo y por eso trabajamos cada día para acercarte lo mejor en cuidado y estilo. ¡Gracias por confiar en nosotros!
                    </p>
                </div>
            </section>
            <section id="promos" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                {/* <h2 className="text-xl font-bold mb-4">Publicidad</h2> */}
                <AdsCarousel images={demo} />
            </section>
            <section>
                <div className="max-w-3xl mx-auto py-8 px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>¿Quieres vender nuestros productos?</h2>
                    <p className="text-gray-700 text-base mb-4">
                        Si estás interesado en convertirte en distribuidor de  Betterware.
                    </p>
                    <button
                        onClick={() => window.open('https://wa.me/5571906152?text=Hola,%20estoy%20interesado%20en%20vender%20sus%20productos', '_blank')}
                        className="px-4 py-2 rounded text-white"
                        style={{ background: primary }}
                    >
                        Contáctanos por WhatsApp
                    </button>
                </div>
            </section>
            <Footer />
            <MobileMenu primary={'#ff81e3'} whatsappNumber={'5571906152'} />
        </div>
    )
}

export default ProductsSell