import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBazarcitoProductById, bazarcitoProducts } from '../../../lib/products'
import type { Metadata } from 'next'

export async function generateStaticParams() {
    return bazarcitoProducts.map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = getBazarcitoProductById(id)
    if (!product) {
        return {
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Bazarcito',
        }
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [
                {
                    url: product.image,
                    alt: product.name,
                },
            ],
        },
    }
}

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const product = getBazarcitoProductById(id)
    if (!product) return notFound()

    return (
        <main className="min-h-screen bg-[#fff4fb] py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative h-80 bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
                    <p className="text-xl font-semibold text-pink-600 mb-4">{product.price}</p>
                    <p className="text-gray-700 leading-7 mb-4">{product.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Categoría: {product.category}</p>
                    <Link
                        href="/bazarcito"
                        className="inline-block mt-3 text-sm font-semibold text-pink-600 hover:text-pink-800"
                    >
                        Ver más productos
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default ProductPage
