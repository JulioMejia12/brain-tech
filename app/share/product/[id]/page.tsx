import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBazarcitoProductById } from '../../../lib/products'
import { getMarronProductById } from '../../../marron/services/products'
import { getCremeriaProductById } from '../../../cremeria/services/products'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

type ShareStore = 'bazarcito' | 'marron' | 'cremeria'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    return value.startsWith('http') ? value : `${siteUrl}${value}`
}

function getStoreFromSearchParams(searchParams?: { [key: string]: string | string[] | undefined }): ShareStore {
    const rawStore = searchParams?.store
    const store = Array.isArray(rawStore) ? rawStore[0] : rawStore
    if (store === 'marron' || store === 'cremeria') return store
    return 'bazarcito'
}

async function getProductByStore(store: ShareStore, id: string) {
    if (store === 'marron') return getMarronProductById(id)
    if (store === 'cremeria') return getCremeriaProductById(id)
    return getBazarcitoProductById(id)
}

function getStoreConfig(store: ShareStore) {
    if (store === 'marron') {
        return {
            name: 'Marron',
            accent: '#b45309',
            background: '#f7efe9',
            listingHref: '/marron',
            detailHref: '/marron/product',
            descriptionFallback: 'Disponible en Marron.',
        }
    }

    if (store === 'cremeria') {
        return {
            name: 'Cremería online',
            accent: '#0ea5a4',
            background: '#fff4fb',
            listingHref: '/cremeria',
            detailHref: '/cremeria/product',
            descriptionFallback: 'Disponible en Cremería online.',
        }
    }

    return {
        name: 'Bazarcito',
        accent: '#db2777',
        background: '#fff4fb',
        listingHref: '/bazarcito',
        detailHref: '/bazarcito/product',
        descriptionFallback: 'Disponible en Bazarcito.',
    }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const { id } = await params
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const store = getStoreFromSearchParams(resolvedSearchParams)
    const storeConfig = getStoreConfig(store)
    const product = await getProductByStore(store, id)

    if (!product) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: `Producto no encontrado en ${storeConfig.name}`,
        }
    }

    const shareUrl = `${siteUrl}/share/product/${product.id}?store=${store}`
    const productUrl = `${siteUrl}${storeConfig.detailHref}/${product.id}`
    const imageUrl = toAbsoluteUrl(product.image)
    const guessImageType = (u: string) => {
        if (!u) return 'image/jpeg'
        if (/\.png(\?|$)/i.test(u)) return 'image/png'
        if (/\.webp(\?|$)/i.test(u)) return 'image/webp'
        if (/\.svg(\?|$)/i.test(u)) return 'image/svg+xml'
        return 'image/jpeg'
    }
    const imageType = guessImageType(imageUrl)
    const description = product.description?.trim() || `Descubre ${product.name} en ${storeConfig.name} por ${product.price}.`

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description,
        keywords: [product.name, product.category, storeConfig.name, 'WhatsApp', 'producto'],
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'es_MX',
            url: shareUrl,
            siteName: storeConfig.name,
            title: product.name,
            description,
            images: [
                {
                    url: imageUrl,
                    secureUrl: imageUrl,
                    type: imageType,
                    alt: product.name,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@braintech',
            title: product.name,
            description,
            images: [imageUrl],
        },
        other: {
            'og:image:secure_url': imageUrl,
            'og:image:type': imageType,
            'og:description': description,
            'twitter:description': description,
        },
    }
}

export default async function ShareProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { id } = await params
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const store = getStoreFromSearchParams(resolvedSearchParams)
    const storeConfig = getStoreConfig(store)
    const product = await getProductByStore(store, id)

    if (!product) return notFound()
    const previewParam = Array.isArray((resolvedSearchParams as any)?.preview) ? (resolvedSearchParams as any).preview[0] : (resolvedSearchParams as any)?.preview
    const previewSegment = previewParam ? `&preview=${String(previewParam)}` : ''
    const shareLinkVisible = `${siteUrl}/share/product/${product.id}?store=${store}${previewSegment}`
    const hostDomain = new URL(siteUrl).host

    return (
        <main className="min-h-screen py-10 px-4" style={{ background: storeConfig.background }}>
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative h-80 bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="p-6">
                    <p className="text-sm font-semibold mb-2" style={{ color: storeConfig.accent }}>Vista previa para compartir</p>
                    <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
                    <p className="text-xl font-semibold mb-4" style={{ color: storeConfig.accent }}>{product.price}</p>
                    <p className="text-gray-700 leading-7 mb-4">{product.description || storeConfig.descriptionFallback}</p>
                    {store === 'marron' && (
                        <div className="mb-4 text-sm text-gray-600">
                            <div className="mb-1">{hostDomain}</div>
                            <a href={shareLinkVisible} className="break-words text-green-600 underline">{shareLinkVisible}</a>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`${storeConfig.detailHref}/${product.id}`}
                            className="inline-block px-4 py-2 rounded text-white font-semibold"
                            style={{ background: storeConfig.accent }}
                        >
                            Ver detalle del producto
                        </Link>
                        <Link
                            href={storeConfig.listingHref}
                            className="inline-block px-4 py-2 rounded border font-semibold"
                            style={{ borderColor: `${storeConfig.accent}33`, color: storeConfig.accent }}
                        >
                            Ver más productos
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
