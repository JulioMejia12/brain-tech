'use client'

import CremeriasSell from '../components/layout/CremeriasSell'
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
        <CremeriasSell {...cremeriaProductsSellProps} cellPhone={cremeriaWhatsappNumber} products={products} promosComponent={<PromotionsLoader />} />
    )
}
