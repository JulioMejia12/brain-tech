'use client'
import { useMemo, useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const DEFAULT_NEGOCIO_ID = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || ''

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
import PromotionsClient from '../../../components/PromotionsClient'
import Image from 'next/image'
import { FiTrash2 } from 'react-icons/fi'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import MobileMenu from './MobileMenu'
import ConfirmModal from '../ui/ConfirmModal'
import ToastMessage, { type ToastType } from '../ui/ToastMessage'
import ButtonSpinner from '../ui/ButtonSpinner'
import EditProductModal from '@/app/components/ui/EditProductModal'
import { useAuth } from '@/contexts/AuthContext'
import type { Product } from '@/app/lib/products'
import MobileStoreHeader, { type MobileStoreHeaderProps } from './MobileStoreHeader'

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
    negocioId?: number | null
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
    title?: string
    bgColor?: string
    primary: string
    secondary: string
    textColor: string
    QuienesSomos?: string
    promos?: Array<string | { id?: string | number; image?: string }>
    promosComponent?: React.ReactNode
    children?: React.ReactNode
    cellPhone?: string
    products?: Product[]
    productsEndpoint?: string
    productMutationBase?: string
    mobileHero?: MobileStoreHeaderProps
    mobileHeroVariant?: 'default' | 'compact-card'
    mobileHeroSubtitle?: string
}

const DEFAULT_PRODUCTS_ENDPOINT = '/api/bazarcito/products'

function getOptimizedHeroImage(src?: string) {
    const fallback = 'https://res.cloudinary.com/ddfj0omil/image/upload/q_auto:best,f_auto,dpr_auto,c_fit,w_1600/v1778198183/laptop-store_tbir4n.png'
    if (!src) return fallback

    if (src.includes('/upload/')) {
        return src.replace('/upload/', '/upload/q_auto:best,f_auto,dpr_auto,c_fit,w_1600/')
    }

    return src
}

function mapProductApiItem(it: ProductApiItem): ProductWithPieces {
    return {
        id: String(it.id),
        name: it.title || it.name || '',
        price: typeof it.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(it.price) : String(it.price || ''),
        promotionPrice: (typeof (it as any).promotionPrice === 'number') ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format((it as any).promotionPrice) : String((it as any).promotionPrice ?? (it as any).promotion_price ?? (it as any).promoPrice ?? ''),
        image: it.image || '/placeholder.png',
        description: it.description || '',
        negocioId: it.negocioId == null ? null : Number(it.negocioId),
        details: Array.isArray((it as any).details) ? (it as any).details.map((d: any) => ({ label: String(d?.label ?? ''), value: String(d?.value ?? '') })) : undefined,
        category: it.category?.name || 'Otros',
        pieces: it.pieces ?? it.quantity ?? it.stock ?? null,
    }
}

const ProductsSell = ({
    heroImage,
    title,
    primary,
    secondary,
    bgColor,
    QuienesSomos,
    promos,
    promosComponent,
    children,
    cellPhone,
    products: productsArray,
    productsEndpoint,
    productMutationBase,
    mobileHero,
    mobileHeroVariant = 'default',
    mobileHeroSubtitle,
    textColor,
}: Props) => {
    const resolvedProductsEndpoint = productsEndpoint || DEFAULT_PRODUCTS_ENDPOINT
    const resolvedProductMutationBase = productMutationBase || resolvedProductsEndpoint.split('?')[0]
    const whatsappDigits = String(cellPhone || '').replace(/[^0-9]/g, '')

    const [products, setProducts] = useState<ProductWithPieces[]>((productsArray || []) as ProductWithPieces[])
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const SHARE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q')?.trim() ?? ''

    const updateSearchQuery = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value.trim()) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    }

    const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
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
    const resolvedHeroImage = getOptimizedHeroImage(heroImage)
    const storeBasePath = useMemo(() => {
        const parts = String(pathname || '/').split('/').filter(Boolean)
        return parts.length > 0 ? `/${parts[0]}` : ''
    }, [pathname])

    // Apply the store theme into CSS variables so global styles (including
    // the .dark rule that references --secondary) pick up the store colors.
    useEffect(() => {
        try {
            const root = document.documentElement
            const prev = {
                background: getComputedStyle(root).getPropertyValue('--background') || '',
                primary: getComputedStyle(root).getPropertyValue('--primary') || '',
                secondary: getComputedStyle(root).getPropertyValue('--secondary') || '',
                foreground: getComputedStyle(root).getPropertyValue('--foreground') || '',
            }

            if (bgColor) root.style.setProperty('--background', bgColor)
            if (primary) root.style.setProperty('--primary', primary)
            if (secondary) root.style.setProperty('--secondary', secondary)
            if (textColor) root.style.setProperty('--foreground', textColor)

            return () => {
                try {
                    if (prev.background) root.style.setProperty('--background', prev.background)
                    if (prev.primary) root.style.setProperty('--primary', prev.primary)
                    if (prev.secondary) root.style.setProperty('--secondary', prev.secondary)
                    if (prev.foreground) root.style.setProperty('--foreground', prev.foreground)
                } catch (e) {
                    // ignore
                }
            }
        } catch (e) {
            // ignore in non-browser environments
        }
    }, [bgColor, primary, secondary, textColor])

    const categories = useMemo(() => {
        const set = new Set<string>(products.map((p) => p.category || 'Otros'))
        return ['Todos', ...Array.from(set)]
    }, [products])

    useEffect(() => {
        let mounted = true

        const normalized = (productsArray as any[] | undefined)?.map((p) => ({
            ...p,
            pieces: (p as any).pieces ?? (p as any).stock ?? null,
        })) as ProductWithPieces[] | undefined

        if (normalized) {
            setProducts(normalized)
            setFetchError(null)
        } else {
            setProducts([])
        }

        async function refreshProducts() {
            try {
                setLoading(true)
                const res = await fetch(resolvedProductsEndpoint, { cache: 'no-store' })
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }

                const body = await res.json()
                const items = Array.isArray(body?.data) ? body.data : []
                const mapped = items.map(mapProductApiItem)

                if (mounted) {
                    setProducts(mapped)
                    setFetchError(null)
                }
            } catch (error: unknown) {
                console.error('Failed to refresh products from API', error)
                if (mounted && !normalized) {
                    setFetchError(error instanceof Error ? error.message : String(error))
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        void refreshProducts()

        return () => {
            mounted = false
        }
    }, [productsArray, resolvedProductsEndpoint])

    const visible = products.filter((p) => {
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        return matchesCategory && matchesSearch
    })
    const buildShareUrl = (product: Product) => {
        const browserOrigin = typeof window !== 'undefined' ? window.location.origin : ''
        const isLocalhost = browserOrigin.includes('localhost') || browserOrigin.includes('127.0.0.1')
        const baseUrl = !browserOrigin || isLocalhost ? SHARE_BASE_URL : browserOrigin
        const detailPath = `${storeBasePath || ''}/product/${product.id}`
        const url = new URL(detailPath, baseUrl)
        url.searchParams.set('utm_source', 'whatsapp')
        url.searchParams.set('utm_medium', 'share')
        url.searchParams.set('preview', String(Date.now()))
        return url.toString()
    }

    const handleRequestProduct = async (product: Product) => {
        const productId = String(product.id)
        try {
            setRequestingIds((prev) => [...prev, productId])
            if (!whatsappDigits) return
            const pageUrl = buildShareUrl(product)
            const detailsText = (product as any).details && Array.isArray((product as any).details) && (product as any).details.length
                ? (product as any).details
                    .filter((d: any) => (d?.label && String(d.label).trim() !== '') || (d?.value && String(d.value).trim() !== ''))
                    .map((d: any) => `• ${d.label}: ${d.value}`)
                    .join('\n')
                : ''
            const textParts = [pageUrl, '', `Hola, quiero realizar el pedido de ${product.name} por ${product.price}.`]
            if (detailsText) textParts.push('', detailsText)
            textParts.push('', 'Por favor me pueden confirmar disponibilidad.')
            const text = textParts.join('\n')
            window.open(`https://api.whatsapp.com/send?phone=${whatsappDigits}&text=${encodeURIComponent(text)}`, '_blank')
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
            const detailsText = (product as any).details && Array.isArray((product as any).details) && (product as any).details.length
                ? (product as any).details
                    .filter((d: any) => (d?.label && String(d.label).trim() !== '') || (d?.value && String(d.value).trim() !== ''))
                    .map((d: any) => `• ${d.label}: ${d.value}`)
                    .join('\n')
                : ''
            const textParts = [pageUrl, '', `Producto: ${product.name}`, `Precio: ${product.price}`, product.description || `Mira este producto en ${title || 'nuestra tienda'}.`]
            if (detailsText) textParts.push('', detailsText)
            const text = textParts.join('\n')
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        } finally {
            window.setTimeout(() => {
                setSharingIds((prev) => prev.filter((id) => id !== productId))
            }, 400)
        }
    }

    return (
        <div style={{ background: bgColor }}>
            <div className="block sm:hidden xs:block relative z-30 w-full overflow-visible bg-white" style={{ background: primary }}>
                {mobileHero ? (
                    <MobileStoreHeader
                        {...mobileHero}
                        imageSrc={getOptimizedHeroImage(mobileHero.imageSrc || heroImage)}
                        title={mobileHero.title || title}
                    />
                ) : mobileHeroVariant === 'compact-card' ? (
                    <div className="mx-auto px-4 pb-5 pt-4">
                        <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-sm">
                            <div className="px-4 pb-3 pt-4 text-center">
                                <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
                                    {mobileHeroSubtitle || 'Catálogo online'}
                                </span>
                            </div>
                            <div className="px-3 pb-3">
                                <div className="relative overflow-hidden rounded-[24px] bg-[#fffaf6] p-2 shadow-inner">
                                    <Image
                                        src={resolvedHeroImage}
                                        alt={title || 'Hero'}
                                        width={800}
                                        height={800}
                                        priority
                                        quality={100}
                                        sizes="100vw"
                                        className="h-auto max-h-[250px] w-full rounded-[18px] object-contain object-center"
                                    />
                                </div>
                            </div>
                            <div className="px-5 pb-5 text-center">
                                <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
                                <p className="mt-1 text-sm text-white/80">Descubre novedades prácticas para tu hogar.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative mx-auto flex min-h-[360px] items-center justify-center px-4 py-4">
                        <Image
                            src={resolvedHeroImage}
                            alt={title || 'Hero'}
                            width={800}
                            height={800}
                            priority
                            quality={100}
                            sizes="100vw"
                            className="h-auto max-h-[520px] w-full object-contain object-center"
                        />
                    </div>
                )}
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
                                onChange={(e) => updateSearchQuery(e.target.value)}
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
                                                        console.info('[ProductsSell] opening edit modal for', p)
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
                                        {p.details && p.details.length > 0 && (
                                            <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                                {p.details.slice(0, 3).map((d) => (
                                                    <li key={`${d.label}-${d.value}`}><span className="font-semibold">{d.label}:</span> {d.value}</li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="mt-3">
                                            <div className="flex flex-col gap-3 min-w-0">
                                                {(() => {
                                                    const promoRaw = (p as any).promotionPrice ?? (p as any).promotion_price ?? (p as any).promoPrice ?? null
                                                    if (promoRaw == null || String(promoRaw).trim() === '') {
                                                        return <div className="text-lg font-bold text-gray-900">{p.price}</div>
                                                    }

                                                    // Try to parse numeric value from the promo (handles formatted strings)
                                                    const parsed = Number(String(promoRaw).replace(/[^0-9.-]/g, ''))
                                                    const hasPositivePromo = !Number.isNaN(parsed) && parsed > 0
                                                    if (!hasPositivePromo) {
                                                        return <div className="text-lg font-bold text-gray-900">{p.price}</div>
                                                    }

                                                    const promoDisplay = typeof promoRaw === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(promoRaw) : String(promoRaw)
                                                    return (
                                                        <div className="flex flex-col">
                                                            <div className="text-sm text-gray-500 line-through">{p.price}</div>
                                                            <div className="text-lg font-bold" style={{ color: primary }}>{promoDisplay}</div>
                                                        </div>
                                                    )
                                                })()}
                                                {(() => {
                                                    const raw = (p as any).pieces ?? (p as any).stock ?? (p as any).quantity ?? null
                                                    const disp = raw == null || raw === '' ? null : Number(raw)
                                                    return (
                                                        <div className="text-sm text-gray-500">Piezas: {disp == null ? '—' : String(disp)}</div>
                                                    )
                                                })()}
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
                onSave={async (payload: any) => {
                    if (!editingProduct) return
                    setSavingProductId(String(editingProduct.id))
                    const normalizedPieces = payload.pieces ?? null
                    const resolvedNegocioId = payload.negocioId ?? editingProduct.negocioId ?? (DEFAULT_NEGOCIO_ID ? Number(DEFAULT_NEGOCIO_ID) : undefined)
                    // call API
                    try {
                        let res: Response
                        // if imageFile provided, send multipart/form-data so the server can upload it
                        if ((payload as any).imageFile) {
                            const form = new FormData()
                            form.append('title', String(payload.name ?? editingProduct.name))
                            if (payload.description !== undefined) form.append('description', String(payload.description))
                            if (payload.price !== undefined) form.append('price', String(payload.price))
                            if (payload.promotionPrice !== undefined) form.append('promotionPrice', String(payload.promotionPrice))
                            // stock removed from edit payload
                            if (payload.pieces !== undefined) form.append('pieces', String(payload.pieces))
                            if (payload.details !== undefined) form.append('details', JSON.stringify(payload.details))
                            if (resolvedNegocioId !== undefined) form.append('negocioId', String(resolvedNegocioId))
                            if (payload.category) form.append('category', String(payload.category))
                            const file = (payload as any).imageFile as File
                            form.append('imageFile', file)

                            res = await fetch(`${resolvedProductMutationBase}/${editingProduct.id}`, {
                                method: 'PUT',
                                body: form,
                            })
                        } else {
                            res = await fetch(`${resolvedProductMutationBase}/${editingProduct.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...payload, negocioId: resolvedNegocioId }),
                            })
                        }
                        if (res.ok) {
                            const body = await res.json()
                            const updated = body.data || null
                            if (updated) {
                                setProducts((prev) => prev.map((it) => {
                                    if (String(it.id) !== String(updated.id)) return it
                                    const newName = String(updated.title || updated.name || payload.name || it.name)
                                    const newDescription = String(updated.description ?? payload.description ?? it.description ?? '')
                                    const newPieces = updated.pieces ?? updated.stock ?? normalizedPieces ?? it.pieces
                                    const newDetails = (updated as any).details ?? payload.details ?? it.details
                                    const newImage = String(updated.image ?? it.image ?? '')
                                    const newNegocioId = updated.negocioId ?? payload.negocioId ?? it.negocioId ?? null
                                    const newCategory = String((updated.category && (updated.category.name || updated.category)) || payload.category || it.category || '')
                                    const newPrice = (updated.price !== undefined && updated.price !== null) ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(updated.price)) : (payload.price ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(payload.price)) : it.price)
                                    const formatPromo = (val: any, fallback: any) => {
                                        if (val === undefined) return fallback
                                        if (val === null) return undefined
                                        const n = Number(val)
                                        if (Number.isNaN(n)) return fallback
                                        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
                                    }
                                    const newPromotionPrice = formatPromo((updated as any).promotionPrice, (payload.promotionPrice !== undefined ? formatPromo(payload.promotionPrice, it.promotionPrice ?? undefined) : it.promotionPrice ?? undefined))
                                    return { ...it, name: newName, description: newDescription, pieces: newPieces, details: newDetails, image: newImage, negocioId: newNegocioId, category: newCategory, price: newPrice, promotionPrice: newPromotionPrice }
                                }))
                            }
                            setToast({ message: 'Producto actualizado correctamente.', type: 'success' })
                        } else {
                            setProducts((prev) => prev.map((it) => (String(it.id) === String(editingProduct.id) ? {
                                ...it,
                                name: String(payload.name ?? it.name),
                                description: String(payload.description ?? it.description),
                                pieces: normalizedPieces ?? it.pieces,
                                image: String(it.image),
                                negocioId: payload.negocioId ?? it.negocioId,
                                category: String(payload.category ?? it.category),
                                price: payload.price ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(payload.price)) : it.price,
                                promotionPrice: payload.promotionPrice === null ? undefined : (payload.promotionPrice ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(payload.promotionPrice)) : it.promotionPrice)
                            } : it)))
                            setToast({ message: 'Producto actualizado localmente.', type: 'success' })
                        }
                    } catch (e) {
                        console.error('Update error', e)
                        setProducts((prev) => prev.map((it) => (String(it.id) === String(editingProduct.id) ? {
                            ...it,
                            name: String(payload.name ?? it.name),
                            description: String(payload.description ?? it.description),
                            pieces: normalizedPieces ?? it.pieces,
                            image: String(it.image),
                            negocioId: payload.negocioId ?? it.negocioId,
                            category: String(payload.category ?? it.category),
                            price: payload.price ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(payload.price)) : it.price,
                            promotionPrice: payload.promotionPrice === null ? undefined : (payload.promotionPrice ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(payload.promotionPrice)) : it.promotionPrice)
                        } : it)))
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
                        const res = await fetch(`${resolvedProductMutationBase}/${targetProduct.id}`, { method: 'DELETE' })
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
                    whatsappNumber={whatsappDigits}
                    message={`Hola, me interesan los productos de ${title}. ¿Me pueden compartir información y promociones disponibles?`}
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
                <div>
                    {promosComponent ?? <PromotionsClient items={promos} />}
                </div>
            </section>
            {children ? <div>{children}</div> : null}
            <MobileMenu primary={primary} whatsappNumber={whatsappDigits} />
        </div>
    )
}

export default ProductsSell