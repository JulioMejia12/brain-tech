import Image from 'next/image'
import Link from 'next/link'
import { cremeriaProductsSellProps } from '@/app/lib/productsSellConfig'
import { mapItemToProduct } from '@/app/lib/products/mappers'
import type { Metadata } from 'next'
import type { Product } from '@/app/lib/products/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    return value.startsWith('http') ? value : `${siteUrl}${value}`
}

export async function generateStaticParams() {
    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/products?negocioId=${encodeURIComponent(String(negocioId))}&limit=1000`, base).toString()
    try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return []
        const body = await res.json().catch(() => ({ data: [] }))
        const items = Array.isArray(body?.data) ? body.data : []
        const products: Product[] = items.map(mapItemToProduct)
        return products.map((product: Product) => ({ id: product.id }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/products/${encodeURIComponent(String(id))}?negocioId=${encodeURIComponent(String(negocioId))}`, base).toString()
    try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
            return {
                metadataBase: new URL(siteUrl),
                title: 'Producto no encontrado',
                description: 'Producto no encontrado en Cremería',
            }
        }
        const body = await res.json().catch(() => ({}))
        const item = body.data || body
        if (!item) {
            return {
                metadataBase: new URL(siteUrl),
                title: 'Producto no encontrado',
                description: 'Producto no encontrado en Cremería',
            }
        }
        const product = mapItemToProduct(item)

        const productUrl = `${siteUrl}/cremeria/product/${product.id}`
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
                images: [
                    {
                        url: imageUrl,
                        alt: product.name,
                        width: 1200,
                        height: 630,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description,
                images: [imageUrl],
            },
        };
    } catch (e) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Cremería',
        }
    }
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const apiUrl = `${siteUrl}/api/products/${id}?negocioId=${encodeURIComponent(String(negocioId))}`
    try {
        const res = await fetch(apiUrl, { cache: 'no-store' })
        if (!res.ok) {
            return (
                <main className="min-h-screen flex items-center justify-center">
                    <div className="max-w-xl p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                        <p className="mb-2">No se encontró el producto con id {id}.</p>
                        <p className="mb-4">Comprueba la API aquí: <a href={apiUrl} className="text-pink-600 underline">{apiUrl}</a></p>
                        <p className="text-sm text-gray-500">Si debería existir, verifica que `DATABASE_URL` y `NEXT_PUBLIC_SITE_URL` estén correctamente configuradas y que el producto exista en la base de datos.</p>
                    </div>
                </main>
            )
        }

        const body = await res.json().catch(() => ({}))
        const item = body.data || body
        if (!item) {
            return (
                <main className="min-h-screen flex items-center justify-center">
                    <div className="max-w-xl p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                        <p className="mb-2">No se encontró el producto con id {id}.</p>
                        <p className="mb-4">Comprueba la API aquí: <a href={apiUrl} className="text-pink-600 underline">{apiUrl}</a></p>
                        <p className="text-sm text-gray-500">Si debería existir, verifica que `DATABASE_URL` y `NEXT_PUBLIC_SITE_URL` estén correctamente configuradas y que el producto exista en la base de datos.</p>
                    </div>
                </main>
            )
        }

        const product = mapItemToProduct(item)
        return (
            <main className="min-h-screen bg-[#fff4fb] py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
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
                        <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
                        <p className="text-xl font-semibold" style={{ color: cremeriaProductsSellProps.primary, marginBottom: 16 }}>{product.price}</p>
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
                        <Link
                            href="/cremeria"
                            className="inline-block mt-3 text-sm font-semibold"
                            style={{ color: cremeriaProductsSellProps.primary }}
                        >
                            Ver más productos
                        </Link>
                    </div>
                </div>
            </main>
        );
    } catch {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="max-w-xl p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                    <p className="mb-2">No se encontró el producto con id {id}.</p>
                    <p className="mb-4">Comprueba la API aquí: <a href={apiUrl} className="text-pink-600 underline">{apiUrl}</a></p>
                    <p className="text-sm text-gray-500">Si debería existir, verifica que `DATABASE_URL` y `NEXT_PUBLIC_SITE_URL` estén correctamente configuradas y que el producto exista en la base de datos.</p>
                </div>
            </main>
        )
    }
}

export default ProductPage
