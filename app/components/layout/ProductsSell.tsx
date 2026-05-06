'use client'
import { useMemo, useState, useEffect, useRef } from 'react'

// Spinner simple
function Spinner() {
    return (
        <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
    )
}
import AdsCarousel from '../../../components/AdsCarousel'
import Image from 'next/image'
import { FiTrash2 } from 'react-icons/fi'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import MobileMenu from './MobileMenu'
import NavBar from './NavBar'
import ConfirmModal from '../ui/ConfirmModal'
import ToastMessage, { type ToastType } from '../ui/ToastMessage'
import ButtonSpinner from '../ui/ButtonSpinner'
import EditProductModal from '../ui/EditProductModal'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/app/lib/products'

type ProductWithPieces = Product & {
    pieces?: number | null
}

type ProductApiItem = {
    id: string | number
    title?: string
    name?: string
    price?: string | number
    image?: string
    description?: string
    category?: {
        name?: string
    } | null
    pieces?: number | null
    quantity?: number | null
    stock?: number | null
}

type ToastState = {
    message: string
    type: ToastType
} | null

type Props = {
    heroImage?: string
    logo?: string
    title?: string
    bgColor?: string
    primary: string
    secondary: string
    textColor: string
    textColorLogo?: string
    QuienesSomos?: string
    promos?: string[]
    children?: React.ReactNode
    cellPhone?: string
    products?: Product[]
}

const ProductsSell = ({
    heroImage,
    logo,
    title,
    primary,
    secondary,
    textColor,
    bgColor,
    QuienesSomos,
    promos,
    children,
    cellPhone,
    products: productsArray
}: Props) => {
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

    const [products, setProducts] = useState<ProductWithPieces[]>((productsArray || []) as ProductWithPieces[])
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const SHARE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const auth = useAuth()
    const isAdmin = Boolean(auth.user?.role?.name && String(auth.user.role.name).toLowerCase() === 'admin')

    // Edit modal state
    const [editingProduct, setEditingProduct] = useState<ProductWithPieces | null>(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [deletingIds, setDeletingIds] = useState<string[]>([])
    const [openingEditId, setOpeningEditId] = useState<string | null>(null)
    const [savingProductId, setSavingProductId] = useState<string | null>(null)
    const [requestingIds, setRequestingIds] = useState<string[]>([])
    const [sharingIds, setSharingIds] = useState<string[]>([])
    const [toast, setToast] = useState<ToastState>(null)
    const [productPendingDelete, setProductPendingDelete] = useState<ProductWithPieces | null>(null)

    const categories = useMemo(() => {
        const set = new Set<string>(products.map((p) => p.category || 'Otros'))
        return ['Todos', ...Array.from(set)]
    }, [products])

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            setFetchError(null)
            try {
                const res = await fetch('/api/bazarcito/products')
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const body = await res.json()
                const items = (body.data || []) as ProductApiItem[]
                // map backend product shape and include pieces if available
                const mapped: ProductWithPieces[] = items.map((it) => ({
                    id: String(it.id),
                    name: it.title || it.name || '',
                    price: typeof it.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(it.price) : String(it.price || ''),
                    image: it.image || '/placeholder.png',
                    description: it.description || '',
                    category: it.category?.name || 'Otros',
                    pieces: it.pieces ?? it.quantity ?? it.stock ?? null,
                }))
                if (mounted) setProducts(mapped)
            } catch (e: unknown) {
                console.error('Failed to load products', e)
                if (mounted) setFetchError(e instanceof Error ? e.message : String(e))
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    const visible = products.filter((p) => {
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        return matchesCategory && matchesSearch
    })

    const buildShareUrl = (product: Product) => {
        const browserOrigin = typeof window !== 'undefined' ? window.location.origin : ''
        const isLocalhost = browserOrigin.includes('localhost') || browserOrigin.includes('127.0.0.1')
        const baseUrl = !browserOrigin || isLocalhost ? SHARE_BASE_URL : browserOrigin
        const url = new URL(`/share/product/${product.id}`, baseUrl)
        url.searchParams.set('utm_source', 'whatsapp')
        url.searchParams.set('utm_medium', 'share')
        url.searchParams.set('preview', String(Date.now()))
        return url.toString()
    }

    const handleRequestProduct = async (product: Product) => {
        const productId = String(product.id)
        try {
            setRequestingIds((prev) => [...prev, productId])
            const pageUrl = buildShareUrl(product)
            const text = [
                pageUrl,
                '',
                `Hola, quiero realizar el pedido de ${product.name} por ${product.price}.`,
                'Por favor me pueden confirmar disponibilidad.'
            ].join('\n')
            window.open(`https://api.whatsapp.com/send?phone=${cellPhone}&text=${encodeURIComponent(text)}`, '_blank')
        } finally {
            window.setTimeout(() => {
                setRequestingIds((prev) => prev.filter((id) => id !== productId))
            }, 400)
        }
    }

    const handleShareProduct = async (product: Product) => {
        const productId = String(product.id)
        try {
            setSharingIds((prev) => [...prev, productId])
            const pageUrl = buildShareUrl(product)
            const text = [
                pageUrl,
                '',
                `Producto: ${product.name}`,
                `Precio: ${product.price}`,
                product.description || 'Mira este producto en Bazarcito.'
            ].join('\n')
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        } finally {
            window.setTimeout(() => {
                setSharingIds((prev) => prev.filter((id) => id !== productId))
            }, 400)
        }
    }

    return (
        <div style={{ background: bgColor }}>
            <div className="hidden sm:block">
                <NavBar
                    title={title}
                    primary={primary}
                    textColor={textColor}
                    logo={logo}
                    textColorLogo="#fff"
                    query={searchQuery}
                    onQueryChange={(value) => setSearchQuery(value)}
                />
            </div>
            {/* Hero con efecto parallax */}
            <div className="block sm:hidden xs:block relative w-full overflow-hidden h-60 md:h-96" style={{ background: primary }}>
                <div ref={heroBgRef} className="absolute inset-0 will-change-transform" style={{ transform: 'translateY(0px)' }}>
                    <Image
                        src={heroImage || '/placeholder-hero.png'}
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
                {loading && <Spinner />}
                {fetchError && !loading && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {fetchError}
                    </div>
                )}
                <div className="sm:hidden mb-4">
                    <label className="block">
                        <span className="sr-only">Buscar productos</span>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar productos"
                                className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                            />
                        </div>
                    </label>
                </div>
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
                        {visible.map((p) => {
                            return (
                                <div key={p.id} className="relative bg-white rounded-lg shadow overflow-hidden">
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
                                        {isAdmin && (
                                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpeningEditId(String(p.id))
                                                        setEditingProduct(p)
                                                        setModalOpen(true)
                                                        window.setTimeout(() => setOpeningEditId((current) => (current === String(p.id) ? null : current)), 250)
                                                    }}
                                                    aria-label={`Editar ${p.name}`}
                                                    disabled={openingEditId === String(p.id)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-700 transition disabled:opacity-60 disabled:pointer-events-none"
                                                >
                                                    {openingEditId === String(p.id) ? (
                                                        <ButtonSpinner className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                            <path d="M3 17a1 1 0 001 1h12a1 1 0 100-2H4a1 1 0 00-1 1z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductPendingDelete(p)}
                                                    aria-label={`Eliminar ${p.name}`}
                                                    disabled={deletingIds.includes(String(p.id))}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 transition disabled:opacity-60 disabled:pointer-events-none"
                                                >
                                                    {deletingIds.includes(String(p.id)) ? (
                                                        <ButtonSpinner className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <FiTrash2 className="w-5 h-5 text-white" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                                        <div className="mt-3">
                                            <div className="flex flex-col gap-3 min-w-0">
                                                <div className="text-lg font-bold text-gray-900">{p.price}</div>
                                                <div className="text-sm text-gray-500">Piezas: {p.pieces ?? '—'}</div>
                                                <button
                                                    type="button"
                                                    className="w-full px-4 py-2 rounded text-white text-sm md:text-base whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                                    style={{ background: primary }}
                                                    disabled={requestingIds.includes(String(p.id))}
                                                    onClick={() => handleRequestProduct(p)}
                                                >
                                                    {requestingIds.includes(String(p.id)) ? (
                                                        <>
                                                            <ButtonSpinner className="h-4 w-4 text-white" />
                                                            <span>Abriendo...</span>
                                                        </>
                                                    ) : (
                                                        'Pedir por WhatsApp'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 text-sm md:text-base whitespace-nowrap hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                                    disabled={sharingIds.includes(String(p.id))}
                                                    onClick={() => handleShareProduct(p)}
                                                >
                                                    {sharingIds.includes(String(p.id)) ? (
                                                        <>
                                                            <ButtonSpinner className="h-4 w-4 text-gray-800" />
                                                            <span>Abriendo...</span>
                                                        </>
                                                    ) : (
                                                        'Compartir por WhatsApp'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            </section>

            <EditProductModal
                isOpen={isModalOpen}
                key={editingProduct?.id ?? 'none'}
                product={editingProduct}
                isSaving={Boolean(editingProduct) && savingProductId === String(editingProduct?.id)}
                onCancel={() => {
                    setModalOpen(false)
                    setEditingProduct(null)
                }}
                onSave={async (payload) => {
                    if (!editingProduct) return
                    setSavingProductId(String(editingProduct.id))
                    const normalizedPieces = payload.pieces ?? null
                    // call API
                    try {
                        const res = await fetch(`/api/bazarcito/products/${editingProduct.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                        })
                        if (res.ok) {
                            const body = await res.json()
                            const updated = body.data || null
                            if (updated) {
                                setProducts((prev) => prev.map((it) => (String(it.id) === String(updated.id) ? { ...it, name: updated.title || updated.name || payload.name, description: updated.description || payload.description, pieces: updated.pieces ?? normalizedPieces } : it)))
                            }
                            setToast({ message: 'Producto actualizado correctamente.', type: 'success' })
                        } else {
                            setProducts((prev) => prev.map((it) => (String(it.id) === String(editingProduct.id) ? { ...it, name: payload.name, description: payload.description, pieces: normalizedPieces } : it)))
                            setToast({ message: 'Producto actualizado localmente.', type: 'success' })
                        }
                    } catch (e) {
                        console.error('Update error', e)
                        setProducts((prev) => prev.map((it) => (String(it.id) === String(editingProduct.id) ? { ...it, name: payload.name, description: payload.description, pieces: normalizedPieces } : it)))
                        setToast({ message: 'No se pudo actualizar en el servidor; se aplicó localmente.', type: 'error' })
                    } finally {
                        setSavingProductId(null)
                        setModalOpen(false)
                        setEditingProduct(null)
                    }
                }}
            />

            <ConfirmModal
                isOpen={Boolean(productPendingDelete)}
                title="Eliminar producto"
                description={(
                    <>
                        ¿Seguro que quieres eliminar <span className="font-semibold text-gray-900">{productPendingDelete?.name}</span>? Esta acción no se puede deshacer.
                    </>
                )}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={productPendingDelete ? deletingIds.includes(String(productPendingDelete.id)) : false}
                onCancel={() => setProductPendingDelete(null)}
                onConfirm={async () => {
                    const targetProduct = productPendingDelete
                    if (!targetProduct) return
                    const productId = String(targetProduct.id)
                    try {
                        setDeletingIds((prev) => [...prev, productId])
                        const res = await fetch(`/api/bazarcito/products/${targetProduct.id}`, { method: 'DELETE' })
                        if (res.ok || res.status === 204) {
                            setProducts((prev) => prev.filter((it) => String(it.id) !== productId))
                            setToast({ message: 'Producto eliminado correctamente.', type: 'success' })
                            setProductPendingDelete(null)
                        } else {
                            const body = await res.json().catch(() => ({}))
                            console.error('Failed to delete product', body)
                            setToast({ message: `No se pudo eliminar: ${body?.error || res.status}`, type: 'error' })
                        }
                    } catch (e) {
                        console.error('Delete error', e)
                        setToast({ message: 'Error al eliminar el producto.', type: 'error' })
                    } finally {
                        setDeletingIds((prev) => prev.filter((id) => id !== productId))
                    }
                }}
            />

            {toast && (
                <ToastMessage
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="hidden md:block">
                <FloatingWhatsApp
                    whatsappNumber={cellPhone}
                    message={`Hola, quiero reservar en ${title}`}
                    className="top-6 right-6 md:top-auto md:bottom-6 md:right-6 lg:bottom-8"
                />
            </div>
            <section id="info" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>¿Quiénes somos?</h2>
                <p className="text-gray-700 text-base mb-2">
                    {QuienesSomos}
                </p>
            </section>
            <section id="promos" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>Promociones</h2>
                <AdsCarousel images={promos} />
            </section>
            {children}
            <Footer />
            <MobileMenu primary={primary} whatsappNumber={cellPhone} />
        </div>
    )
}

export default ProductsSell