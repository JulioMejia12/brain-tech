import { NextResponse } from 'next/server'
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
        const { take, skip } = getPaginationParams(req)
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
