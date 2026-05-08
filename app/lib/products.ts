import { prisma } from './prisma'
import { mapItemToProduct } from './products/mappers'
import type { Product } from './products/types'
import { bazarcitoWhereClause, isPlateriasCategoryName } from '@/app/api/_utils/catalog'
import type { Prisma } from '@prisma/client'

export type { Product } from './products/types'


export async function getBazarcitoProducts(category?: string): Promise<Product[]> {
    if (typeof window === 'undefined') {
        try {
            const where: Prisma.ProductWhereInput = category
                ? {
                    AND: [
                        bazarcitoWhereClause(),
                        {
                            category: {
                                name: category,
                            },
                        },
                    ],
                }
                : bazarcitoWhereClause()
            const items = await prisma.product.findMany({ where, include: { category: true } })
            return items.map(mapItemToProduct)
        } catch (err) {
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
    if (typeof window === 'undefined') {
        try {
            if (!/^\d+$/.test(id)) {
                return undefined
            }

            const item = await prisma.product.findUnique({ where: { id: Number(id) }, include: { category: true } })
            if (!item || isPlateriasCategoryName(item.category?.name)) {
                return undefined
            }
            return item ? mapItemToProduct(item) : undefined
        } catch (err) {
            console.error('Prisma get by id failed, falling back to HTTP fetch:', err)
        }
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/bazarcito/products/${encodeURIComponent(id)}`, base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`Failed to fetch product ${id}: HTTP ${res.status}`)
    const body = await res.json()
    const item = body.data || body
    return item ? mapItemToProduct(item) : undefined
}
