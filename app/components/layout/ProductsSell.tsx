'use client'
import { useMemo, useState, useEffect, useRef } from 'react'
import AdsCarousel from '../../../components/AdsCarousel'
import Image from 'next/image'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import MobileMenu from './MobileMenu'
import NavBar from './NavBar'
import { bazarcitoProducts, type Product } from '../../lib/products'
type Props = {
    logo?: string
    title?: string
    bgColor?: string
    primary: string
    secondary: string
    textColor: string
    textColorLogo?: string
}

const ProductsSell = ({ title, primary, secondary, textColor, bgColor }: Props) => {
    const demo = [
        'https://betterware.com.mx/cdn/shop/files/banner-cooler-mar26-mobile_900x.png?v=1774614976',
        'https://betterware.com.mx/cdn/shop/files/vitrolux-abril26-mobile_3000x.png?v=1774611821',
    ]

    const heroBgRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onScroll = () => {
            const el = heroBgRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const speed = 0.3
            const y = -rect.top * speed
            el.style.transform = `translateY(${y}px)`
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const products = bazarcitoProducts
    const SHARE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const categories = useMemo(() => {
        const set = new Set<string>(products.map((p) => p.category || 'Otros'))
        return ['Todos', ...Array.from(set)]
    }, [products])

    const visible = products.filter((p) => {
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        return matchesCategory && matchesSearch
    })

    const handleShareProduct = (product: Product) => {
        const pageUrl = `${SHARE_BASE_URL}/bazarcito/product/${product.id}`
        const text = `Adquiere este producto: ${product.name}\nPrecio: ${product.price}\n${product.description}\nMira más productos entrando a mi aplicación: ${pageUrl}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <div style={{ background: bgColor }}>
            <div className="hidden sm:block">
                <NavBar
                    title={title}
                    primary={primary}
                    textColor={textColor}
                    logo=""
                    textColorLogo="#fff"
                    query={searchQuery}
                    onQueryChange={(value) => setSearchQuery(value)}
                />
            </div>
            {/* Hero con efecto parallax */}
            <div className="block sm:hidden xs:block relative w-full overflow-hidden h-60 md:h-96" style={{ background: primary }}>
                <div ref={heroBgRef} className="absolute inset-0 will-change-transform" style={{ transform: 'translateY(0px)' }}>
                    <Image
                        src="/bazar4.jpeg"
                        alt="Hero"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: textColor || '#160612' }}>{title}</h1>
                        <p className="mt-2 text-sm md:text-base text-white/90" style={{ color: textColor }}>Explora todos nuestros productos</p>
                    </div>
                </div>
            </div>

            <section className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: secondary }}>Nuestros Productos</h2>
                <>
                    <div className="flex flex-col gap-3 mb-4">
                        <div className="flex gap-2 flex-wrap">
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {visible.map((p) => (
                            <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="w-full bg-gray-50">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        width={800}
                                        height={600}
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center' }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                                    <div className="mt-3">
                                        <div className="flex flex-col gap-3 min-w-0">
                                            <div className="text-lg font-bold text-gray-900">{p.price}</div>
                                            <button
                                                type="button"
                                                className="w-full px-4 py-2 rounded text-white text-sm md:text-base whitespace-nowrap"
                                                style={{ background: primary }}
                                                onClick={() => window.open(
                                                    `https://wa.me/5571906152?text=${encodeURIComponent(`Hola, quiero realizar el pedido de ${p.name} por ${p.price}. Por favor me pueden confirmar disponibilidad.`)}`,
                                                    '_blank'
                                                )}
                                            >Pedir por WhatsApp</button>
                                            <button
                                                type="button"
                                                className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 text-sm md:text-base whitespace-nowrap hover:bg-gray-50"
                                                onClick={() => handleShareProduct(p)}
                                            >Compartir por WhatsApp</button>
                                        </div>
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
            <section id="info" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>Quienes somos</h2>
                <p className="text-gray-700 text-base mb-2">
                    Somos un equipo apasionado por ofrecer productos de calidad para el cuidado personal y el estilizado. Nuestro objetivo es brindar a nuestros clientes una experiencia de compra sencilla, segura y cercana, con atención personalizada y productos seleccionados cuidadosamente.
                </p>
                <p className="text-gray-700 text-base">
                    Creemos en la importancia de sentirte bien contigo mismo y por eso trabajamos cada día para acercarte lo mejor en cuidado y estilo. ¡Gracias por confiar en nosotros!
                </p>
            </section>
            <section id="promos" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>Promociones</h2>
                <AdsCarousel images={demo} />
            </section>
            <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>¿Quieres vender nuestros productos?</h2>
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
            </section>
            <Footer />
            <MobileMenu primary={primary} whatsappNumber={'5571906152'} />
        </div>
    )
}

export default ProductsSell