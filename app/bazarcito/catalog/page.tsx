import CatalogManager from '@/app/components/catalog/CatalogManager'
import { bazarcitoProductsSellProps } from '@/app/lib/productsSellConfig'

const BAZARCITO_NEGOCIO_ID = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || '1'

export const metadata = {
    title: 'Catálogo — Bazarcito',
}

export default function BazarcitoCatalogPage() {
    const bg = bazarcitoProductsSellProps.bgColor || '#ffb6ef'

    return (
        <div style={{ background: bg }} className="min-h-screen">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Catálogo de Bazarcito</h1>
                    <p className="mt-2 text-sm text-gray-500">Sube imágenes o PDFs para que los usuarios puedan descargarlos.</p>
                </div>

                <CatalogManager
                    negocioId={BAZARCITO_NEGOCIO_ID}
                    storefrontName="Bazarcito"
                    accentClassName="border-pink-200 bg-pink-50 text-pink-900"
                />
            </div>
        </div>
    )
}
