import type { Product } from '@/app/lib/products'

export async function getPlateriasProducts(): Promise<Product[]> {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL('/api/platerias/products', base).toString()
    const response = await fetch(url, { cache: 'no-store' })

    if (!response.ok) {
        throw new Error(`Failed to fetch platerias products: HTTP ${response.status}`)
    }

    const body = await response.json()
    return body.data || []
}

export async function getPlateriasProductById(id: string): Promise<Product | undefined> {
    if (!id) return undefined

    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/platerias/products/${encodeURIComponent(id)}`, base).toString()
    const response = await fetch(url, { cache: 'no-store' })

    if (response.status === 404) return undefined
    if (!response.ok) {
        throw new Error(`Failed to fetch platerias product ${id}: HTTP ${response.status}`)
    }

    const body = await response.json()
    return body.data
}
