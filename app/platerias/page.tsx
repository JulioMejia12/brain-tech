import { Suspense } from 'react'
import ProductsSell from "../components/layout/ProductsSell"
import ProductsLoading from '../components/ui/ProductsLoading'
import { plateriasProductsSellProps } from '../lib/productsSellConfig'
import { plateriasMockProducts } from '../lib/products/mocks/platerias'
import { plateriasPromotions } from '../lib/promotions/mocks/platerias'

export default function PlateriasPage() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsSell {...plateriasProductsSellProps} products={plateriasMockProducts} promos={plateriasPromotions} />
        </Suspense>
    )
}