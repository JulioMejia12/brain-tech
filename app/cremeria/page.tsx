import { Suspense } from 'react'
import { connection } from 'next/server'
import ProductsLoading from '../components/ui/ProductsLoading'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'
import type { Product } from '../lib/products/types'
import CremeriaClientPage from './CremeriaClientPage'
import { getCremeriaProducts } from './services/products'

export default async function CremeriaPage() {
    await connection()

    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const cremeriaWhatsappNumber = (process.env.NUMBER_CREMERIA || cremeriaProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')

    let products: Product[] = []
    try {
        products = await getCremeriaProducts()
    } catch (e) {
        // network error or other issue; render page with empty products
        console.error('Failed to load Cremería products on the server:', e)
        products = []
    }

    return (
        <Suspense fallback={<ProductsLoading />}>
            <CremeriaClientPage products={products} cremeriaWhatsappNumber={cremeriaWhatsappNumber} negocioId={String(negocioId)} />
        </Suspense>
    )
}