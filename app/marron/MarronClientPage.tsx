'use client'

import { useEffect, useMemo, useState } from 'react'
import { FiCheckCircle, FiDownload } from 'react-icons/fi'
import ProductsSell from '../components/layout/ProductsSell'
import ProductsLoading from '../components/ui/ProductsLoading'
import { marronProductsSellProps } from '../lib/productsSellConfig'
import PromotionsLoader from './PromotionsLoader'
import type { Product } from '../lib/products'

type Props = {
    products: Product[]
    marronWhatsappNumber: string
}

type CatalogItem = {
    id: number
    name: string
    categoria?: string | null
}

export default function MarronClientPage({ products, marronWhatsappNumber }: Props) {
    const [mounted, setMounted] = useState(false)
    const [catalogs, setCatalogs] = useState<CatalogItem[]>([])

    const catalogsByCategory = useMemo(() => {
        const map = new Map<string, CatalogItem>()

        for (const item of catalogs) {
            const categoryKey = String(item.categoria || 'general').trim().toLowerCase() || 'general'
            if (!map.has(categoryKey)) {
                map.set(categoryKey, item)
            }
        }

        return Array.from(map.values())
    }, [catalogs])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        let active = true

        async function loadCatalogs() {
            try {
                const res = await fetch('/api/catalog?negocioId=2', { cache: 'no-store' })
                const json = await res.json().catch(() => ({})) as { data?: CatalogItem[] }
                if (!res.ok || !active) return

                setCatalogs(Array.isArray(json?.data) ? json.data : [])
            } catch {
                if (active) setCatalogs([])
            }
        }

        void loadCatalogs()

        return () => {
            active = false
        }
    }, [])

    if (!mounted) {
        return <ProductsLoading message="Cargando Marron..." />
    }

    return (
        <ProductsSell {...marronProductsSellProps} cellPhone={marronWhatsappNumber} products={products} promosComponent={<PromotionsLoader />}>
            <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: marronProductsSellProps.secondary }}>Conviértete en Asociado Betterware y Tupperware</h2>
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
                        href={`https://wa.me/${marronWhatsappNumber}?text=${encodeURIComponent('Hola, me interesan los productos de Marron. ¿Me pueden compartir información y promociones disponibles?')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded text-white"
                        style={{ background: marronProductsSellProps.primary }}
                    >
                        Contáctanos por WhatsApp
                    </a>

                    {catalogsByCategory.map((catalog) => (
                        <a
                            key={`${catalog.id}-${catalog.categoria || 'general'}`}
                            href={`/api/catalog/${catalog.id}/download?negocioId=2`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded border font-medium bg-white shadow-sm"
                            style={{ borderColor: marronProductsSellProps.primary, color: '#7a4b16' }}
                        >
                            <FiDownload className="shrink-0" />
                            Descargar {catalog.categoria ? `${catalog.categoria}: ` : ''}{catalog.name}
                        </a>
                    ))}
                </div>
            </section>
        </ProductsSell>
    )
}
