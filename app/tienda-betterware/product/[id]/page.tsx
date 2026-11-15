import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBazarcitoProductById } from '../../../lib/products'
import { betterwareTheme } from '../../../lib/storeTheme'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return value.startsWith('/') ? `${siteUrl}${value}` : `${siteUrl}/${value}`
}

const toShareImageUrl = (value: string) => {
    const absoluteUrl = toAbsoluteUrl(value)
    if (!absoluteUrl.includes('/upload/')) return absoluteUrl
    return absoluteUrl.replace('/upload/', '/upload/f_jpg,q_auto:good,c_limit,w_1200/')
}

const guessImageType = (url: string) => {
    if (/\.png(\?|$)/i.test(url)) return 'image/png'
    if (/\.webp(\?|$)/i.test(url)) return 'image/webp'
    if (/\.svg(\?|$)/i.test(url)) return 'image/svg+xml'
    return 'image/jpeg'
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await getBazarcitoProductById(id)

    if (!product) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Tienda Betterware',
        }
    }

    const productUrl = `${siteUrl}/tienda-betterware/product/${product.id}`
    const imageUrl = toAbsoluteUrl(product.image)
    const shareImageUrl = toShareImageUrl(product.image)
    const imageType = shareImageUrl !== imageUrl ? 'image/jpeg' : guessImageType(imageUrl)
    const description =
        product.description?.trim() ||
        `${product.name} - Disponible en Tienda Betterware por ${product.price}`

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'es_MX',
            url: productUrl,
            siteName: 'Tienda Betterware',
            title: product.name,
            description,
            images: [
                {
                    url: shareImageUrl,
                    secureUrl: shareImageUrl,
                    type: imageType,
                    alt: product.name,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description,
            images: [shareImageUrl],
        },
        other: {
            'og:image:secure_url': shareImageUrl,
            'og:image:type': imageType,
            'og:description': description,
            'twitter:description': description,
        },
    }
}

export default async function BetterwareProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getBazarcitoProductById(id)

    if (!product) notFound()

    const hasPromotion =
        product.promotionPrice != null &&
        String(product.promotionPrice).trim() !== '' &&
        String(product.promotionPrice) !== String(product.price)

    return (
        <main
            className="min-h-screen px-4 py-10"
            style={{ backgroundColor: betterwareTheme.background, color: betterwareTheme.text }}
        >
            <div
                className="mx-auto max-w-4xl overflow-hidden rounded-3xl border"
                style={{
                    backgroundColor: betterwareTheme.secondary,
                    borderColor: betterwareTheme.border,
                }}
            >
                <div className="relative h-80" style={{ backgroundColor: betterwareTheme.primary }}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <div className="p-6">
                    <p
                        className="mb-2 text-sm font-semibold uppercase tracking-wide"
                        style={{ color: betterwareTheme.mutedText }}
                    >
                        {product.category}
                    </p>
                    <h1 className="text-3xl font-extrabold mb-3" style={{ color: betterwareTheme.text }}>
                        {product.name}
                    </h1>
                    {hasPromotion ? (
                        <div className="mb-4">
                            <div
                                className="text-sm line-through"
                                style={{ color: betterwareTheme.mutedText }}
                            >
                                {product.price}
                            </div>
                            <div
                                className="text-xl font-semibold"
                                style={{ color: betterwareTheme.text }}
                            >
                                {product.promotionPrice}
                            </div>
                        </div>
                    ) : (
                        <p
                            className="text-xl font-semibold mb-4"
                            style={{ color: betterwareTheme.text }}
                        >
                            {product.price}
                        </p>
                    )}
                    <p className="leading-7 mb-4" style={{ color: betterwareTheme.mutedText }}>
                        {product.description}
                    </p>
                    {product.details && product.details.length > 0 ? (
                        <div className="mb-4">
                            <h2
                                className="mb-2 text-sm font-semibold"
                                style={{ color: betterwareTheme.text }}
                            >
                                Detalles
                            </h2>
                            <ul className="space-y-1 text-sm" style={{ color: betterwareTheme.mutedText }}>
                                {product.details.map((detail, index) => (
                                    <li key={`${detail.label}-${index}`} className="flex gap-2">
                                        <span className="font-semibold">{detail.label}:</span>
                                        <span>{detail.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    <Link
                        href="/tienda-betterware"
                        className="inline-block mt-3 text-sm font-semibold hover:brightness-110"
                        style={{ color: betterwareTheme.text }}
                    >
                        Ver más productos
                    </Link>
                </div>
            </div>
        </main>
    )
}
