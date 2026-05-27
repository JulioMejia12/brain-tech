import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { POST as productsPOST } from '../../products/route'
import { prisma } from '@/app/lib/prisma'
import { bazarcitoWhereClause } from '@/app/api/_utils/catalog'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'
import { getPaginationParams } from '@/app/api/_utils/route'

export async function POST(req: Request) {
    return productsPOST(req)
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const category = url.searchParams.get('category') || undefined
        const negocioIdParam = url.searchParams.get('negocioId')
        const { take, skip } = getPaginationParams(req)

        if (negocioIdParam != null && Number.isNaN(Number(negocioIdParam))) {
            return jsonError('negocioId must be a valid number', 400)
        }

        const negocioId = negocioIdParam != null ? Number(negocioIdParam) : undefined

        if (negocioId != null) {
            const rows = category
                ? await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    LEFT JOIN Category c ON c.id = p.categoryId
                    WHERE p.negocioId = ${negocioId} AND c.name = ${category}
                    ORDER BY p.createdAt DESC
                    LIMIT ${take} OFFSET ${skip}
                `)
                : await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    WHERE p.negocioId = ${negocioId}
                    ORDER BY p.createdAt DESC
                    LIMIT ${take} OFFSET ${skip}
                `)

            if (!rows.length) {
                return NextResponse.json({ data: [] })
            }

            const products = await prisma.product.findMany({
                where: { id: { in: rows.map((row) => row.id) } },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            })

            return NextResponse.json({ data: products })
        }

        const where = category
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

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        })

        return NextResponse.json({ data: products })
    } catch (error: unknown) {
        logError('Get bazarcito products error:', error)
        return jsonError('Failed to fetch bazarcito products', 500, errorMessage(error))
    }
}
