import { Suspense } from 'react'
import ProductsLoading from '../components/ui/ProductsLoading'
import { marronProductsSellProps } from '../lib/productsSellConfig'
import { getMarronProducts } from './services/products'
import MarronClientPage from './MarronClientPage'

export default async function MarronPage() {
    const products = await getMarronProducts()
    const marronWhatsappNumber = (process.env.NUMBER_MARRON || marronProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')

    return (
        <Suspense fallback={<ProductsLoading />}>
            <MarronClientPage products={products} marronWhatsappNumber={marronWhatsappNumber} />
        </Suspense>
    )
}