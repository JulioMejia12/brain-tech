import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../lib/prisma'
import { getNumericRouteParam, type RouteContext } from '../../_utils/route'
import { errorMessage, jsonError, logError } from '../../_utils/http'

type UpdateProductBody = {
    name?: string
    title?: string
    price?: number | string
    promotionPrice?: number | string | null
    pieces?: number | string
    stock?: number | string
}

function toPromotionPriceDecimal(value: number | string | null | undefined) {
    if (value === undefined) return undefined
    if (value === null || value === '') return null

    const raw = String(value).trim()
    if (raw === '') return null

    return new Prisma.Decimal(raw)
}

export async function GET(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value
        const product = await prisma.product.findUnique({ where: { id: numericId }, include: { category: true } })
        if (!product) return jsonError(`Product with id=${numericId} not found`, 404)
        return NextResponse.json({ data: product })
    } catch (error: unknown) {
        logError('Get product by id error:', error)
        return jsonError('Failed to fetch product', 500, errorMessage(error))
    }
}

export { deleteProduct as DELETE }

export async function PUT(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value
        const body = await req.json().catch(() => ({})) as UpdateProductBody

        const data: { title?: string; price?: number; stock?: number } = {}
        if (body.name || body.title) data.title = String(body.name || body.title)
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }
        if (body.promotionPrice !== undefined) {
            const promotionPrice = toPromotionPriceDecimal(body.promotionPrice)
            if (promotionPrice !== undefined) {
                ; (data as any).promotionPrice = promotionPrice
            }
        }
        const stockSource = body.pieces ?? body.stock
        if (stockSource !== undefined) {
            const parsed = Number(stockSource)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }

        if (Object.keys(data).length === 0) return jsonError('No valid fields to update', 400)

        const updated = await prisma.product.update({ where: { id: numericId }, data })
        return NextResponse.json({ data: updated })
    } catch (error: unknown) {
        logError('Update product error:', error)
        return jsonError('Failed to update product', 500, errorMessage(error))
    }
}
