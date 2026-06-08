'use client'

import { useEffect, useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import StorefrontCatalogDownloads from '../components/catalog/StorefrontCatalogDownloads'
import ProductsSell from '../components/layout/ProductsSell'
import { bazarcitoProductsSellProps } from '../lib/productsSellConfig'
import PromotionsLoader from './PromotionsLoader'
import type { Product } from '../lib/products'

type Props = {
    products: Product[]
    bazarcitoWhatsappNumber: string
}

type CatalogItem = {
    id: number
    name: string
    categoria?: string | null
}

export default function BazarcitoClientPage({ products, bazarcitoWhatsappNumber }: Props) {
    const [catalogs, setCatalogs] = useState<CatalogItem[]>([])

    useEffect(() => {
        let mounted = true

        async function loadCurrentCatalog() {
            try {
                const res = await fetch('/api/catalog?negocioId=1', { cache: 'no-store' })
                const json = await res.json().catch(() => ({})) as { data?: CatalogItem[] }
                if (!res.ok || !mounted) return

                const items = Array.isArray(json?.data) ? json.data : []
                setCatalogs(items)
            } catch {
                if (mounted) setCatalogs([])
            }
        }

        void loadCurrentCatalog()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <ProductsSell {...bazarcitoProductsSellProps} cellPhone={bazarcitoWhatsappNumber} products={products} promosComponent={<PromotionsLoader />}>
            <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: bazarcitoProductsSellProps.secondary }}>Conviértete en Asociado Betterware y Tupperware</h2>
                <p className="text-gray-700 text-base mb-2 font-semibold">
                    Empieza a vender productos Betterware ó Tupperware y genera ingresos extra con horarios flexibles y apoyo de nuestro equipo.
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
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href={`https://wa.me/${bazarcitoWhatsappNumber}?text=${encodeURIComponent('Hola, me interesan los productos de Bazarcito online. ¿Me pueden compartir información y promociones disponibles?')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded text-white"
                        style={{ background: bazarcitoProductsSellProps.primary }}
                    >
                        Contáctanos por WhatsApp
                    </a>
                </div>

                <StorefrontCatalogDownloads
                    catalogs={catalogs}
                    negocioId="1"
                    borderColor={bazarcitoProductsSellProps.primary}
                    textColor="#7a1858"
                    badgeClassName="bg-pink-100 text-pink-700"
                    helperText="Catálogo listo para descargar."
                />
            </section>
        </ProductsSell>
    )
}
