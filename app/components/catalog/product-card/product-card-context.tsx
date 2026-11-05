'use client'

import { createContext, useContext } from 'react'
import type { Product } from '@/app/lib/products'

export type ProductCardContextValue = {
    product: Product
    primary: string
}

export const ProductCardContext = createContext<ProductCardContextValue | null>(null)

export function useProductCard() {
    const context = useContext(ProductCardContext)
    if (!context) {
        throw new Error('Los subcomponentes de <ProductCard> deben renderizarse dentro de su provider.')
    }
    return context
}
