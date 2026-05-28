import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getMarronProductById, getMarronProducts } from '../../services/products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    return value.startsWith('http') ? value : `${siteUrl}${value}`
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

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description: product.description,
        openGraph: {
            type: 'website',
            url: productUrl,
            siteName: 'LocalHub',
            title: product.name,
            description: product.description,
            images: [{ url: imageUrl, alt: product.name, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
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
