'use client'

import { FiCheckCircle } from 'react-icons/fi'
import ProductsSell from '../components/layout/ProductsSell'
import { marronProductsSellProps } from '../lib/productsSellConfig'
import PromotionsLoader from './PromotionsLoader'
import type { Product } from '../lib/products'

type Props = {
    products: Product[]
    marronWhatsappNumber: string
}

export default function MarronClientPage({ products, marronWhatsappNumber }: Props) {
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
                <a
                    href={`https://wa.me/${marronWhatsappNumber}?text=${encodeURIComponent('Hola, me interesan los productos de Marron. ¿Me pueden compartir información y promociones disponibles?')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded text-white"
                    style={{ background: marronProductsSellProps.primary }}
                >
                    Contáctanos por WhatsApp
                </a>
            </section>
        </ProductsSell>
    )
}
