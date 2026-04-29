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
    image: it.image || '/placeholder.png',
    description: it.description || '',
    category: it.category?.name || 'Otros',
})

export async function getBazarcitoProducts(category?: string): Promise<Product[]> {
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
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/bazarcito/products/${encodeURIComponent(id)}`, base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`Failed to fetch product ${id}: HTTP ${res.status}`)
    const body = await res.json()
    const item = body.data || body
    return item ? mapItemToProduct(item) : undefined
}
