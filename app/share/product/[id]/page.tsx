import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBazarcitoProductById } from '../../../lib/products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    return value.startsWith('http') ? value : `${siteUrl}${value}`
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await getBazarcitoProductById(id)

    if (!product) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Bazarcito',
        }
    }

    const shareUrl = `${siteUrl}/share/product/${product.id}`
    const productUrl = `${siteUrl}/bazarcito/product/${product.id}`
    const imageUrl = toAbsoluteUrl(product.image)
    const description = product.description?.trim() || `Descubre ${product.name} en Bazarcito por ${product.price}.`

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description,
        keywords: [product.name, product.category, 'Bazarcito', 'WhatsApp', 'producto'],
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'es_MX',
            url: shareUrl,
            siteName: 'brain-tech-kappa',
            title: product.name,
            description,
            images: [
                {
                    url: imageUrl,
                    secureUrl: imageUrl,
                    type: 'image/jpeg',
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
            'og:image:type': 'image/jpeg',
            'og:description': description,
            'twitter:description': description,
        },
    }
}

export default async function ShareProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getBazarcitoProductById(id)

    if (!product) return notFound()

    return (
        <main className="min-h-screen bg-[#fff4fb] py-10 px-4">
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
                    <p className="text-sm font-semibold text-pink-600 mb-2">Vista previa para compartir</p>
                    <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
                    <p className="text-xl font-semibold text-pink-600 mb-4">{product.price}</p>
                    <p className="text-gray-700 leading-7 mb-4">{product.description || 'Disponible en Bazarcito.'}</p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/bazarcito/product/${product.id}`}
                            className="inline-block px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700"
                        >
                            Ver detalle del producto
                        </Link>
                        <Link
                            href="/bazarcito"
                            className="inline-block px-4 py-2 rounded border border-pink-200 text-pink-600 font-semibold hover:bg-pink-50"
                        >
                            Ver más productos
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
