'use client'

import ProductsSell from '../components/layout/ProductsSell'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'
import PromotionsLoader from './PromotionsLoader'
import type { Product } from '../lib/products'

type Props = {
    products: Product[]
    cremeriaWhatsappNumber: string
    negocioId?: string
}

export default function CremeriaClientPage({ products, cremeriaWhatsappNumber }: Props) {
    return (
        <ProductsSell {...cremeriaProductsSellProps} cellPhone={cremeriaWhatsappNumber} products={products} promosComponent={<PromotionsLoader />} />
    )
}
