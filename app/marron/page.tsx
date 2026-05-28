import { Suspense } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import ProductsSell from '../components/layout/ProductsSell'
import ProductsLoading from '../components/ui/ProductsLoading'
import { marronProductsSellProps } from '../lib/productsSellConfig'
import { getMarronProducts } from './services/products'
import PromotionsLoader from './PromotionsLoader'

export default async function MarronPage() {
    const products = await getMarronProducts()
    const marronWhatsappNumber = (process.env.NUMBER_MARRON || marronProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')

    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsSell {...marronProductsSellProps} cellPhone={marronWhatsappNumber} products={products} promosComponent={<PromotionsLoader />}>
                <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: marronProductsSellProps.secondary }}>Conviértete en Asociado Betterware</h2>
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
        </Suspense>
    )
}