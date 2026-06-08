import CatalogManager from '@/app/components/catalog/CatalogManager'
import { marronProductsSellProps } from '@/app/lib/productsSellConfig'

const MARRON_NEGOCIO_ID = process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || '2'

export const metadata = {
    title: 'Catálogo — Marron',
}

export default function MarronCatalogPage() {
    const bg = marronProductsSellProps.bgColor || '#fff'
    const headingColor = marronProductsSellProps.secondary || '#111'

    return (
        <div style={{ background: bg }}>
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: headingColor }}>Catálogo de Marron</h1>
                    <p className="mt-2 text-sm text-gray-500">Sube imágenes o PDFs para que los usuarios puedan descargarlos.</p>
                </div>

                <CatalogManager
                    negocioId={MARRON_NEGOCIO_ID}
                    storefrontName="Marron"
                    accentClassName="border-amber-200 bg-amber-50 text-amber-900"
                />
            </div>
        </div>
    )
}
