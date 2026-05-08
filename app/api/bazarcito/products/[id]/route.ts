import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { isPlateriasCategoryName } from '@/app/api/_utils/catalog'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'
import type { RouteContext } from '../../../_utils/route'
import { getNumericRouteParam } from '../../../_utils/route'

export async function GET(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        return NextResponse.json({ data: product })
    } catch (error: unknown) {
        logError('Get bazarcito product by id error:', error)
        return jsonError('Failed to fetch bazarcito product', 500, errorMessage(error))
    }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        await prisma.product.delete({ where: { id: result.value } })
        return new NextResponse(null, { status: 204 })
    } catch (error: unknown) {
        logError('Delete bazarcito product error:', error)
        return jsonError('Failed to delete bazarcito product', 500, errorMessage(error))
    }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        const body = (await req.json().catch(() => ({}))) as {
            name?: string
            title?: string
            price?: number | string
            pieces?: number | string
            stock?: number | string
        }

        const data: { title?: string; price?: number; stock?: number } = {}
        if (body.name || body.title) data.title = String(body.name || body.title)
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }

        const stockSource = body.pieces ?? body.stock
        if (stockSource !== undefined) {
            const parsed = Number(stockSource)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }

        if (Object.keys(data).length === 0) {
            return jsonError('No valid fields to update', 400)
        }

        const updated = await prisma.product.update({ where: { id: result.value }, data })
        return NextResponse.json({ data: updated })
    } catch (error: unknown) {
        logError('Update bazarcito product error:', error)
        return jsonError('Failed to update bazarcito product', 500, errorMessage(error))
    }
}
