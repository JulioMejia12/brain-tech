import { prisma } from './prisma'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

const toAbsoluteImage = (img: any) => {
    if (!img) return `${SITE_URL}/image.jpeg`
    const s = String(img)
    if (s.startsWith('http://') || s.startsWith('https://')) return s
    // ensure leading slash
    return s.startsWith('/') ? `${SITE_URL}${s}` : `${SITE_URL}/${s}`
}

export type Product = {
    id: string
    name: string
    price: string
    image: string
    description: string
    category: string
}

const mapItemToProduct = (it: any): Product => ({
    id: String(it.id),
    name: it.title || it.name || '',
    price: typeof it.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(it.price) : String(it.price || ''),
    image: toAbsoluteImage(it.image),
    description: it.description || '',
    category: it.category?.name || 'Otros',
})


export async function getBazarcitoProducts(category?: string): Promise<Product[]> {
    // Server-side: read directly from database to avoid fetching localhost during build
    if (typeof window === 'undefined') {
        try {
            const where = category ? { category: { name: category } } : undefined
            const items = await prisma.product.findMany({ where: where as any, include: { category: true } })
            return items.map(mapItemToProduct)
        } catch (err) {
            // If DB access fails during build, fallback to HTTP fetch (best-effort)
            console.error('Prisma fetch failed, falling back to HTTP fetch:', err)
        }
    }

    const q = category ? `?category=${encodeURIComponent(category)}` : ''
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/bazarcito/products${q}`, base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
        throw new Error(`Failed to fetch products: HTTP ${res.status}`)
    }
    const body = await res.json()
    const items = body.data || []
    return items.map(mapItemToProduct)
}

export async function getBazarcitoProductById(id: string): Promise<Product | undefined> {
    if (!id) return undefined
    // Server-side: read directly from database when possible
    if (typeof window === 'undefined') {
        console.log('getBazarcitoProductById (server) id=', id)
        try {
            // Support numeric and string primary keys
            const isNumeric = /^\d+$/.test(id)
            const where = isNumeric ? { id: Number(id) } : { id }
            const item = await prisma.product.findUnique({ where: where as any, include: { category: true } })
            console.log('Prisma lookup where=', where, 'found=', !!item)
            return item ? mapItemToProduct(item) : undefined
        } catch (err) {
            console.error('Prisma get by id failed, falling back to HTTP fetch:', err)
        }
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/bazarcito/products/${encodeURIComponent(id)}`, base).toString()
    console.log('getBazarcitoProductById (client/fallback) fetching', url)
    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`Failed to fetch product ${id}: HTTP ${res.status}`)
    const body = await res.json()
    const item = body.data || body
    return item ? mapItemToProduct(item) : undefined
}
