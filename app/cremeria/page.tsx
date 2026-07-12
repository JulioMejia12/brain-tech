import { Suspense } from 'react'
import ProductsLoading from '../components/ui/ProductsLoading'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'
import { mapItemToProduct } from '../lib/products/mappers'
import CremeriaClientPage from './CremeriaClientPage'

export default async function CremeriaPage() {
    const negocioId = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
    const cremeriaWhatsappNumber = (process.env.NUMBER_CREMERIA || cremeriaProductsSellProps.cellPhone || '').replace(/[^0-9]/g, '')
    const negocioIdStr = encodeURIComponent(String(negocioId))
    const query = `/api/products?negocioId=${negocioIdStr}&limit=1000`
    const base = process.env.NEXT_PUBLIC_SITE_URL || ''
    const url = base ? new URL(query, base).toString() : query

    let products = []
    try {
        const res = await fetch(url, { cache: 'no-store' })
        if (res.ok) {
            const body = await res.json().catch(() => ({ data: [] }))
            const items = Array.isArray(body?.data) ? body.data : []
            products = items.map(mapItemToProduct)
        } else {
            products = []
        }
    } catch (e) {
        // network error or other issue; render page with empty products
        products = []
    }

    return (
        <Suspense fallback={<ProductsLoading />}>
            <CremeriaClientPage products={products} cremeriaWhatsappNumber={cremeriaWhatsappNumber} negocioId={String(negocioId)} />
        </Suspense>
    )
}