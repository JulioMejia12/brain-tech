import { mapItemToProduct } from '@/app/lib/products/mappers'

const CREMERIA_NEGOCIO_ID = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function getCremeriaProducts() {
    const url = new URL(`/api/products?negocioId=${encodeURIComponent(String(CREMERIA_NEGOCIO_ID))}&limit=1000`, BASE).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const body = await res.json().catch(() => ({ data: [] }))
    const items = Array.isArray(body?.data) ? body.data : []
    return items.map(mapItemToProduct)
}

export async function getCremeriaProductById(id: string) {
    if (!id) return undefined
    const url = new URL(`/api/products/${encodeURIComponent(String(id))}?negocioId=${encodeURIComponent(String(CREMERIA_NEGOCIO_ID))}`, BASE).toString()
    try {
        const res = await fetch(url, { cache: 'no-store' })
        if (res.status === 404) return undefined
        if (!res.ok) {
            console.error(`getCremeriaProductById: API returned HTTP ${res.status} for id ${id}`)
            return undefined
        }
        const body = await res.json().catch(() => ({}))
        const item = body.data || body
        return item ? mapItemToProduct(item) : undefined
    } catch (error) {
        console.error('getCremeriaProductById: fetch failed', error)
        return undefined
    }
}

