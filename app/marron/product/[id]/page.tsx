import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getMarronProductById, getMarronProducts } from '../../services/products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'
const fallbackImage = 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779923687/WhatsApp_Image_2026-05-20_at_10.56.58_PM_xxualo.jpg'

const toAbsoluteUrl = (value: string) => {
    if (!value) return fallbackImage
    // If already absolute (http/https), return as-is
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    // If relative path, prepend site URL
    return value.startsWith('/') ? `${siteUrl}${value}` : `${siteUrl}/${value}`
}

export async function generateStaticParams() {
    const products = (await getMarronProducts()) || []
    return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await getMarronProductById(id)

    if (!product) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Marron',
        }
    }

    const productUrl = `${siteUrl}/marron/product/${product.id}`
    const imageUrl = toAbsoluteUrl(product.image)
    const description = product.description || `${product.name} - Disponible en Marron`

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description: description,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            type: 'product',
            url: productUrl,
            siteName: 'Marron',
            title: product.name,
            description: description,
            images: [
                {
                    url: imageUrl,
                    secureUrl: imageUrl,
                    alt: product.name,
                    width: 1200,
                    height: 630,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description,
            images: [imageUrl],
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getMarronProductById(id)

    if (!product) {
        const apiUrl = `${siteUrl}/api/products/${id}?negocioId=2`
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="max-w-xl p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                    <p className="mb-2">No se encontró el producto con id {id} en Marron.</p>
                    <p className="mb-4">Comprueba la API aquí: <a href={apiUrl} className="text-amber-700 underline">{apiUrl}</a></p>
                    <p className="text-sm text-gray-500">Si debería existir, verifica que el producto pertenezca al `negocioId = 2`.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#f7efe9] py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative h-80 bg-gray-100">
                    <Image src={product.image} alt={product.name} fill unoptimized style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
                    <p className="text-xl font-semibold text-amber-700 mb-4">{product.price}</p>
                    <p className="text-gray-700 leading-7 mb-4">{product.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Categoría: {product.category}</p>
                    {product.details && product.details.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalles</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                {product.details.map((d, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="font-semibold">{d.label}:</span>
                                        <span>{d.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Link href="/marron" className="inline-block mt-3 text-sm font-semibold text-amber-700 hover:text-amber-900">
                        Ver más productos
                    </Link>
                </div>
            </div>
        </main>
    )
}
