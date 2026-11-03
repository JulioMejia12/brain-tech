import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { mapItemToProduct } from '@/app/lib/products/mappers'
import type { Product } from '@/app/lib/products/types'

const CREMERIA_NEGOCIO_ID = Number(process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3')

async function getCremeriaProductByIdFromApi(id: string): Promise<Product | undefined> {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/products/${encodeURIComponent(id)}`, base)
    url.searchParams.set('negocioId', String(CREMERIA_NEGOCIO_ID))

    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return undefined
    if (!res.ok) {
        throw new Error(`Failed to fetch Cremería product ${id}: HTTP ${res.status}`)
    }

    const body = await res.json()
    const item = body?.data || body
    if (!item || Number(item.negocioId) !== CREMERIA_NEGOCIO_ID) {
        return undefined
    }

    return mapItemToProduct(item)
}

export async function getCremeriaProducts(category?: string): Promise<Product[]> {
    const isServer = typeof window === 'undefined'

    if (isServer) {
        try {
            const rows = category
                ? await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    LEFT JOIN Category c ON c.id = p.categoryId
                    WHERE p.negocioId = ${CREMERIA_NEGOCIO_ID} AND c.name = ${category}
                    ORDER BY p.createdAt DESC
                `)
                : await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    WHERE p.negocioId = ${CREMERIA_NEGOCIO_ID}
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
        } catch (error) {
            console.error('Prisma fetch for Cremería failed; returning empty list on server:', error)
            return []
        }
    }

    const params = new URLSearchParams({ negocioId: String(CREMERIA_NEGOCIO_ID), limit: '1000' })
    if (category) params.set('category', category)
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL(`/api/products?${params.toString()}`, base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
        throw new Error(`Failed to fetch Cremería products: HTTP ${res.status}`)
    }

    const body = await res.json()
    const items = Array.isArray(body?.data) ? body.data : []
    return items.map(mapItemToProduct)
}

export async function getCremeriaProductById(id: string): Promise<Product | undefined> {
    if (!id || !/^\d+$/.test(id)) return undefined
    const isServer = typeof window === 'undefined'

    if (isServer) {
        try {
            const rows = await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                SELECT id
                FROM Product
                WHERE id = ${Number(id)} AND negocioId = ${CREMERIA_NEGOCIO_ID}
                LIMIT 1
            `)

            if (!rows.length) {
                return await getCremeriaProductByIdFromApi(id)
            }

            const item = await prisma.product.findUnique({ where: { id: Number(id) }, include: { category: true } })
            return item ? mapItemToProduct(item) : undefined
        } catch (error) {
            console.error('Prisma get Cremería product by id failed; falling back to API on server:', error)
            try {
                return await getCremeriaProductByIdFromApi(id)
            } catch (fallbackError) {
                console.error('Cremería product by id API fallback failed on server:', fallbackError)
                return undefined
            }
        }
    }

    return getCremeriaProductByIdFromApi(id)
}

export { CREMERIA_NEGOCIO_ID }
