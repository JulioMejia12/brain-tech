import { Suspense } from 'react'
import ProductsSell from '../components/layout/ProductsSell'
import ProductsLoading from '../components/ui/ProductsLoading'
import { bazarcitoProductsSellProps } from '../lib/productsSellConfig'

export default function BazarcitoPage() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsSell {...bazarcitoProductsSellProps}>
                <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: bazarcitoProductsSellProps.secondary }}>¿Quieres vender nuestros productos?</h2>
                    <p className="text-gray-700 text-base mb-4">
                        Si estás interesado en convertirte en distribuidor de  Betterware.
                    </p>
                    <a
                        href={`https://wa.me/${bazarcitoProductsSellProps.cellPhone}?text=Hola,%20estoy%20interesado%20en%20vender%20sus%20productos`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded text-white"
                        style={{ background: bazarcitoProductsSellProps.primary }}
                    >
                        Contáctanos por WhatsApp
                    </a>
                </section>
            </ProductsSell>
        </Suspense>
    )
}