import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBazarcitoProductById, getBazarcitoProducts } from '../../../lib/products'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteUrl = (value: string) => {
    if (!value) return siteUrl
    return value.startsWith('http') ? value : `${siteUrl}${value}`
}

export async function generateStaticParams() {
    const products = (await getBazarcitoProducts()) || [];
    return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
    const product = await getBazarcitoProductById(id);
    if (!product) {
        return {
            metadataBase: new URL(siteUrl),
            title: 'Producto no encontrado',
            description: 'Producto no encontrado en Bazarcito',
        };
    }

    const productUrl = `${siteUrl}/bazarcito/product/${product.id}`
    const imageUrl = toAbsoluteUrl(product.image)

    return {
        metadataBase: new URL(siteUrl),
        title: product.name,
        description: product.description,
        openGraph: {
            type: 'website',
            url: productUrl,
            siteName: 'brain-tech-kappa',
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
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const product = await getBazarcitoProductById(id);
    if (!product) return notFound();

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
    );
}

export default ProductPage
