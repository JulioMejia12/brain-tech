import { Suspense } from 'react'
import ProductsSell from "../components/layout/ProductsSell"
import ProductsLoading from '../components/ui/ProductsLoading'
import { plateriasProductsSellProps } from '../lib/productsSellConfig'

export default function PlateriasPage() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsSell {...plateriasProductsSellProps} />
        </Suspense>
    )
}