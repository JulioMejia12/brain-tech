import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { fromPlateriasCategoryName, isPlateriasCategoryName, toPlateriasCategoryName } from '@/app/api/_utils/catalog'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'
import { getNumericRouteParam, type RouteContext } from '@/app/api/_utils/route'

function serializePlateriasProduct(product: {
    id: number
    title: string
    price: number
    stock: number
    image: string
    description: string
    category: { name: string }
}) {
    return {
        ...product,
        category: {
            name: fromPlateriasCategoryName(product.category.name),
        },
    }
}

export async function GET(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || !isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        return NextResponse.json({ data: serializePlateriasProduct(product) })
    } catch (error: unknown) {
        logError('Get platerias product by id error:', error)
        return jsonError('Failed to fetch platerias product', 500, errorMessage(error))
    }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const current = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!current || !isPlateriasCategoryName(current.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        const body = (await req.json().catch(() => ({}))) as {
            name?: string
            title?: string
            description?: string
            price?: number | string
            pieces?: number | string | null
            stock?: number | string | null
            category?: string
        }

        const data: {
            title?: string
            description?: string
            price?: number
            stock?: number
            category?: {
                connectOrCreate: {
                    where: { name: string }
                    create: { name: string }
                }
            }
        } = {}

        if (body.name || body.title) data.title = String(body.name || body.title).trim()
        if (typeof body.description === 'string') data.description = body.description
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }

        const stockSource = body.pieces ?? body.stock
        if (stockSource !== undefined && stockSource !== null) {
            const parsed = Number(stockSource)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }

        if (typeof body.category === 'string' && body.category.trim()) {
            const categoryName = toPlateriasCategoryName(body.category)
            data.category = {
                connectOrCreate: {
                    where: { name: categoryName },
                    create: { name: categoryName },
                },
            }
        }

        if (Object.keys(data).length === 0) {
            return jsonError('No valid fields to update', 400)
        }

        const updated = await prisma.product.update({
            where: { id: result.value },
            data,
            include: { category: true },
        })

        return NextResponse.json({ data: serializePlateriasProduct(updated) })
    } catch (error: unknown) {
        logError('Update platerias product error:', error)
        return jsonError('Failed to update platerias product', 500, errorMessage(error))
    }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const current = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!current || !isPlateriasCategoryName(current.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        await prisma.product.delete({ where: { id: result.value } })
        return new NextResponse(null, { status: 204 })
    } catch (error: unknown) {
        logError('Delete platerias product error:', error)
        return jsonError('Failed to delete platerias product', 500, errorMessage(error))
    }
}
