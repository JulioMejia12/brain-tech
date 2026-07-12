'use client'

import { useEffect, useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import StorefrontCatalogDownloads from '../components/catalog/StorefrontCatalogDownloads'
import ProductsSell from '../components/layout/ProductsSell'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'
import PromotionsLoader from './PromotionsLoader'
import type { Product } from '../lib/products'

type Props = {
    products: Product[]
    cremeriaWhatsappNumber: string
    negocioId?: string
}

type CatalogItem = {
    id: number
    name: string
    categoria?: string | null
}

export default function CremeriaClientPage({ products, cremeriaWhatsappNumber, negocioId }: Props) {
    const [catalogs, setCatalogs] = useState<CatalogItem[]>([])

    const negocioIdValue = negocioId || (process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3')

    useEffect(() => {
        let mounted = true

        async function loadCurrentCatalog() {
            try {
                const id = negocioId || (process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3')
                const res = await fetch(`/api/catalog?negocioId=${encodeURIComponent(String(id))}`, { cache: 'no-store' })
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
        <ProductsSell {...cremeriaProductsSellProps} cellPhone={cremeriaWhatsappNumber} products={products} promosComponent={<PromotionsLoader />}>
            <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: cremeriaProductsSellProps.secondary }}>Conviértete en Asociado</h2>
                <p className="text-gray-700 text-base mb-2 font-semibold">
                    Empieza a vender productos de la cremería y genera ingresos extra con horarios flexibles y apoyo de nuestro equipo.
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
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href={`https://wa.me/${cremeriaWhatsappNumber}?text=${encodeURIComponent('Hola, me interesan los productos de Cremería online. ¿Me pueden compartir información y promociones disponibles?')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded text-white"
                        style={{ background: cremeriaProductsSellProps.primary }}
                    >
                        Contáctanos por WhatsApp
                    </a>
                </div>

                <StorefrontCatalogDownloads
                    catalogs={catalogs}
                    negocioId={String(negocioIdValue)}
                    whatsappNumber={cremeriaWhatsappNumber}
                    borderColor={cremeriaProductsSellProps.primary}
                    textColor="#042024"
                    badgeClassName="bg-teal-100 text-teal-700"
                    helperText="Catálogo listo para descargar."
                />
            </section>
        </ProductsSell>
    )
}
