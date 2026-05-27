import { prisma } from './prisma'
import { mapItemToProduct } from './products/mappers'
import type { Product } from './products/types'
import { bazarcitoWhereClause, isPlateriasCategoryName } from '@/app/api/_utils/catalog'
import { Prisma } from '@prisma/client'

export type { Product } from './products/types'

const BAZARCITO_NEGOCIO_ID = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || process.env.BAZARCITO_NEGOCIO_ID || ''

function getBazarcitoNegocioId() {
    const parsed = Number(BAZARCITO_NEGOCIO_ID)
    return Number.isNaN(parsed) ? undefined : parsed
}


export async function getBazarcitoProducts(category?: string): Promise<Product[]> {
    const negocioId = getBazarcitoNegocioId()

    if (typeof window === 'undefined') {
        try {
            if (negocioId != null) {
                const rows = category
                    ? await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                        SELECT p.id
                        FROM Product p
                        LEFT JOIN Category c ON c.id = p.categoryId
                        WHERE p.negocioId = ${negocioId} AND c.name = ${category}
                        ORDER BY p.createdAt DESC
                    `)
                    : await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                        SELECT p.id
                        FROM Product p
                        WHERE p.negocioId = ${negocioId}
                        ORDER BY p.createdAt DESC
                    `)

                if (!rows.length) {
                    return []
                }

                const items = await prisma.product.findMany({
                    where: { id: { in: rows.map((row) => row.id) } },
                    include: { category: true },
                    orderBy: { createdAt: 'desc' },
                })
                return items.map(mapItemToProduct)
            }

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

    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (negocioId != null) params.set('negocioId', String(negocioId))
    const q = params.toString() ? `?${params.toString()}` : ''
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const path = negocioId != null ? `/api/products${q}` : `/api/bazarcito/products${q}`
    const url = new URL(path, base).toString()
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
    const negocioId = getBazarcitoNegocioId()
    if (typeof window === 'undefined') {
        try {
            if (!/^\d+$/.test(id)) {
                return undefined
            }

            if (negocioId != null) {
                const rows = await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT id
                    FROM Product
                    WHERE id = ${Number(id)} AND negocioId = ${negocioId}
                    LIMIT 1
                `)

                if (!rows.length) {
                    return undefined
                }
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
    const url = new URL(`/api/bazarcito/products/${encodeURIComponent(id)}`, base)
    if (negocioId != null) {
        url.searchParams.set('negocioId', String(negocioId))
    }
    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return undefined
    if (!res.ok) throw new Error(`Failed to fetch product ${id}: HTTP ${res.status}`)
    const body = await res.json()
    const item = body.data || body
    return item ? mapItemToProduct(item) : undefined
}
