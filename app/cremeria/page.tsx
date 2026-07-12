import { Suspense } from 'react'
import ProductsLoading from '../components/ui/ProductsLoading'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'
import { mapItemToProduct } from '../lib/products/mappers'
import CremeriaClientPage from './CremeriaClientPage'

export default async function CremeriaPage() {
    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const cremeriaWhatsappNumber = (process.env.NUMBER_CREMERIA || cremeriaProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/products?negocioId=${encodeURIComponent(String(negocioId))}&limit=1000`, base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    const body = await res.json().catch(() => ({ data: [] }))
    const items = Array.isArray(body?.data) ? body.data : []
    const products = items.map(mapItemToProduct)

    return (
        <Suspense fallback={<ProductsLoading />}>
            <CremeriaClientPage products={products} cremeriaWhatsappNumber={cremeriaWhatsappNumber} negocioId={String(negocioId)} />
        </Suspense>
    )
}