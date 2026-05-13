import { Suspense } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import ProductsSell from '../components/layout/ProductsSell'
import ProductsLoading from '../components/ui/ProductsLoading'
import { bazarcitoProductsSellProps } from '../lib/productsSellConfig'

export default async function BazarcitoPage() {
    // fetch promotions from API (server-side). If it fails, fall back to static promos from config
    let promos: Array<string | { id?: string | number; image?: string }> = bazarcitoProductsSellProps.promos || []
    try {
        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const res = await fetch(`${base}/api/promotions`, { cache: 'no-store' })
        if (res.ok) {
            const json = await res.json().catch(() => null)
            const items = (json && json.data) ? (json.data as Array<Record<string, unknown>>) : []
            const imgs = items
                .map((p) => {
                    const id = (p as any).id as string | number | undefined
                    const image = (p as any).image as string | undefined
                    return { id, image }
                })
                .filter((p) => Boolean(p.image))
            if (imgs.length) promos = imgs
        }
    } catch (e) {
        // ignore and use fallback
        console.warn('Could not load promotions for bazarcito page', e)
    }

    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsSell {...bazarcitoProductsSellProps} promos={promos}>
                <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: bazarcitoProductsSellProps.secondary }}>Conviértete en Asociado Betterware</h2>
                    <p className="text-gray-700 text-base mb-2 font-semibold">
                        Empieza a vender productos Betterware y genera ingresos extra con horarios flexibles y apoyo de nuestro equipo.

                    </p>
                    <ul className="text-gray-700 text-base mb-4 space-y-2">
                        <li className="flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 shrink-0 text-green-600" />
                            <span>Gana por tus ventas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 shrink-0 text-green-600" />
                            <span>Productos fáciles de vender</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 shrink-0 text-green-600" />
                            <span>Atención personalizada</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 shrink-0 text-green-600" />
                            <span>Crece con nosotros</span>
                        </li>
                    </ul>
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