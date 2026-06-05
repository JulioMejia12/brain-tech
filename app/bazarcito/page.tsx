import { Suspense } from 'react'
import ProductsLoading from '../components/ui/ProductsLoading'
import { bazarcitoProductsSellProps } from '../lib/productsSellConfig'
import { getBazarcitoProducts } from '../lib/products'
import BazarcitoClientPage from './BazarcitoClientPage'

export default async function BazarcitoPage() {
    const products = await getBazarcitoProducts()
    const bazarcitoWhatsappNumber = (process.env.NUMBER_BAZARCITO || bazarcitoProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')

    return (
        <Suspense fallback={<ProductsLoading />}>
            <BazarcitoClientPage products={products} bazarcitoWhatsappNumber={bazarcitoWhatsappNumber} />
        </Suspense>
    )
}